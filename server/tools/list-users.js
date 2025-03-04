require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Conectado ao MongoDB Atlas');
        try {
            const users = await User.find({}, '-password');
            console.log('\nUsuários cadastrados:');
            users.forEach(user => {
                console.log(`- ID: ${user._id}`);
                console.log(`  Nome: ${user.name}`);
                console.log(`  Email: ${user.email}`);
                console.log(`  Criado em: ${user.createdAt}`);
                console.log('----------------------------');
            });
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err);
    });
