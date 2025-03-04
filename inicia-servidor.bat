@echo off
echo ======================================
echo    INICIANDO SERVIDOR AGENDA DIGITAL
echo ======================================
echo.

REM Navegar para a pasta raiz do projeto
cd /d %~dp0
echo Diretório atual: %cd%

REM Verificar se estamos na pasta correta
if not exist "server" (
  echo Erro: Pasta 'server' não encontrada!
  echo Certifique-se de que este script está na pasta raiz do projeto.
  goto :end
)

REM Navegar para a pasta server
cd server
echo Entrando na pasta server: %cd%

REM Verificar se package.json e server.js existem
if not exist "package.json" (
  echo Erro: 'package.json' não encontrado na pasta server!
  goto :end
)

if not exist "server.js" (
  echo Erro: 'server.js' não encontrado na pasta server!
  goto :end
)

echo.
echo Iniciando o servidor...
echo.
npm start

:end
echo.
echo Pressione qualquer tecla para sair...
pause > nul
