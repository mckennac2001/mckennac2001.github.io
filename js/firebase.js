

var baseRef = new Firebase('https://the-game.firebaseio.com');
var gamesPath = "/dynamic/games/";
var gamesIds = new Array();
var firebaseRefList = new Array();
var firstDraw = true;

// Start the Firebase communication
var auth = new FirebaseSimpleLogin(baseRef, function(error, user) {
	console.log("FirebaseSimpleLogin");
	if (error) {
		// an error occurred while attempting login
		console.log(error);
	} else if (user) {
		// user authenticated with Firebase
		console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
/*		if (page == "index") {
			populateGameIdList(); 
		} else {
			populateMap();
		}*/
		
		populateGameIdList(); 
		
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
	
	console.log('populateGameIdList');
	
	var childRef = baseRef.child(gamesPath);
	childRef.on('child_added', function(snapshot) {
		// This is called for each Game in the DB
		
		console.log('populateGameIdList callback');
		
		// Stop observing the last 
		// Store this snapshot
//		gameSnapshots.push(snapshot);
		// Parse this snapshot and write out to console
		var aGame = parseGameSnapshot(snapshot);

		console.log('aGame id=' + aGame.id + ', name=' + aGame.name);
		
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
		
	});
}

function addMarkerPopups(marker) {

	console.log('addMarkerPopups');
	
	// Create an info window with the markers text
	//var infowindow = new google.maps.InfoWindow({
	//	content: marker.getTitle()
	//});

	var infobox = new InfoBox({
		content: "<h2>" + marker.getTitle() + "</h2>",
		disableAutoPan: false,
		maxWidth: 150,
		pixelOffset: new google.maps.Size(-140, 0),
		zIndex: null,
		/*boxClass: "infoBox1",*/
		boxStyle: {
			background: "img/red.jpg",
			opacity: 1,
			width: "150px",
			"border-style": "groove",
			"background-color": "#FFF",
			"border-radius": "8px"
		},
		closeBoxURL: "",
		infoBoxClearance: new google.maps.Size(1, 1)
	});

	google.maps.event.addListener(marker, 'click', function() {
		infobox.open(map, marker);
		map.panTo(marker.position);
	});
	
	// Add a listiner so the info window would be displayed on rollower
	google.maps.event.addListener(marker,"mouseover",function(){
		//infowindow.open(marker.get('map'), marker);
		infobox.open(map, marker);
	}); 

	google.maps.event.addListener(marker,"mouseout",function(){
		//infowindow.close();
		infobox.close();
	}); 
}


function populateMap(gameId) {
	
	console.log('populateMap ' + gamesPath + gameId);
			
	// We should destroy any subscriptions we have for old firebases
	while (firebaseRefList.length > 0) {
		firebaseRefList.pop().off();
	}

	var childRef = baseRef.child(gamesPath + gameId);
	childRef.once('value', function(snapshot) {
		
		console.log('populateMap callback');
		
		// Parse this snapshot and write out to console;
		var id = 				snapshot.name();
		var aGame = 			snapshot.val();
		console.log('aGame=' + aGame);	
		
		if (aGame == null) return;
		
		var name = 			aGame.game_name;
		var location = 		aGame.game_location;
//		var numPlayers = 	aGame.game_number_of_players;
		
		$('#gametitle').text(name + " : " + location);
//		$('#mapcanvas').css('visibility', 'visible');
		
//		console.log("players: " + gamesPath + gameId + '/' + 'game_players');
		populatePlayers(baseRef.child(gamesPath + gameId + '/' + 'game_players'));
//		console.log("targets: " + gamesPath + gameId + '/' + 'game_targets');
		populateTargets(baseRef.child(gamesPath + gameId + '/' + 'game_targets'));
		
		console.log('populateMap callback end');
	});
	
	console.log('populateMap end');
}

function populatePlayers(playerRef)	{

	console.log('populatePlayers');
	firebaseRefList.push(playerRef);
	playerRef.on('value', function(snapshot) {

		console.log('populatePlayers value');
		snapshot.forEach(function(childSnapshot) {

			console.log('populatePlayers forEach');
			var playerHash = 	childSnapshot.name();
			var playerData = 	childSnapshot.val();
			var id = 			playerData.id;
			var name = 			playerData.name;
			var latitude = 		playerData.latitude;
			var longitude = 	playerData.longitude;
			var speed = 		playerData.speedHeight;

			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(latitude, longitude),
				clickable: true,
				zIndex: 2,
				title: name + " speed=" + speed,
				map: map,
				icon: "img/bats.png"
			});

			addMarkerPopups(marker);

			console.log('Player Name=' + name + " Id=" + id + " Latitude=" + latitude + " Longitude=" + longitude + " speed=" + speed);
		});		
	});	
}

function populateTargets(targetRef)	{

	console.log('populateTargets');
	firebaseRefList.push(targetRef);
	targetRef.on('value', function(snapshot) {

		console.log('populateTargets value');
		snapshot.forEach(function(childSnapshot) {

			console.log('populateTargets forEach');
			var targetData = 	childSnapshot.val();
			var id = 			targetData.id;
			var name = 			targetData.name;
			var latitude = 		targetData.latitude;
			var longitude = 	targetData.longitude;
			var speed = 		targetData.speedHeight;

			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(latitude, longitude),
				clickable: true,
				zIndex: 2,
				title: name,
				map: map,
				icon: "img/shootingrange.png"
			});

			addMarkerPopups(marker);

			if (firstDraw) {
				// refocus the map
				map.setCenter(marker.getPosition());
				map.setZoom(13);
				firstDraw = false;
			}
			console.log('Target Name=' + name + " Id=" + id + " Latitude=" + latitude + " Longitude=" + longitude + " speed=" + speed);
		});		
	});	
}

// Parse a game snapshot and return a BasicGame object
function parseGameSnapshot(snapshot) {
	
	var id = 			snapshot.name();
	var aGame = 		snapshot.val();

	var name = 			aGame.game_name;
	var location = 		aGame.game_location;
	var numPlayers = 	aGame.game_number_of_players;
	
//	var aPlayer = playersSnapshot.numChildren();

	var aGame = {
		id: id,
		name: name,
		location: location,
		numPlayers: numPlayers
	}
	return aGame;
}







