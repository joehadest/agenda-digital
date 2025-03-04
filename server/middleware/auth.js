const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de autenticação por token JWT
 * Verifica se o token é válido e anexa o usuário à requisição
 */
const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ message: 'Token de autenticação não fornecido' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.error('Erro de autenticação:', error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado. Faça login novamente.' });
        }

        res.status(401).json({ message: 'Por favor, autentique-se' });
    }
};

module.exports = auth;
