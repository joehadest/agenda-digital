document.addEventListener('DOMContentLoaded', () => {
    // Verificar qual formulário está presente na página
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    // Configuração do API
    const API_URL = 'http://localhost:3000/api';

    // Verificar se o usuário já está logado
    const token = localStorage.getItem('auth_token');
    if (token) {
        // Redirecionar para a página principal se já estiver logado
        window.location.href = 'index.html';
    }

    // Função para mostrar mensagens de erro
    function showError(message) {
        errorMessage.textContent = message;
        setTimeout(() => {
            errorMessage.textContent = '';
        }, 5000);
    }

    // Manipulador de login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_URL}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao fazer login');
                }

                // Salvar token e informações do usuário
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_id', data.user._id);
                localStorage.setItem('user_name', data.user.name);

                // Redirecionar para a página principal
                window.location.href = 'index.html';
            } catch (error) {
                showError(error.message);
            }
        });
    }

    // Manipulador de cadastro
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validar se as senhas são iguais
            if (password !== confirmPassword) {
                showError('As senhas não coincidem');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao fazer cadastro');
                }

                // Redirecionar para a página de login
                alert('Cadastro realizado com sucesso! Faça login para continuar.');
                window.location.href = 'login.html';
            } catch (error) {
                showError(error.message);
            }
        });
    }
});
