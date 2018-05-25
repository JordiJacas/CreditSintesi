/*
** Script.js
** Creador: Jordi Jacas
** Archivo donde se alojan funciones para el control del juego por parte del cliente.

/*
** Variables Globales del archivo Game.js;
*/
var Game = {}
Game.cursors;
Game.velocity = 3
Game.arrayObstaclesMap = [];
Game.arrayPlayerMap = [];

//Las funciones Game.init, Game.preload, Game.create y Game.update, son funciones predeterminadas que usa el framework phaser para funcionar.
Game.init = function(){
    Main.game.stage.disableVisibilityChange = true;
};

/*
** Descripcion: Carga las imagenes que se utilizaran mas adelante.
** Entrada: NULL
** Salida: NULL
*/
Game.preload = function(){
	Main.game.load.image('espace','/images/espacio.jpg');
	Main.game.load.image('gris','/images/meteo_gris.png');
	Main.game.load.image('lila','/images/meteo_lila.png');
	Main.game.load.image('verde','/images/meteo_verde.png');
    Main.game.load.image('player','/images/player.png');
    Main.game.load.image('player2','/images/player2.png');
};

/*
** Descripcion: Crea lo necesario para que el juego pueda funcionar.
** Entrada: NULL
** Salida: NULL
*/
Game.create = function(){
	Game.playerMap = {};
    Game.obstacleMap = {};
	Main.game.add.image(0, 0, 'espace');
    Main.game.physics.startSystem(Phaser.Physics.ARCADE);
	cursors = Main.game.input.keyboard.createCursorKeys();
    Client.askNewPlayer();
};

/*
** Descripcion: Es parecido ha un setInterval, se para cuando se finaliza el juego.
** Entrada: NULL
** Salida: NULL
*/
Game.update = function(){
    Game.detecteKey();
    Game.bounceObstacle();
    Game.bouncePlayer();
};


/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Elimna todos los elementos que puden contener las arrays.
** Entrada: NULL
** Salida: NULL
*/
Game.removeElementsArrays = function(){
    Game.arrayObstaclesMap = [];
    Game.arrayPlayerMap = [];
}

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Elimina un elemento de la array en concreto.
** Entrada: int id, string arrayName
** Salida: NULL
*/    
Game.removeElementArray = function(id, arrayName){
    for (var elmt = 0; elmt < arrayName.length; elmt++){
        if(arrayName[elmt] == id){arrayName.splice(elmt, 1);}
    } 
}

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Mustra un mensaje diferente segun si has ganado o no.
** Entrada: boolean boolean
** Salida: NULL
*/
Game.viewResult = function(boolean){
    var message;
    if(boolean){console.log("You Win!!!"); message = "You Win!!!"}
    else if(!boolean){console.log("You lose!!!"); message = "You lose!!!"}

    clearInterval(Game.createNewObstacle);
    Main.endGame("Game over", message);
}

//Functiones para jugadores

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Identifica la tecla que esta pulsando el jugador en ese momento.
** Entrada: NULL
** Salida: NULL
*/
Game.detecteKey = function(){

    if (cursors.left.isDown){Client.sendClick('left')}
    else if(cursors.right.isDown){Client.sendClick('right')}
    else if(cursors.up.isDown){Client.sendClick('up')}
    else if(cursors.down.isDown){Client.sendClick('down')}
}

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Controla las colisiones entre jugadores i obtaculos.
** Entrada: NULL
** Salida: NULL
*/
Game.bouncePlayer = function(){
    for(var id = 0; id < Game.arrayPlayerMap.length; id++){
        console.log(id);
        for( var id2 = 0; id2 < Game.arrayObstaclesMap.length; id2++){
            Main.game.physics.arcade.collide(Game.playerMap[id], Game.obstacleMap[id2]);
        }
    }
}

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Mueve el jugador haci la direccion que se le ha dicho y gurda las nuevas coordenadas en el servidor.
** Entrada: int id, string direction
** Salida: NULL
*/
Game.movePlayer = function(id, direction){
    if(Game.playerMap[id]){
    	if(direction === 'left'){Game.playerMap[id].x -= Game.velocity;}
        else if(direction === 'right'){Game.playerMap[id].x += Game.velocity;}
        else if(direction === 'up'){Game.playerMap[id].y -= Game.velocity;}
        else if(direction === 'down'){Game.playerMap[id].y += Game.velocity;}

        //Client.savePositionPlayer(Game.playerMap[id].x, Game.playerMap[id].y); 
    }
};

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Añade un nuevo jugador al mapa.
** Entrada: NULL
** Salida: NULL
*/
Game.addNewPlayer = function(id,x,y,player){
    
    if(Main.game){
        if(player){Game.playerMap[id] = Main.game.add.sprite(x,y,'player');}
        else if (!player){Game.playerMap[id] = Main.game.add.sprite(x,y,'player2');}
        
        Game.playerMap[id].width = 70;
    	Game.playerMap[id].height = 75;
		
		//Fisicas para que el jugador pude intereccionar con los obstaculos y no salga del mapa.
        Main.game.physics.enable(Game.playerMap[id], Phaser.Physics.ARCADE);
        Game.playerMap[id].body.collideWorldBounds = true;
        Game.playerMap[id].body.onCollide = new Phaser.Signal();
        Game.playerMap[id].body.onCollide.add(Game.hitSpritePlayer, this);
	
		//Añadir jugador a la array.
        Game.arrayPlayerMap.push(id);
    }
};

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Elimina el jugador cuando colisiona con un obstaculo.
** Entrada: object player, object obstacle
** Salida: NULL
*/
Game.hitSpritePlayer = function(player, obstacle){
    if(player.key == "player"){
        Client.destroyPlayer();
        player.kill();
    }
}

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Elimina el jugdor.
** Entrada: int id
** Salida: NULL
*/
Game.removePlayer = function(id){
    if(Game.playerMap[id]){
        Game.playerMap[id].destroy();
        delete Game.playerMap[id];
        Game.removeElementArray(id, Game.arrayPlayerMap);
		
		//Funcion que decide si has perdido o ganado.
        Client.winPlayer();
    }  
};

