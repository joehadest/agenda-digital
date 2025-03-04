const fs = require('fs');
const path = require('path');

// Diretórios principais
const directories = {
    frontend: ['css', 'js'],
    server: ['models', 'routes', 'middleware', 'tools', 'backups']
};

// Criar estrutura de pastas
console.log('Criando estrutura de pastas para GitHub...');

Object.keys(directories).forEach(dir => {
    const mainDir = path.join(__dirname, dir);

    if (!fs.existsSync(mainDir)) {
        fs.mkdirSync(mainDir, { recursive: true });
        console.log(`Criado diretório principal: ${dir}`);
    }

    directories[dir].forEach(subDir => {
        const subDirPath = path.join(__dirname, dir, subDir);
        if (!fs.existsSync(subDirPath)) {
            fs.mkdirSync(subDirPath, { recursive: true });
            console.log(`Criado subdiretório: ${dir}/${subDir}`);
        }
    });
});

// Mover arquivos HTML/CSS/JS para frontend
const htmlFiles = ['index.html', 'login.html', 'register.html'];
const cssDir = path.join(__dirname, 'css');
const jsDir = path.join(__dirname, 'js');

// Mover arquivos HTML
htmlFiles.forEach(file => {
    const sourcePath = path.join(__dirname, file);
    const destPath = path.join(__dirname, 'frontend', file);

    if (fs.existsSync(sourcePath)) {
        try {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`Copiado ${file} para frontend/`);
        } catch (err) {
            console.error(`Erro ao copiar ${file}:`, err);
        }
    }
});

// Mover pasta CSS
if (fs.existsSync(cssDir)) {
    const files = fs.readdirSync(cssDir);
    files.forEach(file => {
        const sourcePath = path.join(cssDir, file);
        const destPath = path.join(__dirname, 'frontend', 'css', file);

        try {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`Copiado css/${file} para frontend/css/`);
        } catch (err) {
            console.error(`Erro ao copiar css/${file}:`, err);
        }
    });
}

// Mover pasta JS
if (fs.existsSync(jsDir)) {
    const files = fs.readdirSync(jsDir);
    files.forEach(file => {
        const sourcePath = path.join(jsDir, file);
        const destPath = path.join(__dirname, 'frontend', 'js', file);

        try {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`Copiado js/${file} para frontend/js/`);
        } catch (err) {
            console.error(`Erro ao copiar js/${file}:`, err);
        }
    });
}

console.log('\nEstrutura reorganizada com sucesso para GitHub!');
console.log('Verifique os arquivos e então continue com o processo de git.');
