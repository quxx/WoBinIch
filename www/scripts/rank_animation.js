function scoreArray()
{
    ajxGetUserList();
    var arr = [];
    arr = getUserArray();
    var points = [];
    var i;
    for (i = 0; i <= arr.length; i++)
    {
        points[i] = getScore(arr[i]);
    }
    var ret = [];
    ret.push(arr);
    ret.push(points);
    return ret;
}
var viewport = {
    width: $(window)
        .width(),
    height: $(window)
        .height()
};
var ct = {
        canvas: null,
        ctx: null,
        values: [],
        newValues: [],
        barWidth: 40,
        barFill: null,
        backgroundFill: null,
        scale: 0,
        duration: 2.0,
        fps: 30,
        startTime: 0,
        timer: null,
        maxP: 0,
        init: function()
        {
            var ret = scoreArray();
            ct.values = ret[1];
            ct.canvas = document.getElementById("myCanvas");
            ct.canvas.width = viewport.width - 5;
            ct.canvas.height = viewport.height - 50;
            if (ct.canvas && ct.canvas.getContext)
            {
                ct.ctx = ct.canvas.getContext("2d");
                //Farbverläufe
                ct.barFill = ct.ctx.createLinearGradient(0, 0, 0, 350);
                ct.barFill.addColorStop(0.0, "#F5A9A9");
                ct.barFill.addColorStop(0.5, "#FE2E2E");
                ct.barFill.addColorStop(1.0, "#DF0101");
                ct.backgroundFill = "#F2F2F2";
                //Array aufsteigen sortieren
                ct.values.sort(function(a, b)
                {
                    return b - a
                });
                //Punkte in relation zum höchsten Punktestand setzen
                ct.maxP = ct.values[0];
                for (var i = 0; i < ct.values.length; i++)
                {
                    ct.newValues[i] = ((ct.values[i] * (ct.canvas.height - 50)) / ct.maxP);
                }
            }
            ct.animStart();
        },
        animStart: function()
        {
            ct.startTime = new Date()
                .getTime();
            ct.timer = setInterval(ct.animate, 1000 / ct.fps);
        },
        animate: function()
        {
            var diffTime = new Date()
                .getTime() - ct.startTime;
            //Skallierungsfaktor
            ct.scale = diffTime / (1000 * ct.duration);
            //Ende
            if (diffTime >= 1000 * ct.duration)
            {
                ct.scale = 1.0; //auf 1.0 setzen damit Säule am Ende den richtigen Wert/Größe hat
                clearInterval(ct.timer);
            }
            ct.draw();
        },
        draw: function()
        {
            //Hintergrund zeichnen
            ct.ctx.fillStyle = ct.backgroundFill;
            ct.ctx.fillRect(0, 0, ct.canvas.width, ct.canvas.height);
            ct.ctx.save();
            ct.ctx.translate(20, ct.canvas.height - 30);
            ct.ctx.scale(1, -1);
            //Säulen zeichnen
            for (var i = 0; i < ct.newValues.length; i++)
            {
                ct.ctx.fillStyle = ct.barFill;
                ct.ctx.fillRect(i * (ct.barWidth + 20), 0, ct.barWidth, ct.scale * ct.newValues[i]);
            }
            ct.ctx.restore();
        }
    }
    //Tabelle

function generateTable()
{
    //Build an array containing Customer records.
    var ret = scoreArray();
    var names = ret[0];
    var points = ret[1];
    var customers = new Array();
    customers.push(["Spieler", "Name", "Punkte"]);
    var x;
    for (x = 0; x < names.length-1; x++)
    {
        customers.push([parseInt(x + 1), names[x], points[x]]);
    }
    //Tabellen Element erstellen
    var table = document.createElement("TABLE");
    table.border = "1";
    //Spalten Anzahl
    var columnCount = customers[0].length;
    //Hinzufügen der Kopfzeilen
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++)
    {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = customers[0][i];
        row.appendChild(headerCell);
    }
    //Daten einfügen
    for (var i = 1; i < customers.length; i++)
    {
        row = table.insertRow(-1);
        for (var j = 0; j < columnCount; j++)
        {
            var cell = row.insertCell(-1);
            cell.innerHTML = customers[i][j];
        }
    }
    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}
document.addEventListener("pageinit", function(e)
{
    if (e.target.id == "my-ranking")
    {
        ct.init();
        generateTable();
    }
});