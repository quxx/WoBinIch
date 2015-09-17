function takePicture () {
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 30,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        //saveToPhotoAlbum: true,
        //encodingType: navigator.camera.EncodingType.JPEG,
        correctOrientation: true
        });

    function onSuccess(imageURI) {
        var req = new AjaxRequest("http://thm-chat.appspot.com/oop/uploadURL", function(response){
            //console.log(response);
            //var image = document.getElementById('picture');
            //image.src = imageURI;
            //var imageName = imageURI.substring(imageURI.length-17, imageURI.length);
            //var imagePfad = imageURI.substring(7, imageURI.length);
            var options = new FileUploadOptions();
            options.fileKey= "image";
            options.fileName= imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType= "image/jpeg";
            options.headers = {
                Connection: "close"
            };
            options.chunkedMode = false;

            var params = new Object();
                params.fromUser = "thomas.claudi";
                params.fromPassword = "8273";
                params.toUser = "thomas.claudi";
                params.type = "img";

            options.params = params;

            var ft = new FileTransfer();
            ft.upload(imageURI, response, win, fail, options);
            
            function win(r) {
                console.log("Code = " + r.responseCode);
                console.log("Response = " + r.response);
                console.log("Sent = " + r.bytesSent);
            }
    
            function fail(error) {
                alert("An error has occurred: Code = " + error.code);
                console.log("upload error source " + error.source);
                console.log("upload error target " + error.target);
            }    
        });
        req.send();   
    };     
}     
    
    
function onFail(message) {
    console.log('Failed because: ' + message);
}




