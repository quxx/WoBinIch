function takePicture () {
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 100,
        encodingType: Camera.EncodingType.JPEG,
        sourceType : Camera.PictureSourceType.CAMERA,
        destinationType: Camera.DestinationType.FILE_URI,
        saveToPhotoAlbum: true,
        correctOrientation: true});

    function onSuccess(imageURI) {
        //image.src = "data:image/jpeg;base64," + imageData;
        
        var image = document.getElementById('picture');
        image.src = imageURI;
        document.getElementById("picture-buttons").innerHTML = "Upload Erfolgreich";
    }
    
    function onFail(message) {
        alert('Failed because: ' + message);
    }
}