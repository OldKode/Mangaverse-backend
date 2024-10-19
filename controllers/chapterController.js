const fs = require('fs');
const path = require('path');
const Chapter = require('../models/Chapter'); // Assumindo que você tenha um modelo de Chapter
const Manga = require('../models/Manga'); // Assumindo que você tenha um modelo de Manga

// Função auxiliar para salvar a imagem localmente
const saveImage = (mangaName, chapterNumber, imageBuffer, imageName) => {
    // console.log("mangaName " + mangaName);
    // console.log("chapterNumber " + chapterNumber);
    //console.log("imageBuffer " + imageBuffer);
    //console.log("imageName " + imageName);
    const chapterPath = path.join(process.env.IMAGE_BASE_PATH, mangaName, `Chapter_${chapterNumber}`);
    if (!fs.existsSync(chapterPath)) {
        fs.mkdirSync(chapterPath, { recursive: true });
    }
    const imagePath = path.join(chapterPath, imageName);
    fs.writeFileSync(imagePath, imageBuffer);
    // console.log(imagePath);
    return imagePath;
};

// POST /chapters - Criar um novo capítulo
exports.createChapter = async (req, res) => {
    const { mangaId, title, number, pages } = req.body;

    try {
        const manga = await Manga.findById(mangaId);
        if (!manga) {
            return res.status(404).json({ error: 'Manga not found' });
        }

        const imagePaths = [];
        pages.forEach((page, index) => {
            const imageBuffer = Buffer.from(page, 'base64');
            const imagePath = saveImage(manga.title, number, imageBuffer, `Page_${index + 1}.jpg`);
            imagePaths.push(imagePath);
        });

        const chapter = new Chapter({
            mangaId,
            title,
            chapterNumber: number,
            pages: imagePaths,
        });

        await chapter.save();
        res.status(201).json({ message: 'Chapter created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /chapters/:chapterId/pages/:pageNumber - Obter uma página de um capítulo
exports.getPage = async (req, res) => {
    const { chapterId, pageNumber } = req.params;

    try {
        const chapter = await Chapter.findById(chapterId);        
        if (!chapter || !chapter.pages[pageNumber - 1]) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const imagePath = chapter.pages[pageNumber - 1];
        const imageBuffer = fs.readFileSync(imagePath);
        const imageBase64 = imageBuffer.toString('base64');

        res.json({ image: imageBase64 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /chapters/:chapterId - Obter informações de um capítulo
exports.getChapter = async (req, res) => {
    const { chapterId } = req.params;

    try {
        const chapter = await Chapter.findById(chapterId);
        
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        res.json(chapter);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lista todos os capítulos de um mangá
exports.getChaptersByManga = async (req, res) => {
    try {
        const { mangaId } = req.params;

        const chapters = await Chapter.find({ mangaId }).sort({ number: 1 });

        if (!chapters.length) {
            return res.status(404).json({ error: 'No chapters found for this manga' });
        }

        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve chapters' });
    }
};

// Adiciona uma nova página a um capítulo
exports.addPage = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const { pages } = req.body;

        if (!pages) {
            return res.status(400).json({ error: 'Page content is required' });
        }
        
        // Decodificar a imagem base64 e salvar no sistema de arquivos
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        const manga = await Manga.findById(chapter.mangaId);
        if (!manga) {
            return res.status(404).json({ error: 'Manga not found' });
        }
        
        const mangaId = chapter.mangaId; // Obtendo o ID do manga para estruturar o caminho
        var pageNumber = chapter.pages.length + 1;

        //console.log("chapter " + chapter);
        const imagePaths = [];
        pages.forEach((page, index) => {
            const imageBuffer = Buffer.from(page, 'base64');
            const imagePath = saveImage(manga.title, chapter.chapterNumber, imageBuffer, `Page_${pageNumber}.jpg`);
            //imagePaths.push(imagePath);
            chapter.pages.push(imagePath);
            pageNumber++;
        });

        //const filePath = `./uploads/mangas/${mangaId}/chapter_${chapter.number}/page_${pageNumber}.png`;

        //fs.writeFileSync(filePath, Buffer.from(page, 'base64'));

        // Adiciona o caminho ao banco de dados        
        await chapter.save();

        res.status(201).json({ message: 'Page added successfully', chapter });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add page' });
    }
};

// PUT /chapters/:chapterId - Atualizar um capítulo
exports.updateChapter = async (req, res) => {
    const { chapterId } = req.params;
    const { title, number, pages } = req.body;

    try {
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        if (title) chapter.title = title;
        if (number) chapter.number = number;
        if (pages && pages.length > 0) {
            // Deletar as imagens antigas
            chapter.pages.forEach(imagePath => {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });

            // Salvar as novas imagens
            const imagePaths = [];
            pages.forEach((page, index) => {
                const imageBuffer = Buffer.from(page, 'base64');
                const imagePath = saveImage(chapter.manga.name, number, imageBuffer, `Page_${index + 1}.jpg`);
                imagePaths.push(imagePath);
            });
            chapter.pages = imagePaths;
        }

        await chapter.save();
        res.json({ message: 'Chapter updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /chapters/:chapterId - Deletar um capítulo
exports.deleteChapter = async (req, res) => {
    const { chapterId } = req.params;

    try {
        const chapter = await Chapter.findByIdAndDelete(chapterId);
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        // Deletar as imagens associadas ao capítulo
        chapter.pages.forEach(imagePath => {
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        });

        res.json({ message: 'Chapter deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
