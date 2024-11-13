const express = require('express');
const routerreserv = express.Router();
const reservController = require('../Controller/reservController.js'); // Correction ici
const authenticateToken = require('../midelware/authentication.js');
const upload = require('../midelware/multer.js');

routerreserv.get('/reserve/:salleId', authenticateToken, reservController.showReservationPage);
routerreserv.post('/reserve', authenticateToken, reservController.reserveSalle);
routerreserv.get('/MesReservations', authenticateToken, reservController.consultReservations);
routerreserv.get('/:reservationId/edit',authenticateToken, reservController.showEditReservationForm);
routerreserv.post('/:reservationId/edit',authenticateToken, reservController.editReservation);
routerreserv.post('/:reservationId/delete', authenticateToken,reservController.deleteReservation);
routerreserv.get('/reservations-en-cours',authenticateToken, reservController.listeReservationsEnCours);

module.exports = routerreserv;
