var questions = [];
questions = JSON.parse(window.localStorage.getItem("questions"));
document.addEventListener("pageinit", function (e) {
    if (e.target.id == "my-page") {
        var i;
        for (i = 0; i < questions.length; i++) {
            getImage(questions[i]);
        }
    }
}, false);


function refresh() {
    window.location = "home.html";
}


function answer(clickedElement) {
    var theId = clickedElement.id;
    //alert(theId);
    window.sessionStorage.setItem('answerTimestamp', theId);
    slidingMenu.setMainPage('map.html', {
        closeMenu: true
    });
}