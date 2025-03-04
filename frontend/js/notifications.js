/**
 * Sistema de Notificações da Agenda Digital
 * Gerencia notificações de compromissos
 */
const notificationSystem = (() => {
    // Armazenar IDs de timeout para possibilitar cancelamento
    const notificationTimers = {};

    /**
     * Solicitar permissão para enviar notificações
     */
    const requestPermission = async () => {
        if (!('Notification' in window)) {
            console.log('Este navegador não suporta notificações desktop');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    };

    /**
     * Mostrar uma notificação
     * @param {Object} event - Dados do evento para notificar
     */
    const showNotification = async (event) => {
        const hasPermission = await requestPermission();

        if (!hasPermission) {
            console.log('Permissão para notificações negada');
            return;
        }

        const notification = new Notification(`Compromisso: ${event.title}`, {
            body: `${event.description || 'Sem descrição'}\nHorário: ${event.time}`,
            icon: 'https://img.icons8.com/color/48/000000/calendar.png'
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        // Reproduzir som de notificação
        playSound();
    };

    /**
     * Programar notificação para um evento
     * @param {Object} event - Evento para agendar notificação
     */
    const scheduleNotification = (event) => {
        if (!event || !event.date || !event.time) return;

        // Cancela qualquer notificação existente para o mesmo evento
        if (event._id && notificationTimers[event._id]) {
            clearTimeout(notificationTimers[event._id]);
            delete notificationTimers[event._id];
        }

        // Calcular quando a notificação deve ser exibida
        const eventDate = new Date(`${event.date}T${event.time}`);

        // Obter minutos para notificar antes (default = 0, ou seja, na hora do evento)
        const minutesBefore = parseInt(event.notification) || 0;

        // Calcular horário exato da notificação
        const notificationTime = new Date(eventDate.getTime() - (minutesBefore * 60 * 1000));

        // Verificar se a hora da notificação já passou
        if (notificationTime <= new Date()) return;

        // Calcular delay em milissegundos
        const delay = notificationTime.getTime() - Date.now();

        // Programar notificação
        const timerId = setTimeout(() => {
            showNotification(event);
        }, delay);

        // Armazenar ID do timer para poder cancelar se necessário
        if (event._id) {
            notificationTimers[event._id] = timerId;
        }

        console.log(`Notificação agendada para: ${notificationTime.toLocaleString('pt-BR')}`);
    };

    /**
     * Cancelar notificação agendada
     * @param {string} eventId - ID do evento
     */
    const cancelNotification = (eventId) => {
        if (notificationTimers[eventId]) {
            clearTimeout(notificationTimers[eventId]);
            delete notificationTimers[eventId];
            console.log(`Notificação cancelada para evento ${eventId}`);
        }
    };

    /**
     * Reagendar todas as notificações baseado na lista de eventos
     * @param {Array} events - Lista de eventos
     */
    const scheduleAllNotifications = (events) => {
        // Cancelar todas as notificações existentes
        Object.keys(notificationTimers).forEach(id => {
            clearTimeout(notificationTimers[id]);
            delete notificationTimers[id];
        });

        // Adicionar notificações para todos os eventos futuros
        events.forEach(event => {
            const eventDate = new Date(`${event.date}T${event.time}`);

            // Apenas eventos futuros
            if (eventDate > new Date()) {
                scheduleNotification(event);
            }
        });

        console.log(`${events.length} eventos verificados para notificações`);
    };

    /**
     * Tocar um som de notificação
     */
    const playSound = () => {
        const audio = new Audio('https://github.com/joehadest/recursos/blob/main/notification-sound.mp3?raw=true');
        audio.play().catch(e => console.log('Erro ao reproduzir som:', e));
    };

    // Solicitar permissão ao inicializar
    requestPermission();

    // API pública
    return {
        requestPermission,
        scheduleNotification,
        cancelNotification,
        scheduleAllNotifications
    };
})();
