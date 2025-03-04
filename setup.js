/**
 * Script para configurar a estrutura da Agenda Digital
 */
const fs = require('fs');
const path = require('path');

// Definir diretórios necessários
const directories = [
    'frontend',
    'frontend/css',
    'frontend/js',
    'server',
    'server/config',
    'server/models',
    'server/routes',
    'server/middleware'
];

console.log('=== CRIANDO ESTRUTURA DA AGENDA DIGITAL ===\n');

// Criar diretórios
directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`✓ Diretório criado: ${dir}`);
        } catch (error) {
            console.error(`✗ Erro ao criar diretório ${dir}: ${error.message}`);
        }
    } else {
        console.log(`! Diretório já existe: ${dir}`);
    }
});

console.log('\n=== ESTRUTURA DE PASTAS CRIADA COM SUCESSO ===');
