const Slide = require('../entities/slide');
const ProductosModel = require('../models/ProductoModel');

module.exports.controller = function(app) {
  app.get('/', function(req, res) {
    // any logic goes here
    var lista_productos = [];
    var slides = [];
    ProductosModel.find({}, function (err, productos) {
      if (err) return res.status(500).json(err);
      let len = 4;
      if (productos.length < len)
        len = productos.length;
      for (let x = 0; x < len; x++) {
        while (lista_productos.length <= x) {
          let producto = productos[Math.floor(Math.random() * Math.floor(productos.length))];
          if (!lista_productos.includes(producto))
            lista_productos.push(producto);
        }
        while (slides.length <= x) {
          let producto = productos[Math.floor(Math.random() * Math.floor(productos.length))];
          let slide = new Slide(x, producto.ImagenesProducto.split(',')[0], producto._id, producto.Descripcion, producto.Nombre);
          if (!slides.includes(slide))
            slides.push(slide);
        }
      }
      res.render('index', { slides: slides, lista_productos });
    });
  });
}