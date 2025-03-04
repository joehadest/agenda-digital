/**
 * Middleware de autenticação
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware para verificar autenticação do usuário
 */
const auth = async (req, res, next) => {
    try {
        // Verificar header de autorização
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Acesso negado. Autenticação necessária.' });
        }

        // Extrair o token (Bearer token)
        const token = authHeader.replace('Bearer ', '');

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar o usuário associado ao token
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Autenticação inválida.' });
        }

        // Adicionar o usuário à requisição
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        console.error('Erro de autenticação:', error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido.' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado. Faça login novamente.' });
        }

        res.status(401).json({ message: 'Falha na autenticação.' });
    }
};

module.exports = auth;
