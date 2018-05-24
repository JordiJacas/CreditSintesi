/*
** Script.js
** Creador: Jordi Jacas
** Archivo donde se alojan funciones principales del projecto
*/

/*
** Variables Globales del archivo main.js;
*/
var Main = {};
Main.game;

/*
** Funcion que se ejecuta al clicar el boton de startGame
** Descripcion: Crea la zona de juego, empieza el juego y esconde o muestra elementos.
** Entrada: NULL
** Salida: NULL
*/
Main.startGame = function(){

    //Crear zona de juegon y comenzar partida.
	Main.game = new Phaser.Game(800, 500, Phaser.AUTO);
	Main.game.state.add('Game', Game);
	Main.game.state.start('Game');
	
    //Ocultar boton de startGame y  mostrar cronometro
    $('#start').hide();
	$('#contenedor').show();
}

/*
** Funcion que se ejecuta al finalizar el juego
** Descripcion: Destruye todos los jugadores, destruye el mapa, muestra un modal con tu resulado y reinicia el cronometro.
** Entrada: string title, string message
** Salida: NULL
*/
Main.endGame = function(title, message){

    //Borrar todos los jugadores de la partida.
    Client.destroyAllPlayers();

    //Borrar la zona de juego.
    Main.game.destroy();
    delete Main.game;

    //Mostrar resultados.
    Main.showModal(title, Main.renderResult(message,Crono.time()));

    //Ocultar cronometro.
    $('#contenedor').hide();

    //Reiniciar cronometro.
    Crono.restart();
}


/*
** Funcion que se ejecuta al llamarla
** Descripcion: Muestra el modal.
** Entrada: string title, string message
** Salida: NULL
*/
Main.showModal = function(title,message)
{   
    $("h2.title-modal").text(title).css({"text-align":"center"});
    $("p.formModal").html(message);
    $("#formModal").modal({show:true, backdrop: 'static', keyboard: true });
}

/*
** Funcion que se ejecuta al llamarla
** Descripcion: Contiene la estructura del modal.
** Entrada: NULL
** Salida: NULL
*/
Main.renderResult = function(message, time){

    var html = "";
    html += '<div class="form-group" id="formLogin">';
    html += '<p class="text-center text-capitalize font-weight-light">'+ message + '<br>'+ "Your time: " + time.time +'</p>';
    html += '</div>';
    html += '<button type="submit" class="btn btn-primary btn-large" id="loginBtn" onclick=Main.hideModal()>Menu</button>';
    return html;
}

/*
** Funcion que se ejecuta al llamarla
** Descripcion: Oculata el modal, muestra el boton de startGame y recarga la pagina(arreglar).
** Entrada: NULL
** Salida: NULL
*/
Main.hideModal = function(){

    //Mirar recargar pagina con socket.io
    //-------------------------
    location.reload(true);
    //-------------------------
    
    //Ocultar modal y mostrar bonton de jugar.
    $("#formModal").modal("hide");
    $('#start').show(); 
	
}
