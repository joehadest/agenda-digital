// Script para codificar caracteres especiais na senha do MongoDB
const password = "SUA_SENHA_AQUI"; // Coloque sua senha real aqui
const encodedPassword = encodeURIComponent(password);
console.log("Senha original:", password);
console.log("Senha codificada para URL:", encodedPassword);
console.log("Use a senha codificada no arquivo .env");
