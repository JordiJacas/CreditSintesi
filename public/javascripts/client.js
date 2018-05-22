var Client = {};
Client.socket = io.connect();

Client.sendTest = function(data){
    console.log(data);
    //Client.socket.emit('test');
};

Client.winPlayer = function(){
    if(Game.arrayPlayerMap.length == 1){Client.socket.emit('win');}
}

Client.socket.on('winresult', function(id){
    if(Game.playerMap[id]){Game.viewResult(true);}
    else{Game.viewResult(false);}
})

Client.socket.on('startObstacles', function(data){
    console.log("Length-Array:")
    console.log(data);
    if(data == 2){setTimeout(Client.askNewObstacle, 1000);}
})

Client.socket.on('startCrono', function(boleanStart){
    console.log(boleanStart);
    if(boleanStart){inicio();}
    else if(!boleanStart){parar();}
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

Client.destroyAllPlayers = function(){
    Client.socket.emit('destroyallplayers');
    //Client.removeObstacle();
    Game.removeElementsArrays();
}

Client.viewNewPlayer = function(){
    Client.socket.emit('viewplayers')
}

Client.socket.on('newplayer',function(data, player){
    if(data.length <= 2){
        Game.addNewPlayer(player.id, player.x, player.y, false);
    };
});

Client.socket.on('allplayers',function(data, player){
   if(data.length <= 2){
        for(var i = 0; i < data.length; i++){
            if(data[i].id == player.id){Game.addNewPlayer(data[i].id,data[i].x,data[i].y, true);}
            else{Game.addNewPlayer(data[i].id,data[i].x,data[i].y, false);}
        }
   }else{
       Main.endGame("You can't play", "The game has started");
    }

    Client.socket.on('moveplayer',function(player, direction){
        if(player){Game.movePlayer(player.id, direction);}
    });

    Client.socket.on('removeplayer',function(id){
        Game.removePlayer(id);
    });

    Client.socket.on('removeallplayers',function(data){
        for(var i = 0; i < data.length; i++){
            Game.removePlayer(data[i].id);
        }
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
    console.log("test");
    Client.socket.emit('removeobstacle');
}

Client.socket.on('newobstacle',function(data){
    Game.addNewObstacle(data.id,data.x,data.y, data.type);
    Game.moveObstacle(data.id, data.velocityX, data.velocityY, data.directionX, data.directionY);
});

Client.socket.on('allobstacles',function(data){

    for(var i = 0; i < data.length; i++){
        Game.addNewObstacle(data[i].id,data[i].x,data[i].y,data[i].type);
        Game.moveObstacle(data[i].id, data[i].velocityX, data[i].velocityY, data[i].directionX, data[i].directionY);
    }

    Client.socket.on('removeallobstacles',function(data){
        for(var i = 0; i < data.length; i++){
            Game.removeObstacle(data[i].id);
        }

        console.log(data);
        console.log(data.length);
        console.log(data[0]);
    });
});
