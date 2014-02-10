
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
	
	$('#gameSelect').change(function() {    
		console.log("Selected ");
		var selectedId = $('#gameSelect').val();
		console.log("Selected=" + selectedId);
		//var selectedId = $('#gameSelect :selected').text();
		//var selectedId = $('#gameSelect').find(":selected").text();
		sessionStorage.setItem("gameid", selectedId);
		location = "game.html";
	    //$('#SelectTitle').text( '$' + $(':selected', this).data("value") );
	});
});