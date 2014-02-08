

var baseRef = new Firebase('https://the-game.firebaseio.com');
var gamesPath = "/dynamic/games/";

function requestGames() {
	var childRef = baseRef.child(gamesPath);
	
	childRef.on('child_added', function(snapshot) {
		var aGame = snapshot.val();
		var name = aGame.game_name;
		console.log('Game Name: ' + name);
		$("#gameSelect").append('<option value=' + name + '>' + name + '</option>');
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

auth.login('password', {
	email: 'mckenna.charles@gmail.com',
	password: 'thegame',
	rememberMe: true
});

$('#gameSelect').onSelect(function() {    
	console.log("Selected ");
    //$('#SelectTitle').text( '$' + $(':selected', this).data("value") );
});
