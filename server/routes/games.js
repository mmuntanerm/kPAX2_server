var express = require('express');
var router = express.Router();
var {ObjectId} = require('mongodb'); //like ObjectId=require('mongodb').ObjectId;

/**
 * Add a new game
 */
router.post('/', function (req, res) {

	// check parameters
	if (!req.body.name || !req.body.owner_id) {
		// 400 - bad request
		res.status(400).send('Bad parameters')
	}

	// find game
	req.db.collection('games').findOne(
		{ name: req.body.name },
		function (err, doc) {

			// if error, return
			if (err) {
				// 500
				return res.status(500).send(err.message)
			}
			// if found, error
			else if (doc) {
				// 400 - conflict
				return res.status(409).send('game ' + req.body.name  + 'already exists')
			}

			var now = new Date()

			// create new game - only a few of fields
			var game = {
				name: req.body.name,
				owner: req.body.owner_id,
				status: 0,
				nlikes: 0,
				created_at: now,
				updated_at: now
			}

			// create game
			req.db.collection('games').insert(
				game,
				function (err, doc) {
					// if error, return
					if (err) {
						// 500
						return res.status(500).send(err.message)
					}

					res.jsonp(game)
				}
			)
		}
	) // find one
})

/**
 * list games
 * No parameters needed
 * endpoint: 	/games/list
 */
router.get('/list', function(req, res, next) {
	// find game
	req.db.collection('games').find(
		{},
		function (err, cursor) {

			// check error
			if (err) {
				return res.status(500).send(err.message)
			}

			var games = []

			// walk cursor
			cursor.each(function (err, doc) {

				// end
				if (doc == null) {
					return res.jsonp(games)
				}

				games.push(doc)
			})
		}
	)
})

/**
 * list ONE game (by Id of the Game)
 */
router.get('/:game_id', function(req, res, next) {
	var gameId = req.params.game_id;
	console.log(gameId);
	// find game
	req.db.collection('games').find(
	//		{"_id" : gameId},
	//		{"_id" : new BSON.ObjectID(gameId)},
		{"_id" : new ObjectId(gameId)},

		function (err, cursor) {

			// check error
			if (err) {
				return res.status(500).send(err.message)
			}

			var games = []

			// walk cursor
			cursor.each(function (err, doc) {

				// end
				if (doc == null) {
					return res.jsonp(games)
				}

				games.push(doc)
			})
		}
	)
})


/**
 * PUT
 * parameter:  name  (game name)
 * 
 */
router.put('/like', function (req, res) {

	// check parameters
	if (!req.body.name) {
		// 400 - bad request
		console.log('** No Parameters. Game name required');
		return res.status(400).send('Bad parameters. Game name required ')

	}

	// find game
	req.db.collection('games').findOne(
		{ name: req.body.name },
		function (err, doc) {

			// if error, return
			if (err) {
				// 500
				return res.status(500).send(err.message); 
			}
			// if NOT found, update
			else if (!doc) {
				// Game not Found
				return res.status(404).send('game ' + req.body.name  + 'NOT exists')
			}

			else {
			// game found -- UPdate nlikes +1
			req.db.collection('games').update(
				//update_filter,
				{'name': req.body.name },{$inc:{'nlikes': +1}}, true, true,
				function (err, doc) {
					// if error, return
					if (err) {
						// 500
						return res.status(500).send(err.message)
					}
					// Nothing Here
				}
			)  // update end



			res.jsonp(doc); // put ENDs ; sends a response needed to END the Update.  Response with a record updated info
			console.log(doc)

			}
			

		}
	) // find one
})











/**
 * POST - Plus completion user info   modified on 2016-05-31 !
 * 	Parameters: User_id , Game_id 
 *  nlike ++ 
 *	additional info of user and date of 'like' added
 */


router.post('/like', function (req, res) {

	// check parameters
	if (!req.body.game_id || !req.body.user_id) {
		// 400 - bad request
		console.log('** No Parameters. Game name required');
		return res.status(400).send('Bad parameters. Game name required ')

	}


	var gameId = req.body.game_id;
	var userId = req.body.user_id;

	// find game
	req.db.collection('games').findOne(
		{"_id" : new ObjectId(gameId)},
		
		function (err, doc) {

			// if error, return
			if (err) {
				// 500
				return res.status(500).send(err.message); 
			}
			// if NOT found, update
			else if (!doc) {
				// Game not Found
				return res.status(404).send('game ' + req.body.name  + ' NOT exists')
			}

			else {
			// game found -- UPdate nlikes +1

			var userDateInfo = {'uid': userId, 'date': new Date()};
			req.db.collection('games').update(
				//update_filter,
				{"_id" : new ObjectId(gameId)},{$inc:{'nlikes': +1}, $push:{ulike:userDateInfo }}, true, true,
				function (err, doc) {
					// if error, return
					if (err) {
						// 500
						return res.status(500).send(err.message)
					}
					// Nothing Here
				}
			)  // update end



			res.jsonp(doc); // put ENDs ; sends a response needed to END the Update.  Response with a record updated info
			console.log(doc)

			}
			

		}
	) // find one
})







//*

/* GET games listing. */
router.get('/', function(req, res, next) {
	  res.send('respond with a resource');
	});



module.exports = router;
