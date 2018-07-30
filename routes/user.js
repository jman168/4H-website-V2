var express = require('express');
var router = express.Router();
var mysql = require('../models/mysql');
var con = mysql.con;
var crypto = require('crypto');
var secret = require(process.env['HOME']+'/secret');

/* GET home page. */
router.get('/signup', function(req, res, next) {
	res.render('user/signup', {message: req.flash('message')});
});

router.post('/signup', function(req, res, next) {
	const hash = crypto.createHmac('sha256', secret)
						.update(req.body.password)
						.digest('hex');
	const ID = crypto.randomBytes(32).toString('hex');
	const TOKEN = crypto.randomBytes(64).toString('hex');
	mysql.checkForUser(req.body.username, function(results) {
		var sql = "INSERT INTO users VALUES ('"+ID+"','"+TOKEN+"','user','"+req.body.username+"','"+hash+"');";
		con.query(sql, function (error, results, fields) {
			if (error) throw error;
			res.cookie('token',TOKEN, { maxAge: 900000});
			res.redirect('/user/profile');
		});
	}, function() {
		req.flash('message', 'The ultimate first world problem... The username is taken :(');
		res.redirect('/user/signup');
	});
});

router.get('/signin', function(req, res, next) {
	res.render('user/signin', {message: req.flash('message')});
});

router.post('/signin', function(req, res, next) {
	const hash = crypto.createHmac('sha256', secret)
						.update(req.body.password)
						.digest('hex');
	const TOKEN = crypto.randomBytes(64).toString('hex');
	mysql.authByUserPass(req.body.username, hash, function() {
		var sql = "UPDATE users SET token = '"+TOKEN+"' WHERE username = '"+req.body.username+"'";
			con.query(sql, function (error, results, fields){
			res.cookie('token',TOKEN, { maxAge: 900000});
			res.redirect('/user/profile');
		});
	}, function() {
		req.flash('message', 'Invalid credentials... Did you type it write sausage fingers?');
		res.redirect('/user/signin');
	});
});

router.get('/logout', function(req, res, next) {
	res.clearCookie('token');
	res.redirect('/');
});

router.get('/profile', function(req, res, next) {
	TOKEN = req.cookies.token;
	mysql.authByToken(TOKEN, function(results) {
		var ID = results[0]['ID']
		res.render('user/profile', {token: TOKEN, ID: ID});
	}, function() {
		res.redirect('/user/signin');
	});
});

module.exports = router;
