var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql1234"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  /*Create a database named "...":*/
  con.query("CREATE DATABASE NaiBoy_bbdd", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});