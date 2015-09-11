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

function testServer(){

    var usr = window.localStorage.getItem("loginname");
    var pwd = window.localStorage.getItem("password");
    
    var baseUrl = "http://thm-chat.appspot.com/oop/";
    var link = baseURL + "users?user=" + usr + "&password=" + pwd;
    ons.notification.alert({message: link});
    $.get(link, function(data){
        ons.notification.alert({message: data})});
    
}