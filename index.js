const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
//Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const mangaRoutes = require('./routes/mangaRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const app = express();
const cors = require('cors'); // Importa o pacote cors
const errorHandler = require('./middlewares/errorHandler');

// Middleware para permitir CORS
// app.use(cors({
//     origin: 'http://localhost:3000', // Permite apenas esta origem. Substitua conforme necessário.
//     methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
//     credentials: true, // Se você estiver usando cookies, deve habilitar esta opção
// }));

app.use(cors());

require('dotenv').config();

connectDB();

app.use(bodyParser.json());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/manga', mangaRoutes);
app.use('/api', chapterRoutes);


// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
