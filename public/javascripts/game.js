var Game = {}
var cursors;
var velocity = 2
var test;

var game = new Phaser.Game(800, 600, Phaser.AUTO, document.getElementById('game'));

Game.iniciar = function(){

    game.state.add('Game', Game);
    game.state.start('Game');
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
	Client.askNewPlayer();
    //Client.askNewObstacle();


    game.physics.startSystem(Phaser.Physics.ARCADE);
    

    
    //setTimeout(function(){setInterval(Client.askNewObstacle, 3000);}, 3000);
	cursors = game.input.keyboard.createCursorKeys();	
};


Game.update = function(){

	if (cursors.left.isDown)
    {
       //Game.playerMap[id].x -= 1;
       Client.sendClick()
    }
    else if (cursors.right.isDown)
    {	
        //Game.playerMap[id].x += 1;
    }
    else if (cursors.up.isDown)
    {
    	//Game.playerMap[id].y -= 1;
    }
    else if (cursors.down.isDown)
    {
    	//Game.playerMap[id].y += 1;
    }
    //Client.sendMoveObstacle();
    //Client.viewNewObstacle();
    Game.detecteKey();    
};


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
};

Game.addNewPlayer = function(id,x,y,player){
    
    if(player) Game.playerMap[id] = game.add.sprite(x,y,'gris');
    else if (!player) Game.playerMap[id] = game.add.sprite(x,y,'verde');
    
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

Game.moveObstacle = function(id, velocityX, velocityY, directionX, directionY){

    // directionX === true --> (+)
    // directionX === false --> (-) 
    //if(directionX) Game.obstacleMap[id].x += velocityX;
    //else if(!directionX) Game.obstacleMap[id].x -= velocityX;

    // directionY === true --> (+)
    // directionY === false --> (-) 
    //if(directionY) Game.obstacleMap[id].y += velocityY;
    //else if(!directionY) Game.obstacleMap[id].y -= velocityY;

    game.physics.enable(Game.obstacleMap[id], Phaser.Physics.ARCADE);
    Game.obstacleMap[id].body.collideWorldBounds = true;
    Game.obstacleMap[id].body.velocity.setTo(velocityX*100, velocityY*100);
    Game.obstacleMap[id].body.bounce.set(1);

    
}

Game.removeObstacle = function(id){
    Game.obstacleMap[id].destroy();
    delete Game.obstacleMap[id];
}