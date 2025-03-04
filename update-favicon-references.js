/**
 * Script para atualizar as referências de favicon para o formato correto em todos os arquivos HTML
 */
const fs = require('fs');
const path = require('path');

console.log('=== ATUALIZANDO REFERÊNCIAS DE FAVICON ===\n');

const frontendDir = path.join(__dirname, 'frontend');
const htmlFiles = ['index.html', 'login.html', 'register.html'];

htmlFiles.forEach(htmlFile => {
    const filePath = path.join(frontendDir, htmlFile);

    if (fs.existsSync(filePath)) {
        try {
            console.log(`Processando ${htmlFile}...`);
            let content = fs.readFileSync(filePath, 'utf8');

            // Verificar se já tem as tags de favicon
            if (content.includes('apple-touch-icon') &&
                content.includes('favicon-32x32.png') &&
                content.includes('favicon-16x16.png') &&
                content.includes('site.webmanifest')) {

                console.log(`- Encontradas referências de favicon em ${htmlFile}`);

                // Atualizar os caminhos: remover a barra inicial para usar caminhos relativos
                let updated = content;
                updated = updated.replace(/href="\/apple-touch-icon\.png"/g, 'href="apple-touch-icon.png"');
                updated = updated.replace(/href="\/favicon-32x32\.png"/g, 'href="favicon-32x32.png"');
                updated = updated.replace(/href="\/favicon-16x16\.png"/g, 'href="favicon-16x16.png"');
                updated = updated.replace(/href="\/site\.webmanifest"/g, 'href="site.webmanifest"');

                // Verificar se houve alterações
                if (updated !== content) {
                    fs.writeFileSync(filePath, updated);
                    console.log(`✅ Caminhos de favicon atualizados em ${htmlFile}`);
                } else {
                    console.log(`- Caminhos de favicon já estão corretos em ${htmlFile}`);
                }
            } else {
                // Adicionar as tags de favicon se não existirem
                console.log(`- Referências de favicon não encontradas em ${htmlFile}, adicionando...`);

                // Encontrar onde adicionar as tags no <head>
                const headEndPos = content.indexOf('</head>');
                if (headEndPos !== -1) {
                    const faviconTags = `
    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="manifest" href="site.webmanifest">`;

                    const updatedContent = content.substring(0, headEndPos) + faviconTags + content.substring(headEndPos);
                    fs.writeFileSync(filePath, updatedContent);
                    console.log(`✅ Adicionadas referências de favicon em ${htmlFile}`);
                }
            }

        } catch (error) {
            console.error(`❌ Erro ao processar ${htmlFile}:`, error.message);
        }
    } else {
        console.log(`⚠️ Arquivo HTML não encontrado: ${htmlFile}`);
    }
});

// Verificar se os arquivos de favicon existem na pasta frontend
console.log('\nVerificando arquivos de favicon na pasta frontend...');
const requiredFavicons = [
    'apple-touch-icon.png',
    'favicon-32x32.png',
    'favicon-16x16.png',
    'site.webmanifest',
    'favicon.ico'
];

const missingFavicons = [];
requiredFavicons.forEach(favicon => {
    const faviconPath = path.join(frontendDir, favicon);
    if (!fs.existsSync(faviconPath)) {
        missingFavicons.push(favicon);
        console.log(`❌ Não encontrado: ${favicon}`);
    } else {
        console.log(`✅ Encontrado: ${favicon}`);
    }
});

// Instruções finais
console.log('\n=== PROCESSO CONCLUÍDO ===');

if (missingFavicons.length > 0) {
    console.log(`\n⚠️ ATENÇÃO: ${missingFavicons.length} arquivos de favicon estão faltando:`);
    missingFavicons.forEach(file => console.log(`   - ${file}`));
    console.log('\nExecute o script fix-favicons.js para corrigir este problema:');
    console.log('node fix-favicons.js');
} else {
    console.log('\n✅ Todos os favicons estão presentes e as referências foram atualizadas!');
    console.log('Agora os ícones devem aparecer corretamente em seu site.');
}
