const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    salle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salle',
        required: true
    },
    datedébut: {
        type: Date,
        required: true
    },
    datefin: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['en cours', 'terminée', 'annulée', 'en attente']
    },
   
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
