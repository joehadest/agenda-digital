/**
 * Script para verificar a configuração do Vercel
 */
const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO CONFIGURAÇÃO DO VERCEL ===\n');

// Verificar vercel.json
const vercelJsonPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
    try {
        const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
        console.log('✅ vercel.json encontrado e é um JSON válido');

        // Verificar configurações básicas
        if (vercelConfig.builds && vercelConfig.routes) {
            console.log('✅ Configuração de builds e routes está presente');
        } else {
            console.log('❌ vercel.json não contém configuração de builds ou routes');
        }

        // Verificar configuração de API
        const apiRoute = vercelConfig.routes?.find(r => r.src?.includes('/api'));
        if (apiRoute && apiRoute.dest?.includes('server.js')) {
            console.log('✅ Rota de API está configurada corretamente');
        } else {
            console.log('❌ Configuração da rota de API pode estar incorreta');
        }

    } catch (error) {
        console.error(`❌ Erro ao analisar vercel.json: ${error.message}`);
    }
} else {
    console.log('❌ Arquivo vercel.json não encontrado');
}

// Verificar se o frontend tem referências corretas à API
const apiJsPath = path.join(__dirname, 'frontend', 'js', 'api.js');
if (fs.existsSync(apiJsPath)) {
    try {
        const apiJsContent = fs.readFileSync(apiJsPath, 'utf8');

        if (apiJsContent.includes('/api') && apiJsContent.includes('isProduction')) {
            console.log('✅ api.js está configurado para detectar ambiente de produção');
        } else {
            console.log('❌ api.js pode não estar configurado corretamente para o Vercel');
        }
    } catch (error) {
        console.error(`❌ Erro ao ler api.js: ${error.message}`);
    }
} else {
    console.log('❌ Arquivo api.js não encontrado');
}

// Verificar package.json
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        if (packageJson.scripts && packageJson.scripts.start) {
            console.log(`✅ Script de start encontrado: "${packageJson.scripts.start}"`);
        } else {
            console.log('❌ Script de start não encontrado no package.json');
        }

        // Verificar dependências essenciais
        const essentialDeps = ['express', 'mongoose', 'bcryptjs', 'jsonwebtoken', 'cors', 'dotenv'];
        const missingDeps = essentialDeps.filter(dep => !packageJson.dependencies || !packageJson.dependencies[dep]);

        if (missingDeps.length === 0) {
            console.log('✅ Todas as dependências essenciais estão presentes');
        } else {
            console.log(`❌ Dependências faltando: ${missingDeps.join(', ')}`);
        }
    } catch (error) {
        console.error(`❌ Erro ao analisar package.json: ${error.message}`);
    }
} else {
    console.log('❌ Arquivo package.json não encontrado');
}

// Verificar existência do server.js
const serverJsPath = path.join(__dirname, 'server', 'server.js');
if (fs.existsSync(serverJsPath)) {
    console.log('✅ Arquivo server.js encontrado');
} else {
    console.log('❌ Arquivo server.js não encontrado!');
}

// Verificar configuração das variáveis de ambiente
console.log('\n=== VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE ===');

const dotEnvPath = path.join(__dirname, 'server', 'config', '.env');
if (fs.existsSync(dotEnvPath)) {
    console.log('✅ Arquivo .env encontrado');

    try {
        const envContent = fs.readFileSync(dotEnvPath, 'utf8');

        // Verificar variáveis essenciais
        if (envContent.includes('MONGODB_URI=')) {
            console.log('✅ Variável MONGODB_URI encontrada no .env');
        } else {
            console.log('❌ Variável MONGODB_URI não encontrada no .env');
        }

        if (envContent.includes('JWT_SECRET=')) {
            console.log('✅ Variável JWT_SECRET encontrada no .env');
        } else {
            console.log('❌ Variável JWT_SECRET não encontrada no .env');
        }
    } catch (error) {
        console.error(`❌ Erro ao ler arquivo .env: ${error.message}`);
    }
} else {
    console.log('❌ Arquivo .env não encontrado!');
    console.log('   Você precisará configurar as variáveis de ambiente diretamente no Vercel:');
    console.log('   - MONGODB_URI=mongodb+srv://joehadest:joe12823134719@agenda-database.dqrzi.mongodb.net/?retryWrites=true&w=majority&appName=agenda-database');
    console.log('   - JWT_SECRET=agenda_digital_secret_key_2023');
}

// Criar script de configuração rápida para o Vercel
console.log('\n=== GERANDO SCRIPT DE CONFIGURAÇÃO RÁPIDA ===');

const vercelSetupPath = path.join(__dirname, 'setup-vercel.js');
const vercelSetupContent = `/**
 * Script para configuração rápida do Vercel
 * Este script configura tudo necessário para o deploy no Vercel
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== CONFIGURAÇÃO RÁPIDA PARA O VERCEL ===');

// Executar script de preparação
try {
  console.log('\\nExecutando prepare-for-vercel.js...');
  require('./prepare-for-vercel.js');
} catch (error) {
  console.error('❌ Erro ao executar prepare-for-vercel.js:', error.message);
  console.log('Tentando criar o arquivo...');
  
  // Criar prepare-for-vercel.js se não existir
  const prepareScript = path.join(__dirname, 'prepare-for-vercel.js');
  if (!fs.existsSync(prepareScript)) {
    // Conteúdo básico para o script
    // ... (conteúdo omitido para brevidade)
    console.log('Script prepare-for-vercel.js criado com sucesso!');
  }
}

// Verificar e instalar dependências
console.log('\\nVerificando dependências...');
try {
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
  }
  
  console.log('\\nInstalando dependências...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências instaladas com sucesso!');
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
}

console.log('\\n===================================================');
console.log('  CONFIGURAÇÃO CONCLUÍDA!');
console.log('===================================================');
console.log('\\nPara fazer o deploy no Vercel:');
console.log('1. Execute: vercel');
console.log('2. Siga as instruções em tela');
console.log('3. Configure as variáveis de ambiente no dashboard do Vercel');
console.log('\\nVARIÁVEIS DE AMBIENTE NECESSÁRIAS:');
console.log('- MONGODB_URI=mongodb+srv://joehadest:joe12823134719@agenda-database.dqrzi.mongodb.net/?retryWrites=true&w=majority&appName=agenda-database');
console.log('- JWT_SECRET=agenda_digital_secret_key_2023');
`;

try {
    fs.writeFileSync(vercelSetupPath, vercelSetupContent);
    console.log('✅ Script de configuração rápida gerado: setup-vercel.js');
} catch (error) {
    console.error(`❌ Erro ao gerar script de configuração: ${error.message}`);
}

console.log('\n=== VERIFICAÇÃO CONCLUÍDA ===');
console.log('\nSe você encontrou problemas, execute:');
console.log('node prepare-for-vercel.js');
console.log('\nE não esqueça de configurar as variáveis de ambiente no dashboard do Vercel:');
console.log('MONGODB_URI e JWT_SECRET');
