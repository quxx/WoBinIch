var questions = window.localStorage.getItem("questions");
var QJson = JSON.parse(questions);
document.addEventListener("pageinit", function (e) {
    if (e.target.id == "my-page") {
        var i;
        for (i = 0; i < QJson.length; i++) {
            var carousel = document.createElement("ons-carousel-item");
            carousel.innerHTML += '<p class="picture-buttons"><ons-button class="btn-send" onclick="">Beantworten</ons-button></p><img src="' + QJson[i].imgPath + '" id="picture" height="100%" width="100%"></img>';
            //aus QJson[i].imgPath wird voraussichtlich statt dessen getImage(QJson[i]), nur als Vorwarnung.
            document.getElementById("carousel").appendChild(carousel);
        }
    }
}, false);

function refresh() {
    window.location = "home.html";
}