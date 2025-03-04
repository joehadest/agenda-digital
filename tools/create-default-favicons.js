/**
 * Script para criar favicons padrão usando canvas
 * Isso é útil quando não há favicons disponíveis
 */
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Verificar se o módulo canvas está instalado
try {
    require.resolve('canvas');
} catch (e) {
    console.error('❌ O módulo "canvas" não está instalado.');
    console.log('\nPor favor, instale-o com:');
    console.log('npm install canvas');
    console.log('\nOu crie os favicons manualmente e execute o script move-favicons.js');
    process.exit(1);
}

console.log('=== CRIANDO FAVICONS PADRÃO ===\n');

const targetDir = path.join(__dirname, '..', 'favicon');

// Criar diretório de favicon se não existir
if (!fs.existsSync(targetDir)) {
    try {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log(`✅ Diretório de favicons criado: ${targetDir}`);
    } catch (error) {
        console.error(`❌ Erro ao criar diretório: ${error.message}`);
        process.exit(1);
    }
}

// Função para criar um canvas com um ícone
function createIconCanvas(size, bgColor, textColor) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Fundo
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Texto (inicial A para Agenda)
    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.floor(size * 0.6)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', size / 2, size / 2);

    return canvas;
}

// Função para salvar o canvas como PNG
function saveCanvasAsPNG(canvas, filePath) {
    return new Promise((resolve, reject) => {
        const out = fs.createWriteStream(filePath);
        const stream = canvas.createPNGStream();

        stream.pipe(out);
        out.on('finish', resolve);
        out.on('error', reject);
    });
}

// Função para salvar o canvas como ICO (formato simplificado)
async function saveCanvasAsICO(canvas, filePath) {
    // Esta é uma versão muito simplificada - um ICO real requereria
    // uma biblioteca específica para gerar o formato corretamente
    await saveCanvasAsPNG(canvas, filePath);
    console.log('Nota: arquivo .ico é na verdade um PNG; para um ICO real, use uma ferramenta como favicon-generator.org');
}

// Arquivos de favicon para criar
const favicons = [
    { name: 'favicon.ico', size: 32, bg: '#4a6fa5', text: '#ffffff' },
    { name: 'favicon-16x16.png', size: 16, bg: '#4a6fa5', text: '#ffffff' },
    { name: 'favicon-32x32.png', size: 32, bg: '#4a6fa5', text: '#ffffff' },
    { name: 'apple-touch-icon.png', size: 180, bg: '#4a6fa5', text: '#ffffff' },
    { name: 'android-chrome-192x192.png', size: 192, bg: '#4a6fa5', text: '#ffffff' },
    { name: 'android-chrome-512x512.png', size: 512, bg: '#4a6fa5', text: '#ffffff' }
];

// Criar e salvar cada favicon
async function createFavicons() {
    try {
        for (const favicon of favicons) {
            const canvas = createIconCanvas(favicon.size, favicon.bg, favicon.text);
            const filePath = path.join(targetDir, favicon.name);

            if (favicon.name.endsWith('.ico')) {
                await saveCanvasAsICO(canvas, filePath);
            } else {
                await saveCanvasAsPNG(canvas, filePath);
            }

            console.log(`✅ Criado: ${favicon.name}`);
        }

        // Criar o arquivo de manifesto
        const webmanifestPath = path.join(targetDir, 'site.webmanifest');
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

        fs.writeFileSync(webmanifestPath, webmanifestContent);
        console.log(`✅ Criado: site.webmanifest`);

        console.log('\n=== FAVICONS CRIADOS COM SUCESSO ===');
        console.log('\nAgora execute o script move-favicons.js para mover os favicons para o diretório frontend:');
        console.log('node tools/move-favicons.js');
    } catch (error) {
        console.error(`❌ Erro ao criar favicons: ${error.message}`);
    }
}

// Executar
createFavicons();
