/**
 * Script para verificar se os favicons estão configurados corretamente
 */
const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO CONFIGURAÇÃO DOS FAVICONS ===\n');

const frontendDir = path.join(__dirname, '..', 'frontend');
const htmlFiles = ['index.html', 'login.html', 'register.html'];

// Verificar arquivos de favicon na raiz do frontend
const faviconFiles = [
    'apple-touch-icon.png',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'favicon.ico',
    'site.webmanifest',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png'
];

console.log('Verificando arquivos de favicon na raiz do frontend:');
let missingFiles = 0;

faviconFiles.forEach(file => {
    const filePath = path.join(frontendDir, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ Encontrado: ${file}`);
    } else {
        console.log(`❌ Não encontrado: ${file}`);
        missingFiles++;
    }
});

if (missingFiles > 0) {
    console.log(`\n❌ ${missingFiles} arquivos de favicon não foram encontrados na raiz.`);
    console.log('Execute o script move-favicons.js para mover os arquivos da pasta favicon para a raiz do frontend.');
}

// Verificar referências aos favicons nos arquivos HTML
console.log('\nVerificando referências nos arquivos HTML:');

htmlFiles.forEach(htmlFile => {
    const filePath = path.join(frontendDir, htmlFile);
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Verificar se usa caminhos absolutos (começando com /)
            if (content.includes('href="/apple-touch-icon.png"') &&
                content.includes('href="/favicon-32x32.png"') &&
                content.includes('href="/favicon-16x16.png"')) {
                console.log(`✅ ${htmlFile}: Caminhos absolutos configurados corretamente`);
            } else {
                console.log(`❌ ${htmlFile}: Caminhos de favicon podem estar incorretos`);
            }
        } catch (error) {
            console.error(`❌ Erro ao ler ${htmlFile}: ${error.message}`);
        }
    } else {
        console.log(`⚠️ Arquivo HTML não encontrado: ${htmlFile}`);
    }
});

// Verificar site.webmanifest
const webmanifestPath = path.join(frontendDir, 'site.webmanifest');
if (fs.existsSync(webmanifestPath)) {
    try {
        const content = fs.readFileSync(webmanifestPath, 'utf8');
        const manifestJson = JSON.parse(content);

        if (manifestJson.icons &&
            manifestJson.icons.some(icon => icon.src && icon.src.startsWith('/'))) {
            console.log('✅ site.webmanifest: Caminhos absolutos configurados corretamente');
        } else {
            console.log('❌ site.webmanifest: Caminhos podem não estar configurados como absolutos');
        }
    } catch (error) {
        console.error(`❌ Erro ao verificar site.webmanifest: ${error.message}`);
    }
} else {
    console.log('❌ site.webmanifest não encontrado na raiz');
}

// Verificar configuração do Vercel (se houver)
const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
    console.log('\nVerificando configuração do Vercel:');

    try {
        const content = fs.readFileSync(vercelJsonPath, 'utf8');
        const vercelConfig = JSON.parse(content);

        if (vercelConfig.routes && vercelConfig.routes.some(route => route.src === '/' || route.src === '/(.*)')) {
            console.log('✅ vercel.json: Contém rotas que podem servir arquivos estáticos da raiz');
        } else {
            console.log('⚠️ vercel.json: Pode não estar configurado para servir arquivos estáticos da raiz');
        }
    } catch (error) {
        console.error(`❌ Erro ao verificar vercel.json: ${error.message}`);
    }
}

console.log('\n=== VERIFICAÇÃO CONCLUÍDA ===');
