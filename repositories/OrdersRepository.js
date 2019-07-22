const OrdersModel = require('../models/OrderModel');

class OrdersRepository {

    async add(order) {
        return new OrdersModel(order).save();
    }

    async deleteById(idOrder) {
        return OrdersModel.findByIdAndRemove(idOrder).exec();
    }

    async update() {
        console.log('y');
    }
    async getAll() {
        console.log('p');
    }
    async getById(idOrder) {
        return OrdersModel.findById(idOrder).exec();
    }

    async getAllByFilter(options) {
        return OrdersModel.find(options).exec();
    }

    async getAllByIdProduct(idProduct) {
        return OrdersModel.find({idProduct: idProduct}).exec();
    }
}

module.exports = Object.create(new OrdersRepository);