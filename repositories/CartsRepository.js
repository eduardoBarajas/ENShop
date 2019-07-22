const CartsModel = require('../models/CartModel');

class CartsRepository {
    async add(cart) {
        return new CartsModel(cart).save();
    }

    async deleteById(idCart) {
        return CartsModel.findByIdAndRemove(idCart).exec();
    }

    async update(cart) {
        return CartsModel.findByIdAndUpdate(cart._id, cart).exec();
    }

    async getAll() {
        return CartsModel.find({}).exec();
    }

    async getById(idCart) {
        return CartsModel.findById(idCart).exec();
    }

    async exists(idCart) {
        return CartsModel.findById(idCart).exec();
    }

    async getAllByFilter(options) {
        return CartsModel.find(options).exec();
    }
        
    async getSample(options) {
        return CartsModel.aggregate([options]).exec();
    }
}

module.exports = Object.create(new CartsRepository);