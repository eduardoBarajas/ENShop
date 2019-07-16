var mongoose = require('mongoose')
const ModeloProductos = require('../models/ProductoModel');
const ModeloPedidos = require('../models/PedidoModel');

module.exports.controller = function(app) {
  app.get('/ListaProductos', function(req, res) {
    // any logic goes here
    res.render('productos/lista_productos');
  });

  app.get('/ObtenerProductos', function(req, res) {
    // any logic goes here
    ModeloProductos.find({}, function (err, productos) {
      if (err) return res.status(500).json(err);
      // docs.forEach
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify(productos));
    });
  });

  app.get('/ObtenerProductos/:categoria', function(req, res) {
    // any logic goes here
    ModeloProductos.find({Categoria: req.params['categoria']}, function (err, productos) {
      if (err) return res.status(500).json(err);
      // docs.forEach
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify(productos));
    });
  });

  app.get('/BuscarProductos/:name', function(req, res) {
    // any logic goes here
    var lista_productos = [];
    ModeloProductos.find({}, function (err, productos) {
      if (err) return res.status(500).json(err);
      // docs.forEach
      productos.forEach( producto => {
        if (producto.Nombre.toUpperCase().includes(req.params['name'].toUpperCase()))
          lista_productos.push(producto);
      });
      if (lista_productos.length == 0) {
        res.writeHead(304, { 'Content-Type': "application/json" });
      } else {
        res.writeHead(200, { 'Content-Type': "application/json" });
      }
      res.end(JSON.stringify(lista_productos));
    });
  });

  app.get('/Producto/:id', function(req, res) {
    ModeloProductos.findById(req.params['id'], function(err, producto) {
        if (err) return console.log(err.errors);
        res.render('productos/detalles_producto', { producto }); 
    });
  });

  app.get('/AgregarProducto', function(req, res) {
    // any logic goes here
    res.render('productos/agregar_nuevo_producto');
  });

  app.post('/AgregarProducto/Guardar', function(req, res) {
    var fecha_actual = new Date();
    var imagenes = '';
    req.body.Imagenes.split(',').forEach( imagen => {
      if (imagen != '')
        if (!imagen.includes('?alt=media'))
          imagenes += imagen+'?alt=media,';
    });
    imagenes = imagenes.substring(0, imagenes.length - 1);
    var nuevo_producto = new ModeloProductos({ 
        Nombre: req.body.Nombre,
        Descripcion: req.body.Descripcion,
        Categoria: req.body.Categoria,
        Estado: req.body.Estado,
        BestSeller: false,
        PrecioActual: Number(req.body.PrecioActual),
        PrecioOriginal: Number(req.body.PrecioOriginal),
        CantidadDisponible: Number(req.body.CantidadDisponible),
        InformacionAdicional: req.body.InformacionAdicional,
        ImagenesProducto: imagenes,
        FechaPublicacion: fecha_actual.toLocaleDateString().split('/')[1]+'/'+fecha_actual.toLocaleDateString().split('/')[0]
          +'/'+fecha_actual.toLocaleDateString().split('/')[2]
    });
    nuevo_producto.save(function (err) {
        if (err) return handleError(err);
        // saved!
        console.log('EXITO');
        res.sendStatus(200);
    });
  });

  app.get('/Admin', function(req, res) {
    // any logic goes here
    res.render('productos/admin_productos');
  });

  app.get('/ObtenerTodosLosProductos', function(req, res) {
    var lista_productos = [];
    ModeloProductos.find({}, function (err, productos) {
      // docs.forEach
      productos.forEach( e => {
          lista_productos.push(e);
      });
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify(lista_productos));
    });
  });

  app.get('/ModificarProducto/:id', function(req, res) {
    ModeloProductos.findById(req.params.id, function(err, producto) {
      res.render('productos/modificar_producto', producto);
    });
  });

  app.get('/ObtenerProductoPorID/:id', function(req, res) {
    ModeloProductos.findById(req.params.id, function(err, producto) {
      console.log(producto);
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify(producto));
    });
	});
	
	app.put('/ActualizarProducto/:id', function(req, res) {
		ModeloProductos.findById(req.params.id, function(err, producto) {
      var bestseller;
      (req.body.BestSeller == 'SI') ? bestseller = true : bestseller = false;
			var imagenes = '';
			req.body.Imagenes.split(',').forEach( imagen => {
        if (imagen != '')
          // si no tienen la parte de alt=media no se pueden visualizar por lo que se agrega a las nuevas imagenes
          // las que ya estan en la base de datos no lo necesitan
          (imagen.includes('?alt=media')) ? imagenes += imagen+',' : imagenes += imagen+'?alt=media,';
      });
      // quita la ultima coma del ultimo link que se guarda
			imagenes = imagenes.substring(0, imagenes.length - 1);
      producto.Nombre = req.body.Nombre;
      producto.BestSeller = bestseller;
			producto.Descripcion = req.body.Descripcion;
			producto.Categoria = req.body.Categoria;
			producto.Estado = req.body.Estado;
			producto.PrecioActual = Number(req.body.PrecioActual);
			producto.PrecioOriginal = Number(req.body.PrecioOriginal);
			producto.CantidadDisponible = Number(req.body.CantidadDisponible);
			producto.InformacionAdicional = req.body.InformacionAdicional;
			producto.ImagenesProducto = imagenes;
			ModeloProductos.findByIdAndUpdate(producto._id, producto, function(err, response) {
				if (err) {
					return res.status(500).json(err);
				}
				res.sendStatus(200);
			});
    });
  });
  app.delete('/EliminarProducto/:id', function(req, res) {
    ModeloProductos.findById(req.params['id'], function(err, producto) {
        if (err) return res.status(500).json(err);
        let its_safe_to_delete = true;
        ModeloPedidos.find({IdProducto: producto._id}, function(errorPedido, pedidos) {
          if (errorPedido) return res.status(500).json(errorPedido);
          if (pedidos.length > 0) {
            its_safe_to_delete = false;
          }
          if (its_safe_to_delete) {
            producto.remove();
            res.writeHead(200, { 'Content-Type': "text/plain" });
            res.end('ProductoEliminado');
          } else {
            res.writeHead(200, { 'Content-Type': "text/plain" });
            res.end('ProductoNoEliminado');
          }
        });
    });
  });
}