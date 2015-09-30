/**
 * 
 * Bekommt 2 Koordinaten Paare übergeben (einmal die vom Spieler eingegebene und die richtige Antwort aus der Bildfrage) hiermit ermittelt die Funktion die Entfernung ziwschen diesen beiden und gibt sie in Km zurück.
 *
 * @function distance
 *
 * @param {String} lat1 - Latitude Wert der vom Spieler eingegbene Position
 * @param {String} lon1 - Longitude Wert der vom Spieler eingegbene Position
 * @param {String} lat2 - Latitude der richtigen Antwort
 * @param {String} lon2 - Longitude der richtigen Antwort
 *
 * @result {Number} dist - Entfernung ziwschen beiden Koordinaten (in KM)
 */
function distance(lat1, lon1, lat2, lon2) {
    var lat1, lon1, lat2, lon2, dist;

    var R = 6371; // Radius of the earth in km
    var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = 0.5 - Math.cos(dLat)/2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos(dLon))/2;

    dist =  R * 2 * Math.asin(Math.sqrt(a));
    return dist;

}