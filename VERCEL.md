# Configuração da Agenda Digital no Vercel

Este guia explica como configurar o projeto para o Vercel.

## Passos para Implantação

1. **Faça login no Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub

2. **Importe o Projeto**
   - Clique em "Add New..." e selecione "Project"
   - Selecione o repositório "agenda-digital"
   - Clique em "Import"

3. **Configure as Variáveis de Ambiente**
   Na página de configuração do projeto, adicione estas variáveis:

   - `MONGODB_URI`: Sua URI de conexão do MongoDB
     ```
     mongodb+srv://joehadest:sua_senha@agenda-database.dqrzi.mongodb.net/usuarios-login?retryWrites=true&w=majority
     ```
   
   - `JWT_SECRET`: Uma chave secreta para autenticação
     ```
     sua_chave_secreta_muito_segura
     ```

4. **Implante o Projeto**
   - Clique em "Deploy" e aguarde a implantação

5. **Verifique a implantação**
   - Quando concluído, clique na URL fornecida pelo Vercel
   - Você deverá ver a página de login da sua Agenda Digital

## Solução de Problemas

- **API não está funcionando?**
  Verifique se as variáveis de ambiente foram configuradas corretamente

- **Problemas de CORS?**
  Verifique se o arquivo server.js tem o middleware CORS configurado corretamente

- **Erro de conexão com o MongoDB?**
  Certifique-se de que o IP do Vercel está na lista de IPs permitidos do MongoDB Atlas
