/*jslint nomen: true, plusplus: true, unparam: true, sloppy: true, vars: true*/
/**
 * 
 * Erstellt aus Rohdaten ein Objekt nach JSON.
 *
 * @method formatJSON
 *
 * @param {Double} timestamp - Timestamp des Eintrags auf den Chatserver, dient als eindeutige ID
 * @param {String} username - User-/Loginname für THM Chatserver
 * @param {String} password - Passwort für THM Chatserver
 * @param {String} image - Bilddatei, bzw. deren Ablageort auf dem Gerät
 * @param {String} score - Aktueller Punktestand des Spielers
 * @param {Boolean} open - Ist die Frage noch offen oder bereits beantwortet?
 *
 * @result {Object} formattedJSON - Javascript Object in JSON Formatierung, welches die obigen Parameter beinhaltet
 *
 */

function createJSON(timestamp, username, password, image, score, open) {
    'use strict';
    var text, formattedJSON;
    text = '{ "timestamp" : "' + timestamp + '"';
    text += ', "username" : "' + username + '"';
    text += ', "password" : "' + password + '"';
    text += ', "image" : "' + image + '"';
    text += ', "geodata" : ""';
    text += ', "score" : "' + score + '"';
    text += ', "open" : "' + open + '" }';

    formattedJSON = JSON.parse(text);
    return formattedJSON;

}

/**
 *
 * Lädt sämtliche JSON-formatierte Objekte, welche ein timestamp-Attribut haben aus dem localstorage in ein Array.
 *
 * @method loadAllJSON
 *
 * @result {Object} JSONArray - Array aus JSON-validen Objekten
 *
 **/

function loadAllJSON() {
    var JSONArray = [];
    for (var i = 0; i < window.localstorage.length; i++) {
        var localData = window.localstorage.key(i);
        //is valid JSON object with proper attributes?
        if (localData.hasOwnProperty("timestamp")) {
            JSONArray.push(JSON.parse(localData));
        }
    }
    return JSONArray;
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