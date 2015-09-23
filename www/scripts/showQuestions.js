function showQuestions() {
    setEarliestTimestamp();
    var time = window.localStorage.getItem("earliestTimestamp");
    var user = window.localStorage.getItem("loginname");
    var pass = window.localStorage.getItem("password");
    var link = "http://thm-chat.appspot.com/oop/messages?since=" + time + "&user=" + user + "&password=" + pass;
    var req = new AjaxRequest(link, function(response){
        parseRawData(response);
        
        
    });
    req.send();
    
}