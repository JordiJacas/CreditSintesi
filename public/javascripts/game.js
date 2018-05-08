var Game = {}
var cursors;


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
	game.add.image(0, 0, 'espace');
	Client.askNewPlayer();

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
        //ame.playerMap[id].x += 1;
    }
    else if (cursors.up.isDown)
    {
    	//Game.playerMap[id].y -= 1;
    }
    else if (cursors.down.isDown)
    {
    	//Game.playerMap[id].y += 1;
    }
};

Game.movePlayer = function(id){

	Game.playerMap[id].x -= 1;
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