function isOnline() {
	var networkStatus = navigator.conenction.type;
	
	if(networkStatus == Connection.NONE || networkStatus == Connection.UNKNOWN) {
		onConnexionError();
		return false;
	} else {
		return true;
	}
}