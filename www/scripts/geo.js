/**
 *
 * Holt sich die aktuellen Geodaten in Form von Altidue und Longitude und speichert sie in den Localstorage
 *
 * @method geolocation
 *
 *
 */

function geolocation() {

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    function onSuccess(position) {
        window.localStorage.setItem("lat", position.coords.latitude);
        window.localStorage.setItem("lon", position.coords.longitude);
    }

    function onError(error) {
        var err = error;
        window.localStorage.setItem("err", err);

    }

}