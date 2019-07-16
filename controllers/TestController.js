var mongoose = require('mongoose')
const modelo = require('../models/test');

module.exports.controller = function(app) {
  app.get('/test', function(req, res) {
    // any logic goes here
    var lista = [];
    modelo.find({}, function (err, tests) {
        // docs.forEach
        tests.forEach( e => {
            lista.push(e.name);
        });
        res.render('test/test', {msg: 'HOLO', lista});
      });
  });

  app.get('/test2', function(req, res) {
    // any logic goes here
    res.render('test/test2');
  });

  app.get('/indice', function(req, res) {
    // any logic goes here
    res.render('index');
  });

  app.post('/test/guardar', function(req, res) {
    var nuevo_test = new modelo({ name: req.body.msg, type: 'Mesnaje' });
    nuevo_test.save(function (err) {
        if (err) return handleError(err);
        // saved!
        console.log('EXITO');
        res.sendStatus(200);
    });
  });
}