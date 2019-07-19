// Requiere de Mongoose
var mongoose = require('mongoose');

// Se define el schema
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: String,
    nameNormalized: String,
    description: String,
    category: String,
    state: String,
    bestSeller: Boolean,
    originalPrice: Number,
    currentPrice: Number,
    availableStock: { type: Number, min: 0 },
    aditionalInfo: String,
    images: [String],
    publishedDate: String
});

// compilar modelo desde schema
var ProductModel = mongoose.model('products', ProductSchema);

module.exports = ProductModel;