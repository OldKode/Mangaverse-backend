// controllers/mangaController.js
const Manga = require('../models/Manga');

// Obter todos os mangás
exports.getMangas = async (req, res) => {
    try {
        const mangas = await Manga.find();
        res.json(mangas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Criar novo mangá
exports.createManga = async (req, res) => {
    try {
        const newManga = new Manga(req.body);
        await newManga.save();
        res.status(201).json(newManga);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Atualiza a imagem de capa de um mangá
exports.updateMangaCoverImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { coverImage } = req.body;

        // Verifica se o mangá existe
        const manga = await Manga.findById(id);
        if (!manga) {
            return res.status(404).json({ error: 'Manga not found' });
        }
        // Atualiza a imagem de capa
        manga.coverImage = coverImage;
        console.log(manga);
        await manga.save();

        res.status(200).json({ message: 'Cover image updated successfully', manga });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update cover image /n' + error });
    }
};

// Obter mangá por ID
exports.getMangaById = async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (!manga) return res.status(404).json({ error: 'Manga not found' });
        res.json(manga);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Atualizar mangá por ID
exports.updateManga = async (req, res) => {
    try {
        const updatedManga = await Manga.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedManga) return res.status(404).json({ error: 'Manga not found' });
        res.json(updatedManga);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Deletar mangá por ID
exports.deleteManga = async (req, res) => {
    try {
        const deletedManga = await Manga.findByIdAndDelete(req.params.id);
        if (!deletedManga) return res.status(404).json({ error: 'Manga not found' });
        res.json({ message: 'Manga deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
