var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  var msgs = ['Hola', 'Puto', 'El', 'QUE', 'LO', 'LEA'];
  res.render('index', { title: 'Express' , message: 'Hola', msgs});
});

router.get('/Test', e => {
  e.res.send('Hola mundo A La Berga');
});

module.exports = router;
