function isOnline() {
	var networkStatus = navigator.conenction.type;
	
	if (networkStatus == Connection.NONE || networkStatus == Connection.UNKNOWN) {
		onConnectionError();
		return false;
	} else {
		return true;
	}
}


