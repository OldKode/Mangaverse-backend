// routes/mangaRoutes.js
const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/mangaController');

router.get('/', mangaController.getMangas);
router.post('/', mangaController.createManga);
router.get('/:id', mangaController.getMangaById);
router.put('/:id', mangaController.updateManga);
router.delete('/:id', mangaController.deleteManga);
// Endpoint para atualizar a imagem de capa de um mangá
router.put('/:id/cover', mangaController.updateMangaCoverImage);

module.exports = router;
