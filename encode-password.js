// Script para codificar caracteres especiais na senha do MongoDB
const password = "joe12823134719"; // Coloque sua senha real aqui
const encodedPassword = encodeURIComponent(password);
console.log("Senha original:", password);
console.log("Senha codificada para URL:", encodedPassword);
console.log("Use a senha codificada no arquivo .env");
