var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarritoSchema = new Schema({
    _id: {
        type: String,
        unique: true
    },
    Nombre: String,
    Apellido: String,
    Correo: String,
    Direccion: String,
    Direccion2: String,
    CP: Number,
    Completado: Boolean,
    Enviado: Boolean,
    Pagado: Boolean,
    CodigoPromo: String,
    FechaCreado: String
});

var ModeloCarrito = mongoose.model('Carritos', CarritoSchema);
module.exports = ModeloCarrito;