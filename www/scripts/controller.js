/**
 * Stellt sicher, dass sich das Sliding Menu nicht per Slide öffnen lässt während die Karte aktiv ist. Enthält außerdem die verschiedenen Funktionen die für das Anzeigen der Karte und für die Beantwortung 
 * und Bewertung der Fragen verantwortlich sind.
 *
 * @function 
 */
(function () {
    var app = angular.module('myApp', ['onsen']);
    var marker;
    //Sliding menu und Buttons
    app.controller('SlidingMenuController', function ($scope) {
        $scope.checkSlidingMenuStatus = function () {
            $scope.slidingMenu.on('postclose', function () {
                $scope.slidingMenu.setSwipeable(false);
            });
            $scope.slidingMenu.on('postopen', function () {
                $scope.slidingMenu.setSwipeable(true);
            });
        };
        $scope.checkSlidingMenuStatus();
    });

    app.controller('MapController', function ($scope, $timeout) {
        $scope.map;
        /**
         *
         * Initialisiert die Map mit Hilfe der GoogleMaps API und fügt sie in die map.html seite ein.
         *
         * @function 
         */
        $timeout(function () {
            var latlng = new google.maps.LatLng(window.localStorage.getItem("lat"), window.localStorage.getItem("lon"));
            var myOptions = {
                zoom: 12,
                center: latlng,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
            $scope.overlay = new google.maps.OverlayView();
            $scope.overlay.draw = function () {}; // empty function required
            $scope.overlay.setMap($scope.map);
            $scope.element = document.getElementById('map_canvas');
            $scope.hammertime = Hammer($scope.element)
                .on("hold", function (event) {
                    $scope.addOnClick(event);
                });
        }, 100);
        /**
         * Handelt die Beantwortung der Frage über den gesetzten Marker auf der Karte.
         * Legt zuerst fest wieviel Punkte maximal erreichbar sind und bei wieviel ungenauigkeit entsprechende Punkte reduziert werden. 
         * Holt sich außerdem das dazugehrige QuestionJSON aus dem Localstorage (über den übergeben referent Timestamp). Ermittelt dann mit Hilfe von distance() wie viele Meter die Antwort von der Lösung entfernt ist
         * und errechnet daraus die Punkte für den Spieler addiert diese mit seinen vorherigen Punkten und erstellt ein answerJSON und sendet dies an alle Benutzer des Spiels. Gibt außerdem eine Message an den Spieler aus 
         * mit den Infos wie er bei der Frage abgeschnitten hat.
         * 
         * Falls der Spieler kein Marker gesetzt hat, wird eine entsprechende Fehlermeldung ausgegeben.
         *
         * @function sendMarker
         */
        $scope.sendMarker = function () {
            if (marker) {
                var accuracy = 50; //Genauigkeit mit der die Punkte abstufung erfolgt (in Meter) (pro Intervall -5% Punkte)
                var maxPoints = 75; //Maximal erreichbare Punkte bei der beantwortung über die Karte
                var reference = window.sessionStorage.getItem("answerTimestamp");
                var questionsArray = [];
                questionsArray = JSON.parse(window.localStorage.getItem("questions"));
                var Qjson, i;
                //hol timestamp und array in die variablen
                for (i in questionsArray) {
                    if (questionsArray[i].timestamp == reference) {
                        Qjson = questionsArray[i];
                    }
                }
                var alat = Qjson.geolat;
                var alng = Qjson.geolon;
                var username = window.localStorage.getItem("loginname");
                var time = Date.now();
                var lat = marker.getPosition()
                    .lat()
                    .toString();
                var lng = marker.getPosition()
                    .lng()
                    .toString();
                var distanceKM = distance(lat, lng, alat, alng);
                var distanceM = Math.round(distanceKM * 1000); //Entfernung beider Koordinaten in Meter
                var points = parseInt(getScore(username)); // Hole alten Punktestand
                var aScore; // Punktestand für diese Frage (Nur für die Alert Message)
                if (maxPoints - ((maxPoints / 20) * Math.floor(distanceM / accuracy)) < 0) {
                    aScore = 0;
                    points += 0;
                } else {
                    aScore = Math.round(maxPoints - ((maxPoints / 20) * Math.floor(distanceM / accuracy)));
                    points += aScore;
                }
                var answerJSON = createAnswerJSON(time, reference, username, alat, alng, points);
                ajxBroadcastJSON(answerJSON);
                var answered = [];
                if (window.localStorage.getItem("answeredQ") !== "") {
                    answered = JSON.parse(window.localStorage.getItem("answeredQ"));
                }
                answered.push(reference);
                window.localStorage.setItem("answeredQ", JSON.stringify(answered));
                scoreQuestion(Qjson);
                ons.notification.alert({
                    title: 'Antwort abgeschickt',
                    messageHTML: 'Punktezahl: ' + aScore + '<br>Distance zum Ziel: ' + distanceM + ' Meter </br>Gesamtpunktzahl: ' + points,
                    callback: function () {
                        window.location = "index.html"
                    }
                });
            } else {
                ons.notification.alert({
                    message: "Bitte setze zuerst einen Marker!"
                });
            }
        };
        /**
         * Analog zu der Beantwortung über den Marker wird die Möglichkeit gegeben zusagen, dass man sich schon an dem gefragten Ort befinden. Über diese Methode kann man eine größee maximal Punktzahl erreichen
         * Legt zuerst fest wieviel Punkte maximal erreichbar sind und bei wieviel ungenauigkeit entsprechende Punkte reduziert werden. 
         * Holt sich außerdem das dazugehrige QuestionJSON aus dem Localstorage (über den übergeben referent Timestamp). Nun wird der aktuelle Standpunkt des Spielers abgefragt und an dieser Stelle ein Marker gesetzt.
         * Ermittelt dann mit Hilfe von distance() wie viele Meter die Antwort von der Lösung entfernt ist
         * und errechnet daraus die Punkte für den Spieler addiert diese mit seinen vorherigen Punkten und erstellt ein answerJSON und sendet dies an alle Benutzer des Spiels. Gibt außerdem eine Message an den Spieler aus 
         * mit den Infos wie er bei der Frage abgeschnitten hat.
         * 
         *
         * @function imHere
         */
        $scope.imHere = function () {
                geolocation();
                var lat = window.localStorage.getItem("lat");
                var lon = window.localStorage.getItem("lon");
                var position = new google.maps.LatLng(lat, lon);
                var myOptions2 = {
                    zoom: 16,
                    center: position,
                    disableDefaultUI: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                $scope.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions2);
                $scope.overlay = new google.maps.OverlayView();
                $scope.overlay.draw = function () {}; // empty function required
                $scope.overlay.setMap($scope.map);
                $scope.element = document.getElementById('map_canvas');
                if (marker) {
                    marker.setPosition(position);
                } else {
                    marker = new google.maps.Marker({
                        position: position,
                        map: $scope.map,
                        draggable: false
                    });
                };
                var maxPoints = 100; //Maximal erreichbare Punkte bei der beantwortung über die Karte
                var accuracy = 50; //Genauigkeit mit der die Punkte abstufung erfolgt (in Meter) (pro Intervall -5% Punkte)
                var reference = window.sessionStorage.getItem("answerTimestamp");
                var questionsArray = [];
                questionsArray = JSON.parse(window.localStorage.getItem("questions"));
                var Qjson, i;
                //Hol timestamp und array in die variablen
                for (i in questionsArray) {
                    if (questionsArray[i].timestamp == reference) {
                        Qjson = questionsArray[i];
                    }
                }
                var alat = Qjson.geolat;
                var alng = Qjson.geolon;
                var username = window.localStorage.getItem("loginname");
                var time = Date.now();
                var lat = marker.getPosition()
                    .lat()
                    .toString();
                var lng = marker.getPosition()
                    .lng()
                    .toString();
                var distanceKM = distance(lat, lng, alat, alng);
                var distanceM = Math.round(distanceKM * 1000); //Entfernung beider Koordinaten in Meter
                var points = parseInt(getScore(username)); //Hole alten Punktestand des Spielers
                var aScore; //Punktestand für diese Frage (Nur für die Alert Message)
                if (maxPoints - ((maxPoints / 20) * Math.floor(distanceM / accuracy)) < 0) {
                    aScore = 0;
                    points += 0;
                } else {
                    aScore = Math.round(maxPoints - ((maxPoints / 20) * Math.floor(distanceM / accuracy)));
                    points += aScore;
                }
                var answerJSON = createAnswerJSON(time, reference, username, alat, alng, points);
                ajxBroadcastJSON(answerJSON);
                var answered = [];
                if (window.localStorage.getItem("answeredQ") !== "") {
                    answered = JSON.parse(window.localStorage.getItem("answeredQ"));
                }
                answered.push(reference);
                window.localStorage.setItem("answeredQ", JSON.stringify(answered));
                scoreQuestion(username);
                ons.notification.alert({
                    title: 'Antwort abgeschickt',
                    messageHTML: 'Punktezahl: ' + aScore + '<br>Distance zum Ziel: ' + distanceM + ' Meter </br>Gesamtpunktzahl: ' + points,
                    callback: function () {
                        window.location = "index.html"
                    }
                });
            }
            /**
             * Setzt einen Marker an die vom User geklickte Stelle auf der Karte. Ist schon ein Marker gestezt wird nur die Position des aktuellen Markers geändert, ist noch keiner gestezt wird ein neuer erstellt und an die Position gesetzt
             *
             * @function addOnClick
             */
        $scope.addOnClick = function (event) {
            var x = event.gesture.center.pageX;
            var y = event.gesture.center.pageY - 44;
            var point = new google.maps.Point(x, y);
            var coordinates = $scope.overlay.getProjection()
                .fromContainerPixelToLatLng(point);
            if (marker) {
                marker.setPosition(coordinates);
            } else {
                marker = new google.maps.Marker({
                    position: coordinates,
                    map: $scope.map,
                    draggable: true
                });
            }
        };
    });
})();