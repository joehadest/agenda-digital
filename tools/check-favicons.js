/**
 * Script para verificar se todos os arquivos de favicon necessários existem
 * e se os caminhos nos arquivos HTML estão corretos
 */
const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO ARQUIVOS DE FAVICON ===\n');

const faviconDir = path.join(__dirname, '..', 'frontend', 'favicon');
const htmlDir = path.join(__dirname, '..', 'frontend');

// Verificar se o diretório de favicons existe
if (!fs.existsSync(faviconDir)) {
    console.log(`❌ Diretório de favicons não encontrado: ${faviconDir}`);
    console.log('Criando o diretório...');
    try {
        fs.mkdirSync(faviconDir, { recursive: true });
        console.log('✅ Diretório de favicons criado com sucesso!');
    } catch (error) {
        console.error(`❌ Erro ao criar diretório de favicons: ${error.message}`);
    }
}

// Lista de arquivos de favicon necessários
const requiredFavicons = [
    { file: 'favicon.ico', description: 'Favicon tradicional' },
    { file: 'favicon-16x16.png', description: 'Favicon 16x16' },
    { file: 'favicon-32x32.png', description: 'Favicon 32x32' },
    { file: 'apple-touch-icon.png', description: 'Ícone para dispositivos Apple' },
    { file: 'android-chrome-192x192.png', description: 'Ícone para Android (192x192)' },
    { file: 'android-chrome-512x512.png', description: 'Ícone para Android (512x512)' },
    { file: 'site.webmanifest', description: 'Manifesto do site' }
];

// Verificar cada arquivo
let missingFiles = 0;
requiredFavicons.forEach(favicon => {
    const filePath = path.join(faviconDir, favicon.file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${favicon.description} encontrado: ${favicon.file}`);
    } else {
        console.log(`❌ ${favicon.description} não encontrado: ${favicon.file}`);
        missingFiles++;
    }
});

// Verificar referências nas páginas HTML
console.log('\n=== VERIFICANDO REFERÊNCIAS NOS ARQUIVOS HTML ===');

const htmlFiles = ['index.html', 'login.html', 'register.html'];
const correctFaviconPath = './favicon/favicon.ico';

htmlFiles.forEach(htmlFile => {
    const filePath = path.join(htmlDir, htmlFile);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(correctFaviconPath)) {
            console.log(`✅ ${htmlFile} tem o caminho correto para o favicon`);
        } else {
            console.log(`❌ ${htmlFile} pode ter um caminho incorreto para o favicon`);
        }
    } else {
        console.log(`⚠️ Arquivo HTML não encontrado: ${htmlFile}`);
    }
});

// Resumo
console.log('\n=== RESUMO DA VERIFICAÇÃO ===');
if (missingFiles === 0) {
    console.log('✅ Todos os arquivos de favicon estão presentes!');
} else {
    console.log(`❌ ${missingFiles} arquivos de favicon estão faltando.`);
    console.log('\nSugestões:');
    console.log('1. Gere um conjunto completo de favicons em https://realfavicongenerator.net/');
    console.log('2. Coloque os arquivos gerados na pasta "frontend/favicon/"');
    console.log('3. Execute este script novamente para verificar se todos os arquivos necessários estão presentes.');
}
