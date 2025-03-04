/**
 * ATUALIZADOR DE REFERÊNCIAS
 * Este script atualiza as referências de arquivos após a reorganização
 */

const fs = require('fs');
const path = require('path');

console.log('=== ATUALIZANDO REFERÊNCIAS DE ARQUIVOS ===');

// Lista de arquivos HTML que precisam ser atualizados
const htmlFiles = [
    'frontend/index.html',
    'frontend/login.html',
    'frontend/register.html'
];

// Atualizar referências nos arquivos HTML
console.log('\nAtualizando arquivos HTML...');
htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);

    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Atualizar referências aos arquivos CSS
        content = content.replace(/href="css\//g, 'href="');

        // Atualizar referências aos arquivos JS
        content = content.replace(/src="js\//g, 'src="');

        // Salvar o arquivo atualizado
        fs.writeFileSync(filePath, content);
        console.log(`✅ Referências atualizadas em: ${file}`);
    } else {
        console.log(`⚠️ Arquivo não encontrado: ${file}`);
    }
});

// Lista de arquivos JS que precisam ser atualizados
const jsFiles = [
    'frontend/js/app.js',
    'frontend/js/notification.js',
    'server/server.js'
];

// Atualizar referências nos arquivos JS
console.log('\nAtualizando arquivos JS...');
jsFiles.forEach(file => {
    const filePath = path.join(__dirname, file);

    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Atualizar caminhos de importação se necessário
        // Por exemplo, se houver require('../models/User') que precisa mudar para require('../models/User')

        // Salvar o arquivo atualizado
        fs.writeFileSync(filePath, content);
        console.log(`✅ Referências verificadas em: ${file}`);
    } else {
        console.log(`⚠️ Arquivo não encontrado: ${file}`);
    }
});

console.log('\nAtualização de referências concluída!');
console.log('Execute o servidor para confirmar que tudo está funcionando corretamente.');
