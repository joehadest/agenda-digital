# Agenda Digital

Uma aplicação web para gerenciar compromissos e agendamentos pessoais, com sistema de notificações e multi-usuário.

## Estrutura do Projeto

```
agenda-digital/
├── frontend/           # Interface do usuário
│   ├── css/            # Estilos CSS
│   │   ├── auth.css    # Estilos para autenticação
│   │   └── style.css   # Estilos principais
│   ├── js/             # JavaScript do frontend
│   │   ├── api.js      # Comunicação com a API
│   │   ├── app.js      # Lógica principal
│   │   ├── auth.js     # Autenticação do usuário
│   │   └── notification.js # Sistema de notificações
│   ├── index.html      # Página principal
│   ├── login.html      # Página de login
│   └── register.html   # Página de cadastro
│
├── server/             # Backend da aplicação
│   ├── config/         # Configurações
│   │   └── .env        # Variáveis de ambiente
│   ├── middleware/     # Middlewares
│   │   └── auth.js     # Middleware de autenticação
│   ├── models/         # Modelos de dados
│   │   ├── Event.js    # Modelo de eventos
│   │   └── User.js     # Modelo de usuário
│   ├── routes/         # Rotas da API
│   │   ├── eventRoutes.js # Rotas de eventos
│   │   └── userRoutes.js  # Rotas de usuários
│   ├── tools/          # Ferramentas e utilitários
│   │   ├── backup-data.js      # Backup de dados
│   │   ├── check-env.js        # Verificação de variáveis
│   │   ├── list-users.js       # Listar usuários
│   │   └── test-connection.js  # Testar conexão
│   └── server.js       # Arquivo principal do servidor
│
├── tools/              # Ferramentas de desenvolvimento
│   ├── fix-git-push.js          # Correção de problemas git
│   ├── fix-vercel-env.js        # Correção de variáveis Vercel
│   ├── generate-jwt-secret.js   # Gerador de chave secreta
│   └── vercel-config-guide.js   # Guia de configuração
│
├── docs/               # Documentação
│   ├── ENV_SETUP.md               # Configuração de ambiente
│   ├── INSTRUCOES_GIT_MANUAL.md   # Uso do Git
│   ├── VERCEL.md                  # Configuração do Vercel
│   └── roadmap_melhorias.js       # Melhorias futuras
│
├── vercel.json         # Configuração do Vercel
├── package.json        # Dependências do projeto
└── .gitignore          # Arquivos ignorados pelo Git
```

## Instalação e Uso

### Configuração do Backend

1. Navegue até a pasta do servidor:
   ```
   cd server
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure o arquivo `.env` na pasta `server/config`:
   ```
   MONGODB_URI=sua_string_de_conexão_mongodb
   JWT_SECRET=sua_chave_secreta
   PORT=3000
   ```

4. Inicie o servidor:
   ```
   npm start
   ```

### Acesso à Aplicação

Abra a página de login em `frontend/login.html` para acessar a aplicação.

## Funcionalidades

- ✅ Autenticação de usuários (cadastro e login)
- ✅ Criar, editar e excluir eventos
- ✅ Filtrar compromissos por data
- ✅ Sistema de notificações para lembrar compromissos
- ✅ Interface responsiva
- ✅ Banco de dados MongoDB Atlas

## Tecnologias Utilizadas

- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js
- Banco de dados: MongoDB Atlas
- Autenticação: JWT
