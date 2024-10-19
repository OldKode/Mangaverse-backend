// models/Chapter.js
const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    mangaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga', required: true },
    chapterNumber: { type: Number, required: true },
    title: String,
    pages: [Buffer], // Armazena as imagens criptografadas
    uploadDate: Date
});

module.exports = mongoose.model('Chapter', ChapterSchema);
