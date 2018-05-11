var Game = {}
var cursors;
var velocity = 2
var arrayObstaclesMap = [];
var arrayPlayerMap = [];

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
    
    //setTimeout(function(){setInterval(Client.askNewObstacle, 3000);}, 3000);
    setTimeout(Client.askNewObstacle, 3000)
		
};


Game.update = function(){
    Game.detecteKey();
    Game.bounceObstacle();    
};

//Functiones para jugadores

Game.detecteKey = function(){

    if (cursors.left.isDown) Client.sendClick('left')
    else if(cursors.right.isDown) Client.sendClick('right')
    else if(cursors.up.isDown) Client.sendClick('up')
    else if(cursors.down.isDown) Client.sendClick('down')
}

Game.movePlayer = function(id, direction){

	if(direction === 'left') Game.playerMap[id].x -= velocity;
    else if(direction === 'right') Game.playerMap[id].x +=  velocity;
    else if(direction === 'up') Game.playerMap[id].y -= velocity;
    else if(direction === 'down') Game.playerMap[id].y += velocity;

    Client.savePositionPlayer(Game.playerMap[id].x, Game.playerMap[id].y); 
};

Game.addNewPlayer = function(id,x,y,player){
    
    if(player) Game.playerMap[id] = game.add.sprite(x,y,'gris');
    else if (!player) Game.playerMap[id] = game.add.sprite(x,y,'verde');
    
    Game.playerMap[id].width = 50;
	Game.playerMap[id].height = 50;

    game.physics.enable(Game.playerMap[id], Phaser.Physics.ARCADE);
    Game.playerMap[id].body.onCollide = new Phaser.Signal();
    Game.playerMap[id].body.onCollide.add(Game.hitSprite, id);

    arrayPlayerMap.push(id);
};

Game.hitSprite = function(id){
    console.log(id);
    console.log("Death");
}

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
    //arrayPlayerMap.remove(id);
};

//Funciones para obstaculos

Game.addNewObstacle = function(id,x,y){
    Game.obstacleMap[id] = game.add.sprite(x,y,'lila');
    Game.obstacleMap[id].width = 50;
    Game.obstacleMap[id].height = 50;

    arrayObstaclesMap.push(id);
}

Game.moveObstacle = function(id, velocityX, velocityY, directionX, directionY){

    game.physics.enable(Game.obstacleMap[id], Phaser.Physics.ARCADE);
    Game.obstacleMap[id].body.collideWorldBounds = true;
    Game.obstacleMap[id].body.velocity.setTo(velocityX*100, velocityY*100);
    Game.obstacleMap[id].body.bounce.set(1);
}

Game.bounceObstacle = function(){
    for(var id = 0; id < arrayObstaclesMap.length; id++){
        for( var id2 = 0; id2 < arrayObstaclesMap.length; id2++){
            //console.log(id + " ------ " + id2)
            if(arrayObstaclesMap[id] != arrayObstaclesMap[id2]) game.physics.arcade.collide(Game.obstacleMap[id], Game.obstacleMap[id2]);
        }
    }

}

Game.removeObstacle = function(id){
    Game.obstacleMap[id].destroy();
    delete Game.obstacleMap[id];
    //arrayObstaclesMap.remove(id);
}