/**
 * Gerencia a autenticação de usuários na Agenda Digital
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verificar qual página está sendo exibida
    const isLoginPage = document.getElementById('login-form');
    const isRegisterPage = document.getElementById('register-form');

    // Configurar o formulário de login
    if (isLoginPage) {
        const loginForm = document.getElementById('login-form');
        const errorMessage = document.getElementById('error-message');

        // Adicionar evento de submit ao formulário de login
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Obter valores dos campos
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validar campos
            if (!email || !password) {
                showError('Preencha todos os campos');
                return;
            }

            try {
                // Tentar fazer login
                await api.login(email, password);

                // Se o login for bem-sucedido, redirecionar para a página principal
                window.location.href = 'index.html';
            } catch (error) {
                showError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
            }
        });

        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }

    // Configurar o formulário de cadastro
    if (isRegisterPage) {
        const registerForm = document.getElementById('register-form');
        const errorMessage = document.getElementById('error-message');

        // Adicionar evento de submit ao formulário de registro
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Obter valores dos campos
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validar campos
            if (!name || !email || !password || !confirmPassword) {
                showError('Preencha todos os campos');
                return;
            }

            // Verificar se as senhas coincidem
            if (password !== confirmPassword) {
                showError('As senhas não coincidem');
                return;
            }

            try {
                // Tentar registrar o usuário
                await api.register(name, email, password);

                // Redirecionar para a página de login com mensagem de sucesso
                window.location.href = 'login.html?registered=true';
            } catch (error) {
                showError(error.message || 'Erro ao criar conta. Verifique seus dados e tente novamente.');
            }
        });

        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }

    // Verificar se o usuário acabou de se registrar (exibir mensagem na página de login)
    if (isLoginPage && window.location.search.includes('registered=true')) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Conta criada com sucesso! Faça login para continuar.';
        errorMessage.style.display = 'block';
        errorMessage.style.color = 'green';
        errorMessage.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
    }
});