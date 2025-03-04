const path = require('path');
const fs = require('fs');

// Mostrar o diretório atual
console.log('Diretório atual:', process.cwd());

// Listar arquivos e pastas no diretório atual
console.log('\nConteúdo do diretório:');
const items = fs.readdirSync('.');
items.forEach(item => {
    const stats = fs.statSync(item);
    const type = stats.isDirectory() ? 'Pasta' : 'Arquivo';
    console.log(`- ${item} (${type})`);
});

// Verificar se package.json existe
console.log('\nVerificando arquivos importantes:');
const packageExists = fs.existsSync('package.json');
const serverExists = fs.existsSync('server.js');
console.log(`- package.json: ${packageExists ? 'Encontrado ✅' : 'Não encontrado ❌'}`);
console.log(`- server.js: ${serverExists ? 'Encontrado ✅' : 'Não encontrado ❌'}`);
