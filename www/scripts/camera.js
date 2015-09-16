function takePicture () {
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 30,
        sourceType : Camera.PictureSourceType.CAMERA,
        destinationType: Camera.DestinationType.FILE_URI,
        saveToPhotoAlbum: true,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true});

    function onSuccess(imageURI) {
        alert(imageURI);
    }     
    
    
    function onFail(message) {
        console.log('Failed because: ' + message);
    }
}