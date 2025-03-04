/**
 * Gerador de chave secreta para JWT
 * Execute este script para gerar uma chave JWT_SECRET segura
 */

// Função para gerar uma string aleatória segura
function generateSecureSecret(length = 32) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
    let result = '';

    // Criar um array de bytes aleatórios
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    // Converter para string usando os caracteres definidos
    for (let i = 0; i < length; i++) {
        result += characters.charAt(randomValues[i] % characters.length);
    }

    return result;
}

// Gerar uma chave secreta
const jwtSecret = typeof crypto !== 'undefined' && crypto.getRandomValues
    ? generateSecureSecret()
    : `secret_${Date.now()}_${Math.random().toString(36).substring(2)}`;

console.log('\n=== JWT SECRET PARA SEU PROJETO VERCEL ===');
console.log('\nAqui está sua chave JWT_SECRET:');
console.log('\n' + jwtSecret);
console.log('\nUse esta chave como valor para a variável JWT_SECRET no Vercel');
console.log('\nIMPORTANTE: Mantenha esta chave em segredo! Não a compartilhe em repositórios públicos.');
