/**
 * Aplicação principal da Agenda Digital
 * Gerencia a interface de usuário e manipulação de eventos
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    if (!api.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Elementos DOM
    const userNameElement = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const eventForm = document.getElementById('event-form');
    const eventsList = document.getElementById('events-list');
    const loadingIndicator = document.getElementById('loading');
    const filterDateInput = document.getElementById('filter-date');
    const clearFilterBtn = document.getElementById('btn-clear-filter');
    const clearFormBtn = document.getElementById('btn-clear');

    // Estado da aplicação
    let currentEvents = [];
    let editingEventId = null;

    // Inicialização
    init();

    // Função principal de inicialização
    async function init() {
        // Carregar nome do usuário
        const userName = localStorage.getItem('user_name');
        if (userName) {
            userNameElement.textContent = `Olá, ${userName}`;
        }

        // Configurar eventos de UI
        setupEventListeners();

        // Carregar eventos do usuário
        await loadEvents();

        // Solicitar permissão para notificações
        notificationSystem.requestPermission();
    }

    // Configurar eventos de interface
    function setupEventListeners() {
        // Logout
        logoutBtn.addEventListener('click', () => api.logout());

        // Formulário de eventos
        eventForm.addEventListener('submit', handleFormSubmit);

        // Botão de limpar formulário
        clearFormBtn.addEventListener('click', () => resetForm());

        // Filtros
        filterDateInput.addEventListener('change', filterEvents);
        clearFilterBtn.addEventListener('click', clearFilter);
    }

    // Carregar eventos do usuário
    async function loadEvents() {
        try {
            showLoading(true);

            // Buscar eventos da API
            const events = await api.getEvents();
            currentEvents = events;

            // Renderizar eventos e configurar notificações
            renderEvents(events);
            notificationSystem.scheduleAllNotifications(events);

            console.log(`${events.length} eventos carregados`);
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            showError('Não foi possível carregar seus compromissos. Tente novamente mais tarde.');
        } finally {
            showLoading(false);
        }
    }

    // Envio do formulário (criar/editar evento)
    async function handleFormSubmit(e) {
        e.preventDefault();

        // Obter dados do formulário
        const eventData = {
            title: document.getElementById('event-title').value.trim(),
            date: document.getElementById('event-date').value,
            time: document.getElementById('event-time').value,
            description: document.getElementById('event-description').value.trim(),
            notification: document.getElementById('event-notification').value
        };

        // Validação simples
        if (!eventData.title || !eventData.date || !eventData.time) {
            showError('Preencha pelo menos título, data e hora do compromisso.');
            return;
        }

        try {
            showLoading(true);
            let savedEvent;

            if (editingEventId) {
                // Atualizar evento existente
                savedEvent = await api.updateEvent(editingEventId, eventData);

                // Atualizar na lista local
                const index = currentEvents.findIndex(e => e._id === editingEventId);
                if (index !== -1) {
                    currentEvents[index] = savedEvent;
                }

                showMessage('Compromisso atualizado com sucesso!');
            } else {
                // Criar novo evento
                savedEvent = await api.createEvent(eventData);

                // Adicionar à lista local
                currentEvents.push(savedEvent);

                showMessage('Compromisso adicionado com sucesso!');
            }

            // Resetar formulário
            resetForm();

            // Atualizar UI e reagendar notificações
            renderEvents(currentEvents);
            notificationSystem.scheduleNotification(savedEvent);

        } catch (error) {
            console.error('Erro ao salvar evento:', error);
            showError('Erro ao salvar compromisso. Tente novamente.');
        } finally {
            showLoading(false);
        }
    }

    // Renderizar eventos na UI
    function renderEvents(events) {
        // Filtrar por data se aplicável
        let filteredEvents = [...events];
        const filterDate = filterDateInput.value;

        if (filterDate) {
            filteredEvents = filteredEvents.filter(event => event.date === filterDate);
        }

        // Ordenar por data/hora
        filteredEvents.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });

        // Limpar lista atual
        eventsList.innerHTML = '';

        // Mostrar mensagem se não houver eventos
        if (filteredEvents.length === 0) {
            eventsList.innerHTML = `
                <li class="event-item" style="text-align: center; color: #666;">
                    ${filterDate ? 'Nenhum compromisso nesta data' : 'Você não tem compromissos agendados'}
                </li>`;
            return;
        }

        // Renderizar cada evento
        filteredEvents.forEach(event => {
            const eventDate = new Date(`${event.date}T${event.time}`);
            const isPast = eventDate < new Date();

            const eventElement = document.createElement('li');
            eventElement.className = `event-item ${isPast ? 'past-event' : ''}`;

            // Formatar data para exibição
            const formattedDate = eventDate.toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            const formattedTime = eventDate.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });

            eventElement.innerHTML = `
                <div class="event-header">
                    <span class="event-title">${event.title}</span>
                    <span class="event-date">${formattedDate} às ${formattedTime}</span>
                </div>
                <div class="event-description">${event.description || 'Sem descrição'}</div>
                <div class="event-actions">
                    <button class="btn-edit btn-secondary">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete btn-danger">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            `;

            // Adicionar event listeners para botões
            const editButton = eventElement.querySelector('.btn-edit');
            const deleteButton = eventElement.querySelector('.btn-delete');

            editButton.addEventListener('click', () => editEvent(event));
            deleteButton.addEventListener('click', () => deleteEvent(event._id));

            eventsList.appendChild(eventElement);
        });
    }

    // Editar evento
    function editEvent(event) {
        // Preencher o formulário
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-date').value = event.date;
        document.getElementById('event-time').value = event.time;
        document.getElementById('event-description').value = event.description || '';
        document.getElementById('event-notification').value = event.notification || '0';

        // Alterar botão para "Atualizar"
        const submitButton = eventForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = `<i class="fas fa-save"></i> Atualizar`;

        // Armazenar ID do evento em edição
        editingEventId = event._id;

        // Rolar para o formulário
        eventForm.scrollIntoView({ behavior: 'smooth' });
    }

    // Excluir evento
    async function deleteEvent(eventId) {
        if (!confirm('Tem certeza que deseja excluir este compromisso?')) {
            return;
        }

        try {
            showLoading(true);

            // Excluir na API
            await api.deleteEvent(eventId);

            // Remover do array local
            currentEvents = currentEvents.filter(event => event._id !== eventId);

            // Atualizar UI
            renderEvents(currentEvents);

            // Cancelar notificações agendadas
            notificationSystem.cancelNotification(eventId);

            showMessage('Compromisso excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir evento:', error);
            showError('Erro ao excluir compromisso. Tente novamente.');
        } finally {
            showLoading(false);
        }
    }

    // Filtrar eventos por data
    function filterEvents() {
        renderEvents(currentEvents);
    }

    // Limpar filtro de data
    function clearFilter() {
        filterDateInput.value = '';
        renderEvents(currentEvents);
    }

    // Resetar formulário
    function resetForm() {
        eventForm.reset();
        editingEventId = null;

        // Restaurar botão para "Salvar"
        const submitButton = eventForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = `<i class="fas fa-save"></i> Salvar`;
    }

    // Mostrar indicador de carregamento
    function showLoading(show) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }

    // Mostrar mensagem de erro
    function showError(message) {
        alert(message);
    }

    // Mostrar mensagem de sucesso
    function showMessage(message) {
        // Implementar toast ou outro tipo de notificação aqui
        console.log(message);
    }
});
