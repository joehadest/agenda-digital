/**
 * Rotas de eventos para a Agenda Digital
 */
const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/events
 * @desc    Obter todos os eventos do usuário
 * @access  Privado
 */
router.get('/', auth, async (req, res) => {
    try {
        const events = await Event.find({ user: req.user._id });
        res.json(events);
    } catch (error) {
        console.error('Erro ao buscar eventos:', error.message);
        res.status(500).json({ message: 'Erro ao buscar eventos' });
    }
});

/**
 * @route   POST /api/events
 * @desc    Criar um novo evento
 * @access  Privado
 */
router.post('/', auth, async (req, res) => {
    try {
        const { title, date, time, description, notification } = req.body;

        const event = new Event({
            title,
            date,
            time,
            description,
            notification,
            user: req.user._id
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error('Erro ao criar evento:', error.message);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Erro de validação',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({ message: 'Erro ao criar evento' });
    }
});

/**
 * @route   GET /api/events/:id
 * @desc    Obter um evento específico
 * @access  Privado
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }

        res.json(event);
    } catch (error) {
        console.error('Erro ao buscar evento:', error.message);
        res.status(500).json({ message: 'Erro ao buscar evento' });
    }
});

/**
 * @route   PUT /api/events/:id
 * @desc    Atualizar um evento
 * @access  Privado
 */
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, date, time, description, notification } = req.body;

        // Buscar o evento e verificar se pertence ao usuário
        const event = await Event.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }

        // Atualizar os campos
        event.title = title;
        event.date = date;
        event.time = time;
        event.description = description;
        event.notification = notification;

        await event.save();
        res.json(event);
    } catch (error) {
        console.error('Erro ao atualizar evento:', error.message);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Erro de validação',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({ message: 'Erro ao atualizar evento' });
    }
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Excluir um evento
 * @access  Privado
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        // Buscar e excluir o evento
        const event = await Event.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }

        res.json({ message: 'Evento excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir evento:', error.message);
        res.status(500).json({ message: 'Erro ao excluir evento' });
    }
});

module.exports = router;
