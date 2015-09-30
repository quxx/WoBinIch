/*global $, downloadFile, console, alert*/

/**
 * Erstellt aus Rohdaten ein Objekt nach JSON und modelliert eine Bildfrage.
 *
 * @function formatJSON
 *
 * @param {Date} timestamp Timestamp des Eintrags auf den Chatserver, dient als eindeutige ID
 * @param {String} username User-/Loginname für THM Chatserver
 * @param {String} lat Latitude der geodaten
 * @param {String} lon Longitude der geodaten
 * @param {String} score Aktueller Punktestand des Spielers
 * @param {Boolean} open Ist die Frage noch offen oder bereits beantwortet?
 *
 * @return {Object} formattedJSON - Javascript Object in JSON Formatierung, welches die obigen Parameter beinhaltet
 */
function createQuestionJSON(timestamp, username, lat, lon, score, open) {
    var text, formattedJSON;
    text = '{ "timestamp" : "' + timestamp + '"';
    text += ', "type" : "question"';
    text += ', "username" : "' + username + '"';
    text += ', "geolat" : "' + lat + '"';
    text += ', "geolon" : "' + lon + '"';
    text += ', "score" : "' + score + '"';
    text += ', "open" : "' + open + '" }';

    formattedJSON = JSON.parse(text);
    return formattedJSON;
}

/** 
 * Erstellt aus Rohdaten ein Objekt nach JSON und modelliert ein Antwortobjekt auf eine Bildfrage.
 *
 * @function formatJSON
 *
 * @param {Date} timestamp Timestamp des Eintrags auf den Chatserver, dient als eindeutige ID
 * @param {String} reference Timestamp der Frage, auf die sich die Antwort bezieht
 * @param {String} username User-/Loginname für THM Chatserver
 * @param {String} lat Latitude der geodaten
 * @param {String} lon Longitude der geodaten
 * @param {String} score Aktueller Punktestand des Spielers
 *
 * @result {Object} formattedJSON - Javascript Object in JSON Formatierung, welches die obigen Parameter beinhaltet
 */
function createAnswerJSON(timestamp, reference, username, lat, lon, score) {
    var text, formattedJSON;
    text = '{ "timestamp" : "' + timestamp + '"';
    text += ', "type" : "reply"';
    text += ', "references" : "' + reference + '"';
    text += ', "username" : "' + username + '"';
    text += ', "geolat" : "' + lat + '"';
    text += ', "geolon" : "' + lon + '"';
    text += ', "score" : "' + score + '" }';

    formattedJSON = JSON.parse(text);
    return formattedJSON;
}

/**
 * Lädt eine vorher im localstorage unter dem Key "userlist" hinterlegte Liste in ein Array und spaltet sie entsprechend in einzelne Benutzernamen auf.
 *
 * @function getUserArray
 *
 * @result {Object} userArray Array aller auf dem Server registrierter Spielernamen
 */
function getUserArray() {
    var userlist, userArray;
    userlist = window.localStorage.getItem("userlist");
    userArray = userlist.split("\n");
    return userArray;
}

/**
 * Wandelt den String aus Rohdaten, welchen ajxGetRawData vom THM Chatserver abholt in JS Objekte um, sortiert diese nach Fragen und Antworten in entsprechende Arrays und legt diese anschließend im localstorage ab.
 *
 * @function parseRawData
 *
 * @param {String} data Die Rohdaten, welche der THM Chatserver liefert.*
 */
function parseRawData(data) {
    var string, nextString, i, regEx, str, imgURL, RArray, Jason, timest, imageURI, dataArray, inFlag, JSONFlag, txtFlag, imgFlag, QArray, usr;
    RArray = [];
    QArray = [];
    inFlag = /[|]in[|]/i;
    txtFlag = /[|]txt[|]/i;
    imgFlag = /[|]img[|]/i;
    JSONFlag = /[{].+[}]/i;
    dataArray = data.split("\n");
    window.localStorage.setItem("questions", QArray);
    window.localStorage.setItem("answers", RArray);
    usr = window.localStorage.getItem("loginname");
    for (i = 0; i < dataArray.length - 1; i += 1) {

        string = dataArray[i];

        nextString = dataArray[i + 1];
        if (inFlag.test(string) === false && txtFlag.test(string) === true && JSONFlag.test(string) === true) {
            //slice JSON-string and save into variable str
            str = JSONFlag.exec(string);

            //parse string into JS object
            Jason = JSON.parse(str);

            if (Jason.username == usr && Jason.type == "reply") {
                RArray.push(Jason);
            }

        }

        //detect incoming messages to parse
        if (inFlag.test(string) === true && txtFlag.test(string) === true && JSONFlag.test(string) === true) {

            //slice JSON-string and save into variable str
            str = JSONFlag.exec(string);

            //parse string into JS object
            Jason = JSON.parse(str);

            //check type of JSON
            switch (Jason.type) {

            case "question":
                if (imgFlag.test(nextString) === true) {
                    //slice the imgURL from the rest of the data and save as variable imgURL
                    imgURL = nextString.slice(nextString.lastIndexOf("|") + 1, nextString.length);

                    //saving image with question timestamp as image name
                    timest = Jason.timestamp;
                    downloadFile(imgURL, "WoBinIch", timest);

                    QArray.push(Jason);
                    i += 1;
                } else {
                    QArray.push(Jason);
                }
                break;

            case "reply":
                RArray.push(Jason);
                break;
            }

        }

        window.localStorage.setItem("questions", JSON.stringify(QArray));
        window.localStorage.setItem("answers", JSON.stringify(RArray));
    }
}

