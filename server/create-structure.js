const fs = require('fs');
const path = require('path');

// Diretórios essenciais
const directories = [
    'middleware',
    'models',
    'routes',
    'backups',
    'tools'
];

console.log('Verificando e criando estrutura de diretórios...');

// Criar diretórios se não existirem
directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);

    if (!fs.existsSync(dirPath)) {
        console.log(`Criando diretório: ${dir}`);
        fs.mkdirSync(dirPath, { recursive: true });
    } else {
        console.log(`Diretório já existe: ${dir}`);
    }
});

console.log('\nEstrutura de diretórios criada com sucesso!');
console.log('Agora tente executar o servidor novamente com: npm start');
