const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('======== VERIFICAÇÃO DE CONFIGURAÇÃO DO SERVIDOR ========');
console.log('Diretório atual:', process.cwd());

// Verificar arquivos principais
const essentialFiles = ['server.js', 'package.json', '.env'];
const modelFiles = ['models/User.js', 'models/Event.js'];
const routeFiles = ['routes/userRoutes.js', 'routes/eventRoutes.js'];
const middlewareFiles = ['middleware/auth.js'];

console.log('\n1. Verificando arquivos essenciais:');
essentialFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  - ${file}: ${exists ? '✅' : '❌'}`);

    if (exists && file === '.env') {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const hasUri = content.includes('MONGODB_URI');
            const hasSecret = content.includes('JWT_SECRET');
            console.log(`    - MONGODB_URI: ${hasUri ? '✅' : '❌'}`);
            console.log(`    - JWT_SECRET: ${hasSecret ? '✅' : '❌'}`);
        } catch (err) {
            console.log(`    Erro ao ler .env: ${err.message}`);
        }
    }
});

console.log('\n2. Verificando modelos:');
modelFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  - ${file}: ${exists ? '✅' : '❌'}`);
});

console.log('\n3. Verificando rotas:');
routeFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  - ${file}: ${exists ? '✅' : '❌'}`);
});

console.log('\n4. Verificando middlewares:');
middlewareFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  - ${file}: ${exists ? '✅' : '❌'}`);
});

console.log('\n5. Verificando dependências instaladas:');
exec('npm list --depth=0', (error, stdout, stderr) => {
    console.log(stdout);

    console.log('\n6. Próximos passos:');
    console.log('  - Para iniciar o servidor: npm start');
    console.log('  - Para verificar a conexão com MongoDB: node test-connection-detailed.js');
    console.log('  - Para testar as rotas: Instale uma ferramenta como Postman ou use curl');
});
