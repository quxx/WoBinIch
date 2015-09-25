/*global geolocation, ajxSendToUser, ajxSendJSON, getUserArray, setUploadArray, uploadImage, createQuestionJSON*/

function takePicture() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 20,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: true,
        correctOrientation: true
    });

    function onSuccess(imageURI) {
        var time, user, pass, lat, lon, score, open, Jason, userArray, i, j, recipient;
        time = Date.now();
        user = window.localStorage.getItem("loginname");
        geolocation();
        lat = window.localStorage.getItem("lat");
        lon = window.localStorage.getItem("lon");
        score = "0";
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