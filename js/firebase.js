

var baseRef = new Firebase('https://the-game.firebaseio.com');
var gamesPath = "/dynamic/games/";
var gamesIds = new Array();
var gameSnapshots = new Array();

// Start the Firebase communication
var auth = new FirebaseSimpleLogin(baseRef, function(error, user) {
	if (error) {
		// an error occurred while attempting login
		console.log(error);
	} else if (user) {
		// user authenticated with Firebase
		console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
		if (page == "index") {
			populateGameIdList(); 
		} else {
			populateMap();
		}
		
	} else {
		// user is logged out
		console.log("User is logged out");
	}
});

auth.login('password', {
	email: 'mckenna.charles@gmail.com',
	password: 'thegame',
	rememberMe: true
});

// Retrieve all the games data and add it to the select list
function populateGameIdList() {
	
	var childRef = baseRef.child(gamesPath);
	childRef.on('child_added', function(snapshot) {
		// This is called for each Game in the DB
		
		// Store this snapshot
		gameSnapshots.push(snapshot);
		// Parse this snapshot and write out to console
		var id = parseGameSnapshot(snapshot);

		// Add the game id to the select list in index.html
		$("#gameSelect").append('<option value=' + id + '>' + id + '</option>');
		$(".middle-sidebar ul").append('<li>' + id + '</li>');
		
		// Select list eye candy
		$(".middle-sidebar li").mouseenter(function() {
			$(this).css("color", "red");
		});
		$(".middle-sidebar li").mouseleave(function() {
			$(this).css("color", "black");
		});
		
	});
}


function populateMap(gameId) {
	
	console.log('populateMap');
			
	var childRef = baseRef.child(gamesPath + gameId);
	childRef.on('value', function(snapshot) {
		
		console.log('populateMap callback');
		
		// Parse this snapshot and write out to console
			console.log('snapshot=' + snapshot);
		var id = 				snapshot.name();
			console.log('id=' + id);
		var aGame = 			snapshot.val();
		
		if (aGame == null) return;
		
			console.log('aGame=' + aGame);
		var playersSnapshot = 	snapshot.child("game_players");
		var targetsSnapshot = 	snapshot.child("game_targets");
		
		var name = 			aGame.game_name;
		var location = 		aGame.game_location;
		var numPlayers = 	aGame.game_number_of_players;
		
		$('#gametitle').text(name);
		$('#mapcanvas').css('visibility', 'visible');
		
		playersSnapshot.forEach(function(childSnapshot) {
			  
			  var playerHash = 	childSnapshot.name();
			  var playerData = 	childSnapshot.val();
			  var id = 			playerData.id;
			  var name = 		playerData.name;
			  var latitude = 	playerData.latitude;
			  var longitude = 	playerData.longitude;
			  var speed = 		playerData.speedHeight;
			  
			  var pos = new google.maps.LatLng(latitude, longitude);
			  
			  var marker = new google.maps.Marker({
				  position: pos,
				  clickable: true,
				  zIndex: 2,
				  title: name + " speed=" + speed,
				  map: map,
				  icon: "img/bats.png"
			  });
			  
			  google.maps.event.addListener(marker, 'click', function() {
				  console.log('marker=' + marker.getTitle());
			  });

			  console.log('Player Name=' + name + " Id=" + id + " Latitude=" + latitude + " Longitude=" + longitude + " speed=" + speed);
		});		
		
		targetsSnapshot.forEach(function(childSnapshot) {
			  
			  var playerData = 	childSnapshot.val();
			  var id = 			playerData.id;
			  var name = 		playerData.name;
			  var latitude = 	playerData.latitude;
			  var longitude = 	playerData.longitude;
			  var speed = 		playerData.speedHeight;
			  
			  var pos = new google.maps.LatLng(latitude, longitude);
			  
			  var marker = new google.maps.Marker({
				  position: pos,
				  clickable: true,
				  zIndex: 2,
				  title: name,
				  map: map,
				  icon: "img/shootingrange.png"
			  });
			  
			  map.setCenter(marker.getPosition());
			  map.setZoom(13);
			  
			  google.maps.event.addListener(marker, 'click', function() {
				  console.log('marker=' + marker.getTitle());
			  });
			  
			  console.log('Target Name=' + name + " Id=" + id + " Latitude=" + latitude + " Longitude=" + longitude + " speed=" + speed);
		});
		
		console.log('populateMap callback end');
	});
	
	console.log('populateMap end');
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

function parseTargets(targetsSnapshot) {
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







