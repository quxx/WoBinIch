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
        var time, user, pass, lat, lon, score, open, Jason, uploadArray, userArray, i, j, recipient;
        time = Date.now();
        user = window.localStorage.getItem("username");
        pass = window.localStorage.getItem("password");
        geolocation();
        lat = window.localStorage.getItem("lat");
        lon = window.localStorage.getItem("lon");
        score = "PLACEHOLDER";
        open = "true";
        Jason = createQuestionJSON(time, user, pass, lat, lon, imageURI, score, open);
        setUploadArray(Jason);
        uploadArray = window.localStorage.getItem("uploadArray");
        userArray = getUserArray();
<<<<<<< HEAD
<<<<<<< HEAD
        for (i in userArray) {
            recipient = userArray[i];
            uploadImage(imageURI, recipient, Jason);
        }
=======
=======
>>>>>>> parent of 9400738... no esta uploadArray
        for (i in uploadArray) {
            for (j in userArray) {
                recipient = userArray[j];
                //ajxSendJSON strips the imageURI from the JSON, to avoid cluttering the server with unneeded data
                ajxSendJSON(Jason, recipient);
                uploadImage(imageURI, recipient);
            }
<<<<<<< HEAD
>>>>>>> parent of 9400738... no esta uploadArray
=======
>>>>>>> parent of 9400738... no esta uploadArray

        }

    }


    function onFail(message) {
        console.log('Failed because: ' + message);
    }
}