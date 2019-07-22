const OrdersRepository = require('../repositories/OrdersRepository');
const mongodb = require("mongodb");
const ResponseHandler = require('../helpers/ResponseHandler');

class OrdersService {

    async add(order) {
        return OrdersRepository.add(order).then(res => {
            return ResponseHandler(false, res, 'Se almaceno el pedido.', 'No se almaceno el pedido.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async deleteById(idOrder) {
        if (mongodb.ObjectID.isValid(idOrder)) {
            return OrdersRepository.deleteById(idOrder).then(res => {
                return ResponseHandler(false, res, 'Se elimino el pedido.', 'No se elimino el pedido.');
            }).catch( error => {
                return Promise.reject(error);
            });  
        } else {
            return Promise.reject(new Error('El id no es valido!.'));
        }
    }
    async update() {
        console.log('y');
    }
    async getAll() {
        console.log('p');
    }
    async getById(idOrder) {
        if (mongodb.ObjectID.isValid(idOrder)) {
            return OrdersRepository.getById(idOrder).then(res => {
                return ResponseHandler(false, res, 'Pedido Obtenido.', 'No se obtuvo el pedido.');
            }).catch( error => {
                return Promise.reject(error);
            });
        } else {
            return Promise.reject(new Error('El id no es valido!.'));
        }
    }

    async getAllByFilter(options) {
        return OrdersRepository.getAllByFilter(options).then(res => {
            return ResponseHandler(true, res, 'Se obtuvieron los pedidos.', 'No se obtuvieron los pedidos.');
        }).catch( error => {
            return Promise.reject(error);
        }); 
    }

    async getAllByIdProduct(idProduct) {
        if (mongodb.ObjectID.isValid(idProduct)) {
            return OrdersRepository.getAllByIdProduct(idProduct).then(res => {
                return ResponseHandler(true, res, 'Tiene pedidos asignados.', 'No tiene pedidos asignados.');
            }).catch( error => {
                return Promise.reject(error);
            });
        } else {
            return Promise.reject(new Error('El id no es valido!.'));
        }
    }
}

module.exports = Object.create(new OrdersService);