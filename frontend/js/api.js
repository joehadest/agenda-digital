class AgendaAPI {
    constructor() {
        // Detectar ambiente automaticamente
        const isProduction = window.location.hostname !== 'localhost' &&
            !window.location.hostname.includes('127.0.0.1');

        // URL base que funciona tanto localmente quanto no Vercel
        this.baseURL = isProduction
            ? '/api'  // No Vercel
            : 'http://localhost:3000/api';  // Local

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

    // ...existing code...
}

// ...existing code...
