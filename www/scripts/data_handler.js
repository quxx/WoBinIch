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

function createJSON(timestamp, username, password, image, open) {
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
    JSONAddGeo(formattedJSON);
    return formattedJSON;

}

function loadAllJSON() {
    var JSONArray = [];
    for (var i = 0; i < window.localstorage.length; i++) {
        var localData = window.localstorage.key(i);
        //is valid JSON object with proper attributes?
        if (localData.hasOwnProperty("timestamp")) {
            JSONArray.push(JSON.parse(localData));
        };
    }
    return JSONArray;
}

/**
 * 
 * Holt eine Liste von registrierten Benutzern vom Server ab und legt sie in den localstorage. Setzt voraus, das der "loginname" und das "password" beim start der App gesetzt und in den localstorage abgelegt wurden.
 *
 * @method ajxGetUserList
 *
 */

function ajxGetUserList() {

    var usr = window.localStorage.getItem("loginname");
    var pwd = window.localStorage.getItem("password");

    var baseURL = "http://thm-chat.appspot.com/oop/";
    var link = baseURL + "users?user=" + usr + "&password=" + pwd;

    $.ajax({
        type: 'get',
        url: link,
        success: function (response) {
            alert("GET-Response: " + response);
            window.localStorage.setItem("userlist", response);
        }
    });

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

function testUserArray() {
    //alert("RAW: " + window.localStorage.getItem("userlist"));
    var text = "";
    var userArray = getUserArray();
    for (var i = 0; i < userArray.length; i++) {
        text += userArray[i] + "\n";
    }
    alert("Verarbeitet: " + text);
}

function ajxBroadcast(message) {
    var usr = window.localStorage.getItem("loginname");
    var pwd = window.localStorage.getItem("password");

    var baseURL = "http://thm-chat.appspot.com/oop/";
    var reci = "";
    var userArray = getUserArray();
    var msg = message;

    for (var i = 0; i < userArray.length; i++) {
        reci = userArray[i];
        ajxSendToUser(reci, msg);
    }
}

function ajxSendToUser(recipient, message) {
    var usr = window.localStorage.getItem("loginname");
    var pwd = window.localStorage.getItem("password");
    var baseURL = "http://thm-chat.appspot.com/oop/sendTxt";
    var link = "?fromUser=" + usr;
    link += "&fromPassword=" + pwd;
    link += "&toUser=" + recipient;
    link += "&type=txt&txt=" + message;

    alert('POST-Request an: ' + baseURL + ' mit Datenpaket: ' + link);
    var req = $ajax({
        type: 'post',
        url: baseURL,
        data: link,
        success: function (response) {
            alert('Success! Server meldet: ' + response);
        }
        error: function (error) {
            alert('Fehler!\n\n' + error);
        }
    });
}

function testMessage() {
    alert('button pressed!');
    ajxSendToUser("D.kessler", "ping");
}

/**
*
* Lädt die zum Upload von Bilddateien benötigte ImageURL vom Server
*
* @method getImageURL
*
* @result {String} imgURL - URL an welche der subsequente Uploadbefehl eines Bilds geschickt werden muss
*
*/

function getImageURL() {
    var imgUrl = "";
    $.ajax({
        type: 'post',
        url: 'http://thm-chat.appspot.com/oop/uploadURL',
        success: function (response) {
            alert("ImageURL: " + response);
            imgUrl = response;
        }
    });
    return imgUrl;
}

function testReturnImageUrl() {
    alert(getImageUrl());
}

/**
*
* Legt ein in einen String umgewandeltes Javascript Objekt in JSON-Notation auf dem Server ab. Hierbei wird der Empfänger nacheinander mit zwei Nachrichten angeschrieben, die erste Nachricht ist ein Bild, die zweite die dazugehörigen Daten als Text.
*
* @method sendJSON
*
* @param JSONObject - Das Objekt, dessen Daten auf den Server geladen werden sollen
* @param recipient - Der Empfänger der Nachricht
*
*/

function sendJSON(JSONObject, recipient) {
    //extract the image to process it seperately, geodata can just be parsed normally!
    var image = JSONObject.image;
    var imgURL = getImageURL();
    //ajxSendImage(imgURL, image);
    delete JSONObject["image"];
    ajxSendToUser(recipient, JSON.stringify(JSONObject));
    JSONObject["image"] = image;
}