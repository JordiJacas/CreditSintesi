var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Contrasenya9",
  database: "NaiBoy_bbdd"
});

/*Funcion conectar*/
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

/*Funciones crear tablas*/
  var sql = "CREATE TABLE ranking (id_user INT AUTO_INCREMENT PRIMARY KEY, tiempo_partida INT NOT NULL)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  /*var sql = "CREATE TABLE invitacionesPartidas (id INT AUTO_INCREMENT PRIMARY KEY, id_usuario1 INT NOT NULL, id_usuario2 INT NOT NULL)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  var sql = "CREATE TABLE partidas (id INT AUTO_INCREMENT PRIMARY KEY, id_personaje1 INT NOT NULL, id_personaje2 INT NOT NULL)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });*/

  var sql = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, status INT NOT NULL DEFAULT 0)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

/*Funciones relaciones tablas*/
  /*var ip1 = "ALTER TABLE invitacionesPartidas ADD CONSTRAINT users_ibfk_1 FOREIGN KEY (id_usuario1) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE";
  con.query(ip1, function (err, result) {
    if (err) throw err;
    console.log("Relacion created");
  });

  var ip2 = "ALTER TABLE invitacionesPartidas ADD CONSTRAINT users2_ibfk_1 FOREIGN KEY (id_usuario2) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE";
  con.query(ip2, function (err, result) {
    if (err) throw err;
    console.log("Relacion created");
  });

  var p1 = "ALTER TABLE partidas ADD CONSTRAINT users3_ibfk_1 FOREIGN KEY (id_personaje1) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE";
  con.query(p1, function (err, result) {
    if (err) throw err;
    console.log("Relacion created");
  });

  var p2 = "ALTER TABLE partidas ADD CONSTRAINT users4_ibfk_1 FOREIGN KEY (id_personaje2) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE";
  con.query(p2, function (err, result) {
    if (err) throw err;
    console.log("Relacion created");
  });*/

  var r = "ALTER TABLE ranking ADD CONSTRAINT users5_ibfk_1 FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE";
  con.query(r, function (err, result) {
    if (err) throw err;
    console.log("Relacion created");
  });
});
