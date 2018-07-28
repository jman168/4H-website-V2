var express = require('express');
var crypto = require('crypto');
var con = require('../models/mysql');

var router = express.Router();

var items_per_col = 3;

/* GET home page. */
router.get('/', function(req, res, next) {
	TOKEN = req.cookies.token;
	if(TOKEN){
		var sql = "SELECT ID FROM users WHERE token = '"+TOKEN+"'";
		con.query(sql, function (error, results, fields){
			var ID = results[0][fields[0].name]
			var sql = "SELECT * FROM records WHERE user = '"+ID+"'";
			con.query(sql, function (error, results, fields) {
				if (error) throw error;
				record_chuncs = []
				for(var i = 0; i < results.length; i+=items_per_col){
					record_chuncs.push(results.slice(i,i+items_per_col));
				}
				res.render('record-books/index', {records: record_chuncs, record_tab: "active"});
			});
		});
	}
	else {
		res.redirect('/user/signin');
	}
});

router.post('/', function(req, res, next) {
	TOKEN = req.cookies.token;
	if(TOKEN){
		var sql = "SELECT ID FROM users WHERE token = '"+TOKEN+"'";
		con.query(sql, function (error, results, fields){
			var userID = results[0][fields[0].name]
			var ID = crypto.randomBytes(64).toString('hex');
			var sql = "INSERT INTO records VALUES ('"+ID+"','"+userID+"','"+req.body.type+"','"+req.body.name+"','"+req.body.year+"');";
			con.query(sql, function (error, results, fields) {
				if (error) throw error;
				res.redirect('/record-books');
			});
		});
	}
	else {
		res.redirect('/user/signin');
	}
});

router.delete('/', function(req, res) {
	TOKEN = req.cookies.token;
	if(TOKEN){
		var sql = "SELECT ID FROM users WHERE token = '"+TOKEN+"'";
		con.query(sql, function (error, results, fields){
			var ID = req.body.ID;
			var sql = "DELETE FROM records WHERE ID = '"+ID+"'";
			con.query(sql, function (error, results, fields) {
				if (error) throw error;
				res.json({url: '/record-books'});
			});
		});
	}
	else {
		res.json({url: '/user/signin'})
	}
});

module.exports = router;
