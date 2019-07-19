const ProductModel = require('../models/ProductModel');

class ProductsRepository {
    async add(product) {
		return new ProductModel(product).save();
    }

    async deleteById(idProducto) {
      return ProductModel.findByIdAndRemove(idProducto).exec();
    }

    async update(producto) {
      return ProductModel.findByIdAndUpdate(producto._id, producto).exec();
    }

    async getAll() {
      return ProductModel.find({}).exec();
    }

    async getById(idProducto) {
      return ProductModel.findById(idProducto).exec();
    }

    async getAllByFilter(options) {
      return ProductModel.find(options).exec();
	 }
	 
	 async getSample(options) {
		 return ProductModel.aggregate([options]).exec();
	 }
}

module.exports = Object.create(new ProductsRepository);