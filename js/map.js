
/*
function populateMarkers() {

	console.log("populateMarkers");
	var markerArray = [new google.maps.LatLng(53.33, -6.2), new google.maps.LatLng(53.23, -6.1)]

	for (var i=0; i<markerArray.length; i++) {
		var marker = new google.maps.Marker({
			position: markerArray[i],
			map: map,
			icon: "img/rabbit_icons_sm2.png"
		});
	}			
}

// Add a marker to the map and push to the array.
function addMarker(location) {
	console.log("addMarker");
	var marker = new google.maps.Marker({
		position: location,
		map: map,	
		icon: "img/rabbit_icons_sm2.png"
	});
	markers.push(marker);
}

// Sets the map on all markers in the array.
function setAllMap(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
	setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
	clearMarkers();
	markers = [];
}
*/

// Storage for newGame markers

var targetMarkersToSave = [];
var targetMarkers = [];
var playerMarkers = [];
var infoBoxes = [];

function GameMarker(id, marker) {
	this.id = id;
	this.marker = marker;
}

String.prototype.hashCode = function() {
	var hash = 0;
	if (this.length == 0) return hash;
	for (var i = 0; i < this.length; i++) {
		car = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + car;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

function LongPress(map, length) {
	this.length_ = length;
	var me = this;
	me.map_ = map;
	me.timeoutId_ = null;
	google.maps.event.addListener(map, 'mousedown', function(e) {
		me.onMouseDown_(e);
	});
	google.maps.event.addListener(map, 'mouseup', function(e) {
		me.onMouseUp_(e);
	});
	google.maps.event.addListener(map, 'drag', function(e) {
		me.onMapDrag_(e);
	});
}; 

// Longpress functionality for markers
LongPress.prototype.onMouseUp_ = function(e) {
	console.log("prototype.onMouseUp");
	clearTimeout(this.timeoutId_);
};
LongPress.prototype.onMouseDown_ = function(e) {
	console.log("prototype.onMouseDown");
	clearTimeout(this.timeoutId_);
	var map = this.map_;
	var event = e;
	this.timeoutId_ = setTimeout(function() {
		console.log("trigger longpress");
		google.maps.event.trigger(map, 'longpress', event);
	}, this.length_);
};
LongPress.prototype.onMapDrag_ = function(e) {
	clearTimeout(this.timeoutId_);
};

function drawGameMap() {
	console.log("drawGameMap");
	
	// Default map focus
	var mapOptions = {
			zoom : 12,
			center : new google.maps.LatLng(53.33, -6.2)
	};

	map = new google.maps.Map(document.getElementById('mapcanvas'),	mapOptions);
	
	firstDraw = true;
	targetMarkersToSave.length = 0;
	targetMarkers.length = 0;
	playerMarkers.length = 0;
	
	fetchMapData(gameId);
}

function drawNewMap() {
	console.log("drawNewMap");
	
	// Default map focus
	var mapOptions = {
			zoom : 12,
			center : new google.maps.LatLng(53.33, -6.2)
	};

	map = new google.maps.Map(document.getElementById('newmapcanvas'),	mapOptions);
	
	targetMarkersToSave.length = 0;
	targetMarkers.length = 0;
	playerMarkers.length = 0;
	
	// Setup the onClick and drag handlers
	google.maps.event.addListener(map, 'click', function(event) {
		addMarker(event.latLng);
	});
}

//Add a marker to the map and push to the array.
function addMarker(location) {
	console.log("addMarker");
	var infoBoxVisible = false;
	var targetName = "";
	
	var marker = new google.maps.Marker({
		position: location,
		map: map,	
		draggable: true,
		title: "a marker",
		icon: "img/rabbit_icons_sm2.png"
	});
	
	targetMarkersToSave.push(marker);
	//targetMarkers.push(new GameMarker("", marker));
		
	var infobox = new InfoBox({
		content: "<div id='tabs'>"+
					"<form id='targetNameForm'>"+
			        	"<div>"+
			        		"<input type='text' width='100%' id='targetNameText' value='" + marker.getTitle() + "'>"+ 
			        		//" <script> $('this').parent().submit(function(e) { e.preventDefault(); console.log('infoBox submit'); } </script>" +
			        	"</div>"+
			        "</form>"+
			     "</div>",
		disableAutoPan: false,
		maxWidth: 160,
		pixelOffset: new google.maps.Size(-140, 0),
		zIndex: null,
		/*boxClass: "infoBox1",*/
		boxStyle: {
			background: "img/red.jpg",
			opacity: .8,
			width: "160px",
			"border-style": "groove",
			"background-color": "#FFF",
			"border-radius": "8px"
		},
		closeBoxURL: "",
		infoBoxClearance: new google.maps.Size(1, 1)
	});
	
	// Click event for marker
	google.maps.event.addListener(marker, 'click', function() {
		console.log('click');
		if (!infoBoxVisible) {
			// Close the other possible info box
			
			while (infoBoxes.length > 0) {
				infoBoxes.pop().close();
			}
			infobox.open(map, marker);
			
			infoBoxes.push(infobox);
			infoBoxVisible = true;
		} else {
			var markerText = $('#targetNameText').val();
			console.log(markerText);
			if (markerText) {
				marker.setTitle(markerText);
			}
			infobox.close();
			infoBoxes.pop();
			infoBoxVisible = false;
		}
	});
	
	// Right click event on marker
    google.maps.event.addListener(marker, 'rightclick', function(event) {
    	console.log('rightclick');
		if (infoBoxVisible) {
			infobox.close();
		}
		marker.setMap(null);
		console.log("markers count " + targetMarkersToSave.length);
		var pos = targetMarkersToSave.indexOf(marker);
		targetMarkersToSave.splice(pos, 1);
		console.log("markers count " + targetMarkersToSave.length);
    });
    
    new LongPress(marker, 500);
	// Long press event on marker
    google.maps.event.addListener(marker, 'longpress', function(event) {
    	console.log('longpress');
		if (infoBoxVisible) {
			infobox.close();
		}
		marker.setMap(null);
		console.log("markers count " + targetMarkersToSave.length);
		var pos = targetMarkersToSave.indexOf(marker);
		targetMarkersToSave.splice(pos, 1);
		console.log("markers count " + targetMarkersToSave.length);
    });
}

function captureForm() {
	console.log("captureForm");
	console.log("captured " + $('#targetNameText').val());
	while (infoBoxes.length > 0) {
		infoBoxes.pop().close();
	}
	return false;
};


function saveGame() {
	console.log("saveGame");	
	// Get game details from the form

	// Get the list of players
	var players = [];
	$('.newGamePlayer').each(function(){
		if ($(this).val() != "") {
			var aPlayer = new Player($(this).val(), "somename");
			players.push(aPlayer);
		}
	});
	var game_players = new Players(players);
	
	// Turn the list of Target Markers on the map into objects we can store
	var game_targets = [];
	for (var i=0; i < targetMarkersToSave.length; i++) {
		
		var aTarget = {
			id: generateUUID(),
			name: targetMarkersToSave[i].getTitle(),
			latitude: targetMarkersToSave[i].getPosition().lat(),
			longitude: targetMarkersToSave[i].getPosition().lng(),
			speedHeight: 0
		};
		game_targets.push(aTarget);
	}
	
	// Create the game object to save to firebase
	var aGame = {
		game_name: $('.newGameName').val(),
		game_location: $('.newGameLocation').val(),
		game_targets: game_targets,
		game_players: game_players
	};

	console.log(aGame);
	writeGameData(aGame);
}

function deleteGame(gameId) {
	console.log("deleteGame");	
	
	var choice = confirm("Are you sure?");
	
	if(choice == true) { 
		deleteGameData(gameId);
	}
}

function editGame(gameId) {
	console.log("editGame");	
}

function Player(id, name, latitude, longitude, speedHeight) {
	this.id = id;
	this.name = name;
	this.latitude = typeof latitude !== 'undefined' ? latitude : 0;
	this.longitude = typeof longitude !== 'undefined' ? longitude : 0;
	this.speedHeight = typeof speedHeight !== 'undefined' ? speedHeight : 0;
//	this.hash = hash;
}

function Players(players) {
	var len = players.length;
	for (var i=0; i < len; i++) {
		var uid = players[i].id.hashCode();
		console.log("uid=" + uid);
		this[uid] = players[i];
	}
	console.log("Players= " + this);
}


function shortUUID (){
	return (new Date().getTime() + Math.random());
}




function initialiseMyLocation(location) {
	console.log("initialiseMyLocation: " + location);
	// Store my location
	myLocation = location;
}

// Move map to my location
function panToMyLocation() {
	
	console.log("panToMyLocation");
	if (myLocation != null) {
		var latlng = new google.maps.LatLng(myLocation.coords.latitude, myLocation.coords.longitude);
		console.log(latlng);
		map.panTo(latlng);
		//map.setCenter(latlng);
	} else {
		console.log("myLocation was null");
	}
}

// Called when a player needs to be [re]drawn to the map
function drawPlayer(aPlayer) {
	
	console.log('drawPlayer');
	// If there is an old marker for this player, we just move it
	for (var i = 0; i < playerMarkers.length; i++) {
		if (playerMarkers[i].id == aPlayer.id) {
			playerMarkers[i].marker.setPosition(new google.maps.LatLng(aPlayer.latitude, aPlayer.longitude));
			//playerMarkers[i].marker.setAnimation(google.maps.Animation.BOUNCE);
			return;
			//playerMarkers[i].marker.setMap(null);
			//playerMarkers.splice(i, 1);
			//break;
		}
	}
	// If we are here, this is the first time we have seen this player
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(aPlayer.latitude, aPlayer.longitude),
		clickable: true,
		zIndex: null,
		title: aPlayer.name + ", speed=" + aPlayer.speed,
		map: map,
		icon: "img/bats.png"
	});
	
	// Add some popup functionality
	addMarkerPopups(marker);
	
	// Store this new marker so we can delete it if the player moves
	playerMarkers.push(new GameMarker(aPlayer.id, marker));
}

