const Slide = require('../entities/slide');
const ProductosService = require('../services/ProductsService');

module.exports.controller = function(app) {
  app.get('/', function(req, res) {
    // any logic goes here
    var slides = [];
    ProductosService.getSample({$sample: {size: 6}}).then(products => {
      products.forEach( product => {
        slides.push(new Slide(products.indexOf(product), product.images[0], product._id, product.description, product.name));
      });
      ProductosService.getSample({$sample: {size: 4}}).then(products => {
        res.render('index', { slides: slides, products: products });
      }, reject => {
        console.error(reject);
        res.render('index', { slides: slides, products: [] });
      });
    }, reject => {
      console.error(reject);
      res.render('index', { slides: slides, products: [] });
    });
  });
}