const CartsRepository = require('../repositories/CartsRepository');
const ResponseHandler = require('../helpers/ResponseHandler');
const mongodb = require("mongodb");

class CartsService {
    async add(cart) {
        return CartsRepository.add(cart).then(res => {
            return ResponseHandler(false, res, 'Se agrego el carrito.', 'No se almaceno el carrito.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async deleteById(idCart) {
        return CartsRepository.deleteById(idCart).then(res => {
            return ResponseHandler(false, res, 'Se elimino el carrito.', 'No hay carrito con ese id.');
        }).catch( error => {
            return Promise.reject(error);
        });  
    }
    
    async update(cart) {
        return CartsRepository.update(cart).then(res => {
            return ResponseHandler(false, res, 'Se modifico el carrito.', 'No hay carrito con ese id.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async getAll() {
        return CartsRepository.getAll().then(res => {
            return ResponseHandler(true, res, 'Se obtuvieron los carritos.', 'No hay carritos.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async getById(idCart) {
        return CartsRepository.getById(idCart).then(res => {
            return ResponseHandler(false, res, 'Se obtuvo el carrito.', 'No hay carrito con ese id.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async getAllByFilter(options) {
        return CartsRepository.getAllByFilter(options).then(res => {
            return ResponseHandler(true, res, 'Se obtuvieron los carritos.', 'No hay carritos con esa especificacion.');
        }).catch( error => {
            return Promise.reject(error);
        }); 
    }

    async exists(idCart) {
        return await CartsRepository.getById(idCart).then(response => {
            return ResponseHandler(false, response, 'Ya existe un carrito con ese id!.', 'No hay carritos con ese id.');
        }).catch( error => {
            return error;
        }); ;
    }
}

module.exports = Object.create(new CartsService );