const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para criar um novo capítulo
router.post('/chapters', chapterController.createChapter);

// Rota para obter uma página específica de um capítulo
router.get('/chapters/:chapterId/pages/:pageNumber', chapterController.getPage);

// Rota para obter um capítulo específico
router.get('/chapters/:chapterId', chapterController.getChapter);

// Rota para listar todos os capítulos de um mangá
router.get('/mangas/:mangaId/chapters', chapterController.getChaptersByManga);

// Endpoint para adicionar uma nova página a um capítulo
router.post('/chapters/:chapterId/pages', chapterController.addPage);

// Rota para atualizar um capítulo existente
router.put('/chapters/:chapterId', chapterController.updateChapter);

// Rota para deletar um capítulo
router.delete('/chapters/:chapterId', chapterController.deleteChapter);

module.exports = router;
