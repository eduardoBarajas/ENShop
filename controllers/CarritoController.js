var mongoose = require('mongoose')
var UUID = require('uuid-js');
const ModeloCarritos = require('../models/CarritoModel');
const ModeloPedidos = require('../models/OrderModel');
const ModeloProductos = require('../models/ProductModel');

module.exports.controller = function(app) {
  
  app.get('/CrearCarritto', function(req, res) {
    var uuid4 = UUID.create();
    console.log('EXITO IDCarrito: '+uuid4.toString().split('-')[0]);
    res.writeHead(200, { 'Content-Type': "text/plain" });
    res.end(uuid4.toString().split('-')[0]);
  });

  app.post('/GuardarCarrito', function(req, res) {
    var fecha_actual = new Date();
    console.log(req.body.id,);
    var carrito_nuevo = new ModeloCarritos({ 
      _id: req.body.id,
      Completado: false,
      Nombre: req.body.Nombre,
      Apellido: req.body.Apellido,
      Correo: req.body.Correo,
      Direccion: req.body.Direccion,
      Direccion2: req.body.Direccion2,
      CP: parseInt(req.body.CP),
      Enviado: false,
      Pagado: true,
      CodigoPromo: UUID.create().toString().split('-')[1],
      FechaCreado: fecha_actual.toLocaleDateString().split('/')[1]+'/'+fecha_actual.toLocaleDateString().split('/')[0]
      +'/'+fecha_actual.toLocaleDateString().split('/')[2]
    });
    carrito_nuevo.save(function (err, carrito) {
        if (err) return res.status(500).json(err);
        // saved!
        console.log('EXITO');
        res.writeHead(200, { 'Content-Type': "text/plain" });
        res.end('Exito');
    });
  });

  app.get('/Carrito', function(req, res) {
    res.render('Pedidos/carrito');
  });

  app.get('/Pago', function(req, res) {
    res.render('Pedidos/checkout');
  });

  app.get('/ObtenerCarrito/:id', function(req, res) {
    ModeloPedidos.find( { IdCarrito: req.params.id }, function(err, pedidos) {
      if (err == null && pedidos.length == 0) {
        res.status(404).send('No se pudo recuperar los productos');
        return;
      }
      var lista_pedidos = [];
      pedidos.forEach( pedido => {
          ModeloProductos.findById(pedido.IdProducto, function(err, producto) {
            if (err && null && pedidos.length == 0) {
              res.statusMessage = "No se pudo recuperar los productos";
              res.status(404).end();
              return;
            };
              lista_pedidos.push({'producto': producto, 'id_pedido': pedido._id});
              if (lista_pedidos.length == pedidos.length) {
                  console.log('EXITO');
                  res.writeHead(200, { 'Content-Type': "application/json" });
                  res.end(JSON.stringify(lista_pedidos));
              }
          });
      });
    });
  });

  app.get('/ObtenerCarritos', function(req, res) {
    ModeloCarritos.find({}, function(err, carritos) {
      if (err || carritos.length == 0) return res.status(404).json(err);
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify(carritos));
    });
  });

  app.get('/ObtenerCarritoInfo/:id', function(req, res) {
    ModeloCarritos.findById(req.params['id'], function(err, carrito) {
      if (err) return res.status(404).json(err);
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify(carrito));
    });
  });

  app.get('/Admin/LimpiarPedidos', function(req, res) {
    let ids_carritos = [];
    ModeloCarritos.find({}, function(errorCarritos, carritos) {
      if (errorCarritos) return res.status(500).json(errorCarritos);
      carritos.forEach( carrito => {
        ids_carritos.push(carrito._id);
      });
      ModeloPedidos.find({}, function(errorPedido, pedidos) {
        if (errorPedido) return res.status(500).json(errorPedido);
        pedidos.forEach( pedido => {
          if (!ids_carritos.includes(pedido.IdCarrito)) {
            ModeloProductos.findById(pedido.IdProducto, function(errorProducto, producto) {
              if (errorProducto) return res.status(500).json(errorProducto);
              producto.CantidadDisponible = producto.CantidadDisponible + pedido.Cantidad;
              producto.save();
            });
            pedido.remove();
          }
        });
      });
    });
    res.writeHead(200, { 'Content-Type': "application/json" });
    res.end('FIN');
  });

  app.delete('/EliminarCarrito/:id', function(req, res) {
    ModeloCarritos.findById(req.params['id'], function(errorCarrito, carrito) {
      if (errorCarrito) return res.status(500).json(errorCarrito);
      ModeloPedidos.find({}, function(errorPedido, pedidos) {
        if (errorPedido) return res.status(500).json(errorPedido);
        pedidos.forEach( pedido => {
          if (pedido.IdCarrito == carrito._id) {
            ModeloProductos.findById(pedido.IdProducto, function(errorProducto, producto) {
              if (errorProducto) return res.status(500).json(errorProducto);
              producto.CantidadDisponible = producto.CantidadDisponible + pedido.Cantidad;
              producto.save();
            });
            pedido.remove();
          }
        });
        carrito.remove();
        console.log('EXITO');
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.end(JSON.stringify(carrito));
      });
    });
  });

  app.put('/ActualizarCarrito/:id', function(req, res) {
		ModeloCarritos.findById(req.params.id, function(err, carrito) {
      switch (req.body.state) {
        case 'PAGADO': carrito.Pagado = true;break;
        case 'ENVIADO': carrito.Enviado = true;break;
        case 'COMPLETADO': carrito.Completado = true;break;
      }
      carrito.save();
      console.log('EXITO');
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify(carrito));
    });
  });
}