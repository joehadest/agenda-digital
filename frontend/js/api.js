/**
 * Classe para gerenciar comunicação com a API da Agenda Digital
 */
class AgendaAPI {
    constructor() {
        // Detectar ambiente automaticamente
        const isProduction = window.location.hostname !== 'localhost' &&
            !window.location.hostname.includes('127.0.0.1');

        // URL base da API
        this.baseURL = isProduction
            ? '/api' // No Vercel, usamos caminho relativo
            : 'http://localhost:3000/api'; // Em desenvolvimento, usamos localhost

        this.token = localStorage.getItem('auth_token');
    }

    // Verifica se o usuário está autenticado
    isAuthenticated() {
        return !!this.token;
    }

    // Obter headers para requisições autenticadas
    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    // Login de usuário
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha no login');
            }

            // Salvar token e informações do usuário
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user_name', data.user.name);
            localStorage.setItem('user_id', data.user._id);

            this.token = data.token;
            return data;

        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    // Registro de usuário
    async register(name, email, password) {
        try {
            const response = await fetch(`${this.baseURL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha no registro');
            }

            return data;

        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        }
    }

    // Buscar perfil do usuário
    async getUserProfile() {
        if (!this.token) {
            throw new Error('Usuário não autenticado');
        }

        try {
            const response = await fetch(`${this.baseURL}/users/profile`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha ao obter perfil');
            }

            return data;

        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            throw error;
        }
    }

    // Obter todos os eventos do usuário
    async getEvents() {
        if (!this.token) {
            throw new Error('Usuário não autenticado');
        }

        try {
            const response = await fetch(`${this.baseURL}/events`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha ao obter eventos');
            }

            return data;

        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            throw error;
        }
    }

    // Criar novo evento
    async createEvent(eventData) {
        if (!this.token) {
            throw new Error('Usuário não autenticado');
        }

        try {
            const response = await fetch(`${this.baseURL}/events`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(eventData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha ao criar evento');
            }

            return data;

        } catch (error) {
            console.error('Erro ao criar evento:', error);
            throw error;
        }
    }

    // Atualizar evento existente
    async updateEvent(eventId, eventData) {
        if (!this.token) {
            throw new Error('Usuário não autenticado');
        }

        try {
            const response = await fetch(`${this.baseURL}/events/${eventId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(eventData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha ao atualizar evento');
            }

            return data;

        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            throw error;
        }
    }

    // Deletar evento
    async deleteEvent(eventId) {
        if (!this.token) {
            throw new Error('Usuário não autenticado');
        }

        try {
            const response = await fetch(`${this.baseURL}/events/${eventId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha ao deletar evento');
            }

            return data;

        } catch (error) {
            console.error('Erro ao deletar evento:', error);
            throw error;
        }
    }

    // Logout - remover credenciais
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_id');
        this.token = null;
        window.location.href = 'login.html';
    }
}

// Criar instância global da API
const api = new AgendaAPI();

// Redirecionar se não estiver autenticado (exceto páginas de autenticação)
if (!api.isAuthenticated() &&
    !window.location.pathname.includes('login.html') &&
    !window.location.pathname.includes('register.html')) {
    window.location.href = 'login.html';
}
