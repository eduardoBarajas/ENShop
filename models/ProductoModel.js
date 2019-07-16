// Requiere de Mongoose
var mongoose = require('mongoose');

// Se define el schema
var Schema = mongoose.Schema;

var ProductoSchema = new Schema({
    Nombre: String,
    Descripcion: String,
    Categoria: String,
    Estado: String,
    BestSeller: Boolean,
    PrecioOriginal: Number,
    PrecioActual: Number,
    CantidadDisponible: { type: Number, min: 0 },
    InformacionAdicional: String,
    ImagenesProducto: String,
    FechaPublicacion: String
});

// compilar modelo desde schema
var ModeloProducto = mongoose.model('ModeloProducto', ProductoSchema);

module.exports = ModeloProducto;