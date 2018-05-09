var Client = {};
Client.socket = io.connect();

Client.sendTest = function(data){
    console.log(data);
    //Client.socket.emit('test');
};

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendClick = function(){
  Client.socket.emit('click');
};

Client.askNewObstacle = function(boolean){
    
    if(!boolean) Client.socket.emit('viewobstacle');
    else if(boolean) Client.socket.emit('newobstacle');
}

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('move',function(data){ 
        Game.movePlayer(data.id );
    });

    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
});

Client.socket.on('newobstacle',function(data){
    Game.addNewObstacle(data.id,data.x,data.y);
});

Client.socket.on('allobstacles',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewObstacle(data[i].id,data[i].x,data[i].y);
    }

    /*Client.socket.on('move',function(data){ 
        Game.movePlayer(data.id );
    });

    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });*/
});
