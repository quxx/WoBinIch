var questions = [];
questions = JSON.parse(window.localStorage.getItem("questions"));
document.addEventListener("pageinit", function(e)
{
//    if (window.localStorage.getItem("answeredQ") == null)
//    {
        window.localStorage.setItem("answeredQ", "");
//    }
    if (e.target.id == "my-page")
    {
        var answered = window.localStorage.getItem("answeredQ");
        var i = 0;
        var x = false;
        //        alert(questions[i].timestamp)
        while (x == false)
        {
            if (answered.search(questions[i].timestamp) == -1 && questions[i].open != false)
            {
                getImage(questions[i]);
                x = true;
            }
            else
            {
                i++
            }
        }
    }
}, false);


function answer(clickedElement)
{
    var theId = clickedElement.id;
    //alert(theId);
    window.sessionStorage.setItem('answerTimestamp', theId);
    slidingMenu.setMainPage('map.html',
    {
        closeMenu: true
    });
}