const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');

// Cria uma conexão ao GridFS
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads'); // Nome do bucket GridFS
});

const multer = require('multer');
const storage = multer.memoryStorage(); // Usa memória para armazenar arquivos temporariamente

// Middleware para armazenar arquivos no GridFS
const upload = multer({ storage: storage });

const uploadFile = (req, res, next) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = new mongoose.Types.ObjectId();
    const writestream = gfs.createWriteStream({
        _id: fileId,
        filename: file.originalname,
        bucketName: 'uploads'
    });

    writestream.write(file.buffer);
    writestream.end();

    writestream.on('finish', () => {
        req.fileId = fileId;
        next();
    });

    writestream.on('error', (err) => {
        res.status(500).json({ error: err.message });
    });
};

module.exports = { upload, uploadFile };
