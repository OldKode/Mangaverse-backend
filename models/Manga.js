// models/Manga.js
const mongoose = require('mongoose');

const MangaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    artist: { type: String, required: true },
    genres: [String],
    status: { type: String, enum: ['Ongoing', 'Completed', 'Hiatus'] },
    summary: String,
    rating: Number,
    view: Number,
    publishDate: Date,
    coverImage: { type: String }, 
});

module.exports = mongoose.model('Manga', MangaSchema);
