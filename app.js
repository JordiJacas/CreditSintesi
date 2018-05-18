var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var mysql = require('mysql');

var aes256 = require('aes256');

///
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
///

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql1234",
  database: "NaiBoy_bbdd"
});

app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('login', { title: 'Login', message: 'Inicia la sessio' })
})

app.get('/registro', function (req, res) {
   res.render('registro', { title: 'Registro', message: 'Hello there!' })
})

app.post('/signup', function (req, res) {

    var key = 'my passphrase';
    var plaintext = req.body.password;
    var encrypted = aes256.encrypt(key, plaintext);

    con.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
        [req.body.name, req.body.email, encrypted], function(err, result) {
            if (err){
                throw err;
            }
            else{
                res.redirect('/');
                console.log('Se ha insertado el usuario correctamente!');
            } 
            con.end();  
        });
})

app.post('/entrar', function (req, res) {

    var username = req.body.name;
    var password = req.body.password;

    var key = 'my passphrase';
    var encrypted = aes256.encrypt(key, password);

    con.query("SELECT name, password FROM users", 
        function(err, result){
        if (err){
            res.redirect('/');
        }else{
            console.log('Conexion correcta!');
            res.render('index', { title: 'Hey', message: 'Hello there!' })
        }
    });
})

server.lastPlayderID = 0;
server.lastObstacleID = 0;

io.on('connection', function(socket){
  console.log('a user connected');

	socket.on('newplayer',function(){
    	socket.player = {
        	id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
        
        socket.emit('allplayers',getAllPlayers(), socket.player);
        socket.broadcast.emit('newplayer',socket.player);

        socket.on('click',function(data){
            io.emit('moveplayer',socket.player, data);
        });

        socket.on('savePlayer', function(data){
            //console.log('click to '+data.x+', '+data.y);
            socket.player.x = data.x;
            socket.player.y = data.y
        })

        socket.on('disconnect',function(){
        	console.log('a user disconnect');
            io.emit('removeplayer',socket.player.id);
        });
    });

    socket.on('newobstacle', function(){
        socket.obstacle = {
            id: server.lastObstacleID++,
            x: randomInt(100,400),
            y: randomInt(100,400),
            velocityX: randomInt(-5, 5),
            velocityY: randomInt(-5, 5),
        };

        socket.emit('allobstacles',getAllObstacles());
        socket.broadcast.emit('newobstacle',socket.obstacle);
    })
});
   
server.listen(3000, function(){
  console.log('listening on *:3000');
});

function getAllPlayers(){
    var players = [];

    console.log(players)

    Object.keys(io.sockets.connected).forEach(function(socketID){
        console.log(socketID)
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function getAllObstacles(){
    var obstacles = [];

    console.log(obstacles)

    Object.keys(io.sockets.connected).forEach(function(socketID){
        console.log(socketID)
        var obstacle = io.sockets.connected[socketID].obstacle;
        if(obstacle) obstacles.push(obstacle);
    });
    return obstacles;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
