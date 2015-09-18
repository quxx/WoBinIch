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

function createQuestionJSON(timestamp, username, password, lat, lon, image, score, open) {
    var text, formattedJSON;
    text = '{ "timestamp" : "' + timestamp + '"';
    text += ' "type" : "question"';
    text += ', "username" : "' + username + '"';
    text += ', "password" : "' + password + '"';
    text += ', "image" : "' + image + '"';
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
    text += ' "type" : "reply"';
    text += ' "references : "' + reference + '"';
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
    var userlist = window.localStorage.getItem("userlist");
    userArray = userlist.split("\n");
    return userArray;
}

function parseRawData(data) {
    var dataArray = data.split("\n");
    var string = "";
    string = dataArray[0];
    alert(string);
    string = string.slice(string.indexOf("{"), string.length) + "}";
    alert(string);
}