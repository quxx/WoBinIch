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
            var imageName = imageURI.substring(imageURI.length-17, imageURI.length);
            var xhr = new XMLHttpRequest();
            var data = '------WebKitFormBoundarylUBuXB648GYZSJC4\nContent-Disposition: form-data; name="fromUser"\n\nthomas.claudi\n------WebKitFormBoundarylUBuXB648GYZSJC4\nContent-Disposition: form-data; name="fromPassword"\n\n8273\n------WebKitFormBoundarylUBuXB648GYZSJC4\nContent-Disposition: form-data; name="toUser"\n\nthomas.claudi\n------WebKitFormBoundarylUBuXB648GYZSJC4\nContent-Disposition: form-data; name="type"\n\nimg\n------WebKitFormBoundarylUBuXB648GYZSJC4\nContent-Disposition: form-data; name="image"; filename=' + imageName  + '\nContent-Type: image/jpeg\n\n\n------WebKitFormBoundarylUBuXB648GYZSJC4--'
            console.log(data);
                
            xhr.open("POST", response, true);
            xhr.setRequestHeader("Content-type",'multipart/mixed; boundary="----WebKitFormBoundarylUBuXB648GYZSJC4" '); 
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // do something with response
                    console.log(xhr.responseText);
                }
                else {
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