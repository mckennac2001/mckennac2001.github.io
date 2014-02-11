
/*
auth.login('password', {
	email: 'mckenna.charles@gmail.com',
	password: 'thegame',
	rememberMe: true
});
	*/

$(document).ready(function() {
	
	$("#printGameData").click(function () {
		console.log('printGameData');
		parseGameSnapshot(gameSnapshots[0]);
	});
	
	// A Game was selected. Now we should fetch the game data and populate the map
	$('#gameSelect').change(function() {    
		console.log("Selected ");
		gameId = $('#gameSelect').val();
		console.log("Selected=" + gameId);
		//var selectedId = $('#gameSelect :selected').text();
		//var selectedId = $('#gameSelect').find(":selected").text();
//		sessionStorage.setItem("gameid", gameId);
		//location = "game.html";
	    $('.topcontent').css("display", "none");
	    $('.bottomcontent').css("display", "none");
	    $('.mapcontent').css("display", "inline");
	    initialize();
	});
});

function updateSelectList(aGame) {
	
	// Add the game id to the select list in index.html
	$("#gameSelect").append('<option value=' + aGame.id + '>' + aGame.name + '</option>');
	$(".middle-sidebar ul").append('<li>' + aGame.name + '</li>');
	
	// Select list eye candy
	$(".middle-sidebar li").mouseenter(function() {
		$(this).css("color", "red");
	});
	$(".middle-sidebar li").mouseleave(function() {
		$(this).css("color", "black");
	});	
}

// Update UI to show the details of the current game
function updateUiWithCurrentGame(aGame) {
	$('#gametitle').text(aGame.name + " : " + aGame.location);
}

function detectBrowser() {
	console.log("detectBrowser");
	var useragent = navigator.userAgent;
	var mapdiv = document.getElementById("mapcanvas");

	if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
		mapdiv.style.width = '100%';
		mapdiv.style.height = '100%';
	} else {
		mapdiv.style.width = '600px';
		mapdiv.style.height = '800px';
	}
}

