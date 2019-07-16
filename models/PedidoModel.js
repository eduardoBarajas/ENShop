var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PedidoSchema = new Schema({
    IdCarrito: String,
    IdProducto: String,
    Cantidad: Number,
    PrecioUnitario: Number
});

var ModeloPedido = mongoose.model('ModeloPedido', PedidoSchema);
module.exports = ModeloPedido;