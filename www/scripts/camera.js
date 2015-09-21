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
        var time, user, pass, lat, lon, score, open, Jason, uploadArray, userArray, i, recipient;
        time = Date.now();
        user = window.localStorage.getItem("username");
        pass = window.localStorage.getItem("password");
        geolocation();
        lat = window.localStorage.getItem("lat");
        lon = window.localStorage.getItem("lon");
        score = "PLACEHOLDER";
        open = "true";
        Jason = createQuestionJSON(time, user, pass, lat, lon, imageURI, score, open);
        userArray = getUserArray();
        for (i in userArray) {
            recipient = userArray[i];
            uploadImage(imageURI, recipient Jason);
        }


    }


    function onFail(message) {
        console.log('Failed because: ' + message);
    }
}