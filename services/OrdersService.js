const OrdersRepository = require('../repositories/OrdersRepository');
const mongodb = require("mongodb");

class OrdersService {
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
        if (mongodb.ObjectID.isValid(idProduct)) {
            return OrdersRepository.getAllByIdProduct(idProduct).then(res => {
                if (res.length > 0) {
                    return Promise.reject(new Error('Imposible eliminar si tiene pedidos asignados.!'));
                } else {
                    return Promise.resolve('Es seguro eliminar.');
                }
            }).catch( error => {
                return Promise.reject(error);
            });
        } else {
            return Promise.reject(new Error('El id no es valido!.'));
        }
    }

    responseHandler(response, errorMessage) {
        if (response === null || response.length === 0) {
            return Promise.reject(new Error(errorMessage));
        } else {
            return Promise.resolve(response);
        }
    }
}

module.exports = Object.create(new OrdersService);