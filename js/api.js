class AgendaAPI {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('auth_token');
    }

    /**
     * Verificar se o usuário está autenticado
     * @returns {Boolean} Estado de autenticação
     */
    isAuthenticated() {
        return !!this.token;
    }

    /**
     * Headers comuns para requisições autenticadas
     * @returns {Object} Headers para requisições
     */
    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    /**
     * Obter todos os eventos do usuário
     * @returns {Promise<Array>} Lista de eventos
     */
    async getAllEvents() {
        try {
            const response = await fetch(`${this.baseURL}/events`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout(); // Token expirado ou inválido
                    throw new Error('Sessão expirada. Faça login novamente.');
                }
                throw new Error('Falha ao carregar eventos');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            throw error;
        }
    }

    /**
     * Adicionar um novo evento
     * @param {Object} eventData Dados do evento
     * @returns {Promise<Object>} Evento criado
     */
    async addEvent(eventData) {
        try {
            const response = await fetch(`${this.baseURL}/events`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                    throw new Error('Sessão expirada. Faça login novamente.');
                }
                throw new Error('Falha ao adicionar evento');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao adicionar evento:', error);
            throw error;
        }
    }

    /**
     * Atualizar um evento existente
     * @param {String} id ID do evento
     * @param {Object} eventData Dados atualizados
     * @returns {Promise<Object>} Evento atualizado
     */
    async updateEvent(id, eventData) {
        try {
            const response = await fetch(`${this.baseURL}/events/${id}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                    throw new Error('Sessão expirada. Faça login novamente.');
                }
                throw new Error('Falha ao atualizar evento');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            throw error;
        }
    }

    /**
     * Excluir um evento
     * @param {String} id ID do evento
     * @returns {Promise<Object>} Resultado da operação
     */
    async deleteEvent(id) {
        try {
            const response = await fetch(`${this.baseURL}/events/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                    throw new Error('Sessão expirada. Faça login novamente.');
                }
                throw new Error('Falha ao excluir evento');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao excluir evento:', error);
            throw error;
        }
    }

    /**
     * Obter informações do usuário logado
     * @returns {Promise<Object>} Dados do usuário
     */
    async getUserInfo() {
        try {
            const response = await fetch(`${this.baseURL}/users/profile`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                    throw new Error('Sessão expirada. Faça login novamente.');
                }
                throw new Error('Falha ao obter informações do usuário');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
            throw error;
        }
    }

    /**
     * Fazer logout
     */
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        window.location.href = 'login.html';
    }
}

// Instância global da API
const api = new AgendaAPI();

// Redirecionar para login se não estiver autenticado (exceto nas páginas de auth)
if (!api.isAuthenticated() &&
    !window.location.href.includes('login.html') &&
    !window.location.href.includes('register.html')) {
    window.location.href = 'login.html';
}
