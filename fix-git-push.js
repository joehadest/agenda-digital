const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script para forçar o push de todos os arquivos para o GitHub
 */

console.log('==========================================');
console.log('   CORREÇÃO DE PUSH PARA GITHUB');
console.log('==========================================');

try {
    // 1. Verificar se é um repositório Git, se não, inicializar
    if (!fs.existsSync(path.join(__dirname, '.git'))) {
        console.log('\n1. Inicializando repositório Git...');
        execSync('git init', { stdio: 'inherit' });
    } else {
        console.log('\n1. Repositório Git já existe ✅');
    }

    // 2. Criar/atualizar .gitignore
    console.log('\n2. Configurando .gitignore...');
    fs.writeFileSync('.gitignore', 'node_modules/\n.env\n');
    console.log('.gitignore configurado ✅');

    // 3. Adicionar todos os arquivos explicitamente (forçando)
    console.log('\n3. Forçando adição de todos os arquivos importantes...');

    // Lista de diretórios importantes para garantir
    const keyDirs = ['css', 'js', 'server', 'frontend'];

    // Garantir que cada diretório importante seja adicionado explicitamente
    keyDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            try {
                execSync(`git add ${dir}/* -f`);
                console.log(`Adicionado diretório: ${dir} ✅`);
            } catch (e) {
                console.log(`Aviso ao adicionar ${dir}: ${e.message}`);
            }
        } else {
            console.log(`Diretório não encontrado: ${dir} ⚠️`);
        }
    });

    // 4. Adicionar arquivos HTML raiz
    console.log('\n4. Adicionando arquivos HTML importantes...');
    ['index.html', 'login.html', 'register.html'].forEach(file => {
        if (fs.existsSync(file)) {
            execSync(`git add ${file} -f`);
            console.log(`Adicionado: ${file} ✅`);
        } else {
            console.log(`Arquivo não encontrado: ${file} ⚠️`);
        }
    });

    // 5. Adicionar outros arquivos importantes
    console.log('\n5. Adicionando outros arquivos importantes...');
    ['.gitignore', 'README.md', 'package.json', 'vercel.json'].forEach(file => {
        if (fs.existsSync(file)) {
            execSync(`git add ${file} -f`);
            console.log(`Adicionado: ${file} ✅`);
        }
    });

    // 6. Verificação final de arquivos adicionados
    console.log('\n6. Status após adição forçada:');
    execSync('git status', { stdio: 'inherit' });

    // 7. Commit
    console.log('\n7. Criando commit...');
    execSync('git commit -m "Versão completa da Agenda Digital - Todos arquivos"', { stdio: 'inherit' });

    // 8. Configurar remote (se não existir)
    console.log('\n8. Verificando remote...');
    try {
        execSync('git remote get-url origin');
        console.log('Remote já configurado ✅');
    } catch (e) {
        console.log('Configurando remote...');
        execSync('git remote add origin https://github.com/joehadest/agenda-digital.git');
    }

    // 9. Push forçado
    console.log('\n9. Enviando para GitHub (forçando)...');
    execSync('git push -f -u origin master', { stdio: 'inherit' });

    console.log('\n==========================================');
    console.log('   PUSH CONCLUÍDO COM SUCESSO!');
    console.log('==========================================');
    console.log('\nVerifique seu repositório em:');
    console.log('https://github.com/joehadest/agenda-digital');

} catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.log('\nTente uma abordagem alternativa:');
    console.log('1. Use o GitHub Desktop para upload (https://desktop.github.com/)');
    console.log('2. Ou siga as instruções detalhadas em INSTRUCOES_GIT_MANUAL.md');
}
