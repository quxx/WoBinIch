function checkConnection() {
	var networkState = navigator.connection.type;
	
//Connection.UNKNOWN  = 'Unknown connection';
//Connection.ETHERNET = 'Ethernet connection';
//Connection.WIFI     = 'WiFi connection';
//Connection.CELL_2G  = 'Cell 2G connection';
//Connection.CELL_3G  = 'Cell 3G connection';
//Connection.CELL_4G  = 'Cell 4G connection';
//Connection.CELL     = 'Cell generic connection';
//Connection.NONE     = 'No network connection'; 
            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';

            return states[networkState];
}


