/**
 * Rotas de usuário para a Agenda Digital
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Registrar um novo usuário
 * @access  Público
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificar se o email já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Este email já está em uso' });
        }

        // Criar novo usuário
        const user = new User({ name, email, password });
        await user.save();

        // Remover senha da resposta
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'Usuário registrado com sucesso',
            user: userResponse
        });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.message);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Erro de validação',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({ message: 'Erro ao registrar. Tente novamente.' });
    }
});

/**
 * @route   POST /api/users/login
 * @desc    Login de usuário
 * @access  Público
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar se email existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // Verificar senha
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remover senha da resposta
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            user: userResponse,
            token
        });
    } catch (error) {
        console.error('Erro no login:', error.message);
        res.status(500).json({ message: 'Erro no servidor. Tente novamente.' });
    }
});

/**
 * @route   GET /api/users/profile
 * @desc    Obter perfil do usuário atual
 * @access  Privado
 */
router.get('/profile', auth, async (req, res) => {
    try {
        // req.user já foi preenchido pelo middleware auth
        res.json({
            message: 'Perfil recuperado com sucesso',
            user: req.user
        });
    } catch (error) {
        console.error('Erro ao buscar perfil:', error.message);
        res.status(500).json({ message: 'Erro ao buscar perfil. Tente novamente.' });
    }
});

module.exports = router;
