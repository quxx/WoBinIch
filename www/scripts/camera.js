/**
 *
 * Öffnet die jeweilige KameraApp des Smartphones sodass der Benutzer ein Photo machen kann, tut er dies wird die funktion createQuestionArray mit den aktuellen geoDaten etc
 * dieses so erstelle QuestionJSON sendet er nun an jeden Benutzer des ChatServers Gleichzeitig läd er über den Server das eben geschossene Foto hoch und sended diese img Nahricht
 * ebendefalls an jeden Benutzer, sodass nun jeder Mitspieler eine JSON Nachricht + die dazugehörige Bildnachricht bekommt.
 *
 * @method takePicture
 *
 *
 */

function takePicture() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 20,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: true,
        correctOrientation: true
    });

    function onSuccess(imageURI) {
        var time, user, pass, lat, lon, score, open, Jason, userArray, i, recipient;
        time = Date.now();
        user = window.localStorage.getItem("loginname");
        geolocation();
        lat = window.localStorage.getItem("lat");
        lon = window.localStorage.getItem("lon");
        score = getScore(user);
        open = "true";
        Jason = createQuestionJSON(time, user, lat, lon, score, open);
        userArray = getUserArray();
        for (i in userArray) {
            recipient = userArray[i];
            ajxSendJSON(Jason, recipient);
            uploadImage(imageURI, recipient, Jason);
        }

    }


    function onFail(message) {
        console.log('Failed because: ' + message);
    }
}