// Called when a target needs to be [re]drawn to the map
function drawTarget(aTarget) {
	
	console.log('drawTarget');
	// If there is an old marker for this target, we update it
	for (var i = 0; i < targetMarkers.length; i++) {
		if ((targetMarkers[i].getPosition().lat() == aTarget.latitude) && 
			(targetMarkers[i].getPosition().lng() == aTarget.longitude) && 
			(aTarget.hitters != undefined)) {
			// Someone has hit this marker
			//targetMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
			targetMarkers[i].setIcon("img/cup.png");
			return;
		}
	}
	
	var iconPath;
	if (aTarget.hitters != undefined) {
		iconPath = "img/cup.png";
	} else {
		iconPath = "img/shootingrange.png";
	}
	
	// If we are here, this is a new marker
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(aTarget.latitude, aTarget.longitude),
		clickable: true,
		zIndex: null,
		title: aTarget.name,
		map: map,
		icon: iconPath
	});

	// Store this marker so we can change it later when it gets hit
	targetMarkers.push(marker);
	addMarkerPopups(marker);

	if (firstDraw) {
		// refocus the map
		map.setCenter(marker.getPosition());
		map.setZoom(13);
		firstDraw = false;
	}
}

function addMarkerPopups(marker) {

	console.log('addMarkerPopups');
	// Create the infoBox that will be displayed
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
	
	// Add a listener so the info window would be displayed on rollover
	google.maps.event.addListener(marker,"mouseover",function(){
		//infowindow.open(marker.get('map'), marker);
		infobox.open(map, marker);
	}); 

	google.maps.event.addListener(marker,"mouseout",function(){
		//infowindow.close();
		infobox.close();
	}); 
}




// On startup
$(document).ready(function() {
	
	// Fetch our location
	navigator.geolocation.getCurrentPosition(initialiseMyLocation);
	// Set functionality for myLocation button
	$('#myLocation').click(panToMyLocation);
	
/*	if ( sessionStorage.getItem("gameid")) {
		// Restore the contents of the text field
		gameId = sessionStorage.getItem("gameid");
		console.log('gameid=' + gameId);
	}*/
});


