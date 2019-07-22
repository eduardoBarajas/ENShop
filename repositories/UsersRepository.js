const UserModel = require('../models/UserModel');

class UsersRepository {
    async add(user) {
        return new UserModel(user).save();
      }
    
      async deleteById(idUser) {
        return UserModel.findByIdAndRemove(idUser).exec();
      }
    
      async update(user) {
        return UserModel.findByIdAndUpdate(user._id, user).exec();
      }
    
      async getAll() {
        return UserModel.find({}).exec();
      }
    
      async getById(idUser) {
        return UserModel.findById(idUser).exec();
      }
    
      async getAllByFilter(options) {
        return UserModel.find(options).exec();
      }

      async getOneByFilter(options) {
        return UserModel.findOne(options).exec();
      }
         
      async getSample(options) {
        return UserModel.aggregate([options]).exec();
      }
}

module.exports = Object.create(new UsersRepository);