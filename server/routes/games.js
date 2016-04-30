var express = require('express');
var router = express.Router();

/* Processing GET requests */
/* GET games listing. */
router.get('/', function(req, res, next) {
  var response ={
    games: [
        {  game_id:'game1', game_name: 'Thrones of mysteries' } ,
        {  game_id:'game2', game_name: 'The Kingdom of Doom' } ,
        {  game_id:'game3', game_name: 'Chess and Cheese' } ,
    ] }
//  res.send('GET /GAMES   respond with a resource');
  res.send(response);
});

/* GET Game users listing. */
router.get('/users/:gameId/:gameClass', function(req, res, next) {
  // try: http://127.0.0.1:3000/games/users/id333/WarGame  [2 parameters]

  var game_id = req.params.gameId;
  var game_Class = req.params.gameClass;
  var response ={
      gameId: game_id,
      Class: game_Class,
      users: [
        {usr_id:'usr1', usr_name: 'John Doe' },
        {usr_id:'usr4', usr_name: 'Markus Mc Knee' },
      ]
    }
  console.log('the path:  ' + req.url );
  //res.send('GET /GAMES/USERS   respond with a resource');
  res.end(JSON.stringify(response));
});


/* GET with variable URL within a pattern; response url's:  "us*s" == users, usuarios, usos*/
router.get('/us*s', function(req, res, next) {
  var response ={
      url:  req.url,
      data: 'Data for this URL : ' + req.url ,
      }
  console.log('the path:  ' + req.url );
  //res.send('GET /GAMES/USERS   respond with a resource');
  res.end(JSON.stringify(response));
});


  // Procesing POST requests!

 // necesita var bodyParser = require('body-parser');
 //var urlencodedParser = bodyParser.urlencoded({ extended: false })

	router.post('/process_post', function (req, res) {
	// Prepare output in JSON format
	response = {
		POST_first_name:req.body.first_name,
		POST_last_name:req.body.last_name
	};
	console.log(response);
	res.end(JSON.stringify(response));
	})


module.exports = router;
