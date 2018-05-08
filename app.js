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
            console.log("test");
            //console.log('click to '+data.x+', '+data.y);
            //socket.player.x = data.x;
            //socket.player.y = data.y;
            io.emit('move',socket.player);
        });

        socket.on('disconnect',function(){
        	console.log('a user disconnect');
            io.emit('remove',socket.player.id);
        });
    });
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

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
    