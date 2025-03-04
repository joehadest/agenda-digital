require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');

console.log('Analisando estrutura do banco de dados da Agenda Digital...');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('\n✅ Conectado ao banco de dados MongoDB Atlas');
        console.log('Nome do banco de dados:', mongoose.connection.db.databaseName);

        // Listar todas as collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nColeções disponíveis:');
        collections.forEach(coll => {
            console.log(`- ${coll.name}`);
        });

        // Analisar modelo de usuário
        console.log('\nModelo de Usuário:');
        console.log('- Campos: nome, email, senha (criptografada), data de criação');
        console.log('- Finalidade: Armazena informações de login e identificação dos usuários');

        // Analisar modelo de eventos
        console.log('\nModelo de Eventos:');
        console.log('- Campos: título, data, hora, descrição, notificação, user (ID do usuário)');
        console.log('- Finalidade: Armazena os compromissos/anotações de cada usuário');
        console.log('- O campo "user" vincula cada evento ao seu proprietário');

        // Mostrar relação entre os modelos
        console.log('\nRelação entre Usuários e Eventos:');
        console.log('- Cada evento pertence a um único usuário (relação 1:N)');
        console.log('- Quando o usuário faz login, apenas seus próprios eventos são carregados');
        console.log('- A API filtra automaticamente os eventos por usuário');

        // Contar usuários e eventos
        const userCount = await User.countDocuments();
        const eventCount = await Event.countDocuments();
        console.log('\nEstatísticas do banco de dados:');
        console.log(`- Total de usuários cadastrados: ${userCount}`);
        console.log(`- Total de eventos/compromissos: ${eventCount}`);

        if (userCount > 0) {
            // Mostrar exemplo de distribuição de eventos por usuário
            console.log('\nDistribuição de eventos por usuário:');
            const users = await User.find({}, 'name email');
            for (const user of users) {
                const userEventCount = await Event.countDocuments({ user: user._id });
                console.log(`- "${user.name}" (${user.email}): ${userEventCount} eventos`);
            }
        }

        mongoose.connection.close();
        console.log('\nConexão fechada. Estrutura de banco de dados analisada com sucesso!');
    })
    .catch(err => {
        console.error('❌ Erro ao conectar ao banco de dados:', err.message);
        process.exit(1);
    });
