const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Obter todos os eventos do usuário
router.get('/', auth, async (req, res) => {
    try {
        const events = await Event.find({ user: req.user._id }).sort({ date: 1, time: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obter um evento específico
router.get('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findOne({ _id: req.params.id, user: req.user._id });

        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Criar novo evento
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
        res.status(400).json({ message: error.message });
    }
});

// Atualizar um evento
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, date, time, description, notification } = req.body;

        const event = await Event.findOne({ _id: req.params.id, user: req.user._id });

        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }

        // Atualizar campos
        event.title = title;
        event.date = date;
        event.time = time;
        event.description = description;
        event.notification = notification;

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Excluir um evento
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }

        res.json({ message: 'Evento excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
