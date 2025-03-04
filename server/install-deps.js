const { execSync } = require('child_process');

console.log('Verificando e instalando dependências necessárias...');

try {
    console.log('Instalando mongoose...');
    execSync('npm install mongoose', { stdio: 'inherit' });

    console.log('Instalando dotenv...');
    execSync('npm install dotenv', { stdio: 'inherit' });

    console.log('Instalando outras dependências essenciais...');
    execSync('npm install express cors bcryptjs jsonwebtoken', { stdio: 'inherit' });

    console.log('\n✅ Todas as dependências foram instaladas com sucesso!');
    console.log('\nAgora você pode executar os scripts de teste:');
    console.log('node test-connection-detailed.js');
    console.log('ou');
    console.log('node simple-test.js');
} catch (error) {
    console.error('\n❌ Erro ao instalar dependências:', error.message);
    console.log('\nTente executar manualmente:');
    console.log('npm init -y');
    console.log('npm install mongoose dotenv express cors bcryptjs jsonwebtoken');
}
