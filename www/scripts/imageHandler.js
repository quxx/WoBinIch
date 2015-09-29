/**
 *
 * Läd das Übergeben Bild an den Empfänger auf den Server
 *
 * @method downloadFile
 *
 * @param {String} imageURI - Die Pfad angabe zu dem hochzuladenen Bild
 * @param {String} consignee - Der Empfänger der Bildnachricht
 *
 *
 */
function uploadImage(imageURI, consignee)
{
    var req = new AjaxRequest("http://thm-chat.appspot.com/oop/uploadURL", function(response)
    {
        var options = new FileUploadOptions();
        options.fileKey = "image";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.headers = {
            Connection: "close"
        };
        options.chunkedMode = false;
        var params = new Object();
        params.fromUser = window.localStorage.getItem("loginname");
        params.fromPassword = window.localStorage.getItem("password");
        params.toUser = consignee;
        params.type = "img";
        options.params = params;
        var ft = new FileTransfer();
        ft.upload(imageURI, response, win, fail, options);
        //Function on Success
        function win(r)
        {}
        //Function on Fail
        function fail(error)
        {
            console.log("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        }
    });
    req.send();
}
/**
 *
 * Läd ein Bild von einer Url und speichert dieses in einem neuerstellten/vorhandenen Ordner auf dem Smartphone.
 *
 * @method downloadFile
 *
 * @param {String} URL - Die URL des zu donwloadenen Bildes
 * @param {String} Folder_Name - Der Ordnername in dem das Bild gespeichert werden soll
 * @param {String} File_Name - Dateiname für das heruntergeladene Bild
 *
 *
 */
function downloadFile(URL, Folder_Name, File_Name)
{
    //Parameter Überprüfen
    if (URL == null && Folder_Name == null && File_Name == null)
    {
        return;
    }
    else
    {
        //Überprüfen ob Internet vorhanden ist
        var networkState = navigator.connection.type;
        if (networkState == Connection.NONE)
        {
            return;
        }
        else
        {
            //Ist dies erfüllt wird nächste Funktion angestoßen
            download(URL, Folder_Name, File_Name);
        }
    }
}

function download(URL, Folder_Name, File_Name)
{
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

    function fileSystemSuccess(fileSystem)
    {
        var download_link = encodeURI(URL);
        var directoryEntry = fileSystem.root; // Frage Root path ab
        directoryEntry.getDirectory(Folder_Name,
        {
            create: true,
            exclusive: false
        }, onDirectorySuccess, onDirectoryFail); // Ordner erstellen
        var rootdir = fileSystem.root;
        var fp = rootdir.toURL(); // Gesamter Ordnerpfad
        fp = fp + Folder_Name + "/" + File_Name + "." + "jpg"; // Ordnerpfad und Dateiname für das speichern
        filetransfer(download_link, fp);
    }

    function onDirectorySuccess(parent)
    {
        // Ordner wurde erstellt
    }

    function onDirectoryFail(error)
    {
        //Error bei Ordner erstellung
        console.log("Unable to create new directory: " + error.code);
    }

    function fileSystemFail(evt)
    {
        //Kann nicht aufs Dateisystem zugreifen
        console.log(evt.target.error.code);
    }
}

function filetransfer(download_link, fp)
{
    var fileTransfer = new FileTransfer();
    // Image Download function
    fileTransfer.download(download_link, fp, function(entry)
    {
        //console.log("download complete: " + entry.fullPath); // Gibt kompletten Pfad des Bildes aus
    }, function(error)
    {
        console.log("download error source " + error.source);
    });
}
/******************************************************** Test Funktion ***************************************************/
function downloadTest()
{
    console.log("Test");
    var url = "http://lh3.googleusercontent.com/JT2wCIrlSJEmGVbBs4uCP85IgWROl1D_AMOzJDtrXob3WA9zbH5QcsfyEycA_gYQ8J7xofQqnBtnnXK8m9Ze";
    var folder = "WoBinIchTest";
    var name = "test";
    downloadFile(url, folder, name);
}