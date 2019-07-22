const UUID = require('uuid-js');
const ProductsService = require('../services/ProductsService');
const OrdersService = require('../services/OrdersService');
const CartsService = require('../services/CartsService');
const REQUEST_MAPPING = '/Carts/';

module.exports.controller = function(app) {
  
  // Views Endpoints

  app.get('/Carrito', function(req, res) {
    res.render('carts/cart');
  });

  app.get('/Pago', function(req, res) {
    res.render('carts/checkout');
  });

  app.get('/Admin/Carritos', function(req, res) {
    res.render('carts/admin_list');
  });

  // Data Endpoints

  app.get(`${REQUEST_MAPPING}Generate`, function(req, res) {
    generateCartId().then( result => {
      res.writeHead(200);
      res.end(JSON.stringify(result));
    }).catch(error => {
      res.sendStatus(500);
      console.log(error);
    });
  });

  app.post(`${REQUEST_MAPPING}Save`, function(req, res) {
    var currentDate = new Date();
    console.log(req.body.id);
    var new_cart = { 
      _id: req.body.id,
      idUser: req.body.idUser,
      completed: false,
      sent: true,
      name: req.body.name,
      lastNames: req.body.lastNames,
      email: req.body.email,
      address: req.body.address,
      address2: req.body.address2,
      cp: parseInt(req.body.cp),
      delivered: false,
      payed: false,
      promoCode: UUID.create().toString().split('-')[1],
      creationDate: currentDate.toLocaleDateString().split('/')[1]+'/'+currentDate.toLocaleDateString().split('/')[0]
      +'/'+currentDate.toLocaleDateString().split('/')[2]
    };
    CartsService.add(new_cart).then( result => {
      if (result.status === 'Success') {
        res.sendStatus(200);
      } else {
        res.sendStatus(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  app.get(`${REQUEST_MAPPING}idCart/:idCart`, function(req, res) {
    OrdersService.getAllByFilter({idCart: req.params['idCart']}).then( result => {
      if (result.status === 'Success') {
        res.writeHead(200, { 'Content-Type': "text/plain" });
        res.end(result.response.length.toString());
      } else {
        res.sendStatus(204);
      } 
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  app.get(`${REQUEST_MAPPING}GetOrders/Cart/:idCart`, function(req, res) {
    OrdersService.getAllByFilter({ idCart: req.params.idCart }).then( ordersResult => {
      if (ordersResult.status === 'Success') {
        order_list = [];
        ordersResult.response.forEach( order => {
          ProductsService.getById(order.idProduct).then(productResult => {
            if (productResult.status === 'Success') {
              order_list.push({'product': productResult.response, 'id_order': order._id});
              if (order_list.length === ordersResult.response.length) {
                res.writeHead(200, { 'Content-Type': "application/json" });
                res.end(JSON.stringify(order_list));
              }
            } 
          }).catch(error => {
            console.log(error);
          });
        });
      } else {
        res.sendStatus(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  app.get(`${REQUEST_MAPPING}GetAll`, function(req, res) {
    CartsService.getAll().then( cartsResult => {
      if (cartsResult.status === 'Success') {
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.end(JSON.stringify(cartsResult.response));
      } else {
        res.sendStatus(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  app.get(`${REQUEST_MAPPING}GetAll/User/:id`, function(req, res) {
    CartsService.getAllByFilter({idUser: req.params.id}).then( cartsResult => {
      if (cartsResult.status === 'Success') {
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.end(JSON.stringify(cartsResult.response));
      } else {
        res.sendStatus(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  app.get(`${REQUEST_MAPPING}id/:id`, function(req, res) {
    CartsService.getById(req.params['id']).then( cartsResult => {
      if (cartsResult.status === 'Success') {
        console.log(cartsResult);
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.end(JSON.stringify(cartsResult.response));
      } else {
        res.sendStatus(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  app.get(`${REQUEST_MAPPING}Admin/Clean`, function(req, res) {
    CartsService.getAllByFilter({sent: false}).then( cartsResult => {
      if (cartsResult.status === 'Success') {
        cartsResult.response.forEach( cart => {
          OrdersService.getAllByFilter({idCart: cart._id}).then( ordersResult => {
            if (ordersResult.status === 'Success') {
              ordersResult.response.forEach(order => {
                ProductsService.getById(order.idProduct).then( productResult => {
                  if (productResult.status === 'Success') {
                    productResult.response.availableStock = productResult.response.availableStock + order.quantity;
                    ProductsService.update(productResult.response).then( result => {
                      if (result.status !== 'Success') {
                        console.log('error');
                      }
                    }).catch(error => {
                      console.log(error);
                      res.sendStatus(500);
                    });
                  } else {
                    console.log('error 204');
                  }
                }).catch(error => {
                  console.log(error);
                  res.sendStatus(500);
                });
                OrdersService.deleteById(order._id).then( deleteResult => {
                  if (deleteResult.status !== 'Success') {
                    console.log('error 204');
                  }
                }).catch(error => {
                  console.log(error);
                  res.sendStatus(500);
                });
                if (orders.indexOf(order) === orders.length) {
                  res.writeHead(200, { 'Content-Type': "application/json" });
                  res.end();
                }
              });
            } else {
              console.log('No tenia pedidos 200');
            }
          }).catch(error => {
            console.log(error);
            res.sendStatus(500);
          });
        });
      } else {
        res.sendStatus(200);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  app.delete(`${REQUEST_MAPPING}Delete/:id`, function(req, res) {
    OrdersService.getAllByFilter({idCart: req.params['id']}).then( ordersResult => {
      if (ordersResult.status === 'Success') {
        ordersResult.response.forEach( order => {
          ProductsService.getById(order.idProduct).then(productResult => {
            productResult.response.availableStock = productResult.response.availableStock + order.quantity;
            ProductsService.update(productResult.response).then( result => {
              if (result.status !== 'Success') {
                console.log('error');
                res.sendStatus(204);
              }
            }).catch(error => {
              console.log(error);
              res.sendStatus(500);
            });
          }).catch(error => {
            console.log(error);
            res.sendStatus(500);
          });
          OrdersService.deleteById(order._id).then( deleteResult => {
            if (deleteResult.status !== 'Success') {
              console.log('pedido error');
              res.sendStatus(204);
            }
          }).catch(error => {
            console.log(error);
            res.sendStatus(500);
          });
        });
        CartsService.deleteById(req.params['id']).then( deleteResult => {
          if (deleteResult.status === 'Success') {
            console.log('SE ELIMINO');
            res.writeHead(200, { 'Content-Type': "application/json" });
            res.end();
          } else {
            console.log('error');
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

  app.put(`${REQUEST_MAPPING}Update/:id`, function(req, res) {
    CartsService.getById(req.params.id).then( cartResult => {
      if (cartResult.status === 'Success') {
        switch (req.body.state) {
          case 'PAGADO': cartResult.response.payed = true;break;
          case 'ENVIADO': cartResult.response.delivered = true;break;
          case 'COMPLETADO': cartResult.response.completed = true;break;
        }
        CartsService.update(cartResult.response).then( updateResult => {
          if (updateResult.status === 'Success') {
            console.log('EXITO');
            res.writeHead(200, { 'Content-Type': "application/json" });
            res.end(JSON.stringify(updateResult.response));
          } else {
            res.sendStatus(204);
            console.log('error');
          }
        }).catch(error => {
          console.log(error);
          res.sendStatus(500);
        });
      } else {
        console.log('error');
        res.send(204);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  async function generateCartId() {
    for (let x = 0; x < 10; x++) {
      let id = UUID.create().toString().split('-')[0];
      const result = await CartsService.exists(id);
      if (result.status === 'NotFound') {
        result.response = id;
        return result;
      }
    }
    return {status: 'Error', message: 'No se pudo generar el id del carrito.', response: null};
  }
}