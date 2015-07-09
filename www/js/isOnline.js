function isOnline() {
	var networkStatus = navigator.conenction.type;
	
	if (networkStatus == Connection.NONE) {
		onConnectionError();
		return false;
	} else {
		return true;
	}
}


