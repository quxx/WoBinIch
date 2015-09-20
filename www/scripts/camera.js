function takePicture () {
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 30,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: true,
        correctOrientation: true
    });

    function onSuccess(imageURI) {
        uploadImage(imageURI, "thomas.claudi");
    };     
}     
    
    
function onFail(message) {
    console.log('Failed because: ' + message);
}




