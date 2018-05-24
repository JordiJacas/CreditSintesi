/*
** Script.js
** Creador: Jordi Jacas
** Archivo donde se alojan funciones que conectan el servidor(app.js) con el resto de archivos JS.

/*
** Variables Globales del archivo client.js;
*/
var Client = {};
Client.socket = io.connect();

Client.sendTest = function(data){
    console.log(data);
    //Client.socket.emit('test');
};

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Compara la array de jugadores y decide ejecutar la funcion en el servidor(app.js)(funcion Socketio: 'win').
** Entrada: NULL
** Salida: NULL
*/
Client.winPlayer = function(){
    if(Game.arrayPlayerMap.length == 1){Client.socket.emit('win');}
}

/*
** Funcion que se ejecuta al llamarla desde el servidor(app.js).
** Descripcion: Compara las ids para decidir el ganador.
** Entrada: int id
** Salida: NULL
*/
Client.socket.on('winresult', function(id){
    if(Game.playerMap[id]){Game.viewResult(true);}
    else{Game.viewResult(false);}
})

/*
** Funcion que se ejecuta al llamarla desde el servidor(app.js).
** Descripcion: Si hay 2 jugadores conectados en la partida ejecuta la funcion socketio para crear los obstaculos.
** Entrada: array data
** Salida: NULL
*/
Client.socket.on('startObstacles', function(data){
    console.log("Length-Array:")
    console.log(data);
    if(data == 2){setTimeout(Game.createNewObstacle = setInterval(Client.askNewObstacle, 1000), 3500);}
})


/*
** Funcion que se ejecuta al llamarla desde el servidor(app.js).
** Descripcion: Iniciar o para el cronometro segun sea TRUE o FALSE.
** Entrada: boolean booleanStart.
** Salida: NULL
*/
Client.socket.on('startCrono', function(boleanStart){
    console.log(boleanStart);
    if(boleanStart){Crono.start();}
    else if(!boleanStart){Crono.stop();}
})

// Funciones para pasar de cliente/servidor o servidor/cliente para jugadores


/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Llama al servidro(app.js) para ejecutar una funcion y crear un jugador.
** Entrada: NULL
** Salida: NULL
*/
Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Llama al servidro(app.js) para ejecutar una funcion que mueve los personajes del juego.
** Entrada: int x, int y
** Salida: NULL
*/
Client.savePositionPlayer = function(x, y){
    Client.socket.emit('savePlayer', {x:x, y:y})
}

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Llama al servidro(app.js) para ejecutar una funcion que pasa inforamcion sobre la tecla que ha presionado el Cliente(jugador).
** Entrada: array data
** Salida: NULL
*/
Client.sendClick = function(data){
  Client.socket.emit('click', data);
};

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Llama al servidro(app.js) para ejecutar una funcion que elimina a un jugador.
** Entrada: NULL
** Salida: NULL
*/
Client.destroyPlayer = function(){
    Client.socket.emit('destroyplayer');
}

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Llama al servidro(app.js) para ejecutar una funcion que elimina a todos los jugadores y pone todas las arrays con su valor original.
** Entrada: NULL
** Salida: NULL
*/
Client.destroyAllPlayers = function(){
    Client.socket.emit('destroyallplayers');
    //Client.removeObstacle();
    Game.removeElementsArrays();
}


/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Llama al servidro(app.js) para ejecutar una funcion para ver los jugadores en la partida.
** Entrada: NULL
** Salida: NULL
*/
Client.viewNewPlayer = function(){
    Client.socket.emit('viewplayers')
}

/*
** Funcion que se ejecuta al llamarla desde el servidor(app.js).
** Descripcion: Crea un jugador enemigo.
** Entrada: array data, array player
** Salida: NULL
*/
Client.socket.on('newplayer',function(data, player){
    if(data.length <= 2){
        Game.addNewPlayer(player.id, player.x, player.y, false);
    };
});

