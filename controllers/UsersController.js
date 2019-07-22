const UsersService = require('../services/UsersService');
const REQUEST_MAPPING = '/Users/';

module.exports.controller = function(app) {
  app.get('/Login', function(req, res) {
    res.render('Auth/Login');
  });

  app.get('/Registrar', function(req, res) {
    // any logic goes here
    res.render('Auth/Login');
  });
  
  app.get(`${REQUEST_MAPPING}id/:id`, function(req, res) {
    UsersService.getById(req.params.id).then( result => {
      if (result.status === 'Success') {
        res.status(200).send(JSON.stringify(result.response));
      } else {
        res.sendStatus(204);
      }
    }).catch( error => {
      console.log(error);
      res.sendStatus(500);
    });
  });
}