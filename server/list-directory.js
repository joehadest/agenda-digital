const fs = require('fs');
const path = require('path');

const currentDir = process.cwd();
console.log('Diretório atual:', currentDir);

console.log('\nArquivos e pastas disponíveis:');

fs.readdirSync(currentDir).forEach(file => {
    const stats = fs.statSync(path.join(currentDir, file));
    if (stats.isDirectory()) {
        console.log(`📁 ${file}`);
    } else {
        console.log(`📄 ${file}`);
    }
});

console.log('\nComando para voltar ao diretório principal:');
console.log('cd ..');
