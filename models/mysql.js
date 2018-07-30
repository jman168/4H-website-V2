var mysql = require('mysql');

var con = mysql.createConnection({
  host: "172.17.0.2",
  user: "root",
  password: "4mydata",
  database: "4h_data",
  multipleStatements: true
});

function authByToken(Token,sucsessFunction, failFunction) {
	var sql = "SELECT * FROM users WHERE token = '"+Token+"'";
	con.query(sql, function (error, results, fields){
		if(error){
			failFunction()
		}
		else if(results.length>0) {
			sucsessFunction(results);
		}
		else {
			failFunction();
		}
	});
}

function checkForUser(Username,sucsessFunction, failFunction) {
	var sql = "SELECT * FROM users WHERE username = '"+Username+"'";
	con.query(sql, function (error, results, fields){
		if(error){
			failFunction()
		}
		else if(results.length==0) {
			sucsessFunction(results);
		}
		else {
			failFunction();
		}
	});
}

function authByUserPass(Username,Password,sucsessFunction, failFunction){
	var sql = "SELECT * FROM users WHERE username = '"+Username+"' AND password = '"+Password+"';";
	con.query(sql, function (error, results, fields){
		if (error) throw error;
		if(error){
			failFunction()
		}
		else if(results.length>0){
			sucsessFunction(results);
		}
		else {
			failFunction()
		}
	});
}

module.exports = {
	con: con,
	authByToken: authByToken,
	checkForUser: checkForUser,
	authByUserPass: authByUserPass
}