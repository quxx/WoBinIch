// Script to take a picture and display it afterwards

        
function takePicture() {
        navigator.camera.getPicture (onSuccess, onFail, 
            { quality: 50, destinationType: Camera.DestinationType.DATA_URL});
            
        function onSuccess (imageData) {
            var image = document.getElementById('picture');
            image.src = "data:image/jpeg;base64," + imageData;
            
            window.location = "../question.html"
            
        }
        
        function onFail (message) {
            alert ('Error occured: ' + message);
        }
    }