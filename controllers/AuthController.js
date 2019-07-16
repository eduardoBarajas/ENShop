const ModeloUsuario = require('../models/UsuarioModel');

module.exports.controller = function(app) {
  app.get('/Login', function(req, res) {
    res.render('Auth/Login');
  });

  app.get('/Registrar', function(req, res) {
    // any logic goes here
    res.render('Auth/Login');
  });

  app.post('/Registrar/Guardar', function(req, res) {
    var nuevo_usuario = new ModeloUsuario({ Nombre: req.body.Nombre, Apellidos: req.body.Apellidos,
        CorreoElectronico: req.body.Correo, Direccion: req.body.Direccion, Localidad: req.body.Localidad,
        Pass: req.body.Pass, CodigoPostal: req.body.CodigoPostal, Telefono: req.body.Telefono, Rol: req.body.Rol });
    nuevo_usuario.save(function (err) {
        if (err) return handleError(err);
        // saved!
        console.log('EXITO');
        res.sendStatus(200);
    });
  });

  app.get('/Login/IniciarSesion', function(req, res) {
    // any logic goes here
    var usuario = null;
    modelo.find({}, function (err, tests) {
        // docs.forEach
        tests.forEach( e => {
            if (e.Nombre.includes(res.Nombre) && e.Pass.includes(res.Pass)) {
                usuario = e;
                res.sendStatus(200);
            }
        });
      });
  });

}