/*global $, geolocation, alert, parseRawData, getUserArray,setEarliestTimestamp, createQuestionJSON*/

/**
 * Holt eine Liste von registrierten Benutzern vom Server ab und legt sie in den localstorage. Setzt voraus, das der "loginname" und das "password" beim start der App gesetzt und in den localstorage abgelegt wurden.
 *
 * @method ajxGetUserList
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
 * Sendet eine Textnachricht an einen Empfänger auf dem THM Chatserver. Nimmt voraus, das der Benutzer eingeloggt ist, also im localstorage Benutzername und Passwort hinterlegt wurden.
 *
 * @method ajxSendToUser
 *
 * @param {String} recipient - Benutzername des Empfängers der Nachricht
 * @param {String} message - Inhalt der Textnachricht
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
 * Sendet eine Textnachricht an alle Benutzer des THM-Chatservers.
 *
 * @method ajxBroadcast
 *
 * @param {String} message - Zu sendende Textnachricht
 */
function ajxBroadcastJSON(message) {
    var i, userArray = [],
        recipient;
    ajxGetUserList();
    userArray = getUserArray();
    for (i in userArray) {
        recipient = userArray[i];
        ajxSendToUser(recipient, JSON.stringify(message));
    }
}

/**
 * Legt ein in einen String umgewandeltes Javascript Objekt in JSON-Notation auf dem Server ab. Hierbei wird der Empfänger nacheinander mit zwei Nachrichten angeschrieben, die erste Nachricht ist ein Bild, die zweite die dazugehörigen Daten als Text.
 *
 * @method ajxsendJSON
 *
 * @param {Object} JSONObject - Das Objekt, dessen Daten auf den Server geladen werden sollen. Erwartet wird ein durch createJSON erstelltes Objet in JSON-formatierung.
 * @param {String} recipient - Der Empfänger der Nachricht
 */
function ajxSendJSON(JSONObject, recipient) {
    var Jason = JSONObject,
        image;
    //delete image data for increased readability.
    if (Jason.imageURI !== null) {
        image = Jason.imageURI;
        delete Jason.imageURI;
        ajxSendToUser(recipient, JSON.stringify(JSONObject));
        JSONObject.imageURI = image;
    } else {
        ajxSendToUser(recipient, JSON.stringify(JSONObject));
    }
}

/** 
 * Nimmt Rohdaten vom Server und gibt sie an die Methode parseRawData weiter.
 *
 * @method ajxGetRawData
 */
function ajxGetRawData() {
    var getURL, timestamp, username, password;
    username = window.localStorage.getItem("loginname");
    password = window.localStorage.getItem("password");
    setEarliestTimestamp();
    timestamp = window.localStorage.getItem("earliestTimestamp");

    getURL = "http://thm-chat.appspot.com/oop/messages?since=" + timestamp;
    getURL += "&user=" + username;
    getURL += "&password=" + password;

    $.ajax({
        type: 'get',
        url: getURL,
        success: function (response) {
            parseRawData(response);
        }
    });
}