/**
 * Teste para verificar se as variáveis de ambiente estão configuradas no Vercel
 * Este arquivo será executado no ambiente do Vercel
 */
console.log('=== TESTE DE VARIÁVEIS DE AMBIENTE NO VERCEL ===');

// Verificar MONGODB_URI
if (process.env.MONGODB_URI) {
    console.log('✅ MONGODB_URI está configurada');

    // Mostrar parte da string para não expor credenciais completas
    const uriParts = process.env.MONGODB_URI.split('@');
    if (uriParts.length > 1) {
        console.log(`   Formato: ${uriParts[0].split(':')[0]}:***@${uriParts[1].substring(0, 15)}...`);
    }
} else {
    console.log('❌ MONGODB_URI não está configurada');
}

// Verificar JWT_SECRET
if (process.env.JWT_SECRET) {
    console.log('✅ JWT_SECRET está configurada');
    console.log(`   Comprimento: ${process.env.JWT_SECRET.length} caracteres`);
} else {
    console.log('❌ JWT_SECRET não está configurada');
}

// Mostrar todas as variáveis de ambiente disponíveis (sem valores)
console.log('\nVariáveis de ambiente disponíveis:');
Object.keys(process.env).forEach(key => {
    console.log(`- ${key}`);
});

// Este arquivo pode ser acessado via URL quando implantado no Vercel
// Exemplo: https://seu-projeto.vercel.app/api/test-env
module.exports = (req, res) => {
    res.status(200).send('Verificação de variáveis realizada. Verifique os logs do Vercel.');
};
