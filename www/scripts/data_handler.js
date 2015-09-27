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


/*
 * 
 * Sucht das zugehörige Bild zu einem Frageobjekt aus dem Gerätespeicher zeigt es an.
 *
 * param {Object} questionJSON - Javascript Objekt, welches mit createQuestionJSON erstellt wurde
 *
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
        alert("success! imgPath = " + fileEntry.fullPath);
    }

}

function testQuestionArray() {
    var questions = JSON.parse(window.localStorage.getItem("questions")),
        i;
    for (i in questions) {
        alert(JSON.stringify(questions[i]));
    }
}

function testFileQuestion() {
    var questions = [];
    questions = JSON.parse(window.localStorage.getItem("questions"));
    var time = questions[0].timestamp;
    alert(time);
    getImage(time);
}