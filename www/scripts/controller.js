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
                var str0 = JSON.stringify(marker.getPosition());
                var str1 = str0.replace('{"G":', "");
                var str2 = str1.replace(',"K":', "/");
                var answer = str2.substr(0, str2.length - 1);

                window.localStorage.setItem("geoAnswer", answer);
                alert(answer);
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
            }


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

    app.controller('ServerController', function ($scope) {

        $scope.testServer = function () {

            'use strict';
            var usr = window.localStorage.getItem("loginname");
            var pwd = window.localStorage.getItem("password");

            var baseURL = "http://thm-chat.appspot.com/oop/";
            var link = baseURL + "users?user=" + usr + "&password=" + pwd;
            ons.notification.alert({
                message: link
            });
            $http.get(link)
                .success(function (response) {
                    ons.notification.alert({
                        message: 'Erfolgreich! - '
                        response
                    });
                });

        }

    });

})();