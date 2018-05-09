var Game = {}
var cursors;
var velocity = 2
var test;
var obstacleID = 0;

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
	//Client.askNewPlayer();

    //setTimeout(Client.askNewObstacle, 3000);
    setTimeout(function(){setInterval(Client.askNewObstacle, 3000);}, 3000);
	cursors = game.input.keyboard.createCursorKeys();	
};


Game.update = function(){
    Client.sendClick();
};

Game.movePlayer = function(id){

	if(cursors.left.isDown)Game.playerMap[id].x -= velocity;
    else if(cursors.right.isDown)Game.playerMap[id].x +=  velocity;
    else if(cursors.up.isDown)Game.playerMap[id].y -= velocity;
    else if(cursors.down.isDown)Game.playerMap[id].y += velocity;
};

Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'gris');
    Game.playerMap[id].width = 50;
	Game.playerMap[id].height = 50;
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.addNewObstacle = function(id,x,y){
    Game.obstacleMap[id] = game.add.sprite(x,y,'lila');
    Game.obstacleMap[id].width = 50;
    Game.obstacleMap[id].height = 50;
}

Game.moveObstacle = function(id){
    Game.obstacleMap[id].x 
    Game.obstacleMap[id].y
}

Game.removeObstacle = function(id){
    Game.obstacleMap[id].destroy();
    delete Game.obstacleMap[id];
}