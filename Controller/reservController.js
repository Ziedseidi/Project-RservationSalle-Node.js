const Salle = require('../models/salle');
const User = require('../models/user');
const Reservation = require('../models/reservation');

const { sendMail } = require("../config/email");
const reservController = {};

reservController.showReservationPage = async (req, res) => {
    try {
        const salleId = req.params.salleId;
        const salle = await Salle.findById(salleId);
        if (!salle) {
            return res.status(404).json({ message: "La salle n'a pas été trouvée." });
        }
        res.render('reservation', { salle: salle, salleId: salleId, successMessage: null, errorMessage: null });
    } catch (error) {
        console.error("Erreur lors de l'affichage de la page de réservation :", error);
        res.status(500).send("Une erreur est survenue lors de l'affichage de la page de réservation.");
    }
};


reservController.reserveSalle = async (req, res) => {
    try {
        const { salleId, dateDebut, dateFin } = req.body;
        if (!dateDebut || !req.userId) {
            return res.status(400).json({ message: "Veuillez fournir la date de début et l'ID de l'utilisateur." });
        }

        const user = await User.findById(req.userId);
        const salle = await Salle.findById(salleId);
        if (!user || !salle) {
            return res.status(404).json({ message: "Utilisateur ou salle non trouvé." });
        }

        const existingReservation = await Reservation.findOne({ 
            salle: salleId, 
            datedébut: { $lte: dateDebut }, 
            datefin: { $gte: dateFin },
            status: "en cours" 
        });

        if (existingReservation) {
            return res.render('reservation', { 
                salle: salle,
                name: salle.name, 
                salleId: salleId, 
                successMessage: null,
                errorMessage: "Impossible de réserver la salle. Elle est déjà réservée pour cette période." 
            });
        }

        const reservation = new Reservation({
            salle: salle,
            salle: salleId,
            user: req.userId,
            datedébut: dateDebut,
            datefin: dateFin,
            status: "en cours" 
        });
        await reservation.save();
        
        sendMail(user.email, "Ajout avec succès", "Bienvenue Ms " + user.username + ",\n\nVous avez bien ajouté votre réservation avec succès. Voici les détails de votre réservation :\n\nDate de début : " + dateDebut + "\nDate de fin : " + dateFin + ".\n\n consulte Le prix total de la réservation dans votre compte  ", false);

        console.log(req.cookies.token);
        res.render('reservation', { 
            salle: salle,
            name: salle.name, 
            salleId: salleId, 
            successMessage: "Réservation effectuée avec succès.", 
            errorMessage: null 
        });
    } catch (error) {
        console.error("Erreur lors de la réservation de la salle :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la réservation de la salle." });
    }
};

reservController.consultReservations = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("Utilisateur non trouvé.");
        }
        const username = user.username;
        const reservations = await Reservation.find({ user: userId }).populate('salle', 'name prix');
        
        reservations.forEach(reservation => {
            const startDate = new Date(reservation.datedébut);
            const endDate = new Date(reservation.datefin);
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            
            if (reservation.salle && reservation.salle.prix) {
                reservation.totalPrice = reservation.salle.prix * days;
            } else {
                reservation.totalPrice = 0;
            }
        });

        res.render('mesReservations', { username, reservations });
    } catch (error) {
        console.error("Erreur lors de la consultation des réservations :", error);
        res.status(500).send("Une erreur est survenue lors de la consultation des réservations.");
    }
};



reservController.showEditReservationForm = async (req, res) => {
    try {
        const reservationId = req.params.reservationId;

        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).send('Réservation non trouvée.');
        }

        // Passer les messages d'erreur et de succès à la méthode render
        const errorMessage = req.query.errorMessage;
        const successMessage = req.query.successMessage;

        res.render('editReservation', { reservation, errorMessage, successMessage });
    } catch (error) {
        console.error('Erreur lors de l\'affichage du formulaire de modification de réservation :', error);
        res.status(500).send('Une erreur est survenue lors de l\'affichage du formulaire de modification de réservation.');
    }
};
reservController.editReservation = async (req, res) => {
    try {
        const reservationId = req.params.reservationId;
        const { dateDebut, dateFin, salleId } = req.body;

        const existingReservation = await Reservation.findOne({ 
            _id: { $ne: reservationId }, // n5arjou id mta3 reservation exicte 
            salle: salleId, 
            datedébut: { $lte: dateDebut }, 
            datefin: { $gte: dateFin } 
        });

        if (existingReservation) {
            const errorMessage = "Impossible de modifier la réservation. Une autre réservation est déjà planifiée pour cette période.";
            return res.render('editReservation', { errorMessage });
        }

        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId, 
            { dateDebut, dateFin }, 
            { new: true }
        );
        
        await updatedReservation.save();
        const updatedSalle = await Salle.findById(updatedReservation.salle);

        const user = await User.findById(req.userId);
        sendMail(user.email, "Modification de réservation réussie", "Cher " + user.username + ",\n\nVotre réservation a été modifiée avec succès. Voici les nouveaux détails de votre réservation :\n\nNom de la salle : " + updatedSalle.name + "\nEmplacement : " + updatedSalle.location + "\nCapacité : " + updatedSalle.capacity + "\nPrix : " + updatedSalle.prix + "\n\nConsultez les détails mis à jour dans votre compte.", false);
        const reservations = await Reservation.find();

        const successMessage = "La réservation a été modifiée avec succès.";
        res.render('editReservation', { reservations, reservation: updatedReservation, successMessage });
    } catch (error) {
        console.error("Erreur lors de la modification de la réservation :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la modification de la réservation." });
    }
};
reservController.deleteReservation = async (req, res) => {
    try {
        const reservationId = req.params.reservationId;
        await Reservation.findByIdAndDelete(reservationId);
        const user = await User.findById(req.userId);
        sendMail(user.email, "Suppression de réservation réussie", "Cher " + user.username + 
        ",\n\nVotre réservation a été supprimée avec succès.\n\nConsultez votre compte pour plus de détails.", false)
        res.redirect('/reservations/MesReservations');
        } catch (error) {
        console.error("Erreur lors de la suppression de la réservation :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la suppression de la réservation." });
    }
};

reservController.listeReservationsEnCours = async (req, res) => {
    try {
        const reservationsEnCours = await Reservation.find({ status: "en cours" })
            .populate('user', 'username') 
            .populate('salle', 'name'); 

        res.render('reservationencours', { reservationsEnCours });
    } catch (error) {
        console.error("Erreur lors de la récupération des réservations en cours :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la récupération des réservations en cours." });
    }
};


module.exports = reservController;
