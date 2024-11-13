const jwt = require('jsonwebtoken');
const Salle=require('../models/salle')
const User = require('../models/user');
const Role = require('../models/role');
const uploadImage= require('../midelware/multer')

const salleController={};
const salleDisponibleController = {};

salleController.showAjouterSallePage = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).send('Authentication failed: invalid token');
        }
        
      
        console.log(req.cookies.token);
        res.render('ajoutersalle'); 
    } catch (error) {
        console.error('Erreur lors de l\'affichage de la page d\'ajout de salle :', error);
        res.status(500).send('Une erreur est survenue lors du chargement de la page.');
    }
};
salleController.addsalle = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).send('Authentication failed: invalid token');
        }

        const { name, capacity, location, prix } = req.body;
        let image='';
        if (req.file) {
            image = 'http://localhost:3002/uploads/' + req.file.filename;
        }
       
        const newSalle = new Salle({
            name,
            capacity,
            location,
            prix,
            image, // Stocker le chemin de l'image dans la base de données
            disponibilité: true
        });

        await newSalle.save();
        res.redirect('/salle/listesalle');
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de la salle :", error);
        res.status(500).send("Une erreur est survenue lors de l'enregistrement de la salle.");
    }
};
salleController.getAllSalles = async (req, res) => {
    try {
        const salles = await Salle.find({}, 'name capacity location image prix disponibilité'); // Spécifiez les champs que vous voulez récupérer
        const availableSallesCount = salles.length;
        res.render('listesalle', { salles, availableSallesCount, req });
    } catch (error) {
        console.error("Erreur lors de la récupération des salles :", error);
        res.status(500).send("Une erreur est survenue lors de la récupération des salles.");
    }
};


salleController.deleteSalle = async (req, res) => {
    const salleId = req.params.id;
    try {
        const salle = await Salle.findById(salleId);
        if (!salle) {
            return res.status(404).json({ message: "La salle n'a pas été trouvée." });
        }
        await Salle.deleteOne({ _id: salleId });
        res.redirect('/salle/listesalle?success=La%20salle%20a%20été%20supprimée%20avec%20succès.');
    } catch (error) {
        console.error("Erreur lors de la suppression de la salle :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la suppression de la salle." });
    }
};
salleController.showEditSallePage = async (req, res) => {
    try {
        const salleId = req.params.id;
        const salle = await Salle.findById(salleId);
        if (!salle) {
            return res.status(404).json({ message: "La salle n'a pas été trouvée." });
        }
        console.log(req.cookies.token)
        res.render('editSalle', { salle });
    } catch (error) {
        console.error("Erreur lors de l'affichage du formulaire de modification de la salle :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de l'affichage du formulaire de modification de la salle." });
    }
};

salleController.editSalle = async (req, res) => {
    const salleId = req.params.id;
    try {
        const salle = await Salle.findById(salleId);
        if (!salle) {
            return res.status(404).json({ message: "La salle n'a pas été trouvée." });
        }
        salle.name = req.body.name;
        salle.location = req.body.location;
        salle.capacity = req.body.capacity;
        salle.prix= req.body.prix;
       
        if (req.file) {
            salle.image = 'http://localhost:3002/uploads/' + req.file.filename;
        }
        await salle.save();
        console.log(req.cookies.token)
        res.redirect('/salle/listesalle?success=La%20salle%20a%20été%20modifiée%20avec%20succès.');
    } catch (error) {
        console.error("Erreur lors de la modification de la salle :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la modification de la salle." });
    }
};


salleDisponibleController.renderSalleDisponible = async (req, res) => {
    try {
        const salles = await Salle.find(); 
        console.log(req.cookies.token);
        res.render('salledisponible', { salles: salles });
    } catch (error) {
        console.error("Erreur lors du rendu de la page des salles disponibles :", error);
        res.status(500).send("Une erreur est survenue lors du rendu de la page des salles disponibles.");
    }
};





module.exports = {
    salleController,
    salleDisponibleController
};