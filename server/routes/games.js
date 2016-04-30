var express = require('express');
var router = express.Router();

/* GET games listing. */
router.get('/', function(req, res, next) {
  res.send('GET /GAMES   respond with a resource');
});

/* GET Game users listing. */
router.get('/users', function(req, res, next) {
  res.send('GET /GAMES/USERS   respond with a resource');
});

module.exports = router;
