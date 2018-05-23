/*
** Script.js
** Creador: Jordi Jacas
** Archivo donde se alojan funciones de crontrol del cronometro.

/*
** Variables Globales del archivo crono.js;
*/
var Crono = {};
Crono.centesimas = 0;
Crono.segundos = 0;
Crono.minutos = 0;

/*
** Funcion que se ejecuta al llamarla
** Descripcion: Pone en funcionamiento el cronometro.
** Entrada: NULL
** Salida: NULL
*/
Crono.start = function() {
	Crono.control = setInterval(Crono.cronometro,10);
}

/*
** Funcion que se ejecuta al llamarla
** Descripcion: Detiene el cronometro.
** Entrada: NULL
** Salida: NULL
*/
Crono.stop = function() {
	clearInterval(Crono.control);
}

/*
** Funcion que se ejecuta al llamarla
** Descripcion: Restaura las variables al valor inicial y detine el cronometro.
** Entrada: NULL
** Salida: NULL
*/
Crono.restart = function() {
	clearInterval(Crono.control);

	Crono.centesimas = 0;
	Crono.segundos = 0;
	Crono.minutos = 0;

	Centesimas.innerHTML = "00";
	Segundos.innerHTML = ":00";
	Minutos.innerHTML = ":00";
}

/*
** Funcion que se ejecuta al llamarla
** Descripcion: Logica del cronometro.
** Entrada: NULL
** Salida: NULL
*/
Crono.cronometro = function() {
	
	//Suma las centesimas y las muestra por pantalla.
	if(Crono.centesimas < 99) {
		Crono.centesimas++;
		if(Crono.centesimas < 10) { Crono.centesimas= "0" + Crono.centesimas }
		Centesimas.innerHTML= ":" + Crono.centesimas;
	}
	
	//Al llegar al maximo de centesimas restaura el valor.
	if(Crono.centesimas == 99) {Crono.centesimas = -1;}
	
	//Suma los segundos y los muestra por pantalla.
	if (Crono.centesimas == 0) {
		Crono.segundos ++;
		if (Crono.segundos < 10) {Crono.segundos = "0"+Crono.segundos}
		Segundos.innerHTML = ":"+Crono.segundos;
	}
	
	//Al llegar al maximo de segundos restaura el valor.
	if(Crono.segundos == 59){Crono.segundos = -1;}
	
	//Suma los minutos y los muestra por pantalla.
	if((Crono.centesimas == 0) && (Crono.segundos == 0)){
		Crono.minutos++;
		if(Crono.minutos < 10){Crono.minutos = "0"+Crono.minutos}
		Minutos.innerHTML = Crono.minutos;
	}
	
	//Al llegar al maximo de minutos restaura el valor.
	if(Crono.minutos == 59){Crono.minutos = -1;}
}

/*
** Funcion que se ejecuta al llamarla
** Descripcion: Devuelve el tiempo donde el cronometro se ha detenido.
** Entrada: NULL
** Salida: string time
*/
Crono.time = function(){

	Crono.time = Crono.minutos + ":" + Crono.segundos + ":" + Crono.centesimas;
	Crono.time = Crono.time;

	return time;
}