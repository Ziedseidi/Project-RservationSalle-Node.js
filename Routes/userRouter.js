const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController.js');
const authenticateToken = require('../midelware/authentication.js');

router.get('/register', userController.registerForm);
router.post('/register', userController.register);
router.get('/login', userController.loginForm);
router.post('/login', userController.login);
router.get('/dashboard', authenticateToken, userController.renderDashboard);
router.get('/welcome',  authenticateToken,userController.renderWelcome); 
router.get('/logout', userController.logout);
module.exports = router;