var Game = {}
Game.cursors;
Game.velocity = 3
Game.arrayObstaclesMap = [];
Game.arrayPlayerMap = [];

Game.init = function(){
    Main.game.stage.disableVisibilityChange = true;
};

Game.preload = function(){
	Main.game.load.image('espace','/images/espacio.jpg');
	Main.game.load.image('gris','/images/meteo_gris.png');
	Main.game.load.image('lila','/images/meteo_lila.png');
	Main.game.load.image('verde','/images/meteo_verde.png');
    Main.game.load.image('player','/images/player.png');
    Main.game.load.image('player2','/images/player2.png');
};

Game.create = function(){
	Game.playerMap = {};
    Game.obstacleMap = {};
	Main.game.add.image(0, 0, 'espace');
    Main.game.physics.startSystem(Phaser.Physics.ARCADE);
	cursors = Main.game.input.keyboard.createCursorKeys();
    Client.askNewPlayer();
};

Game.update = function(){
    Game.detecteKey();
    //Game.bounceObstacle();
    Game.bouncePlayer();
};

Game.removeElementsArrays = function(){
    Game.arrayObstaclesMap = [];
    Game.arrayPlayerMap = [];
}
    
Game.removeElementArray = function(id, arrayName){
    for (var elmt = 0; elmt < arrayName.length; elmt++){
        if(arrayName[elmt] == id){arrayName.splice(elmt, 1);}
    } 
}

Game.viewResult = function(boolean){
    var message;
    if(boolean){console.log("You Win!!!"); message = "You Win!!!"}
    else if(!boolean){console.log("You lose!!!"); message = "You lose!!!"}

    clearInterval(Game.createNewObstacle);
    Main.endGame("Game over", message);
}

//Functiones para jugadores

Game.detecteKey = function(){

    if (cursors.left.isDown){Client.sendClick('left')}
    else if(cursors.right.isDown){Client.sendClick('right')}
    else if(cursors.up.isDown){Client.sendClick('up')}
    else if(cursors.down.isDown){Client.sendClick('down')}
}

Game.bouncePlayer = function(){
    for(var id = 0; id < Game.arrayPlayerMap.length; id++){
        for( var id2 = 0; id2 < Game.arrayObstaclesMap.length; id2++){
            Main.game.physics.arcade.collide(Game.playerMap[id], Game.obstacleMap[id2]);
        }
    }
}

Game.movePlayer = function(id, direction){
    if(Game.playerMap[id]){
    	if(direction === 'left'){Game.playerMap[id].x -= Game.velocity;}
        else if(direction === 'right'){Game.playerMap[id].x += Game.velocity;}
        else if(direction === 'up'){Game.playerMap[id].y -= Game.velocity;}
        else if(direction === 'down'){Game.playerMap[id].y += Game.velocity;}

        Client.savePositionPlayer(Game.playerMap[id].x, Game.playerMap[id].y); 
    }
};

Game.addNewPlayer = function(id,x,y,player){
    
    if(Main.game){
        if(player){Game.playerMap[id] = Main.game.add.sprite(x,y,'player');}
        else if (!player){Game.playerMap[id] = Main.game.add.sprite(x,y,'player2');}
        
        Game.playerMap[id].width = 70;
    	Game.playerMap[id].height = 75;

        Main.game.physics.enable(Game.playerMap[id], Phaser.Physics.ARCADE);
        Game.playerMap[id].body.collideWorldBounds = true;
        Game.playerMap[id].body.onCollide = new Phaser.Signal();
        Game.playerMap[id].body.onCollide.add(Game.hitSpritePlayer, this);

        Game.arrayPlayerMap.push(id);
    }
};

Game.hitSpritePlayer = function(player, obstacle){
    if(player.key == "player"){
        Client.destroyPlayer();
        player.kill();
    }
}

Game.removePlayer = function(id){
    if(Game.playerMap[id]){
        Game.playerMap[id].destroy();
        delete Game.playerMap[id];
        Game.removeElementArray(id, Game.arrayPlayerMap);
        Client.winPlayer();
    }  
};

//Funciones para obstaculos

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

    Game.arrayObstaclesMap.push(id);
}

Game.moveObstacle = function(id, velocityX, velocityY, directionX, directionY){

    Main.game.physics.enable(Game.obstacleMap[id], Phaser.Physics.ARCADE);
    Game.obstacleMap[id].body.collideWorldBounds = true;
    //Game.obstacleMap[id].body.velocity.setTo(velocityX*100, velocityY*100);
    Game.obstacleMap[id].body.bounce.set(1);
    Game.obstacleMap[id].body.onCollide = new Phaser.Signal();
    Game.obstacleMap[id].body.onCollide.add(Game.hitSpriteObstacle,  this);
}

Game.hitSpriteObstacle = function(obstacle1, obstacle2){
    obstacle1.kill();
}

Game.bounceObstacle = function(){
    for(var id = 0; id < Game.arrayObstaclesMap.length; id++){
        for( var id2 = 0; id2 < Game.arrayObstaclesMap.length; id2++){
            if(Game.arrayObstaclesMap[id] != Game.arrayObstaclesMap[id2]){Main.game.physics.arcade.collide(Game.obstacleMap[id], Game.obstacleMap[id2]);}
        }
    }
}

Game.removeObstacle = function(id){
    console.log(id);
    if(Game.obstacleMap[id]){
        Game.obstacleMap[id].destroy();
        delete Game.obstacleMap[id];
        Game.removeElementArray(id, Game.arrayObstaclesMap);
    }
}