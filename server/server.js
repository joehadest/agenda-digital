/**
 * Servidor principal da Agenda Digital
 */
require('dotenv').config({ path: './server/config/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Configuração de variáveis de ambiente
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Criar aplicação Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
console.log('Conectando ao MongoDB...');
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Conectado ao MongoDB Atlas com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err.message);
        process.exit(1);
    });

// Configurar rotas
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Rota raiz
app.get('/', (req, res) => {
    res.json({ message: 'API Agenda Digital funcionando!' });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro na aplicação:', err.stack);
    res.status(500).json({
        message: 'Ocorreu um erro no servidor',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
