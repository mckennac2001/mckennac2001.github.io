
// Animation speed
var speed = 600;
// Global variable
var gameId;

// Setup all the actions
$(document).ready(function() {
	
	// Login to firebase
	auth.login('password', {
		email: 'mckenna.charles@gmail.com',
		password: 'thegame',
		rememberMe: true
	});
	
	// Include the AddPlayers html code
	$(function(){
		$("#player-form").load("AddPlayers.html"); 
	});
    
	// Setup the Add Players form popup
	$('.popup-with-form').magnificPopup({
		type: 'inline',
		preloader: false,
		focus: '#name',
		showCloseBtn: false,

		// When element is focused, some mobile browsers in some cases zoom in
		// It looks not nice, so we disable it:
		callbacks: {
			beforeOpen: function() {
				if($(window).width() < 700) {
					this.st.focus = false;
				} else {
					this.st.focus = '#name';
				}
			}
		}
	});
	$(document).on('click', '.popup-players-save', function (e) {
		$.magnificPopup.close();
	});
	$(document).on('click', '.popup-players-cancel', function (e) {
		$.magnificPopup.close();
	});
    
/*	$("#printGameData").click(function () {
		console.log('printGameData');
		parseGameSnapshot(gameSnapshots[0]);
	});*/
	
	// Start off with the Home button active
	$('#navHome').attr("class","active");

	// Save New Game has been selected
	$('#saveGame').click(function() {
		saveGame();
		$('#navHome').trigger('click');
	});
		
	// Cancel New Game has been selected
	$('#cancelSave').click(function() {
		$('#navHome').trigger('click');
	});
	
	// Delete has been selected
	$('#maingamelist').on('click', 'button.delete', function() {
		console.log('delete this = ' + $(this).parent().parent().attr('value') );
		deleteGame($(this).parent().parent().attr('value'));
	});

	// Edit has been selected
	$('#maingamelist').on('click', 'button.edit', function() {
		console.log('edit this = ' + $(this).parent().parent().attr('value') );
		editGame($(this).parent().parent().attr('value'));
	});
	
	//$("#maingamelist ul").append('<li value=' + aGame.id + '><p>' 
	//		+ aGame.name + ' <button class="edit">Edit</button>  <button class="delete">Delete</button></p></li>');
	
	// Resize the map element when the user has stopped resizing the page
	//var TO = false;
	$(window).resize(function () {
		resizePage();
//		if (TO !== false)
//			clearTimeout(TO);
//		TO = setTimeout(resizePage, 200); //200 is time in miliseconds
	});
	// Call once at startup too
	resizePage();
	    
	// Home button
	$('#navHome').click(function() {
		// Main content area
	    $('.topcontent').slideDown(speed);
	    $('.bottomcontent').slideDown(speed);
	    $('.mapcontent').hide(speed);
	    $('.newmapcontent').hide(speed);
	    $('.gameslistcontent').hide(speed);	
	    // Sidebars
	    $('.new-game-sidebar').hide(speed);
	    $('.game-select-sidebar').slideDown(speed);
	    $('.game-details-sidebar').hide(speed);
	    $('.bottom-sidebar').slideDown(speed);
	    // Nav bar
	    $('#navHome').attr("class","active");
	    $('#navCurrentGame').attr("class","notActive");
	    $('#navNewGame').attr("class","notActive");
	});
	
	// CurrentGame button
	$('#navCurrentGame').click(function() {
		// Main content area
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
	    // Nav bar
	    $('#navHome').attr("class","notActive");
	    $('#navCurrentGame').attr("class","active");
	    $('#navNewGame').attr("class","notActive");
	});

	// NewGame button
	$('#navNewGame').click(function() {
		// Main content area
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
	    // Nav bar
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
		
		// Main content area
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
	    // Nav bar
	    $('#navHome').attr("class","notActive");
	    $('#navCurrentGame').attr("class","active");
	    $('#navNewGame').attr("class","notActive");
		
	    drawGameMap();
	});
	
	detectBrowser();
});

function updateSelectList(aGame) {
	
	// Add the game id to the selects list in index.html
	$("#gameSelect").append('<option value=' + aGame.id + '>' + aGame.name + '</option>');
	
//	$("#maingamelist ul").append('<li value=' + aGame.id + '><p>' 
//			+ aGame.name + ' <button class="edit">Edit</button>  <button class="delete">Delete</button></p></li>');
	$("#maingamelist table").append('<tr value=' + aGame.id + '><td>' 
			+ aGame.name + '</td><td> <button class="edit">Edit</button></td><td><button class="delete">Delete</button></td></tr>');
	
	// Select list eye candy
	$(".new-game-sidebar li").mouseenter(function() {
		$(this).css("color", "#ffacd5");
	});
	$(".new-game-sidebar li").mouseleave(function() {
		$(this).css("color", "black");
	});	
}

function deleteFromSelectList(gameId) {
	
	// Remove this entry from all the UI lists
	$("#gameSelect").find('option[value=' + gameId + ']').remove();
	
//	$("#maingamelist ul").find('li[value=' + gameId + ']').remove();
	$("#maingamelist table").find('td[value=' + gameId + ']').remove();
}

// Update UI to show the details of the current game
function updateUiWithCurrentGame(aGame) {
	$('#gameDetailsName').html("<strong>Name: </strong>" + aGame.name);
	$('#gameDetailsLocation').html("<strong>Location: </strong>" + aGame.location);
}

function resizePage() {

	console.log("resizePage");
    //gWidth = $(window).width();
    gHeight = ($(window).height() - ($('mainheader').height() * 2)) * 0.8;
    if (gHeight < $('new-game-sidebar').height()) {
    	gHeight = $('new-game-sidebar').height();
    }
    $("#newmapcanvas").height(gHeight);
    $("newmapcontent").height(gHeight);
    
  /*  gWidth = gWidth - ((gWidth > 200) ? 100 : 0);
    gHeight = gHeight - ((gHeight > 100) ? 50 : 0);
    $("#gallerycontainer").width(gWidth);
    $("#gallery").width(gWidth);
    $("#gallery").height(gHeight);*/
}

function detectBrowser() {
	console.log("detectBrowser");
	var useragent = navigator.userAgent;
	//var mapdiv = document.getElementById("mapcanvas");

	if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
		alert("its a phone=" + useragent);
		
		// Dynamically chage the body size to 100%
		$('body').css('width', '100%');
		$('slideshows').css('display', 'none');
		$('slideshows').css('height', '0%');
		$('mainheader nav').css('height', '80px');
		$('mainfooter').css('display', 'none');
		$('body').css('font-size', '120%');

		//mapdiv.style.width = '100%';
		//mapdiv.style.height = '100%';
	} else {
		//mapdiv.style.width = '600px';
		//mapdiv.style.height = '800px';
	}
}