//Funciones para obstaculos

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Añade un nuevo obstaculo al mapa.
** Entrada: int id, int x, int y, int type
** Salida: NULL
*/
Game.addNewObstacle = function(id,x,y,type){
    var width;
    var height;
    var color;

    if(type == 1){
        color = 'lila';
        width = 50;
        height = 50;
    }
    else if(type == 2){
        color = 'gris';
        width = 60;
        height = 60;
    }
    else if(type == 3){
        color = 'verde';
        width = 75;
        height = 75;
    }

    Game.obstacleMap[id] = Main.game.add.sprite(x,y,color);
    Game.obstacleMap[id].width = width;
    Game.obstacleMap[id].height = height;
	
	//Añade el obstaculo a la array.
    Game.arrayObstaclesMap.push(id);
}

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Añade fisicas a todos los obstaculos creados para que puedan intereccionar con el entorno y el movimiento.
** Entrada: int id, int velocityX, int velocityY 
** Salida: NULL
*/
Game.moveObstacle = function(id, velocityX, velocityY){
	//Pemitir colisiones
    Main.game.physics.enable(Game.obstacleMap[id], Phaser.Physics.ARCADE);
    Game.obstacleMap[id].body.collideWorldBounds = true;
	
	//Velocidad de los obstaculos
    Game.obstacleMap[id].body.velocity.setTo(velocityX*100, velocityY*100);
	
	//Rebote cuando llega al extremo del mapa
    Game.obstacleMap[id].body.bounce.set(1);
	
	//Funcion al rebotar con otro obstaculo o jugador.
    Game.obstacleMap[id].body.onCollide = new Phaser.Signal();
    Game.obstacleMap[id].body.onCollide.add(Game.hitSpriteObstacle,  this);
}

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Elimina el obstaculo de la pantalla.
** Entrada: object obstacle1, object obstacle2
** Salida: NULL
*/
Game.hitSpriteObstacle = function(obstacle1, obstacle2){
    obstacle1.kill();
}

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Permite rebotes entre objectos.
** Entrada: NULL
** Salida: NULL
*/
Game.bounceObstacle = function(){
    for(var id = 0; id < Game.arrayObstaclesMap.length; id++){
        console.log(id);
        for( var id2 = 0; id2 < Game.arrayObstaclesMap.length; id2++){
            if(Game.arrayObstaclesMap[id] != Game.arrayObstaclesMap[id2]){Main.game.physics.arcade.collide(Game.obstacleMap[id], Game.obstacleMap[id2]);}
        }
    }
}

/*
** Funcion que se ejecuta al llamarla.
** Descripcion: Elimina un obstaculo.
** Entrada: int id
** Salida: NULL
*/
Game.removeObstacle = function(id){
    if(Game.obstacleMap[id]){
        Game.obstacleMap[id].destroy();
        delete Game.obstacleMap[id];
        Game.removeElementArray(id, Game.arrayObstaclesMap);
    }
}