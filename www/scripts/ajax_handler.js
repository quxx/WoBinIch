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
    var usr = window.localStorage.getItem("loginname");
    var pwd = window.localStorage.getItem("password");
    var baseURL = "http://thm-chat.appspot.com/oop/sendTxt?";
    var link = "fromUser=" + usr;
    link += "&fromPassword=" + pwd;
    link += "&toUser=" + recipient;
    link += "&type=txt&txt=" + message;
    baseURL += link;

    $.ajax({
        type: 'get',
        url: baseURL,
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
    var i;
    var userArray = [];
    userArray = getUserArray();
    for (i in userArray) {
        var recipient = userArray[i];
        ajxSendToUser(recipient, message);
    }
}

/**
 *
 * Legt ein in einen String umgewandeltes Javascript Objekt in JSON-Notation auf dem Server ab. Hierbei wird der Empfänger nacheinander mit zwei Nachrichten angeschrieben, die erste Nachricht ist ein Bild, die zweite die dazugehörigen Daten als Text.
 *
 * @method sendJSON
 *
 * @param {Object} JSONObject - Das Objekt, dessen Daten auf den Server geladen werden sollen
 * @param {String} recipient - Der Empfänger der Nachricht
 *
 */

function sendJSON(JSONObject, recipient) {
    //extract the image to process it seperately, geodata can just be parsed normally!
    var image = JSONObject.image;
    var imgURL = getImageURL();
    //ajxSendImage(imgURL, image);
    delete JSONObject.image;
    alert("Format after deleting image: " +JSON.stringify(JSONObject));
    ajxSendToUser(recipient, JSON.stringify(JSONObject));
    JSONObject.image = image;
    alert("Format after readding image: " + JSON.stringify(JSONObject));
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
    $.ajax({
        type: 'post',
        url: 'http://thm-chat.appspot.com/oop/uploadURL',
        success: function (response) {
            alert("ImageURL: " + response);
            imgUrl = response;
        }
    });
}

function testSendJSON() {
    alert("button pressed")
    var timestamp = Date();
    var username = "D.kessler";
    var password = "password";
    var image = "PLACEHOLDER";
    var score = "40000";
    var open = "true";
    var Jason = createJSON(timestamp, username, password, image, score, open);
    alert("JSON built! Format :" + JSON.stringify(Jason));
    sendJSON(Jason, D.kessler);
}