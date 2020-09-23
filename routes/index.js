var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

const EVENT_START = 0;
const EVENT_END   = 1;

function getCurrentEvent(connection) {
	return new Promise((resolve, reject) => {
		let query = "SELECT * FROM `records` ORDER BY `time` DESC";
		connection.query(query, [], function(err, rows) {
			if (err) {reject(err);}
			if (rows.length == 0) {resolve(null);}
			if (rows[0].type == EVENT_START) {
				resolve(rows[0]);
			} else {
				resolve(null);
			}
		})
	});
}

function getDuration(connection, event) {
	return new Promise((resolve, reject) => {
		let query = "SELECT TIMEDIFF(CURRENT_TIMESTAMP, (SELECT `time` FROM `records` WHERE `id` = ?)) AS `duration`";
		connection.query(query, [event.id], function(err, rows) {
			if (err) {reject(err);}
			resolve(rows[0].duration);
		});
	});
}

router.get('/update', function(req, res, next) {
	var connection = mysql.createConnection({
		host: dbHost,
		user: dbUser,
		password: dbPass,
		database: dbName
	});

	let ret = {isEvent: true};

	getCurrentEvent(connection)
	.then((event) => {

		if (event) {
			ret.currentEvent = event;
			getDuration(connection, event)
			.then((duration) => {
				ret.duration = duration;
				connection.end(function() {
					return res.send({data: ret});
				});
			})
		} else {
			ret.isEvent = false;
			connection.end(function() {
				return res.send({data: ret});
			});
		}

	})
	.catch((err) => {
		console.log(err);
		connection.end(function() {
			return next();
		});
	});

});

/* GET home page. */
router.get('/', function(req, res, next) {

	return res.render('index');

	// var connection = mysql.createConnection({
	// 	host: dbHost,
	// 	user: dbUser,
	// 	password: dbPass,
	// 	database: dbName
	// });

	// let ret = {};

	// getCurrentEvent(connection)
	// .then((event) => {
	// 	ret.currentEvent = event;
	// 	getDuration(connection, event)
	// 	.then((duration) => {
	// 		ret.duration = duration;
	// 		connection.end(function() {
	// 			return res.render('index', {data: ret});
	// 		});
	// 	})
	// })
	// .catch((err) => {
	// 	console.log(err);
	// 	connection.end(function() {
	// 		return next();
	// 	});
	// });

});

module.exports = router;
