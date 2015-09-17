function takePicture () {
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 30,
        sourceType : navigator.camera.PictureSourceType.CAMERA,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        //saveToPhotoAlbum: true,
        //encodingType: navigator.camera.EncodingType.JPEG,
        correctOrientation: true});

    function onSuccess(imageURI) {
        var req = new AjaxRequest("http://thm-chat.appspot.com/oop/uploadURL", function(response){
            console.log(response);
            var image = document.getElementById('picture');
            image.src = imageURI;
            var xhr = new XMLHttpRequest();
            imageString = imageURI.substr(7);
            var data = "fromUser=thomas.claudi&fromPassword=8273&toUser=D.kessler&type=img&image=" + imageString;
            console.log(data);
                
            xhr.open("POST", response, true);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // do something with response
                    console.log(xhr.responseText);
                }
            };
            xhr.send(data);
        });
        req.send();      
    }     
    
    
    function onFail(message) {
        console.log('Failed because: ' + message);
    }
}