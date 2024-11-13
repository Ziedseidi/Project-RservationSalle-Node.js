const express = require('express');
const routersalle = express.Router();
const{ salleController , salleDisponibleController  }= require('../Controller/salleController.js');
const authenticateToken = require('../midelware/authentication.js');
const uploadImage = require('../midelware/multer.js');


routersalle.get('/formulaireajoutersalle',  authenticateToken, salleController.showAjouterSallePage);
routersalle.post('/addsalle', authenticateToken,uploadImage.single('image'),salleController.addsalle);
routersalle.get('/listesalle', authenticateToken, salleController.getAllSalles);
routersalle.post('/:id/delete', authenticateToken, salleController.deleteSalle);
routersalle.get('/:id/edit', authenticateToken, salleController.showEditSallePage);
routersalle.post('/:id/edit', authenticateToken, uploadImage.single('image'), salleController.editSalle);
routersalle.get('/salledisponible',authenticateToken,salleDisponibleController.renderSalleDisponible);




module.exports = routersalle;