# Agenda Digital

Uma aplicação web para gerenciar compromissos e agendamentos pessoais, com sistema de notificações e multi-usuário.

## Funcionalidades

- ✅ Autenticação de usuários (cadastro e login)
- ✅ Criar, editar e excluir eventos
- ✅ Filtrar compromissos por data
- ✅ Sistema de notificações para lembrar compromissos
- ✅ Interface responsiva
- ✅ Banco de dados MongoDB Atlas

## Tecnologias Utilizadas

### Frontend
- HTML5, CSS3
- JavaScript (Vanilla)
- Notificações Web

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT para autenticação

## Estrutura do Projeto

```
agenda-digital/
├── frontend/           # Arquivos do cliente
│   ├── css/            # Estilos
│   ├── js/             # Scripts do cliente
│   ├── index.html      # Página principal
│   ├── login.html      # Página de login
│   └── register.html   # Página de cadastro
│
├── server/             # Servidor backend
│   ├── models/         # Modelos de dados
│   ├── routes/         # Rotas da API
│   ├── middleware/     # Middlewares
│   ├── tools/          # Scripts utilitários
│   └── server.js       # Arquivo principal do servidor
│
└── README.md           # Documentação do projeto
```

## Instalação e Uso

### Configuração do Backend

1. Navegue até a pasta do servidor:
   ```bash
   cd server
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na pasta `server` com:
     ```
     MONGODB_URI=sua_string_de_conexão_mongodb
     JWT_SECRET=sua_chave_secreta
     PORT=3000
     ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

### Configuração do Frontend

- Simplesmente abra os arquivos HTML em seu navegador ou use um servidor web estático

## Implantação

- Frontend: Pode ser hospedado no Vercel, Netlify ou GitHub Pages
- Backend: Pode ser hospedado em plataformas como Heroku, Render, Railway ou AWS

## Licença

Este projeto está licenciado sob a licença MIT.
