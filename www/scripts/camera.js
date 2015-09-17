function takePicture () {
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 30,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        //saveToPhotoAlbum: true,
        correctOrientation: true
    });

    function onSuccess(imageURI) {
        var req = new AjaxRequest("http://thm-chat.appspot.com/oop/uploadURL", function(response){

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
            
            //Function on Success
            function win(r) {
            }
            
            //Function on Fail
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




