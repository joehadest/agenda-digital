/**
 * Interface de administração simples para o banco de dados
 * Execute com: node admin.js
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');

const app = express();
const PORT = process.env.ADMIN_PORT || 3001;

// Middleware para JSON
app.use(express.json());

// Conexão com o banco de dados
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err.message));

// Página principal da administração
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Administração do Banco de Dados - Agenda Digital</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #4a6fa5; }
        h2 { margin-top: 30px; color: #166088; }
        .btn { display: inline-block; background: #4a6fa5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
      </style>
    </head>
    <body>
      <h1>Administração do Banco de Dados - Agenda Digital</h1>
      <p>Use esta interface para visualizar e gerenciar o banco de dados da aplicação.</p>
      
      <h2>Usuários</h2>
      <a href="/users" class="btn">Ver todos os usuários</a>
      
      <h2>Eventos</h2>
      <a href="/events" class="btn">Ver todos os eventos</a>
      
      <h2>Estatísticas</h2>
      <a href="/stats" class="btn">Ver estatísticas do banco de dados</a>
      
      <script>
        // JavaScript para atualização automática e interatividade pode ser adicionado aqui
      </script>
    </body>
    </html>
  `);
});

// Listar todos os usuários
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password');

        let html = `
      <html>
      <head>
        <title>Usuários - Agenda Digital</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #4a6fa5; }
          .back { margin-bottom: 20px; display: block; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <a href="/" class="back">&larr; Voltar</a>
        <h1>Lista de Usuários</h1>
        <table>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Data de Cadastro</th>
            <th>Ações</th>
          </tr>
    `;

        users.forEach(user => {
            html += `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${new Date(user.createdAt).toLocaleString('pt-BR')}</td>
          <td>
            <a href="/user/${user._id}/events">Ver eventos</a>
          </td>
        </tr>
      `;
        });

        html += `
        </table>
      </body>
      </html>
    `;

        res.send(html);
    } catch (error) {
        res.status(500).send(`Erro ao buscar usuários: ${error.message}`);
    }
});

// Listar eventos de um usuário específico
app.get('/user/:id/events', async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '-password');

        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }

        const events = await Event.find({ user: user._id }).sort({ date: 1, time: 1 });

        let html = `
      <html>
      <head>
        <title>Eventos do Usuário - Agenda Digital</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #4a6fa5; }
          .back { margin-bottom: 20px; display: block; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <a href="/users" class="back">&larr; Voltar para usuários</a>
        <h1>Eventos de ${user.name}</h1>
        <p>Email: ${user.email}</p>
    `;

        if (events.length === 0) {
            html += '<p>Este usuário não possui eventos cadastrados.</p>';
        } else {
            html += `
        <table>
          <tr>
            <th>Título</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Descrição</th>
          </tr>
      `;

            events.forEach(event => {
                html += `
          <tr>
            <td>${event.title}</td>
            <td>${new Date(event.date).toLocaleDateString('pt-BR')}</td>
            <td>${event.time}</td>
            <td>${event.description || '-'}</td>
          </tr>
        `;
            });

            html += '</table>';
        }

        html += `
      </body>
      </html>
    `;

        res.send(html);
    } catch (error) {
        res.status(500).send(`Erro ao buscar eventos: ${error.message}`);
    }
});

// Estatísticas do banco de dados
app.get('/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const eventCount = await Event.countDocuments();

        // Usuário com mais eventos
        const usersWithEventCount = await Event.aggregate([
            { $group: { _id: "$user", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        let topUser = { name: 'Nenhum', count: 0 };

        if (usersWithEventCount.length > 0) {
            const userId = usersWithEventCount[0]._id;
            const user = await User.findById(userId);
            if (user) {
                topUser = {
                    name: user.name,
                    email: user.email,
                    count: usersWithEventCount[0].count
                };
            }
        }

        res.send(`
      <html>
      <head>
        <title>Estatísticas - Agenda Digital</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #4a6fa5; }
          .back { margin-bottom: 20px; display: block; }
          .stat-card { background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          .stat-number { font-size: 36px; font-weight: bold; color: #166088; }
          .stat-label { color: #666; }
        </style>
      </head>
      <body>
        <a href="/" class="back">&larr; Voltar</a>
        <h1>Estatísticas do Banco de Dados</h1>
        
        <div class="stat-card">
          <div class="stat-number">${userCount}</div>
          <div class="stat-label">Total de Usuários Cadastrados</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">${eventCount}</div>
          <div class="stat-label">Total de Eventos/Compromissos</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">${topUser.count}</div>
          <div class="stat-label">Maior número de eventos por usuário</div>
          <p>Usuário: ${topUser.name} ${topUser.email ? `(${topUser.email})` : ''}</p>
        </div>
      </body>
      </html>
    `);
    } catch (error) {
        res.status(500).send(`Erro ao gerar estatísticas: ${error.message}`);
    }
});

// Listar todos os eventos
app.get('/events', async (req, res) => {
    try {
        // Buscar eventos com informações do usuário
        const events = await Event.find().populate('user', 'name email').sort({ date: 1, time: 1 });

        let html = `
      <html>
      <head>
        <title>Eventos - Agenda Digital</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #4a6fa5; }
          .back { margin-bottom: 20px; display: block; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <a href="/" class="back">&larr; Voltar</a>
        <h1>Lista de Eventos</h1>
        <table>
          <tr>
            <th>Título</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Usuário</th>
            <th>Descrição</th>
          </tr>
    `;

        events.forEach(event => {
            const userName = event.user ? event.user.name : 'Usuário desconhecido';
            html += `
        <tr>
          <td>${event.title}</td>
          <td>${new Date(event.date).toLocaleDateString('pt-BR')}</td>
          <td>${event.time}</td>
          <td>${userName}</td>
          <td>${event.description || '-'}</td>
        </tr>
      `;
        });

        html += `
        </table>
      </body>
      </html>
    `;

        res.send(html);
    } catch (error) {
        res.status(500).send(`Erro ao buscar eventos: ${error.message}`);
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor de administração rodando em http://localhost:${PORT}`);
    console.log('Use Ctrl+C para encerrar');
});
