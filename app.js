//Login
var provider = new firebase.auth.GoogleAuthProvider();


$('#login').click(function(){
	$(this).hide();
  firebase.auth().signInWithPopup(provider)
    .then(function(result) {
    	var user = {
    		uid:result.user.uid,
    		displayName:result.user.displayName,
    		photoURL:result.user.photoURL,
    		puntos:0
    	}


    	//data["users"].push(user)
    	console.log(result.user.photoURL);
    	root.show();
    	root2.show();
    	puchame.show();
    	//DB
    	guardarUser(user);
    	//local:
    	localUser = user;

  });
});

//guardar en base de datos
function guardarUser(user){
	firebase.database().ref("juego_marketing/" + user.uid)
	.set(user)
	.then(s=>{
		console.log("guardé", s);
	});
}

//Leer de la base de datos jugadores en activo
firebase.database().ref("juego_marketing")
.on("child_added", traerUsuarios);

firebase.database().ref("juego_marketing")
.on("child_changed", traerUsuarios);

function traerUsuarios(s){
	var user = s.val();
	var nueva = data["users"].filter(function(u){
		return u.uid !== user.uid; 
	});
	nueva.push(user);
	data["users"] = nueva.reverse();
	root.html(compile(data));
}


////////////////////////////////////////////// RANKING /////////////////////////////////////////////////
//Leer de la base de datos de ranking
firebase.database().ref("ranking")
.on("child_added", traerRanking);

firebase.database().ref("ranking")
.on("child_changed", traerRanking);

function traerRanking(s){
	var user2 = s.val();
	var nueva2 = rankinginfo["users2"].filter(function(u){
		return u.uid !== user2.uid; 
	});
	nueva2.push(user2);
	rankinginfo["users2"] = nueva2.reverse();
	root2.html(compile2(rankinginfo));
}

////////////////////////////////////////////// RANKING /////////////////////////////////////////////////


//cambiar puntos y actualizar lista
$("#puchame").click(function(){

	if(localUser.puntos >= 100) return;
	localUser["puntos"]+=1;
	firebase.database().ref("juego_marketing/" + localUser.uid)
	.set(localUser);
	if(localUser.puntos >= 100){
		setGanador(localUser);
		setRanking(localUser);
	}
});

//ganador
function setGanador(user){
	firebase.database().ref("ganador")
	.set(user);
	console.log("llegue");


}

firebase.database().ref("ganador")
.on("value", function(s){
	console.log("added", s.val());
	$("#ganador").append("<img src='"+s.val().photoURL+"'/>");
	$("#puchame").hide();
});

////////////////////////////////////////////// RANKING /////////////////////////////////////////////////

//incluir en BBDD ganador en ranking
function setRanking(user){
	firebase.database().ref("ranking/" + localUser.uid)
	.set(user);
	console.log("llegue");
	$("#puchame").hide();
}

firebase.database().ref("ranking")
.on("value", function(s){
	console.log("added", s.val());
	$("#ranking").append("<img src='"+s.val().photoURL+"'/>");
	$("#puchame").hide();
});



////////////////////////////////////////////// RANKING /////////////////////////////////////////////////





//resetear juego
$("#reset").click(function(){
	firebase.database().ref("ganador").set(null);
	firebase.database().ref("juego_marketing")
	.once("value")
	.then(function(s){
		var obj = s.val();
		for(var k in obj){
			obj[k].puntos = 0;
		}
		var updates = {};
		updates["juego_marketing"] = obj;
		firebase.database().ref().update(updates);
	});
	$("#ganador").html("");
	$("#puchame").show();
	localUser.puntos = 0;
});

//Template
var root = $("#root");
var template = $("#template").html();
var compile = Handlebars.compile(template);
var data = {
	users : [
		//	{
	//uid:0,
	//displayName:"Chiquito",
  	//photoURL:"https://cloud10.todocoleccion.online/cromos-troquelados/tc/2016/12/18/22/69789161.jpg",
    //puntos:30,
			//	}
			]


		}
var rankinginfo = {
	users2 : []
	}
//Template ranking
var root2 = $("#root_ranking");
var template3 = $("#template_ranking").html();
var compile2 = Handlebars.compile(template3);


	
var puchame = $("#puchame").hide();
var localUser = {};

//Main
root.html(compile(data));
root.hide();


//Main
root2.html(compile2(rankinginfo));
root2.hide();


