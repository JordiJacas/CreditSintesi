var Game = {}
Game.cursors;
Game.velocity = 2
Game.arrayObstaclesMap = [];
Game.arrayPlayerMap = [];

//var game = new Phaser.Game(800, 600, Phaser.AUTO, document.getElementById('game'));

Game.iniciar = function(){

    //game.state.add('Game', Game);
    //game.state.start('Game');
}

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function(){
	game.load.image('espace','/images/espacio.jpg');
	game.load.image('gris','/images/meteo_gris.png');
	game.load.image('lila','/images/meteo_lila.png');
	game.load.image('verde','/images/meteo_verde.png');
};

Game.create = function(){
	Game.playerMap = {};
    Game.obstacleMap = {};
	game.add.image(0, 0, 'espace');
    game.physics.startSystem(Phaser.Physics.ARCADE);
	cursors = game.input.keyboard.createCursorKeys();
    Client.askNewPlayer();
    
    setTimeout(function(){Game.createNewObstacle = setInterval(Client.askNewObstacle, 3000);}, 3000);
    //setTimeout(Client.askNewObstacle, 3000)
		
};

Game.update = function(){
    Game.detecteKey();
    Game.bounceObstacle();
    Game.bouncePlayer();
};

Game.removeElementArray = function(id, arrayName){
    for (var elmt = 0; elmt < arrayName.length; elmt++){
        console.log(id + "  -----" + arrayName[elmt]);
        if(arrayName[elmt] == id) arrayName.splice(elmt, 1);
    } 
}

Game.viewResult = function(boolean){
    console.log("VIEW RESULT");
    if(boolean) alert("You Win!!!");
    else if(!boolean) alert ("You lose!!!");
    else alert("1 player");

    clearInterval(Game.createNewObstacle);
    Client.removeObstacle();
}

//Functiones para jugadores

Game.detecteKey = function(){

    if (cursors.left.isDown) Client.sendClick('left')
    else if(cursors.right.isDown) Client.sendClick('right')
    else if(cursors.up.isDown) Client.sendClick('up')
    else if(cursors.down.isDown) Client.sendClick('down')
}

Game.bouncePlayer = function(){
    for(var id = 0; id < Game.arrayPlayerMap.length; id++){
        for( var id2 = 0; id2 < Game.arrayObstaclesMap.length; id2++){
            //console.log(id + " ------ " + id2)
            game.physics.arcade.collide(Game.playerMap[id], Game.obstacleMap[id2]);
        }
    }
}

Game.movePlayer = function(id, direction){
    if(Game.playerMap[id]){
    	if(direction === 'left') Game.playerMap[id].x -= Game.velocity;
        else if(direction === 'right') Game.playerMap[id].x += Game.velocity;
        else if(direction === 'up') Game.playerMap[id].y -= Game.velocity;
        else if(direction === 'down') Game.playerMap[id].y += Game.velocity;

        Client.savePositionPlayer(Game.playerMap[id].x, Game.playerMap[id].y); 
    }
};

Game.addNewPlayer = function(id,x,y,player){
    
    if(player) Game.playerMap[id] = game.add.sprite(x,y,'gris');
    else if (!player) Game.playerMap[id] = game.add.sprite(x,y,'verde');
    
    Game.playerMap[id].width = 50;
	Game.playerMap[id].height = 50;

    game.physics.enable(Game.playerMap[id], Phaser.Physics.ARCADE);
    Game.playerMap[id].body.collideWorldBounds = true;
    Game.playerMap[id].body.onCollide = new Phaser.Signal();
    Game.playerMap[id].body.onCollide.add(Game.hitSprite, this);

    Game.arrayPlayerMap.push(id);
};

Game.hitSprite = function(elmt){
    Client.destroyPlayer();
    Client.winPlayer();
}

Game.removePlayer = function(id){
    if(Game.playerMap[id]){
        Game.playerMap[id].destroy();
        delete Game.playerMap[id];
        Game.removeElementArray(id, Game.arrayPlayerMap);
    }
};

//Funciones para obstaculos

Game.addNewObstacle = function(id,x,y){

    Game.obstacleMap[id] = game.add.sprite(x,y,'lila');
    Game.obstacleMap[id].width = 50;
    Game.obstacleMap[id].height = 50;

    Game.arrayObstaclesMap.push(id);
}

Game.moveObstacle = function(id, velocityX, velocityY, directionX, directionY){

    game.physics.enable(Game.obstacleMap[id], Phaser.Physics.ARCADE);
    Game.obstacleMap[id].body.collideWorldBounds = true;
    //Game.obstacleMap[id].body.velocity.setTo(velocityX*100, velocityY*100);
    //Game.obstacleMap[id].body.bounce.set(1);
    Game.obstacleMap[id].body.onCollide = new Phaser.Signal();
    Game.obstacleMap[id].body.onCollide.add(Game.test,  this);
}

Game.test = function(test){
    setTimeout(test.destroy(), 1500);
}

Game.bounceObstacle = function(){
    for(var id = 0; id < Game.arrayObstaclesMap.length; id++){
        for( var id2 = 0; id2 < Game.arrayObstaclesMap.length; id2++){
            if(Game.arrayObstaclesMap[id] != Game.arrayObstaclesMap[id2]) game.physics.arcade.collide(Game.obstacleMap[id], Game.obstacleMap[id2]);
        }
    }
}

Game.removeObstacle = function(id){

    if(Game.obstacleMap[id]){
        Game.obstacleMap[id].destroy();
        delete Game.obstacleMap[id];
        Game.removeElementArray(id, Game.arrayObstaclesMap);
    }
}