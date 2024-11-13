const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]// Référence vers une collection de rôles
});

const User = mongoose.model('User', userSchema);

module.exports = User;
