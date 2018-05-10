var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
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
        
        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);

        socket.on('click',function(data){
            //console.log("test");
            //console.log('click to '+data.x+', '+data.y);
            //socket.player.x = data.x;
            //socket.player.y = data.y;
            io.emit('move',socket.player, data);
        });

        socket.on('disconnect',function(){
        	console.log('a user disconnect');
            io.emit('removeplayer',socket.player.id);
        });
    });

    /*socket.on('newobstacle', function(){
        socket.obstacle = {
            id: server.lastObstacleID++,
            x: randomInt(100,400),
            y: randomInt(100,400),
            velocityX: randomInt(-5, 5),
            velocityY: randomInt(-5, 5),
            //directionX: randomBoolean(),
            //directionY: randomBoolean()
        };

        socket.emit('allobstacles',getAllObstacles());
        socket.broadcast.emit('newobstacle',socket.obstacle);

        socket.on('viewobstacles', function(){
            socket.emit('allobstacles',getAllObstacles());
            socket.broadcast.emit('newobstacle',socket.obstacle);
        })

        socket.on('automoveobstacle', function(){
            socket.emit('moveobstacle', socket.obstacle);
        })
    })*/
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

function randomBoolean(){
    return Math.random() >= 0.5;
}
