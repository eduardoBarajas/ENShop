const OrdersModel = require('../models/OrderModel');

class OrdersRepository {
    async add() {
        console.log('xdxddxdxdxdx');
    }
    async delete() {
        console.log('x'); 
    }
    async update() {
        console.log('y');
    }
    async getAll() {
        console.log('p');
    }
    async getById() {
        console.log('m');
    }
    async getAllByIdProduct(idProduct) {
        return OrdersModel.find({idProduct: idProduct}).exec();
    }
}

module.exports = Object.create(new OrdersRepository);