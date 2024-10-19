const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rotas públicas

// Rota para registro de usuário
router.post('/auth/register', authController.register);

// Rota para login de usuário
router.post('/auth/login', authController.login);

router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route' });
});


module.exports = router;
