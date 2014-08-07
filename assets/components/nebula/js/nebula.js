var map;
var marker;
var myLatitude = 55.680206;
var myLongitude = 12.591796;
var locBetterCollective = new google.maps.LatLng(myLatitude, myLongitude);

function toggleBounce() {

    if (marker.getAnimation() != null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function addNewLocation(e) {
    console.log(e);
}

function initialize() {
    var mapOptions = {
        zoom: 18,
        center: locBetterCollective
    };
    map = new google.maps.Map(document.getElementById('mapCurrentLocation'),
        mapOptions);

    marker = new google.maps.Marker({
        map:map,
        draggable:true,
        animation: google.maps.Animation.DROP,
        position: locBetterCollective
    });
    google.maps.event.addListener(marker, 'click', toggleBounce);
    google.maps.event.addListener(map, 'click', addNewLocation);
}

google.maps.event.addDomListener(window, 'load', initialize);
