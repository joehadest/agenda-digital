const mongoose = require('mongoose');

// Configure this with your connection string directly for testing:
const MONGODB_URI = 'mongodb+srv://joehadest:joe12823134719@agenda-database.dqrzi.mongodb.net/usuarios-login?retryWrites=true&w=majority&appName=agenda-database';

console.log('Tentando conectar diretamente a MongoDB Atlas...');

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('\n✅ Conexão bem sucedida!');
        console.log('Banco de dados:', mongoose.connection.db.databaseName);
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('\n❌ Erro ao conectar:', err.message);
        process.exit(1);
    });
