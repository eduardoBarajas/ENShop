const Slide = require('../entities/slide');
const ProductosService = require('../services/ProductsService');

module.exports.controller = function(app) {
  app.get('/', function(req, res) {
    // any logic goes here
    var slides = [];
    var animationsSpeeds = ['faster', 'fast', 'slow', 'slower', 'slower', 'slow', 'fast', 'faster'];
    ProductosService.getSample({$sample: {size: 6}}).then(result => {
      if (result.status === 'Success') {
        result.response.forEach( product => {
          slides.push(new Slide(result.response.indexOf(product), product.images[0], product._id, product.description, product.name));
        });
        ProductosService.getSample({$sample: {size: 8}}).then(result => {
          if (result.status === 'Success') {
            res.render('index', { slides: slides, products: result.response , animationsSpeeds});
          } else {
            res.render('index', { slides: slides, products: [] });
          }
        }).catch(error => {
          console.error(error);
          res.render('index', { slides: slides, products: [] });
        });
      } else {
        res.render('index', { slides: slides, products: [] });
      }
    }).catch(error => {
      console.error(error);
      res.render('index', { slides: slides, products: [] });
    });
  });
}