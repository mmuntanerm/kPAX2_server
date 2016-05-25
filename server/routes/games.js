var express = require('express');
var router = express.Router();


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

			// crete new game - only a few of fields
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
		{"_id" : gameId},
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


//*
// PUT 

//*

/* GET games listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
