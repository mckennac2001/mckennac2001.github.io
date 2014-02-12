
// Animation speed
var speed = 1500;

// Setup all the actions
$(document).ready(function() {
	
/*	$("#printGameData").click(function () {
		console.log('printGameData');
		parseGameSnapshot(gameSnapshots[0]);
	});*/
	
	// Start off with the Home button active
	$('#navHome').attr("class","active");

	// Home button
	$('#navHome').click(function() {
/*	    $('.topcontent').css("display", "block");
	    $('.bottomcontent').css("display", "block");
	    $('.mapcontent').css("display", "none");	
	    $('.gameslistcontent').css("display", "none");	*/

	    $('.topcontent').slideDown(speed);
	    $('.bottomcontent').slideDown(speed);
	    $('.mapcontent').hide(speed);
	    $('.newmapcontent').hide(speed);
	    $('.gameslistcontent').hide(speed);	
	    // Sidebars
	    $('.new-game-sidebar').hide(speed);
	    $('.game-select-sidebar').slideDown(speed);
	    $('.game-details-sidebar').slideDown(hide);
	    
	    
	    $('#navHome').attr("class","active");
	    $('#navCurrentGame').attr("class","notActive");
	    $('#navNewGame').attr("class","notActive");
	});
	
	// CurrentGame button
	$('#navCurrentGame').click(function() {
/*	    $('.topcontent').css("display", "none");
	    $('.bottomcontent').css("display", "none");
	    $('.mapcontent').css("display", "none");	
	    $('.gameslistcontent').css("display", "block");	*/
		
	    $('.topcontent').hide(speed);
	    $('.bottomcontent').hide(speed);
	    $('.mapcontent').hide(speed);
	    $('.newmapcontent').hide(speed);
	    $('.gameslistcontent').slideDown(speed);	
	    // Sidebars
	    $('.new-game-sidebar').hide(speed);
	    $('.game-select-sidebar').slideDown(speed);
	    $('.game-details-sidebar').hide(speed);
	    $('.bottom-sidebar').slideDown(speed);
	    
	    $('#navHome').attr("class","notActive");
	    $('#navCurrentGame').attr("class","active");
	    $('#navNewGame').attr("class","notActive");
	});

	// NewGame button
	$('#navNewGame').click(function() {
		
	    $('.topcontent').hide(speed);
	    $('.bottomcontent').hide(speed);
	    $('.mapcontent').hide(speed);
	    $('.newmapcontent').slideDown(speed);
	    $('.gameslistcontent').hide(speed);	
	    // Sidebars
	    $('.new-game-sidebar').slideDown(speed);
	    $('.game-select-sidebar').hide(speed);
	    $('.game-details-sidebar').hide(speed);
	    $('.bottom-sidebar').hide(speed);
	    
	    $('#navHome').attr("class","notActive");
	    $('#navCurrentGame').attr("class","notActive");
	    $('#navNewGame').attr("class","active");
/*	    
	    $(".newGamePlayer").on ('keypress', function (e) {
	        console.log(String.fromCharCode(e.which));
	        $("#gameform").append("<li>Another player<input class='newGamePlayer' type='text' name='newGamePlayer'/></li>");
	    });*/
	    
	    drawNewMap();
	});
	
	// A Game was selected. Now we should fetch the game data and populate the map
	$('#gameSelect').change(function() {    
		console.log("Selected ");
		gameId = $('#gameSelect').val();
		console.log("Selected=" + gameId);

//		sessionStorage.setItem("gameid", gameId);
		//location = "game.html";
/*	    $('.topcontent').css("display", "none");
	    $('.bottomcontent').css("display", "none");
	    $('.mapcontent').css("display", "block");
	    $('.gameslistcontent').css("display", "none");	*/

	    $('.topcontent').hide(speed);
	    $('.bottomcontent').hide(speed);
	    $('.mapcontent').slideDown(speed);
	    $('.newmapcontent').hide(speed);
	    $('.gameslistcontent').hide(speed);	
	    // Sidebars
	    $('.new-game-sidebar').hide(speed);
	    $('.game-select-sidebar').slideDown(speed);
	    $('.game-details-sidebar').slideDown(speed);
	    $('.bottom-sidebar').hide(speed);
	    
	    $('#navHome').attr("class","notActive");
	    $('#navCurrentGame').attr("class","active");
	    $('#navNewGame').attr("class","notActive");
		
	    drawGameMap();
	});
});

function updateSelectList(aGame) {
	
	// Add the game id to the selects list in index.html
	$("#gameSelect").append('<option value=' + aGame.id + '>' + aGame.name + '</option>');
	
	$("#maingamelist ul").append('<li>' + aGame.name + '</li>');
	
	// Select list eye candy
	$(".new-game-sidebar li").mouseenter(function() {
		$(this).css("color", "red");
	});
	$(".new-game-sidebar li").mouseleave(function() {
		$(this).css("color", "black");
	});	
}

// Update UI to show the details of the current game
function updateUiWithCurrentGame(aGame) {
	$('#gameDetailsName').html("<strong>Name: </strong>" + aGame.name);
	$('#gameDetailsLocation').html("<strong>Location: </strong>" + aGame.location);
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

