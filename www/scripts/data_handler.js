/**
 * 
 * Erstellt aus Rohdaten ein Objekt nach JSON.
 *
 * @method formatJSON
 *
 * @param {Double} timestamp - Timestamp des Eintrags auf den Chatserver, dient als eindeutige ID
 * @param {String} username - User-/Loginname für THM Chatserver
 * @param {String} password - Passwort für THM Chatserver
 * @param {String} imgURL - Endgültige URL für Bildnachricht auf THM Chatserver - Muss vorher generiert und vom Server abgeholt werden!
 * @param {String} geodata - Geolocation Data
 * @param {String} score - Aktueller Punktestand des Spielers
 * @param {Boolean} open - Ist die Frage noch offen oder bereits beantwortet?
 *
 * @result {Object} formattedJSON - Javascript Object in JSON Formatierung, welches die obigen Parameter beinhaltet
 *
 */

function formatJSON(timestamp, username, password, imgURL, geodata, score, open) {
    'use strict';
    var text, formattedJSON;
    text = '{ "timestamp" : "' + timestamp + '"';
    text += ', "username" : "' + username + '"';
    text += ', "password" : "' + password + '"';
    text += ', "imgURL" : "' + imgURL + '"';
    text += ', "geodata" : "' + geodata + '"';
    text += ', "score" : "' + score + '"';
    text += ', "open" : "' + open + '" }';

    formattedJSON = JSON.parse(text);
    return formattedJSON;

}

//function testServer() {
//
//    var usr = window.localStorage.getItem("loginname");
//    var pwd = window.localStorage.getItem("password");
//
//    var baseURL = "http://thm-chat.appspot.com/oop/";
//    var link = baseURL + "users?user=" + usr + "&password=" + pwd;
//
//    var request = new AjaxRequest(link, function (response) {
//        alert('Response:\n' + response);
//    });
//    request.send();
//}

function jQueryTestServer() {

    var usr = window.localStorage.getItem("loginname");
    var pwd = window.localStorage.getItem("password");

    var baseURL = "http://thm-chat.appspot.com/oop/";
    var link = baseURL + "users?user=" + usr + "&password=" + pwd;

    $.ajax({
        context: this,
        type: 'get',
        url: link,
        success: function (response) {
            alert("GET-Response: " + response);
            window.localStorage.setItem("userlist", response);
        }
    });

}

function getUserArray() {
    var userlist = window.localStorage.getItem("userlist");
    userArray = userlist.split("\n");
    return userArray;
}

function testUserArray() {
    alert("RAW: " + window.localStorage.getItem("userlist"));
    var text = "";
    var userArray = getUserArray();
    for (i = 0; i < userArray.length; i++) {
        text += userArray[i] + "\n";
    }
    alert("Verarbeitet: " + text);
}