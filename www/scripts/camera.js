function takePicture () {
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 20,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: true,
        correctOrientation: true
    });

    function onSuccess(imageURI) {
        uploadImage(imageURI, "thomas.claudi");
        geolocation();
        window.localStorage.getItem("lat");
        window.localStorage.getItem("lon");
        var message = lat + "|" + lon;
        ajxSendToUser("thomas.claudi", message);
 
    };     
}     
    
    
function onFail(message) {
    console.log('Failed because: ' + message);
}




