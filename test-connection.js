require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');

console.log('Tentando conectar a:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Conexão bem sucedida!');
        console.log('Banco de dados:', mongoose.connection.db.databaseName);

        // Listar todas as collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections disponíveis:');
        collections.forEach(coll => {
            console.log(`- ${coll.name}`);
        });

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Erro ao conectar:', err.message);
        process.exit(1);
    });
