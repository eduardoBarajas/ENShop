// Requiere de Mongoose
var mongoose = require('mongoose');

// Se define el schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    nameNormalized: String,
    lastNames: String,
    email: { type: String, unique: true},
    address: String,
    pass: String,
    cp: String,
    telephone: String,
    role: String
});

// compilar modelo desde schema
var UserModel = mongoose.model('Users', UserSchema);

module.exports = UserModel;