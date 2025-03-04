/**
 * Script para preparar a aplicação para implantação no Vercel
 */
const fs = require('fs');
const path = require('path');

console.log('=== PREPARANDO APLICAÇÃO PARA O VERCEL ===\n');

// 1. Verificar se vercel.json existe
const vercelJsonPath = path.join(__dirname, 'vercel.json');
if (!fs.existsSync(vercelJsonPath)) {
    console.log('❌ Arquivo vercel.json não encontrado. Criando...');

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
    console.log('✅ Arquivo vercel.json criado com sucesso!');
} else {
    console.log('✅ Arquivo vercel.json encontrado');
}

// 2. Verificar e ajustar o package.json
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
    console.log('\nVerificando package.json...');

    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        // Garantir que o script de start esteja configurado corretamente
        if (!packageJson.scripts || !packageJson.scripts.start) {
            packageJson.scripts = packageJson.scripts || {};
            packageJson.scripts.start = 'node server/server.js';
            console.log('✅ Script "start" adicionado ao package.json');
        }

        // Garantir que as dependências necessárias estejam presentes
        const requiredDeps = {
            "express": "^4.18.2",
            "mongoose": "^7.0.3",
            "bcryptjs": "^2.4.3",
            "jsonwebtoken": "^9.0.0",
            "cors": "^2.8.5",
            "dotenv": "^16.0.3"
        };

        packageJson.dependencies = packageJson.dependencies || {};
        let depsChanged = false;

        for (const [dep, version] of Object.entries(requiredDeps)) {
            if (!packageJson.dependencies[dep]) {
                packageJson.dependencies[dep] = version;
                console.log(`✅ Dependência adicionada: ${dep}@${version}`);
                depsChanged = true;
            }
        }

        // Salvar alterações no package.json se necessário
        if (depsChanged) {
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            console.log('✅ Arquivo package.json atualizado com sucesso!');
        } else {
            console.log('✅ Todas as dependências necessárias já estão no package.json');
        }

    } catch (error) {
        console.error(`❌ Erro ao processar package.json: ${error.message}`);
    }
} else {
    console.log('\n❌ Arquivo package.json não encontrado. Criando um básico...');

    const basePackageJson = {
        "name": "agenda-digital",
        "version": "1.0.0",
        "description": "Aplicação para gerenciar compromissos com notificações",
        "main": "server/server.js",
        "scripts": {
            "start": "node server/server.js",
            "dev": "nodemon server/server.js"
        },
        "dependencies": {
            "express": "^4.18.2",
            "mongoose": "^7.0.3",
            "bcryptjs": "^2.4.3",
            "jsonwebtoken": "^9.0.0",
            "cors": "^2.8.5",
            "dotenv": "^16.0.3"
        },
        "engines": {
            "node": ">=14.0.0"
        }
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(basePackageJson, null, 2));
    console.log('✅ Arquivo package.json criado com sucesso!');
}

// 3. Ajustar configurações de ambiente para o Vercel
const serverEnvPath = path.join(__dirname, 'server', 'config', '.env');

if (fs.existsSync(serverEnvPath)) {
    console.log('\nConfigurando variáveis de ambiente...');

    // Extrair o MONGODB_URI e JWT_SECRET do .env
    try {
        const envContent = fs.readFileSync(serverEnvPath, 'utf8');
        const mongodbMatch = envContent.match(/MONGODB_URI=(.+)/);
        const jwtMatch = envContent.match(/JWT_SECRET=(.+)/);

        if (mongodbMatch && jwtMatch) {
            const mongoUri = mongodbMatch[1].trim();
            const jwtSecret = jwtMatch[1].trim();

            console.log('✅ Variáveis de ambiente extraídas do arquivo .env');
            console.log('\n⚠️ IMPORTANTE: Configure estas variáveis de ambiente no Vercel:');
            console.log(`   MONGODB_URI: ${mongoUri}`);
            console.log(`   JWT_SECRET: ${jwtSecret}`);
        } else {
            console.log('❌ Não foi possível extrair as variáveis do arquivo .env');
        }
    } catch (error) {
        console.error(`❌ Erro ao ler arquivo .env: ${error.message}`);
    }
} else {
    console.log('\n⚠️ Arquivo .env não encontrado! Configure manualmente as variáveis no Vercel:');
    console.log('   MONGODB_URI: mongodb+srv://joehadest:joe12823134719@agenda-database.dqrzi.mongodb.net/?retryWrites=true&w=majority&appName=agenda-database');
    console.log('   JWT_SECRET: agenda_digital_secret_key_2023');
}

// 4. Verificar arquivos principais da aplicação
const essentialFiles = [
    { path: 'frontend/index.html', message: 'Página principal' },
    { path: 'frontend/login.html', message: 'Página de login' },
    { path: 'frontend/register.html', message: 'Página de cadastro' },
    { path: 'server/server.js', message: 'Servidor principal' }
];

console.log('\nVerificando arquivos essenciais da aplicação:');

let allFilesExist = true;
for (const file of essentialFiles) {
    const filePath = path.join(__dirname, file.path);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file.message} encontrado (${file.path})`);
    } else {
        console.log(`❌ ${file.message} NÃO encontrado (${file.path})`);
        allFilesExist = false;
    }
}

if (!allFilesExist) {
    console.log('\n❌ Alguns arquivos essenciais não foram encontrados!');
    console.log('   O projeto pode não funcionar corretamente no Vercel.');
} else {
    console.log('\n✅ Todos os arquivos essenciais foram encontrados!');
}

// 5. Verificar se a pasta server/config existe para o .env
const configDir = path.join(__dirname, 'server', 'config');
if (!fs.existsSync(configDir)) {
    console.log('\n⚠️ O diretório server/config não existe. Criando...');
    fs.mkdirSync(configDir, { recursive: true });
}

console.log('\n=== PREPARAÇÃO PARA O VERCEL CONCLUÍDA ===');
console.log('\nPara implantar no Vercel:');
console.log('1. Faça um commit das alterações para o GitHub');
console.log('2. No dashboard do Vercel, importe o repositório');
console.log('3. Configure as variáveis de ambiente (MONGODB_URI e JWT_SECRET)');
console.log('4. Clique em "Deploy"');
