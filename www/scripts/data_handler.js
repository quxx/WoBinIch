/*global $, downloadFile, alert*/

/**
 * 
 * Erstellt aus Rohdaten ein Objekt nach JSON und modelliert eine Bildfrage.
 *
 * @method formatJSON
 *
 * @param {Date} timestamp - Timestamp des Eintrags auf den Chatserver, dient als eindeutige ID
 * @param {String} username - User-/Loginname für THM Chatserver
 * @param {String} password - Passwort für THM Chatserver
 * @param {String} image - Bilddatei, bzw. deren Ablageort auf dem Gerät
 * @param {String} lat - Latitude der geodaten
 * @param {String} lon - Longitude der geodaten
 * @param {String} score - Aktueller Punktestand des Spielers
 * @param {Boolean} open - Ist die Frage noch offen oder bereits beantwortet?
 *
 * @result {Object} formattedJSON - Javascript Object in JSON Formatierung, welches die obigen Parameter beinhaltet
 *
 */

function createQuestionJSON(timestamp, username, password, lat, lon, imageURI, score, open) {
    var text, formattedJSON;
    text = '{ "timestamp" : "' + timestamp + '"';
    text += ', "type" : "question"';
    text += ', "username" : "' + username + '"';
    text += ', "password" : "' + password + '"';
    text += ', "imageURI" : "' + imageURI + '"';
    text += ', "geolat" : "' + lat + '"';
    text += ', "geolon" : "' + lon + '"';
    text += ', "score" : "' + score + '"';
    text += ', "open" : "' + open + '" }';

    formattedJSON = JSON.parse(text);
    return formattedJSON;
}

/**
 * 
 * Erstellt aus Rohdaten ein Objekt nach JSON und modelliert ein Antwortobjekt auf eine Bildfrage.
 *
 * @method formatJSON
 *
 * @param {Date} timestamp - Timestamp des Eintrags auf den Chatserver, dient als eindeutige ID
 * @param {String} reference - Timestamp der Frage, auf die sich die Antwort bezieht
 * @param {String} username - User-/Loginname für THM Chatserver
 * @param {String} password - Passwort für THM Chatserver
 * @param {String} lat - Latitude der geodaten
 * @param {String} lon - Longitude der geodaten
 * @param {String} score - Aktueller Punktestand des Spielers
 *
 * @result {Object} formattedJSON - Javascript Object in JSON Formatierung, welches die obigen Parameter beinhaltet
 *
 */

function createAnswerJSON(timestamp, reference, username, password, lat, lon, score) {
    var text, formattedJSON;
    text = '{ "timestamp" : "' + timestamp + '"';
    text += ', "type" : "reply"';
    text += ', "references : "' + reference + '"';
    text += ', "username" : "' + username + '"';
    text += ', "password" : "' + password + '"';
    text += ', "geolat" : "' + lat + '"';
    text += ', "geolon" : "' + lon + '"';
    text += ', "score" : "' + score + '" }';

    formattedJSON = JSON.parse(text);
    return formattedJSON;
}
/**
 * 
 * Lädt eine vorher im localstorage unter dem Key "userlist" hinterlegte Liste in ein Array und spaltet sie entsprechend in einzelne Benutzernamen auf.
 *
 * @method getUserArray
 *
 * @result {Object} userArray - Array aller auf dem Server registrierter Spielernamen
 *
 */

function getUserArray() {
    var userlist, userArray;
    userlist = window.localStorage.getItem("userlist");
    userArray = userlist.split("\n");
    return userArray;
}

//currently not working correctly! Still needs to distinguish between open and closed questions!
function parseRawData(data) {
    alert("parseRawData called! Data: " + data);
    var dataArray, string, nextString, i, imgURL, QArray, RArray, Jason, timest, image = "PLACEHOLDER";
    dataArray = data.split("\n");
    for (i in dataArray) {
        //ignore outgoing stuff? Does that make sense? Not sure yet...
        if (string.search("|out|") > 0) {
            i += 1;
        } else {
            string = dataArray[i];
            nextString = dataArray[i + 1];
            //handle images
            if (nextString.search("|img|") > 0) {
                imgURL = nextString.slice(string.lastIndexOf("|") + 1, string.length);

                //access next line to get corresponding stringified object and parse it
                string = dataArray[i + 1];
                string = string.slice(string.indexOf("{"), string.length);
                Jason = JSON.parse(string);
                timest = JSON.timestamp;
                downloadFile(imgURL, "WoBinIch", timest);
                //add image attribute
                Jason.image = image;
                QArray.push(Jason);
            } else {
                string = dataArray[i];
                string = string.slice(string.indexOf("{"), string.length);
                Jason = JSON.parse(string);
            }
        }
    }
    window.localstorage.setItem("questions", JSON.stringify(QArray));
    window.localstorage.setItem("answers", JSON.stringify(RArray));
}

function setEarliestTimestamp() {
    var time
    time = Date.now() + -2 * 24 * 3600 * 1000;
    window.localStorage.setItem("earliestTimestamp", time);
}