/**
 * Setzt den Timestamp, ab welchem die Daten vom Server geholt werden auf aktuelles Datum minus 2 Tage.
 *
 * @function setEarliestTimestamp
 */
function setEarliestTimestamp() {
    var time;
    time = Date.now() + -2 * 24 * 3600 * 1000;
    //if (time < 1443184895905) {
    //time = 1443184895905;
    //}
    window.localStorage.setItem("earliestTimestamp", time);
}

/**
 * Liefert zu einem Frageobjekt die zugehörign Antwortobjekte in einem Array.
 *
 * @function getAnswers
 *
 * @param {Object} questionJSON Frageobjekt in JSON-formatierung, welches durch createQuestionJSON erstellt wurde
 *
 * @return {Object} returnArray Array aus Antwortobjekten, welche das übergebene Frageobjekt referenzieren.
 */
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

/**
 * Bewertet das übergebene Frageobjekt, sofern alle Antworten abgegeben wurden oder die Frage älter als 2 Tage ist und schreibt die Bewertung in das Score-Attribut des Frageobjekts.
 *
 * @function scoreQuestion
 *
 * @param {Object} questionJSON Frageobjekt, welches bewertet werden soll
 */
function scoreQuestion(questionJSON) {
    var correct,
        percent,
        answers = [],
        users = [],
        i,
        dist,
        score,
        time;
    answers = getAnswers(questionJSON);
    users = getUserArray();
    setEarliestTimestamp();
    time = window.localStorage.getItem("earliestTimestamp");
    if (answers.length == users.length - 1 || questionJSON.timestamp < time) {
        for (i in anwers) {
            if (distance(answers.lat, answers.lon, questionJSON.lat, questionJSON.lon) < 1) {
                correct += 1;
            }
        }

        percent = (correct / answers.length) * 100;

        score = -0.0000003984868 * Math.pow(percent, 5);
        score += 0.0001186065769 * Math.pow(percent, 4);
        score -= 0.0118659541345 * Math.pow(percent, 3);
        score += 0.40644 * Math.pow(percent, 2);
        score -= 0.4924343 * percent - 25;

        if (score > 100) {
            score = 100;

        }
        if (score < 0) {
            score = 0;
        }
        score += parseInt(getscore(questionJSON.username));
        
        createQuestionJSON(questionJSON.timestamp, questionJSON.username, questionJSON.geolat, questionJSON.geolon, score, "false");
    } else {
        console.log("nicht alle Spieler haben bisher geantwortet!");
    }
}

/**
 * Sucht das zugehörige Bild zu einem Frageobjekt aus dem Gerätespeicher zeigt es an.
 *
 * @function getImage
 *
 * @param {Object} questionJSON Javascript Objekt, welches mit createQuestionJSON erstellt wurde
 */
function getImage(questionJSON) {
    //alert("getimg called!");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fsSuccess, fsFail);

    function fsSuccess(fs) {
        var timestamp = questionJSON.timestamp;
        var imgName = "WoBinIch/" + timestamp + ".jpg";
        fs.root.getFile(imgName, {
            create: false
        }, gotImg, function (error) {
            alert("File Retrieval Error!\n\n" + error.code);
        });
    }

    function fsFail(error) {
        alert("FileSystem Error!\n\n" + error.code);
    }

    function gotImg(fileEntry) {
        var imgPath = fileEntry.toNativeURL();
        //------------------------------------------------
        //Bildpfad wird hier ermittelt und kann leider 
        //auch nur hier weiterverarbeitet werden! 
        //------------------------------------------------
        var reference = questionJSON.timestamp;
        document.getElementById("question").innerHTML = '<div><img style="z-index: -1;" src="' + imgPath + '" id="picture" height="100%" width="100%"></img></div><p class="par-buttons"> ' +
            '<button class="button button--large btn-send" id="' + reference + '" onclick="answer(this)">Beantworten</button></p>';
    }

}

/**
 * Ermittelt den Punktestand des übergebenen Benutzers anhand der im localstorage hinterlegten Datensätze für Fragen und Antworten.
 *
 * @function getScore
 *
 * @param {String} username Benutzername des Spielers
 *
 * @result {String} Score Punktestand des Spielers
 */
function getScore(username) {
    var qArray, rArray, i, j, score;
    score = 0;
    qArray = JSON.parse(window.localStorage.getItem("questions"));
    rArray = JSON.parse(window.localStorage.getItem("answers"));
    for (i in qArray) {
        if (score < qArray[i].score && username == qArray[i].username && qArray[i].score != "NaN") {
            score = qArray[i].score;
        }
    }
    for (j in rArray) {
        if (score < rArray[j].score && username == rArray[j].username && rArray[j].score != "NaN") {
            score = rArray[j].score;
        }
    }
    return score;
}