var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('test', { title: 'Express in Action' });
});

/* GET another page. */
router.get('/another', function(req, res, next) {
  res.render('test2', { title: 'Another Page in Action', author: ' WebMaster KpaxServer2' });
});

module.exports = router;
