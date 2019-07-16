var mongoose = require('mongoose')
const ModeloPedidos = require('../models/PedidoModel');
const ModeloProductos = require('../models/ProductoModel');

module.exports.controller = function(app) {
  
  app.post('/AgregarPedido', function(req, res) {
    var pedido_nuevo = new ModeloPedidos({ 
        IdCarrito: req.body.IdCarrito,
        IdProducto: req.body.IdProducto,
        Cantidad: req.body.Cantidad,
        PrecioUnitario: req.body.PrecioUnitario,
        Completado: req.body.Completado
    });
    pedido_nuevo.save(function (err, pedido) {
        if (err) return handleError(err);
        // saved!
        ModeloProductos.findById(pedido.IdProducto, function (err, producto) {
            if (err) return console.log(err.errors);
            producto.CantidadDisponible = producto.CantidadDisponible - pedido.Cantidad;
            producto.save(function (err) {
                if (err) return console.log(err.errors);
                console.log('EXITO');
                res.sendStatus(200);
            });
        });
    });
  });

  app.get('/Pedidos/:id', function(req, res) {
    ModeloPedidos.find({IdCarrito: req.params['id']}, function(err, pedidos) {
        if (err) return console.log(err.errors);
        res.writeHead(200, { 'Content-Type': "text/plain" });
        res.end(pedidos.length.toString());
    });
  });

  app.get('/Pedidos', function(req, res) {
    res.render('Pedidos/pedidos');
  });

  app.delete('/EliminarPedido/:id', function(req, res) {
    ModeloPedidos.findById(req.params['id'], function(err, pedido) {
        if (err) return res.status(500).json(err);
        ModeloProductos.findById(pedido.IdProducto, function(errorProducto, producto) {
          if (errorProducto) return res.status(500).json(errorProducto);
          producto.CantidadDisponible = producto.CantidadDisponible + pedido.Cantidad;
          producto.save();
        });
        pedido.remove();
        res.writeHead(200, { 'Content-Type': "text/plain" });
        res.end('PedidoEliminado');
    });
  });

  app.get('/Admin/MostrarPedidos', function(req, res) {
    res.render('Pedidos/admin_pedidos');
  });

  app.get('/ObtenerTodosLosPedidos/:id', function(req, res) {
    ModeloPedidos.find( { IdCarrito: req.params.id }, function(err, pedidos) {
      if (err) return res.status(404).send('No se pudo recuperar los productos');
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify(pedidos));
    });
  });
}