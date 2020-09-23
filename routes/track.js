var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var authHandler = require('./../helper/authHandler.js');

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

const EVENT_START = 0;
const EVENT_END   = 1;

function getLastEventOfActivity(connection, activity) {
	return new Promise((resolve, reject) => {
		let query = "SELECT * FROM `records` WHERE `activity` = ? ORDER BY `time` DESC";
		connection.query(query, [activity], function(err, rows) {
			if (err) {reject(err);}
			if (rows.length === 0) {resolve(null);}
			resolve(rows[0]);
		});
	});
}

function addEvent(connection, activity, type) {
	return new Promise((resolve, reject) => {
		let query = "INSERT INTO `records` (`type`, `activity`) VALUES (?, ?)";
		connection.query(query, [type, activity], function(err, rows) {
			if (err) {reject(err);}
			resolve();
		});
	});
}

/* POST activity tracker */
router.post('/:activity', authHandler.checkApiKey, function(req, res, next) {

	var connection = mysql.createConnection({
		host: dbHost,
		user: dbUser,
		password: dbPass,
		database: dbName
	});

	let activity = req.params.activity;

	getLastEventOfActivity(connection, activity)
	.then((event) => addEvent(connection, activity, (event ? !event.type : EVENT_START)))
	.then(() => {
		connection.end(function() {
			return res.sendStatus(200);
		});
	})
	.catch((err) => {
		console.log(err);
		connection.end(function() {
			return next();
		});
	});
});

module.exports = router;
