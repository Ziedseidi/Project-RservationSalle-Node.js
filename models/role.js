const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Nom du rôle (ex: admin, client, moderator, etc.)
    description: { type: String }, // Description du rôle (facultatif)
    // Autres propriétés du rôle
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
