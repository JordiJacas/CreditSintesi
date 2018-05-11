var Client = {};
Client.socket = io.connect();

Client.sendTest = function(data){
    console.log(data);
    //Client.socket.emit('test');
};

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendClick = function(data){
  Client.socket.emit('click', data);
};

Client.viewNewPlayer = function(){
    Client.socket.emit('viewplayers')
}

/*Client.sendMoveObstacle = function(){
    Client.socket.emit('automoveobstacle');
}

Client.askNewObstacle = function(){
    Client.socket.emit('newobstacle');
}

Client.viewNewObstacle = function(){
    Client.socket.emit('viewobstacle');
}*/


Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id, data.x, data.y, false);
});

Client.socket.on('allplayers',function(data, player){
    for(var i = 0; i < data.length; i++){
        if(data[i].id == player.id) Game.addNewPlayer(data[i].id,data[i].x,data[i].y, true);
        else Game.addNewPlayer(data[i].id,data[i].x,data[i].y, false)   ;
    }

    Client.socket.on('move',function(player, direction){ 
        Game.movePlayer(player.id, direction);
    });

    Client.socket.on('removeplayer',function(id){
        Game.removePlayer(id);
    });
});







/*Client.socket.on('newobstacle',function(data){
    Game.addNewObstacle(data.id,data.x,data.y);
});

Client.socket.on('allobstacles',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewObstacle(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('moveobstacle',function(data){ 
        Game.moveObstacle(data.id, data.velocityX, data.velocityY, data.directionX, data.directionY);
    });

    /*Client.socket.on('remove',function(id){
        Game.removeObstacle(id);
    });
});*/
