class NotificationManager {
    constructor() {
        this.notificationsEnabled = false;
        this.scheduledNotifications = new Map();
        this.initialize();
    }

    /**
     * Inicializar o sistema de notificações
     */
    initialize() {
        // Verificar se o navegador suporta notificações
        if (!("Notification" in window)) {
            console.log("Este navegador não suporta notificações desktop");
            return;
        }

        // Verificar permissão
        if (Notification.permission === "granted") {
            this.notificationsEnabled = true;
            this.setupEventListeners();
        } else if (Notification.permission !== "denied") {
            this.requestPermission();
        }
    }

    /**
     * Solicitar permissão para notificações
     */
    requestPermission() {
        Notification.requestPermission()
            .then(permission => {
                if (permission === "granted") {
                    this.notificationsEnabled = true;
                    this.setupEventListeners();

                    // Notificar usuário sobre permissão concedida
                    new Notification("Agenda Digital", {
                        body: "As notificações foram ativadas com sucesso!",
                        icon: "favicon.ico"
                    });
                }
            });
    }

    /**
     * Configurar listeners para eventos do sistema
     */
    setupEventListeners() {
        // Verificar notificações quando a página é carregada
        document.addEventListener('DOMContentLoaded', async () => {
            // Verificar se o usuário está autenticado
            if (typeof api !== 'undefined' && api.isAuthenticated()) {
                try {
                    const events = await api.getAllEvents();
                    this.scheduleNotificationsForEvents(events);
                } catch (error) {
                    console.error('Erro ao buscar eventos para notificações:', error);
                }
            }
        });

        // Verificar notificações periodicamente (a cada minuto)
        setInterval(() => this.checkUpcomingEvents(), 60000);
    }

    /**
     * Programar notificações para uma lista de eventos
     * @param {Array} events Lista de eventos
     */
    scheduleNotificationsForEvents(events) {
        if (!this.notificationsEnabled) return;

        events.forEach(event => {
            const eventDate = new Date(`${event.date}T${event.time}`);

            // Só agendar notificações para eventos futuros
            if (eventDate > new Date()) {
                this.scheduleNotification(event);
            }
        });
    }

    /**
     * Programar notificação para um evento
     * @param {Object} event O evento para notificar
     * @returns {Boolean} Se a notificação foi agendada com sucesso
     */
    scheduleNotification(event) {
        if (!this.notificationsEnabled) return false;

        // Usar _id para eventos da API ou id para eventos locais
        const eventId = event._id || event.id;

        // Cancelar notificação existente para este evento
        if (this.scheduledNotifications.has(eventId)) {
            clearTimeout(this.scheduledNotifications.get(eventId));
        }

        const eventDate = new Date(`${event.date}T${event.time}`);

        // Calcular quando mostrar a notificação (em minutos antes)
        const notificationTime = new Date(eventDate);
        notificationTime.setMinutes(notificationTime.getMinutes() - parseInt(event.notification || 0));

        const now = new Date();

        // Se o tempo de notificação já passou, não agende
        if (notificationTime < now) {
            return false;
        }

        // Calcular a diferença em milissegundos
        const timeUntilNotification = notificationTime.getTime() - now.getTime();

        // Agendar a notificação
        const timerId = setTimeout(() => {
            this.showNotification(event);
        }, timeUntilNotification);

        this.scheduledNotifications.set(eventId, timerId);
        return true;
    }

    /**
     * Mostrar uma notificação para um evento
     * @param {Object} event O evento a ser notificado
     */
    showNotification(event) {
        if (!this.notificationsEnabled) return;

        const options = {
            body: event.description || 'Sem descrição',
            icon: 'favicon.ico'
        };

        const notification = new Notification(`Lembrete: ${event.title}`, options);

        notification.onclick = function () {
            window.focus();
            this.close();
        };
    }

    /**
     * Verificar eventos próximos (para backup de notificações)
     */
    async checkUpcomingEvents() {
        if (!this.notificationsEnabled) return;

        try {
            // Buscar eventos da API se disponível
            let events = [];
            if (typeof api !== 'undefined' && api.isAuthenticated()) {
                events = await api.getAllEvents();
            } else {
                // Fallback para eventos locais
                events = typeof eventStorage !== 'undefined' ? eventStorage.getAllEvents() : [];
            }

            const now = new Date();

            events.forEach(event => {
                const eventDate = new Date(`${event.date}T${event.time}`);
                const notificationTime = new Date(eventDate);
                notificationTime.setMinutes(notificationTime.getMinutes() - parseInt(event.notification || 0));

                // Verificar se está na hora de notificar (com 1 minuto de margem)
                const timeDiff = Math.abs(now.getTime() - notificationTime.getTime()) / 60000;

                if (timeDiff < 1 && eventDate > now) {
                    this.showNotification(event);
                }
            });
        } catch (error) {
            console.error('Erro ao verificar eventos para notificações:', error);
        }
    }
}

// Criar instância global
const notificationManager = new NotificationManager();
