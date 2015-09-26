function showQuestions() {
    var questions = window.localStorage.getItem("questions");
    //alert(questions);
    var QJson = JSON.parse(questions);
    //alert(QJson[0].imgPath);
    
    var i;
    for (i=0; i<QJson.length; i++) {
        var carousel = document.createElement("ons-carousel-item");
        carousel.innerHTML += '<p class="picture-buttons"><ons-button class="btn-send" onclick="takePicture()">Beantwortren</ons-button></p><img src="' + QJson[i].imgPath + '" id="picture" height="100%" width="100%"></img>';
        document.getElementById("carousel").appendChild(carousel);
    
    //document.getElementById("carousel").insertAdjacentHTML('beforeend', '<ons-carousel-item><div><img src="' + QJson[i].imgPath + '" id="picture" height="100%" width="100%"></img></div></ons-carousel-item>');
    
    }
}