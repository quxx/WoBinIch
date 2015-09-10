function takePicture () {
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        saveToPhotoAlbum: true,
        correctOrientation: true});

    function onSuccess(imageData) {
        //var image = document.getElementById('picture');
        //image.src = "data:image/jpeg;base64," + imageData;
 
        document.getElementById("picture").src = "data:image/jpeg;base64," + imageData;
        document.getElementById("picture-buttons").innerHTML = "Upload Erfolgreich";
    }
    
    function onFail(message) {
        alert('Failed because: ' + message);
    }
}