
var questions = window.localStorage.getItem("questions");
var QJson = JSON.parse(questions);
document.addEventListener("pageinit", function(e) {
      if (e.target.id == "my-page") {
        var i;
        for (i=0; i<QJson.length; i++) {
        var carousel = document.createElement("ons-carousel-item");
        var timestamp = QJson[i].timestamp;
        //alert(timestamp);
        carousel.innerHTML += '<div><img style="z-index: -1;" src="' + QJson[i].imgPath + '" id="picture" height="100%" width="100%"></img></div><p class="par-buttons"><button id="' + timestamp + '" class="btn-send" onclick="answer(this)">Beantworten</button></p>';
        document.getElementById("carousel").appendChild(carousel);
        }
      }
    }, false);

function refresh() {
    window.location="home.html";
}

function answer(clickedElement) {
    var theId = clickedElement.id; 
    alert(theId);
    window.sessionStorage.setItem('answerTimestamp', theId);
    slidingMenu.setMainPage('map.html', {closeMenu: true});
}