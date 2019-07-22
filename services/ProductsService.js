const ProductsRepository = require('../repositories/ProductsRepository');
const mongodb = require("mongodb");
const ResponseHandler = require('../helpers/ResponseHandler');

class ProductsService {
    async add(product) {
        return ProductsRepository.add(product).then(res => {
            return ResponseHandler(false, res, 'Se agrego el producto.', 'No se almaceno el producto.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async deleteById(idProduct) {
        if (mongodb.ObjectID.isValid(idProduct)) {
            return ProductsRepository.deleteById(idProduct).then(res => {
                return ResponseHandler(false, res, 'Se elimino el producto.', 'No se elimino el producto.');
            }).catch( error => {
                return Promise.reject(error);
            });  
        } else {
            return Promise.reject(new Error('El id no es valido!.'));
        }
    }

    async update(product) {
        return ProductsRepository.update(product).then(res => {
            return ResponseHandler(false, res, 'Se modifico el producto.', 'No se modifico el producto.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async getAll() {
        return ProductsRepository.getAll().then(res => {
            return ResponseHandler(true, res, 'Se obtuvieron los productos.', 'No se obtuvieron los productos.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async getById(idProduct) {
        if (mongodb.ObjectID.isValid(idProduct)) {
            return ProductsRepository.getById(idProduct).then(res => {
                return ResponseHandler(false, res, 'Se encontro el producto.', 'No se encontro el producto.');
            }).catch( error => {
                return Promise.reject(error);
            });
        } else {
            return Promise.reject(new Error('El id no es valido!.'));
        }
    }

    async getAllByFilter(options) {
        return ProductsRepository.getAllByFilter(options).then(res => {
            return ResponseHandler(true, res, 'Se obtuvieron los productos.', 'No se obtuvieron los productos.');
        }).catch( error => {
            return Promise.reject(error);
        }); 
    }

    async getSample(options) {
        return ProductsRepository.getSample(options).then(res => {
            return ResponseHandler(true, res, 'Se obtuvieron los productos.', 'No se obtuvieron los productos.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }
}

module.exports = Object.create(new ProductsService);