/*
** Funcion que se ejecuta al llamarla desde el servidor(app.js).
** Descripcion: Crea un jugador nuevo.
** Entrada: array data, array player
** Salida: NULL
*/
Client.socket.on('allplayers',function(data, player){

    //Bucle que crear solo dos personajes, el resto no entran en la partida y te muestra un mensaje.
    if(data.length <= 2){
        for(var i = 0; i < data.length; i++){
            if(data[i].id == player.id){Game.addNewPlayer(data[i].id,data[i].x,data[i].y, true);}
            else{Game.addNewPlayer(data[i].id,data[i].x,data[i].y, false);}
        }
    }else{
       Main.endGame("You can't play", "The game has started");
    }

    /*
    ** Funcion que se ejecuta al llamarla desde el servidor(app.js).
    ** Descripcion: Mueve el jugador.
    ** Entrada: array player, string direction
    ** Salida: NULL
    */
    Client.socket.on('moveplayer',function(player, direction){
        if(player){Game.movePlayer(player.id, direction);}
    });

    /*
    ** Funcion que se ejecuta al llamarla desde el servidor(app.js).
    ** Descripcion: Elimnia el jugador
    ** Entrada: int id
    ** Salida: NULL
    */
    Client.socket.on('removeplayer',function(id){
        Game.removePlayer(id);
    });

    /*
    ** Funcion que se ejecuta al llamarla desde el servidor(app.js).
    ** Descripcion: Borra todos los jugadores.
    ** Entrada: array data
    ** Salida: NULL
    */
    Client.socket.on('removeallplayers',function(data){
        for(var i = 0; i < data.length; i++){
            Game.removePlayer(data[i].id);
        }
    });
});

// Funciones para pasar de cliente/servidor o servidor/cliente para obstaculos

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Llama al servidro(app.js) para ejecutar una funcion que mueve el obstaculo.
** Entrada: NULL
** Salida: NULL
*/
Client.sendMoveObstacle = function(){
    Client.socket.emit('automoveobstacle');
}

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Llama al servidro(app.js) para ejecutar una funcion crea un nuevo obstaculo.
** Entrada: NULL
** Salida: NULL
*/
Client.askNewObstacle = function(){
    Client.socket.emit('newobstacle');
}

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Llama al servidro(app.js) para ejecutar una funcion que elimina un obstaculo.
** Entrada: NULL
** Salida: NULL
*/
Client.removeObstacle = function(){
    console.log("test");
    Client.socket.emit('removeobstacle');
}

/*
** Funcion que se ejecuta al llamarla desde el servidor(app.js).
** Descripcion: Crea un nuevo obstaculo que se muestra al contrincante.
** Entrada: array data
** Salida: NULL
*/
Client.socket.on('newobstacle',function(data){
    Game.addNewObstacle(data.id,data.x,data.y, data.type);
    Game.moveObstacle(data.id, data.velocityX, data.velocityY);
});

/*
** Funcion que se ejecuta al llamarla desde el servidor(app.js).
** Descripcion: Crea un nuevo obstaculo que se muestra en su pantalla.
** Entrada: array data
** Salida: NULL
*/
Client.socket.on('allobstacles',function(data){

    //Bucle que crea y mueve todos los obstaculos que se hayan creado en la partida.
    for(var i = 0; i < data.length; i++){
        Game.addNewObstacle(data[i].id,data[i].x,data[i].y,data[i].type);
        Game.moveObstacle(data[i].id, data[i].velocityX, data[i].velocityY, data[i].directionX, data[i].directionY);
    }

    /*
    ** Funcion que se ejecuta al llamarla desde el servidor(app.js).
    ** Descripcion: Elimina todos los obstaculos de la partida.
    ** Entrada: array data
    ** Salida: NULL
    */
    Client.socket.on('removeallobstacles',function(data){
        for(var i = 0; i < data.length; i++){
            Game.removeObstacle(data[i].id);
        }
    });
});
