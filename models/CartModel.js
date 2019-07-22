var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
    _id: {
        type: String,
        unique: true
    },
    name: String,
    idUser: String,
    nameNormalized: String,
    lastNames: String,
    email: String,
    address: String,
    address2: String,
    cp: Number,
    sent: Boolean,
    completed: Boolean,
    delivered: Boolean,
    payed: Boolean,
    promoCode: String,
    creationDate: String
});

var CartModel = mongoose.model('carts', CartSchema);
module.exports = CartModel;