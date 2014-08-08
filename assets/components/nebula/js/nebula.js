
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
    if(objLastClickedMarker !== objMarker) {
        objLastClickedMarker = objMarker;
    }
    else {
        objLastClickedMarker = undefined;
    }
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
        zoom: 13,
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
        if(objLastClickedMarker) {
            toggleBounce(objLastClickedMarker);
        }
    });

}

var addNebulaMarkers = function(arrMarkers) {
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

    var strInfoboxMarkup = '<div class="bodega-info" style="width:400px;">'+
    '<div class="row">'+
        '<div class="large-8 columns">'+
        '<h3 id="firstHeading" class="firstHeading">'+strBodegaName+'</h3>'+
            '<img src="assets/components/nebula/images/alt_beer_open.png">'+
                '<img src="assets/components/nebula/images/alt_beer_open.png">'+
                    '<img src="assets/components/nebula/images/alt_beer_open.png">'+
                        '<img src="assets/components/nebula/images/alt_beer_open.png">'+
                            '<img src="assets/components/nebula/images/alt_beer_closed.png">'+
                                '<p>Open today:10-24</p>'+
                                '<p>Get drunk and have fun...</p>'+
                            '</div>'+
                            '<div class="large-4 columns text-right">'+
                                '<img src="assets/components/nebula/images/styrmanden.jpg" style="width:80px; margin-top:20px;">'+
                               '     <p>Streetview</p>'+
                             '   </div>'+
                           ' </div>'+

                          '  <div class="row">'+
                             '   <div class="large-6 columns">'+
                                '    <img src="assets/components/nebula/images/cigarette_no.png">'+
                                      '  <img src="assets/components/nebula/images/ball8_yes.png">'+
                                         '   <img src="assets/components/nebula/images/jukebox_no.png">'+
                                         '   </div>'+
                                          '  <div class="large-6 columns text-right">'+
                                             '   <img src="assets/components/nebula/images/styrmanden.jpg" style="width:40px;">'+
                                              '      <img src="assets/components/nebula/images/styrmanden.jpg" style="width:40px;">'+
                                               '         <img src="assets/components/nebula/images/styrmanden.jpg" style="width:40px;">'+
                                                           ' <p><small>Pictures of '+strBodegaName+'</small></p>'+
                                                        '</div>'+
                                                   ' </div>'+

        '</div>';

    objInfoWindow = new google.maps.InfoWindow({
        content: strInfoboxMarkup
    });
    objInfoWindow.open(objGoogleMap, objMarker);

};


google.maps.event.addDomListener(window, 'load', getBodegaData);
