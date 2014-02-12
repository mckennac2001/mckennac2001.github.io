

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
		// user is authenticated
		console.log('User ID: ' + user.id + ', Provider: ' + user.provider);	
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
		var aGame = parseGameSnapshot(snapshot);
		
		updateSelectList(aGame);
	});
}

// Parse a game snapshot and return a Game object
function parseGameSnapshot(snapshot) {
	
	console.log('parseGameSnapshot');
	var gameVal = snapshot.val();
	if (gameVal == null) {
		console.log('snapshot.val() == null');
		return null;
	}

	var aGame = {
		id: 		snapshot.name(),
		name: 		gameVal.game_name,
		location: 	gameVal.game_location,
		numPlayers: gameVal.game_number_of_players
	};
	
	console.log('aGame id=' + aGame.id + ', name=' + aGame.name + ', location=' + aGame.location);
	return aGame;
}


function fetchMapData(gameId) {
	
	console.log('fetchMapData ' + gamesPath + gameId);
	
	// We should destroy any subscriptions we have for old firebases
	while (firebaseRefList.length > 0) {
		firebaseRefList.pop().off();
	}

	var childRef = baseRef.child(gamesPath + gameId);
	childRef.once('value', function(snapshot) {
		
		console.log('fetchMapData callback');
		
		var aGame = parseGameSnapshot(snapshot);
		if (aGame == null) return;

		// Update UI with our new game info
		updateUiWithCurrentGame(aGame);
		fetchPlayers(baseRef.child(gamesPath + gameId + '/' + 'game_players'));
		fetchTargets(baseRef.child(gamesPath + gameId + '/' + 'game_targets'));
		
		console.log('fetchMapData callback end');
	});
	
	console.log('fetchMapData end');
}

function fetchPlayers(playerRef)	{

	console.log('fetchPlayers');
	firebaseRefList.push(playerRef);
	playerRef.on('value', function(snapshot) {

		console.log('fetchPlayers new data');
		snapshot.forEach(function(childSnapshot) {

			console.log('fetchPlayers forEach');
//			var playerHash = 	childSnapshot.name();
			var playerData = 	childSnapshot.val();
			
			// Create a player object to pass to map drawing functions
			var aPlayer = new Player(playerData.id,
									 playerData.name,
									 playerData.latitude,
									 playerData.longitude,
									 playerData.speedHeight);
//									 childSnapshot.name());
			drawPlayer(aPlayer);
			
			console.log('Player Name=' + aPlayer.name + " Id=" + aPlayer.id + " Latitude=" + aPlayer.latitude + " Longitude=" + aPlayer.longitude + " speed=" + aPlayer.speed);
			console.log('fetchPlayers end');
		});		
	});	
}

function fetchTargets(targetRef)	{

	console.log('fetchTargets');
	firebaseRefList.push(targetRef);
	targetRef.on('value', function(snapshot) {

		console.log('fetchTargets new data');
		snapshot.forEach(function(childSnapshot) {

			console.log('fetchTargets forEach');
			var targetData = 	childSnapshot.val();
			
			// Create a target object to pass to map drawing functions
			var aTarget = { 
				id: 			targetData.id,
				name: 			targetData.name,
				latitude: 		targetData.latitude,
				longitude:	 	targetData.longitude,
				speed:	 		targetData.speedHeight,
				hitters:		targetData.hitters
			};
			drawTarget(aTarget);
			
			console.log('Target Name=' + aTarget.name + " Id=" + aTarget.id + " Latitude=" + aTarget.latitude + " Longitude=" + aTarget.longitude + " speed=" + aTarget.speed);
			console.log('fetchTargets end');
		});		
	});	
}

function writeGameData(aGame) {
	console.log('writeGameData');

	var id = generateUUID();
	// Change reference to the game we just created
	var ref = baseRef.child("/dynamic/games/" + id);
	// Write the game data
	ref.set(aGame);
}

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};





