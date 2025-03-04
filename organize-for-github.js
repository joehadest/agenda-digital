const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===================================');
console.log('   ORGANIZANDO PARA GITHUB/VERCEL');
console.log('===================================');

// Criar estrutura de pastas se não existirem
const directories = {
    frontend: ['css', 'js'],
    server: ['models', 'routes', 'middleware', 'tools']
};

Object.keys(directories).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Criado diretório: ${dir}`);
    }

    directories[dir].forEach(subdir => {
        const fullPath = path.join(dir, subdir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`Criado subdiretório: ${fullPath}`);
        }
    });
});

// Arquivos para mover
const filesToMove = {
    // HTML files to frontend
    'index.html': 'frontend/index.html',
    'login.html': 'frontend/login.html',
    'register.html': 'frontend/register.html',

    // CSS files to frontend/css
    'css/style.css': 'frontend/css/style.css',
    'css/auth.css': 'frontend/css/auth.css',

    // JS files to frontend/js
    'js/app.js': 'frontend/js/app.js',
    'js/api.js': 'frontend/js/api.js',
    'js/auth.js': 'frontend/js/auth.js',
    'js/notification.js': 'frontend/js/notification.js'
};

// Mover arquivos
console.log('\nMovendo arquivos para estrutura correta:');
Object.entries(filesToMove).forEach(([source, dest]) => {
    if (fs.existsSync(source)) {
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        try {
            fs.copyFileSync(source, dest);
            console.log(`Copiado: ${source} → ${dest} ✅`);
        } catch (err) {
            console.log(`Erro ao copiar ${source}: ${err.message} ❌`);
        }
    } else {
        console.log(`Arquivo não encontrado: ${source} ⚠️`);
    }
});

// Atualizar referencias nos arquivos HTML
const htmlFiles = ['frontend/index.html', 'frontend/login.html', 'frontend/register.html'];

htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Substituir referências CSS
        content = content.replace(/href="css\//g, 'href="');

        // Substituir referências JS
        content = content.replace(/src="js\//g, 'src="');

        fs.writeFileSync(file, content);
        console.log(`Atualizadas referências em: ${file} ✅`);
    }
});

console.log('\n===================================');
console.log('   ESTRUTURA PRONTA PARA GITHUB');
console.log('===================================');
console.log('\nPróximos passos:');
console.log('1. Execute: node fix-git-push.js');
console.log('2. Verifique o GitHub após o push');
