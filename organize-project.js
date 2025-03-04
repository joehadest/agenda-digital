/**
 * ORGANIZADOR DE ESTRUTURA DE PROJETO
 * Este script organiza todos os arquivos soltos em uma estrutura
 * de pastas adequada para a Agenda Digital
 */

const fs = require('fs');
const path = require('path');

// Estrutura de pastas que queremos criar
const directories = [
    'frontend/js',
    'frontend/css',
    'server/models',
    'server/routes',
    'server/middleware',
    'server/tools',
    'server/config',
    'tools',
    'docs'
];

// Arquivos para mover (origem -> destino)
const filesToMove = {
    // Frontend
    'index.html': 'frontend/index.html',
    'login.html': 'frontend/login.html',
    'register.html': 'frontend/register.html',

    // CSS
    'css/style.css': 'frontend/css/style.css',
    'css/auth.css': 'frontend/css/auth.css',

    // Frontend JS
    'js/app.js': 'frontend/js/app.js',
    'js/api.js': 'frontend/js/api.js',
    'js/auth.js': 'frontend/js/auth.js',
    'js/notification.js': 'frontend/js/notification.js',

    // Server
    'server/server.js': 'server/server.js',

    // Server Models
    'server/models/User.js': 'server/models/User.js',
    'server/models/Event.js': 'server/models/Event.js',

    // Server Routes
    'server/routes/userRoutes.js': 'server/routes/userRoutes.js',
    'server/routes/eventRoutes.js': 'server/routes/eventRoutes.js',

    // Server Middleware
    'server/middleware/auth.js': 'server/middleware/auth.js',

    // Server Tools
    'server/test-connection.js': 'server/tools/test-connection.js',
    'server/test-connection-detailed.js': 'server/tools/test-connection-detailed.js',
    'server/check-env.js': 'server/tools/check-env.js',
    'server/simple-test.js': 'server/tools/simple-test.js',
    'server/list-directory.js': 'server/tools/list-directory.js',
    'server/install-deps.js': 'server/tools/install-deps.js',
    'server/tools/list-users.js': 'server/tools/list-users.js',
    'server/tools/backup-data.js': 'server/tools/backup-data.js',
    'encode-password.js': 'server/tools/encode-password.js',

    // Root Tools
    'fix-vercel-env.js': 'tools/fix-vercel-env.js',
    'fix-git-push.js': 'tools/fix-git-push.js',
    'check-git-status.js': 'tools/check-git-status.js',
    'reorganize.js': 'tools/reorganize.js',
    'organize-for-github.js': 'tools/organize-for-github.js',
    'git-diagnostic.js': 'tools/git-diagnostic.js',
    'vercel-config-guide.js': 'tools/vercel-config-guide.js',
    'mongodb-connection-guide.js': 'tools/mongodb-connection-guide.js',
    'generate-jwt-secret.js': 'tools/generate-jwt-secret.js',
    'vercel-env-steps.js': 'tools/vercel-env-steps.js',
    'explain-env-values.js': 'tools/explain-env-values.js',
    'roadmap_melhorias.js': 'docs/roadmap_melhorias.js',

    // Documentation
    'README.md': 'README.md',
    'VERCEL.md': 'docs/VERCEL.md',
    'ENV_SETUP.md': 'docs/ENV_SETUP.md',
    'INSTRUCOES_GIT_MANUAL.md': 'docs/INSTRUCOES_GIT_MANUAL.md',
    'GITHUB_DESKTOP.md': 'docs/GITHUB_DESKTOP.md',
    'VERCEL_CONFIG_VISUAL.md': 'docs/VERCEL_CONFIG_VISUAL.md',
    'VERCEL_NEW_PROJECT_GUIDE.md': 'docs/VERCEL_NEW_PROJECT_GUIDE.md',
    'CORRECAO_VERCEL_ENV.md': 'docs/CORRECAO_VERCEL_ENV.md',

    // Configuration
    '.gitignore': '.gitignore',
    'vercel.json': 'vercel.json',
    'package.json': 'package.json',
    'server/.env': 'server/config/.env',
    'server/.env.example': 'server/config/.env.example'
};

// Criar diretórios
console.log('=== ORGANIZANDO ESTRUTURA DE PROJETO ===');
console.log('\nCriando estrutura de pastas...');

directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);

    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`✅ Diretório criado: ${dir}`);
        } catch (error) {
            console.log(`❌ Erro ao criar diretório ${dir}: ${error.message}`);
        }
    } else {
        console.log(`ℹ️ Diretório já existe: ${dir}`);
    }
});

// Mover arquivos
console.log('\nMovendo arquivos para as pastas corretas...');
let filesMoved = 0;
let filesSkipped = 0;
let filesNotFound = 0;

Object.entries(filesToMove).forEach(([source, dest]) => {
    const sourcePath = path.join(__dirname, source);
    const destPath = path.join(__dirname, dest);

    // Verificar se o arquivo de origem existe
    if (fs.existsSync(sourcePath)) {
        try {
            // Garantir que o diretório de destino existe
            const destDir = path.dirname(destPath);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }

            // Copiar o arquivo
            fs.copyFileSync(sourcePath, destPath);
            console.log(`✅ Arquivo movido: ${source} → ${dest}`);
            filesMoved++;

            // Depois de copiar, apagar o original se não estiver no mesmo lugar
            if (sourcePath !== destPath) {
                try {
                    fs.unlinkSync(sourcePath);
                } catch (unlinkError) {
                    console.log(`⚠️ Não foi possível excluir original: ${source}`);
                }
            }
        } catch (error) {
            console.log(`❌ Erro ao mover ${source}: ${error.message}`);
            filesSkipped++;
        }
    } else {
        // O arquivo não existe, verificar se já existe no destino
        if (fs.existsSync(destPath)) {
            console.log(`ℹ️ Arquivo já existe no destino: ${dest}`);
            filesSkipped++;
        } else {
            console.log(`⚠️ Arquivo não encontrado: ${source}`);
            filesNotFound++;
        }
    }
});

// Resumo
console.log('\n=== RESUMO DA ORGANIZAÇÃO ===');
console.log(`✅ Arquivos movidos: ${filesMoved}`);
console.log(`ℹ️ Arquivos ignorados: ${filesSkipped}`);
console.log(`⚠️ Arquivos não encontrados: ${filesNotFound}`);
console.log('\nA estrutura do projeto foi organizada com sucesso!');
console.log('\nSua nova estrutura de diretórios é:');
console.log('agenda-digital/');
console.log('├── frontend/         # Arquivos do cliente (HTML, CSS, JS)');
console.log('├── server/           # Backend e API');
console.log('├── tools/            # Scripts utilitários gerais');
console.log('├── docs/             # Documentação do projeto');
console.log('└── ... arquivos de configuração na raiz');
