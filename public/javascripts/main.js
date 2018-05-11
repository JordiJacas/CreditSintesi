
/**
 * Creado por Jordi Jacas
 */

 /*
 * Js que ejecuta el juego
 */
var game;
function start(){

	game = new Phaser.Game(800, 600, Phaser.AUTO, document.getElementById('game'));
	game.state.add('Game', Game);
	game.state.start('Game');
}

$('#start').click(start);
