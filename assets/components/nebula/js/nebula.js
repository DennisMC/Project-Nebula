
// Test/Dummy Data
var myLatitude = 55.680206;
var myLongitude = 12.591796;
var locBetterCollective = new google.maps.LatLng(myLatitude, myLongitude);

// Nebula JavaScript
var objGoogleMap, arrMarkersOnMap = [], objNewlyAddedMarker, objLastClickedMarker;
var objInfoWindow;
var strIconBase = 'http://www.bodega.ninja/assets/components/nebula/images/';



function toggleBounce(objMarker) {
    if(objLastClickedMarker) {
        objLastClickedMarker.setAnimation(null);
    }

    if (objMarker.getAnimation() != null) {
        objMarker.setAnimation(null);
    } else {
        objMarker.setAnimation(google.maps.Animation.BOUNCE);
    }
    objLastClickedMarker = objMarker;
}


function addNewLocation(e) {
    if(typeof addNewMarker != 'undefined') {
        addNewMarker.setMap(null);
    }
    addNewMarker = new google.maps.Marker({
        map:objGoogleMap,
        draggable:true,
        position: e.latLng
    });
}

function getBodegaData() {
    ajaxRpc('web/getLocations', {}, 'nebula', function(objData){
        initialize();
        addNebulaMarkers(objData['result']);
    }, '', '');

}
function initialize() {

    var mapOptions = {
        zoom: 18,
        center: locBetterCollective
    };
    var arrNoInfoIcons = [
        {
            featureType: "poi",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];

    objGoogleMap = new google.maps.Map(document.getElementById('mapCurrentLocation'), mapOptions);
    objGoogleMap.setOptions({styles: arrNoInfoIcons});

    google.maps.event.addListener(objGoogleMap, 'click', addNewLocation);
    google.maps.event.addListener(objGoogleMap, 'click', function() {
        if(typeof objInfoWindow != 'undefined') {
            objInfoWindow.close();
        }

    });

}

var addNebulaMarkers = function(arrMarkers) {
    console.log(arrMarkers);
    for(var i = 0; i < arrMarkers.length; i += 1) {
        var locBodegaMarker = new google.maps.LatLng(arrMarkers[i].latitude, arrMarkers[i].longtitude);
        var strMarkerIcon = 'alt_beer_open.png';
        arrMarkersOnMap[i] = new google.maps.Marker({
            map: objGoogleMap,
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: locBodegaMarker,
            id: i,
            name: arrMarkers[i].name,
            address1: arrMarkers[i].extended.address1,
            phone: arrMarkers[i].extended.phone,
            icon: strIconBase + strMarkerIcon
        });

        google.maps.event.addListener(arrMarkersOnMap[i], 'click', function() {
            toggleBounce(this);
            openInfoWindow(this);
        });
    }
};
var openInfoWindow = function(objMarker) {
    if(typeof objInfoWindow != 'undefined') {
        objInfoWindow.close();
    }
    var strBodegaName = objMarker.name;
    var strBodegaAddress = objMarker.address1;
    var strBodegaPhone = objMarker.phone;
    var strInfoboxMarkup = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h3 id="firstHeading" class="firstHeading">'+strBodegaName+'</h3>'+
        '<div id="bodyContent">'+
        '<p style="">Much Text, so content.. Wow</p>'+
        '<p>Adr: '+strBodegaAddress+' --- Tlf: '+ strBodegaPhone+ '</p>'+
        '</div>'+
        '</div>';

    objInfoWindow = new google.maps.InfoWindow({
        content: strInfoboxMarkup
    });
    objInfoWindow.open(objGoogleMap, objMarker);

};


google.maps.event.addDomListener(window, 'load', getBodegaData);
