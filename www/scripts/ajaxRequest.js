/**
 * Sendet einen Ajax Request an eine bestimme URL, und kann die Antwort in der Callback Funktion verarbeiten
 *
 * @function AjaxRequest
 * 
 * @param {String} sURL Die Server URL f�r den Request
 * @param {function} fCallback eine Callbackfuntion die nach dem Request ausgef�hrt werden soll
 * @param {String} sContent (Optional) Post Content welches an den Server �bermittelt werden soll
 */
function AjaxRequest(sURL, fCallback, sContent)
{
    this.url = sURL;
    if (AjaxRequest.arguments.length < 1) this.url = "";
    this.callback = fCallback;
    if (AjaxRequest.arguments.length < 2) this.callback = null;
    this.content = sContent;
    if (AjaxRequest.arguments.length < 3) this.content = "";
    this.httpReq = null;
    this.send = function()
    {
        if (this.url.length <= 0) return false;
        if (window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.ActiveXObject))
        {
            this.httpReq = new XMLHttpRequest();
        }
        else
        {
            try
            {
                this.httpReq = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e)
            {
                this.httpReq = null;
            }
        }
        if (this.httpReq != null)
        {
            var method = (this.content.length > 0) ? "POST" : "GET";
            this.httpReq.open(method, this.url, true);
            if (this.content.length > 0) this.httpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            var tmp = this;
            this.httpReq.onreadystatechange = function()
            {
                tmp.onRequestStateChange();
            };
            this.httpReq.send(this.content);
            return true;
        }
        else return false;
    }
    this.onRequestStateChange = function()
    {
        if (this.httpReq.readyState == 4)
        {
            if (this.callback != null) this.callback(this.httpReq.responseText);
        }
    }
}