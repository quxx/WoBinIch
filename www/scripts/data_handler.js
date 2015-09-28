/*global $, downloadFile, console, alert*/

/**
 * 
 * Erstellt aus Rohdaten ein Objekt nach JSON und modelliert eine Bildfrage.
 *
 * @method formatJSON
 *
 * @param {Date} timestamp - Timestamp des Eintrags auf den Chatserver, dient als eindeutige ID
 * @param {String} username - User-/Loginname für THM Chatserver
 * @param {String} lat - Latitude der geodaten
 * @param {String} lon - Longitude der geodaten
 * @param {String} score - Aktueller Punktestand des Spielers
 * @param {Boolean} open - Ist die Frage noch offen oder bereits beantwortet?
 *
 * @result {Object} formattedJSON - Javascript Object in JSON Formatierung, welches die obigen Parameter beinhaltet
 *
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
 * 
 * Erstellt aus Rohdaten ein Objekt nach JSON und modelliert ein Antwortobjekt auf eine Bildfrage.
 *
 * @method formatJSON
 *
 * @param {Date} timestamp - Timestamp des Eintrags auf den Chatserver, dient als eindeutige ID
 * @param {String} reference - Timestamp der Frage, auf die sich die Antwort bezieht
 * @param {String} username - User-/Loginname für THM Chatserver
 * @param {String} lat - Latitude der geodaten
 * @param {String} lon - Longitude der geodaten
 * @param {String} score - Aktueller Punktestand des Spielers
 *
 * @result {Object} formattedJSON - Javascript Object in JSON Formatierung, welches die obigen Parameter beinhaltet
 *
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

/*
 *
 * Wandelt den String aus Rohdaten, welchen ajxGetRawData vom THM Chatserver abholt in JS Objekte um, sortiert diese nach Fragen und Antworten in entsprechende Arrays und legt diese anschließend im localstorage ab.
 *
 * @method parseRawData
 *
 * @param {String} data - Die Rohdaten, welche der THM Chatserver liefert.*
 *
 */

function parseRawData(data) {
    //alert("parseRawData called! Data: " + data);
    var string, nextString, i, regEx, str, imgURL, RArray, Jason, timest, imageURI, dataArray, inFlag, JSONFlag, txtFlag, imgFlag, QArray = [];
    window.localStorage.setItem("questions", QArray);
    inFlag = /[|]in[|]/i;
    txtFlag = /[|]txt[|]/i;
    imgFlag = /[|]img[|]/i;
    JSONFlag = /[{].+[}]/i;
    dataArray = data.split("\n");
    //alert(dataArray[1]);
    //alert("raw data sliced! Found " + dataArray.length + " lines!");
    for (i = 0; i < dataArray.length - 1; i += 1) {

        string = dataArray[i];
        //console.log("TEST: " + string + " ******** I= " + i);
        nextString = dataArray[i + 1];
        //alert("String is now: " + string + ", nextString is now: " + nextString);

        //detect incoming messages to parse
        if (inFlag.test(string) === true && txtFlag.test(string) === true && JSONFlag.test(string) === true) {

            //slice JSON-string and save into variable string
            str = JSONFlag.exec(string);
            //alert("Sliced String: " + str);
            //parse string into JS object
            Jason = JSON.parse(str);
            //alert("JSON.timestamp = " + Jason.timestamp);
            //check type of JSON
            if (Jason.type == "question" && Jason.open == "true" && imgFlag.test(nextString) === true) {
                //alert("found img after question! slicing ImgURL!");
                //slice the imgURL from the rest of the data and save as variable imgURL
                imgURL = nextString.slice(nextString.lastIndexOf("|") + 1, nextString.length);

                //saving image with question timestamp as image name
                timest = Jason.timestamp;
                downloadFile(imgURL, "WoBinIch", timest);
                //alert(JSON.stringify(Jason));

                QArray.push(Jason);
                i += 1;

            } else if (Jason.type == "reply") {
                //handle answerJSON here!
                RArray.push(Jason);

            }
        }

        //sollte idealerweise kein localstorage Objekt sein sondern 'n eigentständiges File. Evtl. kriegen wir das noch hin!
        window.localStorage.setItem("questions", JSON.stringify(QArray));
        window.localStorage.setItem("answers", JSON.stringify(RArray));
    }
}

