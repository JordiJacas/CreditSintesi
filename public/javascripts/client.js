var Client = {};
Client.socket = io.connect();

Client.sendTest = function(data){
    console.log(data);
    //Client.socket.emit('test');
};

Client.winPlayer = function(){

    console.log("winPlayer");
    if(1 == 1)Client.socket.emit('win');
}

Client.socket.on('winresult', function(id){
        console.log(id);
        if(Game.playerMap[id]) Game.viewResult(true);
        else Game.viewResult(false);
})


// Funciones para pasar de cliente/servidor o servidor/cliente para jugadores

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.savePositionPlayer = function(x, y){
    Client.socket.emit('savePlayer', {x:x, y:y})
}

Client.sendClick = function(data){
  Client.socket.emit('click', data);
};

Client.destroyPlayer = function(){
    Client.socket.emit('destroyplayer');
}

Client.viewNewPlayer = function(){
    Client.socket.emit('viewplayers')
}

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id, data.x, data.y, false);
});

Client.socket.on('allplayers',function(data, player){
    for(var i = 0; i < data.length; i++){
        if(data[i].id == player.id) Game.addNewPlayer(data[i].id,data[i].x,data[i].y, true);
        else Game.addNewPlayer(data[i].id,data[i].x,data[i].y, false)   ;
    }

    Client.socket.on('moveplayer',function(player, direction){ 
        Game.movePlayer(player.id, direction);
    });

    Client.socket.on('removeplayer',function(id){
        Game.removePlayer(id);
    });
});


// Funciones para pasar de cliente/servidor o servidor/cliente para obstaculos

Client.sendMoveObstacle = function(){
    Client.socket.emit('automoveobstacle');
}

Client.askNewObstacle = function(){
    Client.socket.emit('newobstacle');
}

Client.removeObstacle = function(){
    Client.socket.emit('removeobstacle');
}

Client.socket.on('newobstacle',function(data){
    Game.addNewObstacle(data.id,data.x,data.y);
    Game.moveObstacle(data.id, data.velocityX, data.velocityY, data.directionX, data.directionY);
});

Client.socket.on('allobstacles',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewObstacle(data[i].id,data[i].x,data[i].y);
        Game.moveObstacle(data[i].id, data[i].velocityX, data[i].velocityY, data[i].directionX, data[i].directionY);
    }

    Client.socket.on('removeallobstacles',function(data){
        for(var i = 0; i < data.length; i++){
            Game.removeObstacle(data[i].id);
        }
    });
});
