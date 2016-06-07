var express = require('express');
var router = express.Router();

var auxliar = require ('./aux.js');  // Imports aux functions 

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
				updated_at: now,
				status: 1
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
 * list users under a FREE condition 
 * if no parameter passed, all users ar listed 
 * the 'q' query must be a valid JSON query condition in MongoBD format
 * endpoint method: GET
 * example : /users/list?q={"status":3}
 */

router.get('/list', function(req, res, next) {

	console.log("games/list endpoint! Query Chain passed: %s",req.query.q);

	if (typeof(req.query.q) != 'undefined' )
		{
		 	if (auxliar.IsJsonString(req.query.q) ) {
		 		console.log('Query condition:q=  %s ', req.query.q)
				var userQuery = JSON.parse(req.query.q);
				}
				else 
				{
					console.log(' Bad JSON format, NO Query Done!: NO records listed')
					var userQuery = {"_id":null};
				}	
		} else {
		  	console.log(' q Query condition not defined: all records listed')
			var userQuery = {};

		};

	console.log('JSON Query passed: ', userQuery);

	// find user
	req.db.collection('users').find(
		//{},
		userQuery,
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

/**
 * list users (all users in the system, whatever is them status )
 * URL example:  METHOD: GET
 * http://localhost:3000/user/lista
 */
router.get('/lista', function(req, res, next) {
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



/*
// Aux Function
function IsJsonString(str) {
	// For testing if str is a well formed JSON chain 
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

*/