var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var mysql = require('mysql');

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
  res.render('index', { title: 'Login', message: 'Inicia la sessio' })
})

app.get('/registro', function (req, res) {
   res.render('registro', { title: 'Registro', message: 'Hello there!' })
})

app.post('/signup', function (req, res) {

    con.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
        [req.body.name, req.body.email, req.body.password], function(err, result) {
            if (err){
                throw err;
            }
            else{
                res.redirect('/');
                console.log('Se ha insertado el usuario correctamente!');
            }  
        });
})

app.post('/entrar', function (req, res) {

    var username = req.body.name;
    var password = req.body.password;

    con.query("SELECT name, password FROM users WHERE name='"+username+"'AND password='"+password+"';", 
        function(err, result){
        if(result.length == 0){
            res.redirect('/');
        }else if(result.length == 1){
            console.log('Conexion correcta!');
            con.query("UPDATE users SET status = '1' WHERE status = 0 AND name='"+username+"'AND password='"+password+"';");
            res.render('index', { title: 'Hey', message: 'Hello there!' })

        }
    });
})

app.get('/ranking', function (req, res){

    con.query('SELECT * FROM users', function(error,filas){
        if (error) {            
            console.log('error en el listado');
            return;
        }
        res.render('index',{name:filas});
    });
})

///////////////////////////////////////////////////////////////////////////////////////////////

server.lastPlayderID = 0;
server.lastObstacleID = 0;

io.on('connection', function(socket){
  
  console.log("--------------------------------------------------");
  console.log('a user connected');
  console.log("--------------------------------------------------");

	socket.on('newplayer',function(){
    	socket.player = {
        	id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };

          console.log("--------------------------------------------------");
          console.log('Player');
          //console.log(socket.connected);
          console.log("socket 2.1");
          console.log(socket.player);
          console.log("--------------------------------------------------");


        socket.emit('allplayers',getAllPlayers(), socket.player);
        socket.broadcast.emit('newplayer',getAllPlayers(), socket.player);

        socket.emit('startObstacles', getAllPlayers().length);
        

        socket.on('click',function(data){
            io.emit('moveplayer',socket.player, data);
        });

        socket.on('savePlayer', function(data){
            //console.log('click to '+data.x+', '+data.y);
            socket.player.x = data.x;
            socket.player.y = data.y
        })

        socket.on('destroyplayer', function(){
            io.emit('removeplayer', socket.player.id)
        })

        socket.on('destroyallplayers', function(){
            io.emit('removeallplayers', getAllPlayers());
            socket.emit('removeallplayers', getAllPlayers());

            server.lastPlayderID = 0;
            server.lastObstacleID = 0;

            delete socket.player;
            delete socket.obstacle

            console.log("--------------------------------------------------");
            console.log("Restart");
            console.log(socket.player);
            console.log(socket.obstacle);
            console.log("--------------------------------------------------");
        })
    });

    socket.on('newobstacle', function(){
        socket.obstacle = {
            id: server.lastObstacleID++,
            x: randomInt(0, 800),
            y: 1,
            velocityX: randomInt(-3, 3),
            velocityY: randomInt(-3, 3),
            type: randomInt(1,4),
        };

        console.log("--------------------------------------------------");
        console.log("Obstacle");
        console.log(socket.obstacle);
        console.log("--------------------------------------------------");

        socket.emit('allobstacles',getAllObstacles());
        socket.broadcast.emit('newobstacle',socket.obstacle);

        socket.emit('startCrono', true);
        socket.broadcast.emit('startCrono', true);

        socket.on('removeobstacle', function(){
            io.emit('removeallobstacles', getAllObstacles());
            socket.emit('removeallobstacles', getAllObstacles());
        })
    })

    socket.on('win', function(){
        socket.emit('startCrono', false);
        socket.broadcast.emit('startCrono', false);

        socket.emit('winresult', socket.player.id);
    })

    socket.on('disconnect',function(){
        console.log('a user disconnect');
        //io.emit('removeplayer',socket.player.id);
    });
});
   
server.listen(3000, function(){
  console.log('listening on *:3000');
});


function getAllPlayers(){
    var players = [];
    //console.log("PLAYER");
    //console.log(players)

    Object.keys(io.sockets.connected).forEach(function(socketID){
        //console.log(socketID)
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function getAllObstacles(){
    var obstacles = [];
    //console.log("OBSTACLES")
    //console.log(obstacles)

    Object.keys(io.sockets.connected).forEach(function(socketID){
        //console.log(socketID)
        var obstacle = io.sockets.connected[socketID].obstacle;
        if(obstacle) obstacles.push(obstacle);
    });
    return obstacles;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}