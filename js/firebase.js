

var baseRef = new Firebase('https://the-game.firebaseio.com');
var gamesPath = "/dynamic/games/";
var gamesIds = new Array();
var gameSnapshots = new Array();


function requestGames(callback) {
	
	var childRef = baseRef.child(gamesPath);
	childRef.once('child_added', function(snapshot) {
		
		// Store this snapshot
		gameSnapshots.push(snapshot);
		// Parse this snapshot and write out to console
		var id = parseGameSnapshot(snapshot);

		// Add the game ids to the select list 
		$("#gameSelect").append('<option value=' + id + '>' + id + '</option>');
		$(".middle-sidebar ul").append('<li>' + id + '</li>');
		
		// Select list candy
		$(".middle-sidebar li").mouseenter(function() {
			$(this).css("color", "red");
		});
		$(".middle-sidebar li").mouseleave(function() {
			$(this).css("color", "black");
		});
		
	});
}

function requestOneGame(gameId) {
	
	var childRef = baseRef.child(gamesPath + gameId);
	childRef.once('value', function(snapshot) {
		
		// Parse this snapshot and write out to console
		var id = parseGameSnapshot(snapshot);
	});
}

// Parse a game snapshot and ????
function parseGameSnapshot(snapshot) {
	
	var id = 				snapshot.name();
	var aGame = 			snapshot.val();
	var playersSnapshot = 	snapshot.child("game_players");
	var targetsSnapshot = 	snapshot.child("game_targets");
	
	var name = 			aGame.game_name;
	var location = 		aGame.game_location;
	var numPlayers = 	aGame.game_number_of_players;
	
	var aPlayer = playersSnapshot.numChildren();

	gamesIds += id;
	console.log('Game Name=' + name + " Location=" + location + " #Players=" + numPlayers);
	
	parsePlayers(playersSnapshot);
	parseTargets(targetsSnapshot);


	
	return id;
}

function parsePlayers(playersSnapshot) {
	// Loop through all the Players
	playersSnapshot.forEach(function(childSnapshot) {
		  
		  var playerHash = 	childSnapshot.name();
		  var playerData = 	childSnapshot.val();
		  var id = 			playerData.id;
		  var name = 		playerData.name;
		  var latitude = 	playerData.latitude;
		  var longitude = 	playerData.longitude;
		  var speed = 		playerData.speedHeight;
		  
		  console.log('Player Name=' + name + " Id=" + id + " Latitude=" + latitude + " Longitude=" + longitude + " speed=" + speed);
	});	
}

function parseTargets(playersSnapshot) {
	// Loop through all the Targets
	targetsSnapshot.forEach(function(childSnapshot) {
		  
		  var playerData = 	childSnapshot.val();
		  var id = 			playerData.id;
		  var name = 		playerData.name;
		  var latitude = 	playerData.latitude;
		  var longitude = 	playerData.longitude;
		  var speed = 		playerData.speedHeight;
		  
		  console.log('Target Name=' + name + " Id=" + id + " Latitude=" + latitude + " Longitude=" + longitude + " speed=" + speed);
	});
}

var auth = new FirebaseSimpleLogin(baseRef, function(error, user) {
	if (error) {
		// an error occurred while attempting login
		console.log(error);
	} else if (user) {
		// user authenticated with Firebase
		console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
		requestGames();
	} else {
		// user is logged out
		console.log("User is logged out");
	}
	
});






