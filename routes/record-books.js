var express = require('express');
var crypto = require('crypto');
var mysql = require('../models/mysql');
var con = mysql.con;

var router = express.Router();

var items_per_col = 3;

/* GET home page. */
router.get('/', function(req, res, next) {
	var TOKEN = req.cookies.token;
	mysql.authByToken(TOKEN, function (results) {
		var ID = results[0]['ID'];
		var sql = "SELECT * FROM records WHERE user = '"+ID+"'";
		con.query(sql, function (error, results, fields) {
			if (error) throw error;
			record_chuncs = []
			for(var i = 0; i < results.length; i+=items_per_col){
				record_chuncs.push(results.slice(i,i+items_per_col));
			}
			res.render('record-books/index', {records: record_chuncs, record_tab: "active"});
		});
	}, function () {
		res.redirect('/user/signin');
	});
});

router.post('/', function(req, res, next) {
	var TOKEN = req.cookies.token;
	mysql.authByToken(TOKEN, function (results) {
		var userID = results[0]['ID'];
		var ID = crypto.randomBytes(64).toString('hex');
		var sql = "INSERT INTO records";
		sql += " VALUES ('"+ID+"','"+userID+"','"+req.body.type+"','"+req.body.name+"','"+req.body.year+"');";
		sql += " INSERT INTO poultry_records(ID)";
		sql += " VALUES ('"+ID+"');";
		con.query(sql, function (error, results, fields) {
			if (error) throw error;
			res.redirect('/record-books');
		});
	}, function () {
		res.redirect('/user/signin');
	});
});

router.delete('/', function(req, res) {
	var TOKEN = req.cookies.token;
	mysql.authByToken(TOKEN, function (results) {
		var ID = req.body.ID;
		var sql = "DELETE FROM records WHERE ID = '"+ID+"';";
		sql += "DELETE FROM poultry_records WHERE ID = '"+ID+"';";
		con.query(sql, function (error, results, fields) {
			if (error) throw error;
			res.json({url: '/record-books'});
		});
	}, function () {
		res.redirect('/user/signin');
	});
});

router.get('/view', function(req, res, next) {
	var TOKEN = req.cookies.token;
	mysql.authByToken(TOKEN, function (results) {
		var ID = req.query.ID;
		var sql = "SELECT * FROM poultry_records WHERE ID = '"+ID+"';";
		con.query(sql, function (error, results, fields) {
			var data = [];
			var keys = Object.keys(results[0]);
			keys.splice(0, 1);
			for(var i in keys){
				var value = results[0][keys[i]];
				if(!value){
					value='';
				}
				data.push({field: keys[i], value: value});
			}
			res.render('record-books/view', {data: data, ID: ID});
		});
	}, function () {
		res.redirect('/user/signin');
	});
});

router.post('/view', function(req, res, next) {
	var TOKEN = req.cookies.token;
	mysql.authByToken(TOKEN, function (results) {
		var ID = req.body.ID;
		var field = req.body.field;
		var value = req.body.value;
		var sql = "UPDATE poultry_records SET "+field+" = '"+value+"' WHERE ID = '"+ID+"';";
		con.query(sql, function (error, results, fields) {
			if (error) throw error;
			res.json({});
		});
	}, function () {
		res.redirect('/user/signin');
	});
});

module.exports = router;
