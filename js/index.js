
/*
auth.login('password', {
	email: 'mckenna.charles@gmail.com',
	password: 'thegame',
	rememberMe: true
});
	*/

$(document).ready(function() {
	
/*	$("#printGameData").click(function () {
		console.log('printGameData');
		parseGameSnapshot(gameSnapshots[0]);
	});*/
	
	// Start off with the Home button active
	$('#navHome').attr("class","active");

	// Home button
	$('#navHome').click(function() {
	    $('.topcontent').css("display", "block");
	    $('.bottomcontent').css("display", "block");
	    $('.mapcontent').css("display", "none");	
	    $('.gameslistcontent').css("display", "none");	
	    
	    $('#navHome').attr("class","active");
	    $('#navCurrentGame').attr("class","notActive");
	    $('#navNewGame').attr("class","notActive");
	});
	
	// CurrentGame button
	$('#navCurrentGame').click(function() {
	    $('.topcontent').css("display", "none");
	    $('.bottomcontent').css("display", "none");
	    $('.mapcontent').css("display", "none");	
	    $('.gameslistcontent').css("display", "block");	
	    
	    $('#navHome').attr("class","notActive");
	    $('#navCurrentGame').attr("class","active");
	    $('#navNewGame').attr("class","notActive");
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
	    $('.mapcontent').css("display", "block");
	    $('.gameslistcontent').css("display", "none");	
	    
	    $('#navHome').attr("class","notActive");
	    $('#navCurrentGame').attr("class","active");
	    $('#navNewGame').attr("class","notActive");
		
	    initialize();
	});
});

function updateSelectList(aGame) {
	
	// Add the game id to the selects list in index.html
	$("#gameSelect").append('<option value=' + aGame.id + '>' + aGame.name + '</option>');
	
	$("#maingamelist ul").append('<li>' + aGame.name + '</li>');
	
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

