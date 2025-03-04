/**
 * Servidor para Agenda Digital
 * 
 * INSTALAÇÃO:
 * 1. Certifique-se de ter o Node.js instalado (versão 14+ recomendada)
 * 2. Abra o terminal na pasta '/server'
 * 3. Execute 'npm install' para instalar as dependências
 * 4. Certifique-se de ter o MongoDB instalado e rodando localmente na porta 27017
 *    (ou atualize a variável MONGODB_URI no arquivo .env)
 * 5. Para iniciar o servidor: 'npm start' (ou 'npm run dev' para desenvolvimento)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Esta linha é crucial - importa o mongoose
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Inicializar app Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conectado ao MongoDB Atlas com sucesso!');
        console.log('Nome do banco de dados:', mongoose.connection.db.databaseName);
        console.log('Collections disponíveis: usuarios, eventos');
    })
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err.message);

        // Log adicional para ajudar a diagnosticar problemas de conexão
        if (err.name === 'MongoServerSelectionError') {
            console.error('Não foi possível conectar ao servidor MongoDB. Verifique:');
            console.error('1. Se as credenciais estão corretas');
            console.error('2. Se seu IP está na lista de IPs permitidos no MongoDB Atlas');
            console.error('3. Se a rede permite conexões externas');
        }
    });

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Rota inicial
app.get('/', (req, res) => {
    res.json({ message: 'API da Agenda Digital', status: 'online' });
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
