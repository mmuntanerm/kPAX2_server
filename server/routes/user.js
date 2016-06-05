var express = require('express');
var router = express.Router();


/**
 * Add a new user
 */
router.post('/', function (req, res) {

	// check parameters
	if (!req.body.login || !req.body.name) {
		// 400 - bad request
		console.log("LOGIN: %s", req.body.login);
		console.log("NAME: %s", req.body.name);
		return res.status(400).send('Bad parameters')
	}

	// find user
	req.db.collection('users').findOne(
		{ login: req.body.login },
		function (err, doc) {

			// if error, return
			if (err) {
				// 500
				return res.status(500).send(err.message)
			}
			// if found, error
			else if (doc) {
				// 400 - conflict
				return res.status(409).send('User already exists')
			}

			var now = new Date()

			// crete new user - only wanted fields
			var user = {
				login: req.body.login,
				name: req.body.name,
				created_at: now,
				updated_at: now
			}

			// create user
			req.db.collection('users').insert(
				user,
				function (err, doc) {
					// if error, return
					if (err) {
						// 500
						return res.status(500).send(err.message)
					}

					res.jsonp(user)
				}
			)
		}
	) // find one
})

/**
 * list users (all users in the system)
 * URL example:  METHOD: GET
 * http://localhost:3000/user/list
 */
router.get('/list', function(req, res, next) {
	// find user
	req.db.collection('users').find(
		{},
		function (err, cursor) {

			// check error
			if (err) {
				return res.status(500).send(err.message)
			}

			var users = []

			// walk cursor
			cursor.each(function (err, doc) {

				// end
				if (doc == null) {
					return res.jsonp(users)
				}

				users.push(doc)
			})
		}
	)
})


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
