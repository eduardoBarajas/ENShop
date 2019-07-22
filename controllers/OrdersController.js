const ProductsService = require('../services/ProductsService');
const OrdersService = require('../services/OrdersService');

const REQUEST_MAPPING = '/Orders/';

module.exports.controller = function(app) {

  // Views Endpoints

  app.get('/Pedidos', function(req, res) {
    res.render('orders/list');
  });

  app.get('/Pedidos/id/:id', function(req, res) {
    res.render('orders/details', {id: req.params.id});
  });

  // Data Endpoints
  
  app.post(`${REQUEST_MAPPING}Save`, function(req, res) {
    var new_order = { 
        idCart: req.body.idCart,
        idProduct: req.body.idProduct,
        quantity: req.body.quantity,
        unitaryPrice: req.body.unitaryPrice,
        completed: req.body.completed
    };
    OrdersService.add(new_order).then( resultOrder => {
      if (resultOrder.status === 'Success') {
        ProductsService.getById(resultOrder.response.idProduct).then( resultProduct => {
          resultProduct.response.availableStock = resultProduct.response.availableStock - resultOrder.response.quantity;
          ProductsService.update(resultProduct.response).then( result => {
            if (result.status === 'Success') {
              console.log('EXITO');
              res.sendStatus(200);
            } else {
              console.log('NO EXITO');
              res.sendStatus(204);
            }
          }).catch(error => {
            console.log(error);
            res.sendStatus(500);
          });
        }).catch(error => {
          console.log(error);
          OrdersService.delete(resultOrder.response._id).then( () => {
            res.sendStatus(500);
          }).catch(error => {
            console.log(error);
            res.sendStatus(500);
          });
        });
      } else {
        console.log('NO EXITO');
        res.sendStatus(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  app.delete(`${REQUEST_MAPPING}Delete/:id`, function(req, res) {
    OrdersService.getById(req.params['id']).then(orderResult => {
      if (orderResult.status === 'Success') {
        ProductsService.getById(orderResult.response.idProduct).then(productResult => {
          if (productResult.status === 'Success') {
            productResult.response.availableStock = productResult.response.availableStock + orderResult.response.quantity;
            ProductsService.update(productResult.response).then( result => {
              if (result.status === 'Success') {
                console.log('extiooo');
                OrdersService.deleteById(req.params['id']).then( deleteResult => {
                  if (deleteResult.status === 'Success') {
                    res.sendStatus(200);
                  } else {
                    res.sendStatus(204);
                  }
                }).catch(error => {
                  console.log(error);
                  res.sendStatus(500);
                })
              } else {
                console.log('fallo');
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
      } else {
        console.log('fallo');
        res.sendStatus(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  app.get(`${REQUEST_MAPPING}All/idCart/:id`, function(req, res) {
    OrdersService.getAllByFilter({ idCart: req.params.id }).then(ordersResult => {
      if (ordersResult.status === 'Success') {
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.end(JSON.stringify(ordersResult.response));
      } else {
        res.sendStatus(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });
  
  app.get(`${REQUEST_MAPPING}id/:id`, function(req, res) {
    OrdersService.getById(req.params.id).then(ordersResult => {
      if (ordersResult.status === 'Success') {
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.end(JSON.stringify(ordersResult.response));
      } else {
        res.sendStatus(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });
}