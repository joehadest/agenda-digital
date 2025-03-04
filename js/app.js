document.addEventListener('DOMContentLoaded', async () => {
    // Elementos DOM
    const eventForm = document.getElementById('event-form');
    const eventsListEl = document.getElementById('events-list');
    const filterDateEl = document.getElementById('filter-date');
    const btnClearFilter = document.getElementById('btn-clear-filter');
    const btnLogout = document.getElementById('btn-logout');
    const userNameEl = document.getElementById('user-name');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Elemento selecionado para edição
    let editingEventId = null;
    // Eventos carregados da API
    let allEvents = [];

    // Inicializar a aplicação
    init();

    /**
     * Função de inicialização
     */
    async function init() {
        // Verificar autenticação
        if (!api.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        // Mostrar nome do usuário
        const userName = localStorage.getItem('user_name');
        if (userName) {
            userNameEl.textContent = `Olá, ${userName}`;
        } else {
            try {
                const userInfo = await api.getUserInfo();
                userNameEl.textContent = `Olá, ${userInfo.user.name}`;
                localStorage.setItem('user_name', userInfo.user.name);
            } catch (error) {
                console.error('Erro ao buscar informações do usuário:', error);
            }
        }

        // Carregar eventos existentes
        loadEvents();

        // Configurar listeners de eventos
        setupEventListeners();

        // Data atual no filtro
        filterDateEl.valueAsDate = new Date();
    }

    /**
     * Configurar listeners de eventos da UI
     */
    function setupEventListeners() {
        // Form de adição/edição de eventos
        eventForm.addEventListener('submit', handleFormSubmit);

        // Filtro de data
        filterDateEl.addEventListener('change', () => renderEvents(allEvents));
        btnClearFilter.addEventListener('click', clearFilter);

        // Botão de logout
        btnLogout.addEventListener('click', () => api.logout());
    }

    /**
     * Carregar eventos da API
     */
    async function loadEvents() {
        try {
            showLoading(true);
            allEvents = await api.getAllEvents();
            renderEvents(allEvents);
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            showError('Não foi possível carregar seus compromissos. Tente novamente mais tarde.');
        } finally {
            showLoading(false);
        }
    }

    /**
     * Manipular envio do formulário (adicionar/editar evento)
     */
    async function handleFormSubmit(e) {
        e.preventDefault();

        const eventData = {
            title: document.getElementById('event-title').value,
            date: document.getElementById('event-date').value,
            time: document.getElementById('event-time').value,
            description: document.getElementById('event-description').value,
            notification: document.getElementById('event-notification').value
        };

        try {
            showLoading(true);

            if (editingEventId) {
                // Editar evento existente
                const updatedEvent = await api.updateEvent(editingEventId, eventData);

                // Atualizar o evento na lista local
                const index = allEvents.findIndex(e => e._id === editingEventId);
                if (index !== -1) {
                    allEvents[index] = updatedEvent;
                }

                editingEventId = null;
                resetForm('Adicionar');
            } else {
                // Adicionar novo evento
                const newEvent = await api.addEvent(eventData);
                allEvents.push(newEvent);

                // Programar notificação
                notificationManager.scheduleNotification({
                    id: newEvent._id,
                    ...eventData
                });
            }

            // Limpar o formulário
            eventForm.reset();

            // Atualizar lista
            renderEvents(allEvents);

        } catch (error) {
            console.error('Erro ao salvar evento:', error);
            showError('Não foi possível salvar o compromisso. Tente novamente.');
        } finally {
            showLoading(false);
        }
    }

    /**
     * Renderizar lista de eventos
     */
    function renderEvents(events) {
        eventsListEl.innerHTML = '';

        // Clone para não modificar o array original
        let eventsToRender = [...events];

        // Aplicar filtro de data se selecionado
        const filterDate = filterDateEl.value;
        if (filterDate) {
            eventsToRender = eventsToRender.filter(event => event.date === filterDate);
        }

        // Ordenar eventos por data e hora
        eventsToRender.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });

        // Renderizar cada evento
        eventsToRender.forEach(event => {
            const eventEl = createEventElement(event);
            eventsListEl.appendChild(eventEl);
        });

        // Exibir mensagem se não houver eventos
        if (eventsToRender.length === 0) {
            eventsListEl.innerHTML = '<p class="empty-message">Nenhum compromisso encontrado.</p>';
        }
    }

    /**
     * Criar elemento DOM para um evento
     */
    function createEventElement(event) {
        const eventEl = document.createElement('li');
        eventEl.className = 'event-item';

        // Formatar data para exibição
        const eventDate = new Date(`${event.date}T${event.time}`);
        const formattedDate = eventDate.toLocaleDateString('pt-BR');
        const formattedTime = eventDate.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Verificar se o evento já passou
        const isPast = eventDate < new Date();
        if (isPast) {
            eventEl.classList.add('past-event');
        }

        eventEl.innerHTML = `
            <div class="event-header">
                <span class="event-title">${event.title}</span>
                <span class="event-datetime">${formattedDate} às ${formattedTime}</span>
            </div>
            <div class="event-description">${event.description || 'Sem descrição'}</div>
            <div class="event-actions">
                <button class="btn-secondary btn-edit">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-delete">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        `;

        // Adicionar listeners aos botões
        const btnEdit = eventEl.querySelector('.btn-edit');
        const btnDelete = eventEl.querySelector('.btn-delete');

        btnEdit.addEventListener('click', () => editEvent(event._id));
        btnDelete.addEventListener('click', () => deleteEvent(event._id));

        return eventEl;
    }

    /**
     * Editar um evento
     */
    function editEvent(id) {
        const event = allEvents.find(e => e._id === id);
        if (!event) return;

        // Preencher o formulário com dados do evento
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-date').value = event.date;
        document.getElementById('event-time').value = event.time;
        document.getElementById('event-description').value = event.description || '';
        document.getElementById('event-notification').value = event.notification || '0';

        // Marcar que estamos editando
        editingEventId = id;

        // Mudar texto do botão
        const submitBtn = eventForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Atualizar';

        // Rolar para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Excluir um evento
     */
    async function deleteEvent(id) {
        if (confirm('Tem certeza que deseja excluir este compromisso?')) {
            try {
                showLoading(true);
                await api.deleteEvent(id);

                // Remover da lista local
                allEvents = allEvents.filter(e => e._id !== id);

                // Cancelar edição se estiver editando o evento excluído
                if (editingEventId === id) {
                    resetForm('Adicionar');
                }

                renderEvents(allEvents);
            } catch (error) {
                console.error('Erro ao excluir evento:', error);
                showError('Não foi possível excluir o compromisso. Tente novamente.');
            } finally {
                showLoading(false);
            }
        }
    }

    /**
     * Resetar formulário
     */
    function resetForm(buttonText) {
        eventForm.reset();
        editingEventId = null;

        // Resetar texto do botão
        const submitBtn = eventForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = `<i class="fas fa-plus"></i> ${buttonText}`;
    }

    /**
     * Limpar filtro de data
     */
    function clearFilter() {
        filterDateEl.value = '';
        renderEvents(allEvents);
    }

    /**
     * Exibir/ocultar indicador de carregamento
     */
    function showLoading(show) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }

    /**
     * Mostrar mensagem de erro
     */
    function showError(message) {
        alert(message);
    }
});
