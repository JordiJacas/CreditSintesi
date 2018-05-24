var mysql = require('mysql');

var con = mysql.createConnection({
  host: "ec2-54-243-235-153.compute-1.amazonaws.com",
  user: "fekjsstwxzeuxz",
  password: "68deb33a54d12d8fd255f0581efc1f6cfb2b8523c8118abf4f86f5518935e85f",
  database: "ddr803gnq42grm",
  port: 5432
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