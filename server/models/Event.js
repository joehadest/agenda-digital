/**
 * Modelo de Evento para a Agenda Digital
 */
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Título é obrigatório'],
        trim: true
    },
    date: {
        type: String,
        required: [true, 'Data é obrigatória'],
        // Formato YYYY-MM-DD
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido']
    },
    time: {
        type: String,
        required: [true, 'Hora é obrigatória'],
        // Formato HH:MM
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido']
    },
    description: {
        type: String,
        trim: true
    },
    notification: {
        type: String,
        default: '0' // Minutos antes para notificar
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Índices para melhorar a performance das consultas
EventSchema.index({ user: 1, date: 1 });

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
