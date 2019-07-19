const ProductsService = require('../services/ProductsService');
const OrdersService = require('../services/OrdersService');

const REQUEST_MAPPING = '/Products/';

module.exports.controller = function(app) {

  app.get('/Catalogo', function(req, res) {
    res.render('products/catalog');
  });

  app.get('/AgregarProducto', function(req, res) {
    // any logic goes here
    res.render('products/add');
  });

  app.get('/Admin', function(req, res) {
    // any logic goes here
    res.render('products/admin');
  });

  app.get(`/ModificarProducto/id/:id`, function(req, res) {
    ProductsService.getById(req.params.id).then(product => {
      res.render('products/edit', product);
    }, reject => {
      res.status(reject.status || 404);
      res.render('error', {e: reject});
    });
  });

  app.get(`/Producto/id/:id`, function(req, res) {
    ProductsService.getById(req.params.id).then(product => {
      res.render('products/details', { product });
    }, err => {
      res.render('error', {e: err});
    });
  });

  app.get(`${REQUEST_MAPPING}GetAll`, function(req, res) {
    // any logic goes here
    ProductsService.getAll().then( products => {
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify(products));
    }, reject => {
      console.log('reject xd:' + reject);
      res.writeHead(204, { 'Content-Type': "application/json" });
      res.end();
    });
  });

  app.get(`${REQUEST_MAPPING}Category/:category`, function(req, res) {
    // any logic goes here
    ProductsService.getAllByFilter({category: req.params['category']}).then( products => {
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify(products));
    }, reject => {
      console.log('rkect '+reject);
      res.writeHead(204, { 'Content-Type': "application/json" });
      res.end();
    });
  });

  app.get(`${REQUEST_MAPPING}Search/:name`, function(req, res) {
    // any logic goes here
    ProductsService.getAllByFilter({nameNormalized: { $regex: '.*' + req.params['name'].toLowerCase() + '.*' } }).then( products => {
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify(products));
    }, reject => {
      console.log('tekert '+ reject);
      res.writeHead(204, { 'Content-Type': "application/json" });
      res.end();
    });
    
  });

  app.post(`${REQUEST_MAPPING}Save`, function(req, res) {
    var new_product = { 
        name: req.body.name,
        nameNormalized: req.body.name.toLowerCase(),
        description: req.body.description,
        category: req.body.category,
        state: req.body.state,
        bestSeller: false,
        currentPrice: Number(req.body.currentPrice),
        originalPrice: Number(req.body.originalPrice),
        availableStock: Number(req.body.availableStock),
        aditionalInfo: req.body.aditionalInfo,
        images: req.body.images.split(','),
        FechaPublicacion: new Date().toLocaleDateString().split('/')[1]+'/'+new Date().toLocaleDateString().split('/')[0]
          +'/'+new Date().toLocaleDateString().split('/')[2]
    };
    ProductsService.add(new_product).then( () => {
      console.log('EXItO');
      res.sendStatus(200);
    }, reject => {
      console.log('Fracaso: '+reject);
      res.sendStatus(500);
    });
  });

  app.get(`${REQUEST_MAPPING}id/:id`, function(req, res) {
    ProductsService.getById(req.params.id).then(product => {
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify(product));
      console.log(product);
    }, reject => {
      console.log(reject);
      res.writeHead(204, { 'Content-Type': "application/json" });
      res.end();
    });
	});
	
	app.put(`${REQUEST_MAPPING}Update/:id`, function(req, res) {
    console.log(req.body.images);
    ProductsService.getById(req.params.id).then( product => {
      var bestseller;
      (req.body.bestSeller == 'SI') ? bestseller = true : bestseller = false;
      // quita la ultima coma del ultimo link que se guarda
      product.name = req.body.name;
      product.nameNormalized = req.body.name.toLowerCase();
      product.bestSeller = bestseller;
			product.description = req.body.description;
			product.category = req.body.category;
			product.state = req.body.state;
			product.currentPrice = Number(req.body.currentPrice);
			product.originalPrice = Number(req.body.originalPrice);
			product.availableStock = Number(req.body.avalaibleStock);
			product.aditionalInfo = req.body.aditionalInfo;
      product.images = req.body.images.split(',');
      ProductsService.update(product).then( () => {
        res.sendStatus(200);
      }, reject => {
        console.log(reject);
        res.sendStatus(500);
      });
    }, reject => {
      console.log(reject);
      res.sendStatus(500);
    });
  });

  app.delete(`${REQUEST_MAPPING}Delete/:id`, function(req, res) {
    OrdersService.getAllByIdProduct(req.params['id']).then( () => {
      ProductsService.deleteById(req.params['id']).then( () => {
        res.writeHead(200, { 'Content-Type': "text/plain" });
        res.end('ProductoEliminado');
      }, reject => {
        console.log('reject '+ reject);
        res.writeHead(204, { 'Content-Type': "text/plain" });
        res.end();
      });
      console.log('Tenia pedidos:'+pedidos);
    }, reject => {
      console.log(reject);
      res.writeHead(204, { 'Content-Type': "text/plain" });
      res.end();
    });
  });
}