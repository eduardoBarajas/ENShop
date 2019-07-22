const ProductsService = require('../services/ProductsService');
const OrdersService = require('../services/OrdersService');

const REQUEST_MAPPING = '/Products/';

module.exports.controller = function(app) {

  // Views Endpoints

  app.get('/Catalogo', function(req, res) {
    res.render('products/catalog');
  });

  app.get('/AgregarProducto', function(req, res) {
    // any logic goes here
    res.render('products/add');
  });

  app.get('/Admin/Catalogo', function(req, res) {
    // any logic goes here
    res.render('products/admin');
  });

  app.get(`/ModificarProducto/id/:id`, function(req, res) {
    ProductsService.getById(req.params.id).then(result => {
      if (result.status === 'Success') {
        res.render('products/edit', {product: JSON.stringify(result)});
      } else {
        res.render('error', {e: new Error(result.message)});
      }
    }).catch(error => {
      res.render('error', {e: error});
    });
  });

  app.get(`/Producto/id/:id`, function(req, res) {
    ProductsService.getById(req.params.id).then(result => {
      if (result.status === 'Success') {
        res.render('products/details', { product: result.response });
      } else {
        res.render('error', {e: new Error(result.message)});
      }
    }, err => {
      res.render('error', {e: err});
    });
  });

  // Data Endpoints

  app.get(`${REQUEST_MAPPING}GetAll`, function(req, res) {
    // any logic goes here
    ProductsService.getAll().then( result => {
      if (result.status === 'Success') {
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.end(JSON.stringify(result));
      } else {
        res.writeHead(204, { 'Content-Type': "application/json" });
        res.end();
      }
    }).catch( error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  app.get(`${REQUEST_MAPPING}Category/:category`, function(req, res) {
    // any logic goes here
    ProductsService.getAllByFilter({category: req.params['category']}).then( result => {
      if (result.status === 'Success') {
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.end(JSON.stringify(result));
      } else {
        res.writeHead(204, { 'Content-Type': "application/json" });
        res.end();
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  app.get(`${REQUEST_MAPPING}Search/:name`, function(req, res) {
    // any logic goes here
    ProductsService.getAllByFilter({nameNormalized: { $regex: '.*' + req.params['name'].toLowerCase() + '.*' } }).then( result => {
      res.writeHead(200, { 'Content-Type': "application/json" });
      res.end(JSON.stringify(result));
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
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
        publishDate: new Date().toLocaleDateString().split('/')[1]+'/'+new Date().toLocaleDateString().split('/')[0]
          +'/'+new Date().toLocaleDateString().split('/')[2]
    };
    ProductsService.add(new_product).then( result => {
      if (result.status === 'Success') {
        console.log('EXItO');
        res.sendStatus(200);
      } else {
        console.log('estaba mal');
        res.sendStatus(204);
      }
    }).catch( error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  app.get(`${REQUEST_MAPPING}id/:id`, function(req, res) {
    ProductsService.getById(req.params.id).then(result => {
      if (result.status === 'Success') {
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.end(JSON.stringify(result.response));
      } else {
        res.sendStatus(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
	});
	
	app.put(`${REQUEST_MAPPING}Update/:id`, function(req, res) {
    console.log(req.body.images);
    ProductsService.getById(req.params.id).then( result => {
      if (result.status === 'Success') {
        (req.body.bestSeller == 'SI') ? result.response.bestSeller = true : result.response.bestSeller = false;
        // quita la ultima coma del ultimo link que se guarda
        result.response.name = req.body.name;
        result.response.nameNormalized = req.body.name.toLowerCase();
        result.response.description = req.body.description;
        result.response.category = req.body.category;
        result.response.state = req.body.state;
        result.response.currentPrice = Number(req.body.currentPrice);
        result.response.originalPrice = Number(req.body.originalPrice);
        result.response.availableStock = Number(req.body.avalaibleStock);
        result.response.aditionalInfo = req.body.aditionalInfo;
        result.response.images = req.body.images.split(',');
        ProductsService.update(result.response).then( result => {
          if (result.status === 'Success') {
            res.sendStatus(200);
          } else {
            res.sendStatus(204);
          }
        }).catch(error => {
          console.log(error);
          res.sendStatus(500);
        });  
      } else {
        res.sendStatus(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  app.delete(`${REQUEST_MAPPING}Delete/:id`, function(req, res) {
    OrdersService.getAllByIdProduct(req.params['id']).then( result => {
      if (result.status === 'NotFound') {
        ProductsService.deleteById(req.params['id']).then( result => {
          if (result.status === 'Success') {
            res.sendStatus(200);
          } else {
            res.sendStatus(204);
          }
        }).catch(error => {
          console.log(error);
          res.sendStatus(500);
        });
      } else {
        res.sendStatus(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });
}