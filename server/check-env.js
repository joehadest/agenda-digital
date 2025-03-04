/**
 * Script para verificar a configuração de variáveis de ambiente
 * Útil para diagnóstico e verificação de configuração
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('=== VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE ===');

// Variáveis necessárias
const requiredVars = [
    { name: 'MONGODB_URI', description: 'URI de conexão com MongoDB Atlas' },
    { name: 'JWT_SECRET', description: 'Chave secreta para tokens JWT' }
];

// Variáveis opcionais
const optionalVars = [
    { name: 'PORT', description: 'Porta do servidor', default: 3000 },
    { name: 'ADMIN_PORT', description: 'Porta para painel admin', default: 3001 }
];

// Verificar variáveis obrigatórias
console.log('\n1. VARIÁVEIS OBRIGATÓRIAS:');
let missingRequired = false;

requiredVars.forEach(variable => {
    const value = process.env[variable.name];

    if (!value) {
        console.log(`❌ ${variable.name}: NÃO ENCONTRADA - ${variable.description}`);
        missingRequired = true;
    } else {
        // Mostrar parte da string para não expor credenciais
        let safeValue = '';
        if (variable.name === 'MONGODB_URI') {
            const parts = value.split('@');
            if (parts.length > 1) {
                const credPart = parts[0].split('://')[1].split(':');
                safeValue = `${credPart[0]}:***@${parts[1].substring(0, 20)}...`;
            } else {
                safeValue = 'Formato inválido';
            }
        } else if (variable.name === 'JWT_SECRET') {
            safeValue = value.substring(0, 3) + '***' + (value.length > 10 ? value.slice(-2) : '');
        } else {
            safeValue = value;
        }

        console.log(`✅ ${variable.name}: CONFIGURADA - ${safeValue}`);
    }
});

// Verificar variáveis opcionais
console.log('\n2. VARIÁVEIS OPCIONAIS:');
optionalVars.forEach(variable => {
    const value = process.env[variable.name];

    if (!value) {
        console.log(`ℹ️ ${variable.name}: Não definida, usando valor padrão (${variable.default})`);
    } else {
        console.log(`✅ ${variable.name}: ${value}`);
    }
});

// Verificar arquivo .env
const envPath = path.join(__dirname, '.env');
console.log('\n3. ARQUIVO .ENV:');
if (fs.existsSync(envPath)) {
    console.log('✅ Arquivo .env encontrado');

    // Verificar se está no .gitignore
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        if (gitignoreContent.includes('.env')) {
            console.log('✅ .env está corretamente listado no .gitignore');
        } else {
            console.log('⚠️ AVISO: .env não está no .gitignore. Suas credenciais podem ser expostas!');
        }
    }
} else {
    console.log('⚠️ Arquivo .env não encontrado. As variáveis de ambiente podem estar definidas no sistema.');
}

// Verificar conexão com MongoDB se URI estiver definida
console.log('\n4. TESTE DE CONEXÃO:');
if (process.env.MONGODB_URI) {
    console.log('Para testar a conexão com o MongoDB, execute:');
    console.log('node test-connection-detailed.js');
} else {
    console.log('Não é possível testar a conexão sem MONGODB_URI definido');
}

// Resumo final
console.log('\n=== RESUMO DA VERIFICAÇÃO ===');
if (missingRequired) {
    console.log('❌ Existem variáveis obrigatórias não configuradas!');
    console.log('   Configure-as no arquivo .env ou no ambiente de produção.');
} else {
    console.log('✅ Todas as variáveis necessárias estão configuradas.');
    console.log('   Sua aplicação deve funcionar corretamente.');
}
