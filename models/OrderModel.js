var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    idCart: String,
    idProduct: String,
    quantity: Number,
    unitaryPrice: Number
});

var OrdersModel = mongoose.model('orders', OrderSchema);
module.exports = OrdersModel;