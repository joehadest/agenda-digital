const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Título é obrigatório'],
        trim: true
    },
    date: {
        type: String,
        required: [true, 'Data é obrigatória']
    },
    time: {
        type: String,
        required: [true, 'Hora é obrigatória']
    },
    description: {
        type: String,
        trim: true
    },
    notification: {
        type: String,
        default: '0'
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
}, { collection: 'eventos' }); // Definindo o nome da collection

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
