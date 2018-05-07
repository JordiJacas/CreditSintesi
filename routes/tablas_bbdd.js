var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql1234",
  database: "NaiBoy_bbdd"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  /*Create a table named "customers":*/
  var sql = "CREATE TABLE ranking (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), tiempo TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  var sql = "CREATE TABLE invitacionesPartidas (id INT AUTO_INCREMENT PRIMARY KEY, id_usuario1 INT, id_usuario2 INT)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  var sql = "CREATE TABLE partidas (id INT AUTO_INCREMENT PRIMARY KEY, id_personaje1 INT, id_personaje2 INT)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
  
  var sql = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), token TEXT)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});
