function geolocation() {

    navigator.geolocation.getCurrentPosition(onSuccess, onError);


    // onSuccess Geolocation
    //
    function onSuccess(position) {
        window.localStorage.setItem("lat", position.coords.latitude);
        window.localStorage.setItem("lon", position.coords.longitude);
        //alert (lat + "<br>" + window.localStorage.getItem("lat"));
    }

    function onError(error) {
        var err = error;
        window.localStorage.setItem("err", err);

    }

}

function JSONAddGeo(JSONObj) {

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    function onSuccess(position) {
        JSONObj["geodata"] = position;
    }
    
    function onError(error) {
    var err = error;
        alert('Fehler beim ermitteln der Koordinaten!');
    }
}