var Main = {};
Main.game;

Main.startGame = function(){
	Main.game = new Phaser.Game(800, 600, Phaser.AUTO);
	Main.game.state.add('Game', Game);
	Main.game.state.start('Game');
    $('#start').hide();
}

Main.endGame = function(title, message){
    Client.destroyAllPlayers();
    Main.game.destroy();
    delete Main.game;
    Main.showModal(title, Main.renderResult(message));
}

Main.showModal = function(title,message)
{   
    $("h2.title-modal").text(title).css({"text-align":"center"});
    $("p.formModal").html(message);
    $("#formModal").modal({show:true, backdrop: 'static', keyboard: true });
}

Main.renderResult = function(message){

    var html = "";
    html += '<div class="form-group" id="formLogin">';
    html += '<p class="text-center text-capitalize font-weight-light">'+ message +'</p>';
    html += '</div>';
    html += '<button type="submit" class="btn btn-primary btn-large" id="loginBtn" onclick=Main.hideModal()>Menu</button>';
    return html;
}

Main.hideModal = function(){

    //Mirar recargar pagina con socket.io
    //-------------------------
    location.reload(true);
    //-------------------------
    
    $("#formModal").modal("hide");
    $('#start').show(); 
}

Main.testForm = function(test){
       
}
