const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('========== VERIFICAÇÃO DE STATUS DO GIT ==========');

try {
    // Verificar se o diretório é um repositório Git
    const isGitRepo = fs.existsSync(path.join(__dirname, '.git'));
    console.log(`É um repositório Git? ${isGitRepo ? 'Sim ✅' : 'Não ❌'}`);

    if (!isGitRepo) {
        console.log('Inicializando repositório Git...');
        execSync('git init', { stdio: 'inherit' });
    }

    // Verificar status
    console.log('\nStatus atual do Git:');
    execSync('git status', { stdio: 'inherit' });

    // Verificar arquivos no controle de versão
    console.log('\nArquivos no controle de versão:');
    try {
        const trackedFiles = execSync('git ls-tree -r HEAD --name-only 2>/dev/null || echo "Nenhum commit ainda"').toString();
        console.log(trackedFiles || 'Nenhum arquivo enviado ainda');
    } catch (e) {
        console.log('Nenhum commit ainda.');
    }

    // Verificar configuração remota
    console.log('\nRepositórios remotos:');
    try {
        const remotes = execSync('git remote -v').toString();
        console.log(remotes || 'Nenhum repositório remoto configurado');
    } catch (e) {
        console.log('Erro ao verificar repositórios remotos.');
    }

    console.log('\n======== RECOMENDAÇÕES ========');
    console.log('Execute os seguintes comandos para enviar todos os arquivos:');
    console.log('1. git add .');
    console.log('2. git commit -m "Envio completo do projeto"');
    console.log('3. git push -u origin master (ou main)');

} catch (error) {
    console.error('Erro ao verificar status do Git:', error.message);
}
