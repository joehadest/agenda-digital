/**
 * Script para configuração rápida do Vercel
 * Este script configura tudo necessário para o deploy no Vercel
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== CONFIGURAÇÃO RÁPIDA PARA O VERCEL ===');

// Verificar e criar o vercel.json se não existir
console.log('\nVerificando vercel.json...');
const vercelJsonPath = path.join(__dirname, 'vercel.json');

if (!fs.existsSync(vercelJsonPath)) {
    console.log('❌ vercel.json não encontrado. Criando...');

    const vercelConfig = {
        "version": 2,
        "builds": [
            {
                "src": "server/server.js",
                "use": "@vercel/node"
            },
            {
                "src": "frontend/**",
                "use": "@vercel/static"
            }
        ],
        "routes": [
            {
                "src": "/api/(.*)",
                "dest": "server/server.js"
            },
            {
                "src": "/(.*)",
                "dest": "frontend/$1"
            }
        ],
        "env": {
            "NODE_ENV": "production"
        }
    };

    fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, 2));
    console.log('✅ vercel.json criado com sucesso!');
} else {
    console.log('✅ vercel.json já existe');
}

// Verificar e modificar o arquivo api.js para suportar produção
console.log('\nVerificando frontend/js/api.js...');
const apiJsPath = path.join(__dirname, 'frontend', 'js', 'api.js');

if (fs.existsSync(apiJsPath)) {
    const apiJsContent = fs.readFileSync(apiJsPath, 'utf8');

    if (!apiJsContent.includes('isProduction') || !apiJsContent.includes('/api')) {
        console.log('⚠️ Modificando api.js para funcionar em produção...');

        // Implementação simplificada - em um cenário real, seria melhor usar um parser de JS
        const updatedContent = apiJsContent.replace(
            /this\.baseURL\s*=\s*(['"])http:\/\/localhost:3000\/api\1/,
            `this.baseURL = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1') ? '/api' : 'http://localhost:3000/api'`
        );

        fs.writeFileSync(apiJsPath, updatedContent);
        console.log('✅ api.js atualizado para suportar ambiente de produção');
    } else {
        console.log('✅ api.js já está configurado para produção');
    }
} else {
    console.log('❌ api.js não encontrado! Isso pode causar problemas no Vercel.');
}

// Verificar e criar package.json se não existir
console.log('\nVerificando package.json...');
const packageJsonPath = path.join(__dirname, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json não encontrado. Criando arquivo básico...');

    const basicPackageJson = {
        name: "agenda-digital",
        version: "1.0.0",
        description: "Agenda Digital com notificações",
        main: "server/server.js",
        scripts: {
            start: "node server/server.js",
            dev: "nodemon server/server.js"
        },
        dependencies: {
            express: "^4.18.2",
            mongoose: "^7.0.3",
            bcryptjs: "^2.4.3",
            jsonwebtoken: "^9.0.0",
            cors: "^2.8.5",
            dotenv: "^16.0.3"
        }
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(basicPackageJson, null, 2));
    console.log('✅ package.json criado com sucesso!');
} else {
    console.log('✅ package.json já existe');
}

// Configurar diretório de configuração e arquivo env
console.log('\nVerificando diretório config...');
const configDirPath = path.join(__dirname, 'server', 'config');
const envFilePath = path.join(configDirPath, '.env');

if (!fs.existsSync(configDirPath)) {
    console.log('❌ Diretório config não encontrado. Criando...');
    fs.mkdirSync(configDirPath, { recursive: true });
    console.log('✅ Diretório config criado');
}

if (!fs.existsSync(envFilePath)) {
    console.log('❌ Arquivo .env não encontrado. Criando...');

    const envContent = `# Configuração do MongoDB
MONGODB_URI=mongodb+srv://joehadest:joe12823134719@agenda-database.dqrzi.mongodb.net/?retryWrites=true&w=majority&appName=agenda-database

# Secret para JWT
JWT_SECRET=agenda_digital_secret_key_2023

# Porta do servidor
PORT=3000`;

    fs.writeFileSync(envFilePath, envContent);
    console.log('✅ Arquivo .env criado');
} else {
    console.log('✅ Arquivo .env já existe');
}

// Verificar se a Vercel CLI está instalada
console.log('\nVerificando Vercel CLI...');
try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI já está instalada');
} catch (error) {
    console.log('❌ Vercel CLI não encontrada. Tentando instalar...');
    try {
        execSync('npm install -g vercel', { stdio: 'inherit' });
        console.log('✅ Vercel CLI instalada com sucesso');
    } catch (installError) {
        console.error('❌ Não foi possível instalar a Vercel CLI:', installError.message);
        console.log('\nPara instalar manualmente, execute:');
        console.log('npm install -g vercel');
    }
}

console.log('\n===================================================');
console.log('  CONFIGURAÇÃO PARA O VERCEL CONCLUÍDA!');
console.log('===================================================');
console.log('\nPara fazer o deploy no Vercel:');
console.log('1. Execute: vercel');
console.log('2. Siga as instruções em tela');
console.log('3. Configure as variáveis de ambiente no dashboard do Vercel');
console.log('\nVARIÁVEIS DE AMBIENTE NECESSÁRIAS:');
console.log('- MONGODB_URI=mongodb+srv://joehadest:joe12823134719@agenda-database.dqrzi.mongodb.net/?retryWrites=true&w=majority&appName=agenda-database');
console.log('- JWT_SECRET=agenda_digital_secret_key_2023');
