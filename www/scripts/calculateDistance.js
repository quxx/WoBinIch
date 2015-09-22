//Berechnung Distanz zwischen 2 Koordinaten
//nun umgeschrieben, sodass sie Parameter frisst!

function distance(playerlat, playerlon, answerlat, answerlon) {
    var lat1, lon1, lat2, lon2, dist;

    //Zurecht schneiden beider Strings für Latitude und Longitude Werte
    lat1 = playerlat;
    lon1 = playerlon;

    lat2 = answerlat;
    lon2 = answerlon;

    //alert(playerAnswer + "\n" + lat1 + "\n" + lon1 + "\n" + answer + "\n" + lat2 + "\n" + lon2);

    //Berechnung der Distanz zwischen beiden Koordinaten (dist in Km)
    dist = 6378.388 * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));

    return dist;
}