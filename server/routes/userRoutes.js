const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Registrar novo usuário
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificar se o email já está em uso
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Este email já está cadastrado' });
        }

        // Criar novo usuário
        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        // Remover a senha do resultado
        const userObject = user.toObject();
        delete userObject.password;

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: userObject
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Encontrar usuário pelo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Verificar senha
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remover a senha do resultado
        const userObject = user.toObject();
        delete userObject.password;

        res.json({
            user: userObject,
            token
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obter perfil do usuário
router.get('/profile', auth, async (req, res) => {
    try {
        // Remover a senha do resultado
        const userObject = req.user.toObject();
        delete userObject.password;

        res.json({ user: userObject });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
