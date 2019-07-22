const ModeloUsuario = require('../models/UserModel');

module.exports.controller = function(app) {
  app.get('/Login', function(req, res) {
    res.render('Auth/Login');
  });

  app.get('/Registrar', function(req, res) {
    // any logic goes here
    res.render('Auth/Login');
  });
  
}