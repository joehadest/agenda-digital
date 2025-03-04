class EventStorage {
    constructor() {
        this.STORAGE_KEY = 'agenda_digital_events';
    }

    /**
     * Obter todos os eventos salvos
     * @returns {Array} Lista de eventos
     */
    getAllEvents() {
        const events = localStorage.getItem(this.STORAGE_KEY);
        return events ? JSON.parse(events) : [];
    }

    /**
     * Adicionar um novo evento
     * @param {Object} event Evento a ser adicionado
     */
    addEvent(event) {
        const events = this.getAllEvents();
        event.id = Date.now().toString();
        events.push(event);
        this.saveEvents(events);
        return event;
    }

    /**
     * Atualizar um evento existente
     * @param {String} id ID do evento
     * @param {Object} updatedEvent Dados atualizados
     */
    updateEvent(id, updatedEvent) {
        let events = this.getAllEvents();
        const index = events.findIndex(event => event.id === id);

        if (index !== -1) {
            updatedEvent.id = id;
            events[index] = updatedEvent;
            this.saveEvents(events);
            return true;
        }

        return false;
    }

    /**
     * Remover um evento
     * @param {String} id ID do evento a ser removido
     */
    deleteEvent(id) {
        let events = this.getAllEvents();
        events = events.filter(event => event.id !== id);
        this.saveEvents(events);
    }

    /**
     * Obter um evento específico pelo ID
     * @param {String} id ID do evento
     * @returns {Object|null} O evento encontrado ou null
     */
    getEventById(id) {
        const events = this.getAllEvents();
        return events.find(event => event.id === id) || null;
    }

    /**
     * Salvar eventos no localStorage
     * @param {Array} events Lista de eventos para salvar
     */
    saveEvents(events) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
    }
}

// Criar instância global
const eventStorage = new EventStorage();
