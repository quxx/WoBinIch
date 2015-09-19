/*global $, geolocation, alert, parseRawData, getUserArray, createQuestionJSON*/

/**
 * 
 * Holt eine Liste von registrierten Benutzern vom Server ab und legt sie in den localstorage. Setzt voraus, das der "loginname" und das "password" beim start der App gesetzt und in den localstorage abgelegt wurden.
 *
 * @method ajxGetUserList
 *
 */

function ajxGetUserList() {
    var usr, pwd, baseURL, link;
    usr = "D.kessler";
    pwd = "5410";

    baseURL = "http://thm-chat.appspot.com/oop/";
    link = baseURL + "users?user=" + usr + "&password=" + pwd;

    $.ajax({
        type: 'get',
        url: link,
        success: function (response) {
            window.localStorage.setItem("userlist", response);
        }
    });

}


/**
 *
 * Sendet eine Textnachricht an einen Empfänger auf dem THM Chatserver. Nimmt voraus, das der Benutzer eingeloggt ist, also im localstorage Benutzername und Passwort hinterlegt wurden.
 *
 * @method ajxSendToUser
 *
 * @param {String} recipient - Benutzername des Empfängers der Nachricht
 * @param {String} message - Inhalt der Textnachricht
 *
 */

function ajxSendToUser(recipient, message) {
    var usr, pwd, baseURL, getURL;
    usr = window.localStorage.getItem("loginname");
    pwd = window.localStorage.getItem("password");
    baseURL = "http://thm-chat.appspot.com/oop/sendTxt?";
    getURL = baseURL + "fromUser=" + usr;
    getURL += "&fromPassword=" + pwd;
    getURL += "&toUser=" + recipient;
    getURL += "&type=txt&txt=" + message;

    $.ajax({
        type: 'get',
        url: getURL
    });
}

/**
 *
 * Sendet eine Textnachricht an alle Benutzer des THM-Chatservers.
 *
 * @method ajxBroadcast
 *
 * @param {String} message - Zu sendende Textnachricht
 *
 */


function ajxBroadcast(message) {
    var i, userArray = [], recipient;
    userArray = getUserArray();
    for (i in userArray) {
        recipient = userArray[i];
        ajxSendToUser(recipient, message);
    }
}

/**
 *
 * Legt ein in einen String umgewandeltes Javascript Objekt in JSON-Notation auf dem Server ab. Hierbei wird der Empfänger nacheinander mit zwei Nachrichten angeschrieben, die erste Nachricht ist ein Bild, die zweite die dazugehörigen Daten als Text.
 *
 * @method ajxsendJSON
 *
 * @param {Object} JSONObject - Das Objekt, dessen Daten auf den Server geladen werden sollen. Erwartet wird ein durch createJSON erstelltes Objet in JSON-formatierung.
 * @param {String} recipient - Der Empfänger der Nachricht
 *
 */

function ajxsendJSON(JSONObject, recipient) {
    var Jason = JSONObject, image;
    //extract the image to process it seperately, geodata can just be parsed normally!
    image = Jason.image;
    delete Jason.image;
    ajxSendToUser(recipient, JSON.stringify(JSONObject));
    JSONObject.image = image;
}

/**
 *
 * Lädt die zum Upload von Bilddateien benötigte ImageURL vom Server und speichert sie unter dem Key "imageURL" in den localstorage.
 *
 * @method ajxsetImageURL
 *
 */

function ajxsetImageURL() {
    $.ajax({
        type: 'post',
        url: 'http://thm-chat.appspot.com/oop/uploadURL',
        success: function (response) {
            window.localStorage.setItem("imageURL", response);
        }
    });
}

function testSendJSON() {
    var timestamp, username, password, image, lat, lon, score, open, Jason;
    timestamp = Date.now();
    username = "D.kessler";
    password = "password";
    image = "PLACEHOLDER";
    geolocation();
    lat = window.localStorage.getItem("lat");
    lon = window.localStorage.getItem("lon");
    score = "40000";
    open = "true";
    Jason = createQuestionJSON(timestamp, username, password, lat, lon, image, score, open);
    alert("JSON built! Format :" + JSON.stringify(Jason));
    ajxsendJSON(Jason, "D.kessler");
}

function ajxGetRawData(username, password, timestamp) {
    var getURL = "http://thm-chat.appspot.com/oop/messages?since=" + timestamp;
    getURL += "&user=" + username;
    getURL += "&password=" + password;
    $.ajax({
        type: 'get',
        url: getURL,
        success: function (response) {
            alert("Server response: " + response);
            parseRawData(response);
        }
    });
}

function testGetJSON() {
    ajxGetRawData("D.kessler", "5410", "1442495809177");
    /*    var openArray = window.localStorage.getItem("openArray");
        var closedArray = window.localStorage.getItem("closedArray");
        alert(openArray);
        alert(closedArray);*/
}