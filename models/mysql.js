var mysql = require('mysql');

module.exports = mysql.createConnection({
  host: "172.17.0.2",
  user: "root",
  password: "4mydata",
  database: "4h_data"
});