const UsersService = require('../services/UsersService');
const jwt = require('jsonwebtoken');
const REQUEST_MAPPING = '/Auth/';
const BCrypt = require('bcrypt');
const SALT = 10;

module.exports.controller = function(app) {

  app.get('/Login', function(req, res) {
    res.render('auth/login');
  });

  app.get('/Registro', function(req, res) {
    // any logic goes here
    res.render('auth/register');
  });

  app.post(`${REQUEST_MAPPING}CreateUser`, function(req, res) {
    if (req.body.name.length < 3)
      return res.sendStatus(400);
    BCrypt.hash(req.body.pass, SALT, function(err, hash) {
      if (err) return new Error('Hubo un error con el cifrado');
      var new_user = { name: req.body.name, lastNames: req.body.lastNames,
        email: req.body.email, address: req.body.address, pass: hash, cp: req.body.cp,
        telephone: req.body.telephone, role: 1 };
      UsersService.add(new_user).then( result => {
        res.status(200).send(result);
      }).catch(error => {
        console.log(error);
        if (error.errmsg.includes('duplicate key')) {
          res.status(200).send({status: 'Error', message: 'El Correo Electronico Ya Existe!'});  
        } else {
          res.sendStatus(500);
        }
      })
    });
  });

  app.post(`${REQUEST_MAPPING}LogIn`, function(req, res) {
    // any logic goes here
    UsersService.getOneByFilter({email: req.body.email}).then( result => {
      if (result.status === 'Success') {
        BCrypt.compare(req.body.pass, result.response.pass, function(_, valid) {
          // Store hash in your password DB.
          if (valid === true) {
            let response = {idUser: result.response._id, expire: 60 * 120};
            // 101 is admin role
            if (result.response.role === '101') {
              response['token'] = jwt.sign({}, process.env.SECRET_KEY, { expiresIn: 60 * 120 });
            }
            res.status(200).send(response);
          } else {
            res.sendStatus(204);
          }
        });
      } else {
        res.sendStatus(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

}