/*
 *
 * Setzt den Timestamp, ab welchem die Daten vom Server geholt werden auf aktuelles Datum minus 2 Tage.
 *
 * @method setEarliestTimestamp
 *
 */

function setEarliestTimestamp() {
    var time;
    //time = Date.now() + -2 * 24 * 3600 * 1000;
    //if (time < 1443184895905) {
    time = 1443184895905;
    //}
    window.localStorage.setItem("earliestTimestamp", time);
}

/*
 *
 * Liefert zu einem Frageobjekt die zugehörign Antwortobjekte in einem Array.
 *
 * @method getAnswers
 *
 * @param {Object} questionJSON - Frageobjekt in JSON-formatierung, welches durch createQuestionJSON erstellt wurde
 *
 * @return {Object} - returnArray - Array aus Antwortobjekten, welche das übergebene Frageobjekt referenzieren.
 *
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

/*
 *
 * Bewertet das übergebene Frageobjekt, sofern alle Antworten abgegeben wurden oder die Frage älter als 2 Tage ist und schreibt die Bewertung in das Score-Attribut des Frageobjekts.
 *
 * @method scoreQuestion
 *
 * @param {Object} questionJSON - Frageobjekt, welches bewertet werden soll
 *
 */

function scoreQuestion(questionJSON) {
    var answers = [],
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
        if (score < 0) {
            score = 0;
        }
        questionJSON.score += score;
    } else {
        console.log("nicht alle Spieler haben bisher geantwortet!");
    }
}


/*
 * 
 * Sucht das zugehörige Bild zu einem Frageobjekt aus dem Gerätespeicher zeigt es an.
 *
 * @method getImage
 *
 * @param {Object} questionJSON - Javascript Objekt, welches mit createQuestionJSON erstellt wurde
 *
 */

function getImage(questionJSON) {
    alert("getimg called!");
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
        var carousel = document.createElement("ons-carousel-item");
        var reference = questionJSON.timestamp + "|" + questionJSON.geolat + "|" + questionJSON.geolon;
        //alert(reference);
        //alert(timestamp);
        carousel.innerHTML += '<div><img style="z-index: -1;" src="' + imgPath + '" id="picture" height="100%" width="100%"></img></div><p class="par-buttons"><button id="' + reference + '" class="btn-send" onclick="answer(this)">Beantworten</button></p>';
        document.getElementById("carousel").appendChild(carousel);
    }

}

/*
 *
 * Ermittelt den Punktestand des übergebenen Benutzers anhand der im localstorage hinterlegten Datensätze für Fragen und Antworten.
 *
 * @method getScore
 *
 * @param {String} username - Benutzername des Spielers
 *
 * @result {String} Score - Punktestand des Spielers
 *
 */

function getScore(username) {
    var qArray, rArray, i, j, score;
    qArray = JSON.parse(window.localStorage.getItem("questions"));
    rArray = JSON.parse(window.localStorage.getItem("answers"));
    for (i in qArray) {
        if (score < qArray[i].score && username == qArray[i].username) {
            score = qArray[i].score;
        }
    }
    for (j in rArray) {
        if (score < rArray[j].score && username == rArray[j].username) {
            score = rArray[j].score;
        }
    }
    return score;
}

/*
*
* Erhöht den Punktestand des übergebenen Objektes um addedPoints
*
* @method updateScore
*
* @param {Object} JSONObj - Objekt, dessen Punktestand erhöht werden soll. Muss durch createQuestionJSON oder createAnswerJSON erstellt werden.
* @param {Integer} addedPoints - Betrag, um welchen der Punktestand erhöht werden soll
*
* @result {Object} JSONObj - Objekt mit neuem Punktestand
*
*/

function updateScore(JSONObj, addedPoints) {
    var score;
    
    score = getScore(JSONObj.score);
    score += addedPoints;
    JSONObj.score = score;
    
    return JSONObj;
}

function testAnswerArray() {
    var answers = JSON.parse(window.localStorage.getItem("answers")),
        i;
    for (i in answers) {
        alert(JSON.stringify(answers[i]));
    }
}

function testFileQuestion() {
    var questions = [];
    questions = JSON.parse(window.localStorage.getItem("questions"));
    var time = questions[0].timestamp;
    alert(time);
    getImage(questions[0]);
}