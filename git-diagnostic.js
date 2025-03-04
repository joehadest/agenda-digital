const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script de diagnóstico para problemas do Git
 * Ajuda a identificar por que apenas o README está sendo enviado
 */

console.log('==========================================');
console.log('   DIAGNÓSTICO AVANÇADO DE GIT');
console.log('==========================================');
console.log('\nAnalisando diretório atual...');

// 1. Listar todos os arquivos no diretório (exceto node_modules)
console.log('\n1. ARQUIVOS NO DIRETÓRIO:');

function listFiles(dir, fileList = [], indent = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);

        // Ignorar node_modules
        if (entry.name === 'node_modules') {
            console.log(`${indent}📁 ${entry.name} [Ignorado]`);
            return;
        }

        if (entry.isDirectory()) {
            console.log(`${indent}📁 ${entry.name}`);
            listFiles(fullPath, fileList, indent + '  ');
        } else {
            console.log(`${indent}📄 ${entry.name}`);
            fileList.push(fullPath);
        }
    });

    return fileList;
}

const allFiles = listFiles(__dirname);
console.log(`Total de arquivos (exceto em node_modules): ${allFiles.length}`);

// 2. Verificar se o diretório é um repositório Git
console.log('\n2. STATUS DO REPOSITÓRIO GIT:');
const isGitRepo = fs.existsSync(path.join(__dirname, '.git'));
console.log(`É um repositório Git? ${isGitRepo ? 'Sim ✅' : 'Não ❌'}`);

if (!isGitRepo) {
    console.log('Problema detectado: .git não existe. É necessário inicializar o repositório.');
}

// 3. Verificar .gitignore
console.log('\n3. CONFIGURAÇÃO DO .GITIGNORE:');
const gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    console.log('Conteúdo do .gitignore:');
    console.log(gitignoreContent);
} else {
    console.log('Arquivo .gitignore não encontrado. Isso pode ser um problema!');
}

// 4. Verificar quais arquivos estão sendo rastreados pelo Git
console.log('\n4. ARQUIVOS RASTREADOS PELO GIT:');

try {
    // Tentar obter arquivos já em controle de versão
    const trackedFilesRaw = execSync('git ls-files', { encoding: 'utf8' });
    const trackedFiles = trackedFilesRaw.split('\n').filter(Boolean);

    console.log(`Total de arquivos rastreados: ${trackedFiles.length}`);

    if (trackedFiles.length > 0) {
        console.log('Arquivos rastreados:');
        trackedFiles.forEach(file => console.log(`- ${file}`));
    } else {
        console.log('Nenhum arquivo está sendo rastreado pelo Git!');
    }

    // Verificar arquivos que não estão sendo rastreados
    const untrackedFilesRaw = execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' });
    const untrackedFiles = untrackedFilesRaw.split('\n').filter(Boolean);

    console.log(`\nTotal de arquivos não rastreados: ${untrackedFiles.length}`);

    if (untrackedFiles.length > 0) {
        console.log('Exemplos de arquivos não rastreados:');
        untrackedFiles.slice(0, 10).forEach(file => console.log(`- ${file}`));
        if (untrackedFiles.length > 10) {
            console.log(`... e mais ${untrackedFiles.length - 10} arquivos`);
        }
    }
} catch (err) {
    console.log('Erro ao verificar arquivos rastreados:', err.message);
}

// 5. Verificar remotes do Git
console.log('\n5. REPOSITÓRIOS REMOTOS:');
try {
    const remotes = execSync('git remote -v', { encoding: 'utf8' });
    console.log(remotes || 'Nenhum repositório remoto configurado');
} catch (err) {
    console.log('Erro ao verificar repositórios remotos:', err.message);
}

// 6. Gerar solução baseada nos problemas encontrados
console.log('\n==========================================');
console.log('   SOLUÇÃO RECOMENDADA');
console.log('==========================================');

if (!isGitRepo) {
    console.log('\nPROBLEMA: Repositório Git não inicializado');
    console.log('\nSOLUÇÃO:');
    console.log('Execute estes comandos na ordem:');
    console.log('1. git init');
    console.log('2. git add .');
    console.log('3. git commit -m "Versão inicial"');
    console.log('4. git remote add origin https://github.com/joehadest/agenda-digital.git');
    console.log('5. git push -u origin master');
} else {
    console.log('\nPROBLEMA: Alguns arquivos não estão sendo enviados para o GitHub');
    console.log('\nSOLUÇÃO:');
    console.log('Execute o script fix-git-push.js para forçar a adição de todos os arquivos:');
    console.log('node fix-git-push.js');
}

console.log('\nSe preferir solução manual, siga as instruções em INSTRUCOES_GIT_MANUAL.md');
