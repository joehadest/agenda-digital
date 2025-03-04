require('dotenv').config();
const mongoose = require('mongoose');

// Extraindo partes da string de conexão para debug
// (não mostrará a senha completa por segurança)
const connectionString = process.env.MONGODB_URI;
const parts = connectionString.split('@');
const credentials = parts[0].split('://')[1];
const username = credentials.split(':')[0];
const passwordStart = credentials.split(':')[1]?.substring(0, 2);

console.log('Informações de conexão:');
console.log('- Username:', username);
console.log('- Password: ' + (passwordStart ? passwordStart + '****' : 'não definida'));
console.log('- Host:', parts[1]?.split('/')[0]);
console.log('- Database:', parts[1]?.split('/')[1]?.split('?')[0]);

console.log('\nTentando conectar a MongoDB Atlas...');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('\n✅ Conexão bem sucedida!');
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
        console.error('\n❌ Erro ao conectar:', err.message);

        // Ajuda específica baseada no erro
        if (err.message.includes('bad auth')) {
            console.error('\nProblema de autenticação detectado:');
            console.error('1. Verifique se a senha no arquivo .env está correta');
            console.error('2. Se sua senha contém caracteres especiais, use o script encode-password.js');
            console.error('3. Confirme que o usuário existe no MongoDB Atlas e tem as permissões corretas');
        } else if (err.message.includes('getaddrinfo')) {
            console.error('\nProblema de conexão de rede:');
            console.error('1. Verifique sua conexão com a internet');
            console.error('2. Confirme que o hostname do MongoDB Atlas está correto');
        }

        process.exit(1);
    });
