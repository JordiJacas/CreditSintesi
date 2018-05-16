
/**
 * Creado por Jordi Jacas
 */

 /*
 * Js que ejecuta el juego
 */

var Main = {};
Main.game;

Main.startGame = function(){
	Main.game = new Phaser.Game(800, 600, Phaser.AUTO, document.getElementById('game'));
	Main.game.state.add('Game', Game);
	Main.game.state.start('Game');
    $('#start').hide();
}

Main.endGame = function(message){

	Main.game.destroy();
	Main.showModal("Game Over", Main.renderForm(message));
}

Main.showModal = function(title,message)
{   
    $("h2.title-modal").text(title).css({"text-align":"center"});
    $("p.formModal").html(message);
    $("#formModal").modal({show:true, backdrop: 'static', keyboard: true });
}

Main.renderForm = function(message){

    var html = "";
    html += '<div class="form-group" id="formLogin">';
    html += '<p class="text-center text-capitalize font-weight-light">'+ message +'</p>';
    html += '</div>';
    html += '<button type="submit" class="btn btn-primary btn-large" id="loginBtn" onclick=Main.hideModal()>Next</button>';
    return html;
}

Main.hideModal = function(){
    $("#formModal").modal("hide");
    $('#star').show();
}
