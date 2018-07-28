var express = require('express');
var router = express.Router();
var con = require('../models/mysql');
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
	var sql = "SELECT EXISTS(SELECT 1 FROM users WHERE username = '"+req.body.username+"');";
	con.query(sql, function (error, results, fields){
		if(results[0][fields[0]['name']]==0){
			var sql = "INSERT INTO users VALUES ('"+ID+"','"+TOKEN+"','user','"+req.body.username+"','"+hash+"');";
			con.query(sql, function (error, results, fields) {
				if (error) throw error;
				res.cookie('token',TOKEN, { maxAge: 900000});
				res.redirect('/user/profile');
			});
		}
		else {
			req.flash('message', 'The ultimate first world problem... The username is taken :(');
			res.redirect('/user/signup');
		}
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
	var sql = "SELECT EXISTS(SELECT 1 FROM users WHERE username = '"+req.body.username+"' AND password = '"+hash+"');";
	con.query(sql, function (error, results, fields){
		if(results[0][fields[0]['name']]==0){
			req.flash('message', 'Invalid credentials... Did you type it write sausage fingers?');
			res.redirect('/user/signin');
		}
		else {
			var sql = "UPDATE users SET token = '"+TOKEN+"' WHERE username = '"+req.body.username+"'";
			con.query(sql, function (error, results, fields){
				res.cookie('token',TOKEN, { maxAge: 900000});
				res.redirect('/user/profile');
			});
		}
	});
});

router.get('/logout', function(req, res, next) {
	res.clearCookie('token');
	res.redirect('/');
});

router.get('/profile', function(req, res, next) {
	res.render('user/profile', {token: req.cookies.token});
});

module.exports = router;
