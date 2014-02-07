
var map;
var markers = [];
var myLocation = null;

function initialiseMyLocation(location) {
	console.log(location);
	myLocation = location;
}

function panToMyLocation() {
	
	if (myLocation != null) {
		var latlng = new google.maps.LatLng(myLocation.coords.latitude, myLocation.coords.longitude);
		console.log(latlng);
		map.panTo(latlng);
	} else {
		console.log("myLocation was null");
	}
}

function populateMarkers() {

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

function initialize() {

	navigator.geolocation.getCurrentPosition(initialiseMyLocation);

	var mapOptions = {
			zoom : 10,
			center : new google.maps.LatLng(53.33, -6.2)
	};

	map = new google.maps.Map(document.getElementById('mapcanvas'),	mapOptions);

	google.maps.event.addListener(map, 'click', function(event) {
		addMarker(event.latLng);
	});

	$('#showTargets').click(showMarkers);
	$('#hideTargets').click(clearMarkers);
	$('#myLocation').click(panToMyLocation);
}

function detectBrowser() {
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