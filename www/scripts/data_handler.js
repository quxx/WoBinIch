/*global $, downloadFile, console, alert*/

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

function createQuestionJSON(timestamp, username, password, lat, lon, score, open) {
    var text, formattedJSON;
    text = '{ "timestamp" : "' + timestamp + '"';
    text += ', "type" : "question"';
    text += ', "username" : "' + username + '"';
    text += ', "password" : "' + password + '"';
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
    var dataArray, string, nextString, i, imgURL, QArray, RArray, Jason, timest, imageURI;
    dataArray = data.split("\n");
    for (i in dataArray) {
        string = dataArray[i];
        nextString = dataArray[i + 1];
        //ignore outgoing stuff? Does that make sense? Not sure yet, just gonna try it out for now...
        if (string.search("|out|") > 0) {
            i += 1;
        } else {
            //slice JSON-string and save into variable string
            string = string.slice(string.indexOf("{"), string.length);

            //parse string into JS object
            Jason = JSON.parse(string);

            //check type of JSON
            if (Jason.type == "question" && Jason.open == "true") {
                if (nextString.search("|img|") > 0) {
                    //slice the imgURL from the rest of the data and save as variable imgURL
                    imgURL = nextString.slice(nextString.lastIndexOf("|") + 1, nextString.length);

                    //generate timestamp as filename for image that needs to be downloaded
                    timest = JSON.timestamp;
                    downloadFile(imgURL, "WoBinIch", timest);
                    //add image attribute - Thomas, HELP!

                    Jason.image = imageURI;
                    QArray.push(Jason);


                    i += 2;


                } else {
                    alert("expected image but found this: " + nextString);
                }

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
    var time;
    time = Date.now() + -2 * 24 * 3600 * 1000;
    window.localStorage.setItem("earliestTimestamp", time);
}

function getAnswers(questionJSON) {
    var i, answerArray, returnArray = [];
    answerArray = window.localStorage.getItem("answers");
    for (i in answerArray) {
        if (answerArray[i].references == questionJSON.timestamp) {
            returnArray.push(answerArray[i]);
        }
    }
    return returnArray;
}

function scoreQuestion(questionJSON) {
    var answers = [],
        users = [],
        i,
        dist,
        score;
    answers = getAnswers(questionJSON);
    users = getUserArray();
    if (answers.length == users.length) {
        for (i in anwers) {
            dist = distance(answers.lat, answers.lon, questionJSON.lat, questionJSON.lon);

        }
        score = -0.0000003984868 * Math.pow(dist, 5);
        score += 0.0001186065769 * Math.pow(dist, 4);
        score -= 0.0118659541345 * Math.pow(dist, 3);
        score += 0.40644 * Math.pow(dist, 2);
        score -= 0.4924343 * dist - 25;

        if (score > 100) {
            score = 100;

        }
        questionJSON.score = score;
    } else {
        console.log("nicht alle Spieler haben bisher geantwortet!");
    }
}
