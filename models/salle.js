const mongoose = require('mongoose');

const salleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: { 
        type: String, 
       
    },
    prix:{
        type:Number,
        required:true
    },
    disponibilité: {
        type: Boolean,
        default: true // Par défaut, la salle est disponible
    }
});

const Salle = mongoose.model('Salle', salleSchema);

module.exports = Salle;
