const ProductModel = require('../models/ProductModel');

class ProductsRepository {
  async add(product) {
    return new ProductModel(product).save();
  }

  async deleteById(idProduct) {
    return ProductModel.findByIdAndRemove(idProduct).exec();
  }

  async update(product) {
    return ProductModel.findByIdAndUpdate(product._id, product).exec();
  }

  async getAll() {
    return ProductModel.find({}).exec();
  }

  async getById(idProduct) {
    return ProductModel.findById(idProduct).exec();
  }

  async getAllByFilter(options) {
    return ProductModel.find(options).exec();
  }
	 
  async getSample(options) {
    return ProductModel.aggregate([options]).exec();
  }
}

module.exports = Object.create(new ProductsRepository);