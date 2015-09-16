
//Berechnung Distanz zwischen 2 Koordinaten
function distance() {
    //Initilisieren
    var playerAnswer = "50.588339493172235/8.708437442255675";
    var answer = "50.5765896/8.6767661";
                
    //Zurecht schneiden beider Strings für Latitude und Longitude Werte
    var index1 = playerAnswer.indexOf('/');
    var lat1 = playerAnswer.slice(0, index1);
    var lon1 = playerAnswer.slice(index1 + 1, playerAnswer.length);
                
    var index2 = answer.indexOf('/');
    var lat2 = answer.slice(0, index2);
    var lon2 = answer.slice(index2 + 1, answer.length);
                                
    //alert(playerAnswer + "\n" + lat1 + "\n" + lon1 + "\n" + answer + "\n" + lat2 + "\n" + lon2);
                
    //Berechnung der Distanz zwischen beiden Koordinaten (dist in Km)
    var dist = 6378.388 * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
                
    alert(dist);
}