// Requiere de Mongoose
var mongoose = require('mongoose');

// Se define el schema
var Schema = mongoose.Schema;

var ModeloPruebaSchema = new Schema({
    name: String,
    type: { type: String } // works. asset is an object with a type property
});

// compilar modelo desde schema
var ModeloPrueba = mongoose.model('ModeloPrueba', ModeloPruebaSchema);

module.exports = ModeloPrueba;