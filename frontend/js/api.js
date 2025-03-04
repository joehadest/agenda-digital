class AgendaAPI {
    constructor() {
        // URL base que funciona tanto localmente quanto no Vercel
        this.baseURL = process.env.NODE_ENV === 'production'
            ? '/api'
            : 'http://localhost:3000/api';

        this.token = localStorage.getItem('auth_token');
    }

    // ...existing code...
}

// ...existing code...
