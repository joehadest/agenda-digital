/**
 * Script para mover os arquivos de favicon para a raiz do frontend
 * dependendo da localização atual dos favicons
 */
const fs = require('fs');
const path = require('path');

console.log('=== MOVENDO ARQUIVOS DE FAVICON PARA A RAIZ ===\n');

// Possíveis locais dos favicons
const possibleSourceDirs = [
    path.join(__dirname, '..', 'frontend', 'favicon'),
    path.join(__dirname, '..', 'favicon'),  // Na raiz do projeto
    path.join(__dirname, '..', 'frontend', 'images', 'favicon'),
    path.join(__dirname, '..', 'frontend', 'assets', 'favicon'),
    path.join(__dirname, '..', 'frontend', 'assets', 'icons'),
    path.join(__dirname, '..', 'assets', 'favicon')
];

const targetDir = path.join(__dirname, '..', 'frontend');

// Encontrar diretório de favicons
let sourceDir = null;

for (const dir of possibleSourceDirs) {
    if (fs.existsSync(dir)) {
        const hasFiles = fs.readdirSync(dir).some(file =>
            file.includes('favicon') ||
            file.includes('apple-touch-icon') ||
            file.includes('android-chrome')
        );

        if (hasFiles) {
            sourceDir = dir;
            break;
        }
    }
}

// Se não encontrou, criar diretório de favicon
if (!sourceDir) {
    console.log('❌ Nenhuma pasta com favicons encontrada!');

    // Criar diretório de favicon padrão
    sourceDir = path.join(__dirname, '..', 'favicon');
    if (!fs.existsSync(sourceDir)) {
        try {
            fs.mkdirSync(sourceDir, { recursive: true });
            console.log(`✅ Diretório de favicons criado em: ${sourceDir}`);
        } catch (error) {
            console.error(`❌ Erro ao criar diretório de favicons: ${error.message}`);
            process.exit(1);
        }
    }

    console.log('\n⚠️ Você precisará adicionar manualmente os arquivos de favicon ao diretório:');
    console.log(sourceDir);
    console.log('\nExecute este script novamente após adicionar os arquivos.');
    process.exit(0);
}

console.log(`✅ Diretório de favicons encontrado: ${sourceDir}`);

// Lista de arquivos de favicon para procurar
const faviconFiles = [
    'apple-touch-icon.png',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'favicon.ico',
    'site.webmanifest',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png'
];

// Examinar os arquivos existentes
console.log('\nVerificando arquivos de favicon disponíveis:');

// Listar todos os arquivos no diretório de origem
const availableFiles = fs.readdirSync(sourceDir);
const filesToMove = [];

// Verificar quais dos arquivos necessários estão disponíveis
for (const file of faviconFiles) {
    if (availableFiles.includes(file)) {
        console.log(`✅ Encontrado: ${file}`);
        filesToMove.push(file);
    } else {
        console.log(`❌ Não encontrado: ${file}`);

        // Verificar se existe algum arquivo com nome similar
        const similarFiles = availableFiles.filter(f =>
            f.toLowerCase().includes(file.replace(/\..*$/, '').toLowerCase())
        );

        if (similarFiles.length > 0) {
            console.log(`   Encontrados arquivos similares: ${similarFiles.join(', ')}`);
            filesToMove.push(...similarFiles);
        }
    }
}

if (filesToMove.length === 0) {
    console.log('\n❌ Nenhum arquivo de favicon encontrado para mover!');
    console.log('Por favor, adicione manualmente os arquivos de favicon e execute este script novamente.');
    process.exit(0);
}

// Mover os arquivos encontrados
console.log('\nMovendo arquivos de favicon para a raiz do frontend:');
let movedCount = 0;

for (const file of filesToMove) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    try {
        // Verificar se o arquivo já existe no destino
        if (fs.existsSync(targetPath)) {
            console.log(`⚠️ O arquivo ${file} já existe na raiz do frontend. Sobrescrevendo...`);
        }

        // Copiar arquivo
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`✅ Copiado: ${file}`);
        movedCount++;
    } catch (error) {
        console.error(`❌ Erro ao copiar ${file}: ${error.message}`);
    }
}

// Verificar/Criar site.webmanifest se necessário
const webmanifestPath = path.join(targetDir, 'site.webmanifest');
if (!fs.existsSync(webmanifestPath)) {
    console.log('\nCriando arquivo site.webmanifest...');

    const webmanifestContent = `{
    "name": "Agenda Digital",
    "short_name": "Agenda",
    "icons": [
        {
            "src": "/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "#4a6fa5",
    "background_color": "#f5f7fa",
    "display": "standalone"
}`;

    try {
        fs.writeFileSync(webmanifestPath, webmanifestContent);
        console.log('✅ Arquivo site.webmanifest criado com sucesso!');
        movedCount++;
    } catch (error) {
        console.error(`❌ Erro ao criar site.webmanifest: ${error.message}`);
    }
} else {
    // Atualizar site.webmanifest existente para usar caminhos absolutos
    try {
        const content = fs.readFileSync(webmanifestPath, 'utf8');
        const updatedContent = content.replace(/"src": "\.\/([^"]+)"/g, '"src": "/$1"');
        fs.writeFileSync(webmanifestPath, updatedContent);
        console.log('✅ Caminhos atualizados no site.webmanifest existente');
    } catch (error) {
        console.error(`❌ Erro ao atualizar site.webmanifest: ${error.message}`);
    }
}

console.log(`\n${movedCount} arquivo(s) processado(s) com sucesso.`);
console.log('\n=== PROCESSO CONCLUÍDO ===');
