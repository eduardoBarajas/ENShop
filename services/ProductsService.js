const ProductsRepository = require('../repositories/ProductsRepository');
const mongodb = require("mongodb");

class ProductsService {
    async add(producto) {
        return ProductsRepository.add(producto).then(res => {
            return this.responseHandler(res, 'Ocurrio un problema al agregar el producto!.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async deleteById(idProducto) {
        if (mongodb.ObjectID.isValid(idProducto)) {
            return ProductsRepository.deleteById(idProducto).then(res => {
                return this.responseHandler(res, 'Ocurrio un problema al eliminar el producto!.');  
            }).catch( error => {
                return Promise.reject(error);
            });  
        } else {
            return Promise.reject(new Error('El id no es valido!.'));
        }
    }

    async update(producto) {
        return ProductsRepository.update(producto).then(res => {
            return this.responseHandler(res, 'Ocurrio un problema al modificar el producto!.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async getAll() {
        return ProductsRepository.getAll().then(res => {
            return this.responseHandler(res, 'No hay ningun producto en el sistema!.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async getById(idProducto) {
        if (mongodb.ObjectID.isValid(idProducto)) {
            return ProductsRepository.getById(idProducto).then(res => {
                return this.responseHandler(res, 'No se encontro el producto!.');
            }).catch( error => {
                return Promise.reject(error);
            });
        } else {
            return Promise.reject(new Error('El id no es valido!.'));
        }
    }

    async getAllByFilter(options) {
        return ProductsRepository.getAllByFilter(options).then(res => {
            return this.responseHandler(res, 'No se encontro el producto!.');
        }).catch( error => {
            return Promise.reject(error);
        }); 
    }

    async getSample(options) {
        return ProductsRepository.getSample(options).then(res => {
            return this.responseHandler(res, 'No se encontraron productos!.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    responseHandler(response, errorMessage) {
        if (response === null || response.length === 0) {
            return Promise.reject(new Error(errorMessage));
        } else {
            return Promise.resolve(response);
        }
    }
}

module.exports = Object.create(new ProductsService);