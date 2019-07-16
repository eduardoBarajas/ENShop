// Requiere de Mongoose
var mongoose = require('mongoose');

// Se define el schema
var Schema = mongoose.Schema;

var UsuarioSchema = new Schema({
    _id: { type: String },
    Nombre: String,
    Apellidos: String,
    CorreoElectronico: String,
    Direccion: String,
    Localidad: String,
    Pass: String,
    CodigoPostal: String,
    Telefono: String,
    Rol: String
});

// compilar modelo desde schema
var ModeloUsuario = mongoose.model('ModeloUsuario', UsuarioSchema);

module.exports = ModeloUsuario;