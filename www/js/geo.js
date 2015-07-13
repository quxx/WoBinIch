function geolocation() {
	
        navigator.geolocation.getCurrentPosition(onSuccess, onError);


    // onSuccess Geolocation
    //
    function onSuccess(position) {
        var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		
		window.localStorage.setItem("lat",lat);
		window.localStorage.setItem("lon",lon);
    }
	
	function onError(error) {
        var err = error;
		window.localStorage.setItem("err",err);
					
    }


	
}