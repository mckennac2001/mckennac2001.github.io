
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