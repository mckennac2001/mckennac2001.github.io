
var gameRef = new Firebase('https://the-game.firebaseio.com');

var auth = new FirebaseSimpleLogin(gameRef, function(error, user) {
	if (error) {
		// an error occurred while attempting login
		console.log(error);
	} else if (user) {
		// user authenticated with Firebase
		console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
	} else {
		// user is logged out
		console.log("user is logged out!");
	}
});

auth.login('password', {
	email: 'mckenna.charles@gmail.com',
	password: 'thegame',
	rememberMe: true
});