// controller.js

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

    //Map controller
    app.controller('MapController', function ($scope, $timeout) {

        $scope.map;

        //Map initialieren  
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
            $scope.hammertime = Hammer($scope.element).on("hold", function (event) {
                $scope.addOnClick(event);
            });

        }, 100);

        //Send

        $scope.sendMarker = function () {
            if (marker) {
                var accuracy = 50; //Genauigkeit mit der die Punkte abstufung erfolgt (in Meter) (pro Intervall -5% Punkte)
                var maxPoints = 75; //Maximal erreichbare Punkte bei der beantwortung über die Karte
                var reference = window.sessionStorage.getItem("answerTimestamp").split("|");
                var alat = reference[1].toString();
                var alng = reference[2].toString();
                var username = window.localStorage.getItem("loginname");
                var time = Date.now();
                var lat = marker.getPosition().lat().toString();
                var lng = marker.getPosition().lng().toString();
                var distanceKM = distance(lat, lng, alat, alng);
                var distanceM = Math.round(distanceKM * 1000); //Entfernung beider Koordinaten in Meter
                var points = parseInt(reference[3]);
                if (maxPoints - ((maxPoints / 20) * Math.floor(distanceM / accuracy)) < 0) {
                    points += 0;
                } else {
                    points += Math.round(maxPoints - ((maxPoints / 20) * Math.floor(distanceM / accuracy)));
                }
                //alert(points);
                var answerJSON = createAnswerJSON(time, reference[0], username, alat, alng, points);
                ajxBroadcastJSON(answerJSON);

            } else {
                ons.notification.alert({
                    message: "Bitte setze zuerst einen Marker!"
                });
            }
        };

        //Ich bin da!
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
            var reference = window.sessionStorage.getItem("answerTimestamp").split("|");
            var alat = reference[1].toString();
            var alng = reference[2].toString();
            var username = window.localStorage.getItem("loginname");
            var time = Date.now();
            var lat = marker.getPosition().lat().toString();
            var lng = marker.getPosition().lng().toString();
            var distanceKM = distance(lat, lng, alat, alng);
            var distanceM = Math.round(distanceKM * 1000); //Entfernung beider Koordinaten in Meter
            var points = parseInt(reference[3]);
            if (maxPoints - ((maxPoints / 20) * Math.floor(distanceM / accuracy)) < 0) {
                    points += 0;
                } else {
                    points += Math.round(maxPoints - ((maxPoints / 20) * Math.floor(distanceM / accuracy)));
                }
            var answerJSON = createAnswerJSON(time, reference[0], username, alat, alng, points);
            ajxBroadcastJSON(answerJSON);

        }


        //Marker hinzufügen
        $scope.addOnClick = function (event) {
            var x = event.gesture.center.pageX;
            var y = event.gesture.center.pageY - 44;
            var point = new google.maps.Point(x, y);
            var coordinates = $scope.overlay.getProjection().fromContainerPixelToLatLng(point);


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