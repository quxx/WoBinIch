var questions = [];
questions = JSON.parse(window.localStorage.getItem("questions"));
/**
 * Es wird das QuestionArray aus dem Localstorage gelesen, nun wird anhand des Timestamps überprüft ob die Frage schon beantwortet worden ist, ist dies der Fall wird die nächste Frage überpfüft,
 * ist dies nich der Fall wird das dazugehörige Bild aus der Bildnachricht geladen (über getImage() wird dieses dann auch angezeigt)
 *
 * @function 
 */
document.addEventListener("pageinit", function(e)
{
    if (window.localStorage.getItem("answeredQ") == null)
    {
        window.localStorage.setItem("answeredQ", "");
    }
    if (e.target.id == "my-page")
    {
        var answered = window.localStorage.getItem("answeredQ");
        var i = 0;
        var x = false;
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

/**
 * Bekommt ein Element übergeben speichert die dazugehörige ID in den Localstorage, und wechselt auf die map.html seite.
 * Die Id des objekets behinhaltet den Timestamp des jeweils angeklickten Bildes, dieser wird für die zuordnung von Bild und Bildfrage gebraucht
 *
 * @function answer
 * 
 * @param {element} clickedElement Das übergeben Elemnt aus der play.html 
 */
function answer(clickedElement)
{
    var theId = clickedElement.id;
    window.sessionStorage.setItem('answerTimestamp', theId);
    slidingMenu.setMainPage('map.html',
    {
        closeMenu: true
    });
}