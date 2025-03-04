/**
 * CORREÇÃO DE ERRO DE VARIÁVEIS DE AMBIENTE NO VERCEL
 */

const fs = require('fs');
const path = require('path');

console.log('==========================================================');
console.log('  CORREÇÃO DO ERRO: "Environment Variable references Secret"');
console.log('==========================================================');

// Caminho para o vercel.json
const vercelJsonPath = path.join(__dirname, 'vercel.json');

// Verificar se o arquivo existe
if (fs.existsSync(vercelJsonPath)) {
    console.log('\n1. Encontrado arquivo vercel.json. Corrigindo...');

    try {
        // Ler o arquivo atual
        const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));

        // Remover a seção "env" que está causando o problema
        if (vercelConfig.env) {
            console.log('   - Removendo seção "env" do arquivo (isso resolverá o erro)');
            delete vercelConfig.env;

            // Salvar o arquivo modificado
            fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, 2));
            console.log('   - Arquivo atualizado com sucesso! ✅');
        } else {
            console.log('   - O arquivo não contém seção "env". Nenhuma alteração necessária.');
        }
    } catch (error) {
        console.error('❌ Erro ao modificar o arquivo:', error.message);
    }
} else {
    console.log('\n❌ Arquivo vercel.json não encontrado.');
}

console.log('\n2. PRÓXIMOS PASSOS:');
console.log('   a) Configure as variáveis de ambiente diretamente no dashboard do Vercel:');
console.log('      - Vá para https://vercel.com/dashboard');
console.log('      - Selecione seu projeto "agenda-digital"');
console.log('      - Vá para Settings > Environment Variables');
console.log('      - Adicione as variáveis:');
console.log('        • MONGODB_URI: mongodb+srv://joehadest:joe12823134719@agenda-database.dqrzi.mongodb.net/usuarios-login?retryWrites=true&w=majority');
console.log('        • JWT_SECRET: sua_chave_secreta_aqui');
console.log('   b) Faça um novo deploy do projeto');

console.log('\n==========================================================');
console.log('  RESUMO DO PROBLEMA E SOLUÇÃO');
console.log('==========================================================');
console.log('O erro ocorreu porque o arquivo vercel.json estava referenciando');
console.log('secrets (@mongodb-uri) que não existiam no seu projeto Vercel.');
console.log('\nA solução foi remover essas referências do arquivo e configurar');
console.log('as variáveis de ambiente diretamente no dashboard do Vercel.');
