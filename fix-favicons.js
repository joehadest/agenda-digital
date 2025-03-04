/**
 * Script para corrigir problemas com favicons em um único passo
 */
const fs = require('fs');
const path = require('path');

console.log('=== CORRIGINDO FAVICONS DA AGENDA DIGITAL ===\n');

// Caminhos importantes
const frontendDir = path.join(__dirname, 'frontend');
const htmlFiles = ['index.html', 'login.html', 'register.html'];

// 1. Verificar se há favicons em algum lugar do projeto
console.log('Procurando por arquivos de favicon...');

function findFaviconFiles() {
    const possibleLocations = [
        path.join(__dirname, 'frontend', 'favicon'),
        path.join(__dirname, 'favicon'),
        path.join(__dirname, 'frontend', 'assets'),
        path.join(__dirname, 'assets'),
        path.join(__dirname, 'frontend', 'images')
    ];

    // Procurar por arquivos que pareçam ser favicons
    for (const location of possibleLocations) {
        if (fs.existsSync(location)) {
            try {
                const files = fs.readdirSync(location);
                const faviconFiles = files.filter(file =>
                    file.includes('favicon') ||
                    file.includes('apple-touch-icon') ||
                    file.includes('android-chrome')
                );

                if (faviconFiles.length > 0) {
                    console.log(`✅ Encontrados ${faviconFiles.length} arquivos de favicon em: ${location}`);
                    return { location, files: faviconFiles };
                }
            } catch (error) {
                console.error(`Erro ao ler diretório ${location}:`, error.message);
            }
        }
    }

    return null;
}

// Encontrar favicons
const faviconSource = findFaviconFiles();

if (!faviconSource) {
    console.log('❌ Nenhum arquivo de favicon encontrado no projeto.');
    console.log('\nCriando favicons básicos na raiz do frontend...');

    // Criar um favicon.ico básico diretamente na pasta frontend
    try {
        // Vamos apenas copiar um arquivo de texto e renomeá-lo como favicon.ico
        // (isso é apenas um placeholder - não é um favicon válido)
        const placeholderContent = 'Este é um arquivo placeholder para favicon.ico';
        fs.writeFileSync(path.join(frontendDir, 'favicon.ico'), placeholderContent);
        console.log('✅ Criado favicon.ico placeholder na pasta frontend');

        // Criar um site.webmanifest básico
        const webmanifestContent = `{
      "name": "Agenda Digital",
      "short_name": "Agenda",
      "icons": [],
      "theme_color": "#4a6fa5",
      "background_color": "#f5f7fa",
      "display": "standalone"
    }`;
        fs.writeFileSync(path.join(frontendDir, 'site.webmanifest'), webmanifestContent);
        console.log('✅ Criado site.webmanifest na pasta frontend');
    } catch (error) {
        console.error('❌ Erro ao criar arquivos básicos:', error.message);
    }
} else {
    // Copiar favicons encontrados para a pasta frontend
    console.log(`\nCopiando favicons de ${faviconSource.location} para frontend/...`);

    for (const file of faviconSource.files) {
        try {
            const sourcePath = path.join(faviconSource.location, file);
            const destPath = path.join(frontendDir, file);
            fs.copyFileSync(sourcePath, destPath);
            console.log(`✅ Copiado: ${file}`);
        } catch (error) {
            console.error(`❌ Erro ao copiar ${file}:`, error.message);
        }
    }
}

// 2. Corrigir referências nos arquivos HTML
console.log('\nAtualizando referências de favicon nos arquivos HTML...');

htmlFiles.forEach(htmlFile => {
    const filePath = path.join(frontendDir, htmlFile);

    if (fs.existsSync(filePath)) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');

            // Verificar se já tem referências de favicon
            const hasFaviconLinks = content.includes('rel="icon"') ||
                content.includes('rel="shortcut icon"') ||
                content.includes('rel="apple-touch-icon"');

            // Se não tiver, adicionar as referências básicas
            if (!hasFaviconLinks) {
                const headEndPos = content.indexOf('</head>');

                if (headEndPos !== -1) {
                    const faviconLinks = `
    <!-- Favicons -->
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="manifest" href="site.webmanifest">`;

                    content = content.substring(0, headEndPos) + faviconLinks + content.substring(headEndPos);
                    fs.writeFileSync(filePath, content);
                    console.log(`✅ Adicionadas referências de favicon em ${htmlFile}`);
                }
            } else {
                // Corrigir caminhos existentes
                content = content.replace(/href="\/apple-touch-icon\.png"/g, 'href="apple-touch-icon.png"');
                content = content.replace(/href="\/favicon-\d+x\d+\.png"/g, match =>
                    match.replace('href="/', 'href="')
                );
                content = content.replace(/href="\/site\.webmanifest"/g, 'href="site.webmanifest"');

                fs.writeFileSync(filePath, content);
                console.log(`✅ Corrigidos caminhos de favicon em ${htmlFile}`);
            }
        } catch (error) {
            console.error(`❌ Erro ao atualizar ${htmlFile}:`, error.message);
        }
    } else {
        console.log(`⚠️ Arquivo HTML não encontrado: ${htmlFile}`);
    }
});

console.log('\n=== PROCESSO CONCLUÍDO ===');
console.log('\nVerifique se os favicons estão aparecendo corretamente no seu site.');
console.log('Se ainda houver problemas, considere usar um gerador de favicons online como:');
console.log('https://realfavicongenerator.net');
