require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Event = require('../models/Event');

// Pasta para salvar backups
const backupDir = path.join(__dirname, '../backups');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

// Nome do arquivo baseado na data atual
const date = new Date();
const filename = `backup_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.json`;

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Conectado ao MongoDB Atlas');
        try {
            // Buscar todos os usuários (sem senhas)
            const users = await User.find({}, '-password');

            // Buscar todos os eventos
            const events = await Event.find({});

            // Criar objeto de backup
            const backupData = {
                users: users,
                events: events,
                timestamp: new Date(),
                databaseName: mongoose.connection.db.databaseName
            };

            // Salvar em arquivo
            const backupPath = path.join(backupDir, filename);
            fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

            console.log(`Backup salvo com sucesso em: ${backupPath}`);
            console.log(`Total de usuários: ${users.length}`);
            console.log(`Total de eventos: ${events.length}`);

        } catch (error) {
            console.error('Erro ao fazer backup:', error);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err);
    });
