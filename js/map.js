




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
function initialize() {
	console.log("initialize");
	
	// Fetch our location
	navigator.geolocation.getCurrentPosition(initialiseMyLocation);
	// Set functionality for myLocation button
	$('#myLocation').click(panToMyLocation);

	// Default map focus
	var mapOptions = {
			zoom : 12,
			center : new google.maps.LatLng(53.33, -6.2)
	};

	map = new google.maps.Map(document.getElementById('mapcanvas'),	mapOptions);

	
	firstDraw = true;
	fetchMapData(gameId);
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

// Called when a player needs to be drawn to the map
function drawPlayer(aPlayer) {
	
	console.log('drawPlayer');
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(aPlayer.latitude, aPlayer.longitude),
		clickable: true,
		zIndex: null,
		title: aPlayer.name + " speed=" + aPlayer.speed,
		map: map,
		icon: "img/bats.png"
	});
	
	addMarkerPopups(marker);
}

//Called when a target needs to be drawn to the map
function drawTarget(aTarget) {
	
	console.log('drawTarget');
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(aTarget.latitude, aTarget.longitude),
		clickable: true,
		zIndex: null,
		title: aTarget.name,
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


/*
// On startup
$(document).ready(function() {
	if ( sessionStorage.getItem("gameid")) {
		// Restore the contents of the text field
		gameId = sessionStorage.getItem("gameid");
		console.log('gameid=' + gameId);
	}
});
*/

