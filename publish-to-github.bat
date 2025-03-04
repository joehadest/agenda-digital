@echo off
echo ========================================
echo    PUBLICANDO PARA GITHUB E VERCEL
echo ========================================
echo.

REM Navegar para a pasta raiz do projeto
cd /d %~dp0
echo Diretório atual: %cd%

echo.
echo 1. Inicializando repositório Git...
git init

echo.
echo 2. Adicionando origem remota...
git remote add origin https://github.com/joehadest/agenda-digital.git

echo.
echo 3. Adicionando todos os arquivos...
git add .

echo.
echo 4. Criando commit inicial...
git commit -m "Versão inicial da Agenda Digital"

echo.
echo 5. Enviando para o GitHub...
git push -u origin master

echo.
echo Processo concluído! Acesse:
echo https://github.com/joehadest/agenda-digital
echo.
echo Para implantar no Vercel:
echo 1. Acesse vercel.com
echo 2. Importe seu repositório do GitHub
echo 3. Configure as variáveis de ambiente:
echo    - MONGODB_URI
echo    - JWT_SECRET
echo.
pause
