# Instruções para Push Manual no GitHub

Se o script automatizado não funcionar, siga estas instruções passo a passo:

## 1. Preparação

Certifique-se de que a estrutura do projeto está correta:
```
node reorganize.js
```

## 2. Configurar Git

Abra o terminal (PowerShell ou CMD) na pasta do projeto e execute:

```bash
# Remover repositório Git existente (se houver)
rm -rf .git

# Inicializar novo repositório
git init

# Configurar usuário e email (substitua pelos seus)
git config user.name "joel"
git config user.email "joel.melo171@gmail.com"
```

## 3. Adicionar Arquivos

```bash
# Criar arquivo .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore

# Adicionar todos os arquivos
git add .

# Verificar quais arquivos foram adicionados
git status
```

## 4. Commit e Push

```bash
# Criar commit
git commit -m "Versão completa da Agenda Digital"

# Adicionar repositório remoto
git remote add origin https://github.com/joehadest/agenda-digital.git

# Enviar para o GitHub
git push -f -u origin master
```

## 5. Verificação

Após o push, visite seu repositório no GitHub para confirmar que todos os arquivos foram enviados:
https://github.com/joehadest/agenda-digital

## Problemas Comuns

1. **Erro "fatal: remote origin already exists"**
   ```bash
   git remote remove origin
   git remote add origin https://github.com/joehadest/agenda-digital.git
   ```

2. **Erro de autenticação**
   - Certifique-se de estar logado em sua conta GitHub
   - Use um token de acesso pessoal se necessário

3. **Arquivos muito grandes**
   - O GitHub tem limite de 100MB por arquivo
   - Verifique se há arquivos grandes que devem ser excluídos
