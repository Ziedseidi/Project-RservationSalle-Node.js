const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const router = require('./Routes/userRouter');
const routersalle = require('./Routes/salleRouter');
const routerreserv = require('./Routes/reservRouter');
const uploadImage = require('./midelware/multer'); 

const cookieParser = require('cookie-parser');
const Role = require('./models/role');
require('dotenv').config();
const methodOverride = require('method-override');

const initializeRoles = async () => {
    try {
        const existingRoles = await Role.find();
        if (existingRoles.length === 0) {
            await Role.create([
                { name: 'admin', description: 'Administrateur' },
                { name: 'client', description: 'Client' },
            ]);
            console.log('Les rôles ont été initialisés avec succès.');
        } else {
            console.log('Des rôles existent déjà dans la base de données.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des rôles :', error);
    }
};

initializeRoles();

const app = express();
const port = process.env.PORT || 3002;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/reservation_salle');
        console.log("Connexion réussie avec la base de données");
    } catch (error) {
        console.log(error.message);
    }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static('public'));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/users', router);
app.use('/salle', routersalle);
app.use('/reservations', routerreserv);

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
