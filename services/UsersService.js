const UsersRepository = require('../repositories/UsersRepository');
const ResponseHandler = require('../helpers/ResponseHandler');

class UsersService {
    async add(user) {
        return UsersRepository.add(user).then(res => {
            return ResponseHandler(false, res, 'Se agrego el usuario.', 'No se almaceno el usuario.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async deleteById(idUser) {
        if (mongodb.ObjectID.isValid(idUser)) {
            return UsersRepository.deleteById(idUser).then(res => {
                return ResponseHandler(false, res, 'Se elimino el usuario.', 'No se elimino el usuario.');
            }).catch( error => {
                return Promise.reject(error);
            });  
        } else {
            return Promise.reject(new Error('El id no es valido!.'));
        }
    }

    async update(user) {
        return UsersRepository.update(user).then(res => {
            return ResponseHandler(false, res, 'Se modifico el usuario.', 'No se modifico el usuario.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async getAll() {
        return UsersRepository.getAll().then(res => {
            return ResponseHandler(true, res, 'Se obtuvieron los usuarios.', 'No se obtuvieron los usuarios.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }

    async getById(idUser) {
        if (mongodb.ObjectID.isValid(idUser)) {
            return UsersRepository.getById(idUser).then(res => {
                return ResponseHandler(false, res, 'Se encontro el usuario.', 'No se encontro el usuario.');
            }).catch( error => {
                return Promise.reject(error);
            });
        } else {
            return Promise.reject(new Error('El id no es valido!.'));
        }
    }

    async getAllByFilter(options) {
        return UsersRepository.getAllByFilter(options).then(res => {
            return ResponseHandler(true, res, 'Se obtuvieron los usuarios.', 'No se obtuvieron los usuarios.');
        }).catch( error => {
            return Promise.reject(error);
        }); 
    }

    async getOneByFilter(options) {
        return UsersRepository.getOneByFilter(options).then(res => {
            return ResponseHandler(false, res, 'Se obtuvo el usuario.', 'No se obtuvo el usuario.');
        }).catch( error => {
            return Promise.reject(error);
        }); 
    }

    async getSample(options) {
        return UsersRepository.getSample(options).then(res => {
            return ResponseHandler(true, res, 'Se obtuvieron los usuarios.', 'No se obtuvieron los usuarios.');
        }).catch( error => {
            return Promise.reject(error);
        });
    }
}

module.exports = Object.create(new UsersService);