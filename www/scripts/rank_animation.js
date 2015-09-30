

/**
 * Die Punktestände der Spieler werden eingeholt
 */
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
   
    var ret = scoreArray();
    var arrVisitors = new Array();
    for (var i=0; i <= ret[0].length-1;i++) {
        arrVisitors[i] = ret[0][i] + "," + ret[1][i];
    }
    // Canvas Variablen
    var canvas;
    var context;
    // Diagramm Eigenschaften
    var cWidth, cHeight, cMargin, cSpace;
    var cMarginSpace, cMarginHeight;
    // Saeulen Eigenschaften
    var bWidth, bMargin, totalBars, maxDataValue;
    var bWidthMargin;
    // Saeulen Animation
    var ctr, numctr, speed;
    // Achsen Eigenschaften
    var totLabelsOnYAxis;
    document.addEventListener("pageinit", function(e)
    {
        if (e.target.id == "my-ranking")
        {
            var viewport = {
                width: $(window)
                    .width(),
                height: $(window)
                    .height()
            };

            canvas = document.getElementById("myCanvas");
            canvas.width = viewport.width - 5;
            canvas.height = viewport.height - 50;
            if (canvas && canvas.getContext)
            {
                context = canvas.getContext('2d');
            }
            chartSettings();
            drawAxisLabelMarkers();
            drawChartWithAnimation();
        }
    });
    
    
     /** 
      * Diagramm und Saeulen werden initialisiert. Variablen zum zeichnen und animieren werden errechnet bzw. bereitgestellt. Außerdem wird die größte Punktzahl ermittelt.
      */ 
    function chartSettings()
    {
        // Diagramm Eigenschaften
        cMargin = 25;
        cSpace = 30;
        cHeight = canvas.height - 2 * cMargin - cSpace;
        cWidth = canvas.width - 2 * cMargin - cSpace;
        cMarginSpace = cMargin + cSpace;
        cMarginHeight = cMargin + cHeight;
        // Saeulen Eigenschaften
        bMargin = 15;
        totalBars = arrVisitors.length;
        bWidth = (cWidth / totalBars) - bMargin;
        // ermitteln des maximalen Wertes für die Spitze
        maxDataValue = 0;
        for (var i = 0; i < totalBars; i++)
        {
            var arrVal = arrVisitors[i].split(",");
            var barVal = parseInt(arrVal[1]);
            if (parseInt(barVal) > parseInt(maxDataValue)) maxDataValue = barVal;
        }
        totLabelsOnYAxis = 10;
        context.font = "10pt Garamond";
        // initialisieren der Animationswerte
        ctr = 0;
        numctr = 100;
        speed = 10;
    }
     /**
      * Uebergeben der Daten an drawAxis(), damit dort die Achsen gezeichnet werden können. Zusätzlich werden die Achsenbezeichnungen aufgerufen.
      */
    function drawAxisLabelMarkers()
    {
        context.lineWidth = "2.0";
        // zeichne y Achse
        drawAxis(cMarginSpace, cMarginHeight, cMarginSpace, cMargin);
        // zeichne x Achse
        drawAxis(cMarginSpace, cMarginHeight, cMarginSpace + cWidth, cMarginHeight);
        context.lineWidth = "1.0";
        drawMarkers();
    }
     /**
      * Zeichenfunktion der Achsen mittels übergebenen Parametern.
      * @param {strin} x - Startpostion der X-Achse
      * @param {strin} y - Startpostion der X-Achse
      * @param {strin} X - Startpostion der Y-Achse
      * @param {strin} Y - Startpostion der Y-Achse
      */
    function drawAxis(x, y, X, Y)
    {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(X, Y);
        context.closePath();
        context.stroke();
    }
    
    /**
     * Ermitteln und zeichnen der Markierungen für die Achsen, sowie der Achsenbezeichnung von X und Y Achse.
     */
    function drawMarkers()
    {
        var numMarkers = parseInt(maxDataValue / totLabelsOnYAxis);
        context.textAlign = "right";
        context.fillStyle = "#000";;
        // Y Achse
        for (var i = 0; i <= totLabelsOnYAxis; i++)
        {
            markerVal = i * numMarkers;
            markerValHt = i * numMarkers * cHeight;
            var xMarkers = cMarginSpace - 5;
            var yMarkers = cMarginHeight - (markerValHt / maxDataValue);
            context.fillText(markerVal, xMarkers, yMarkers, cSpace);
        }
        // X Achse
        context.textAlign = 'center';
        for (var i = 0; i < totalBars; i++)
        {
            arrval = arrVisitors[i].split(",");
            name = arrval[0];
            markerXPos = cMarginSpace + bMargin + (i * (bWidth + bMargin)) + (bWidth / 2);
            markerYPos = cMarginHeight + 10;
            context.fillText(name, markerXPos, markerYPos, bWidth);
        }
        context.save();
        // Y Achsen Bezeichnung
        context.translate(cMargin - 10, cHeight / 2);
        context.rotate(Math.PI * -90 / 180);
        context.fillText('Punkte', 0, 0);
        context.restore();
        // X Achsen Bezeichnung
        context.fillText('Spieler', cMarginSpace + (cWidth / 2), cMarginHeight + 30);
    }
    /**
     * Ist für die animierte Darstellung der Saeulen zuständig. Die Anzahl der benoetigten Saeulen wird ermittelt und initialisiert.
     */
    function drawChartWithAnimation()
    {
        // Spieler array wird durchlaufen und animiert dargestellt
        for (var i = 0; i < totalBars; i++)
        {
            var arrVal = arrVisitors[i].split(",");
            bVal = parseInt(arrVal[1]);
            bHt = (bVal * cHeight / maxDataValue) / numctr * ctr;
            bX = cMarginSpace + (i * (bWidth + bMargin)) + bMargin;
            bY = cMarginHeight - bHt - 2;
            drawRectangle(bX, bY, bWidth, bHt, true);
        }
        // timeout überprüft ob gewollte Höhe der Saeule erreicht ist,
        // wenn nicht wächst sie weiter
        if (ctr < numctr)
        {
            ctr = ctr + 1;
            setTimeout(arguments.callee, speed);
        }
    }
    
    /**
     * Zeichnet die benötigten Saeulen. Bekommt alle nötigen Parameter aus drawCharWithAnimation().
     * 
     * @param {String}  x - x Position im Diagramm
     * @param {String}  y - y Position im Diagramm
     * @param {String}  w - breite der Saeule
     * @param {String}  h - hoehe der Saeule
     * @param {String}  fill - true oder falls, ob farbig zeichnen
     */
    function drawRectangle(x, y, w, h, fill)
    {
        context.beginPath();
        context.rect(x, y, w, h);
        context.closePath();
        context.stroke();
        if (fill)
        {
            var gradient = context.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgb(235,72,47)');
            gradient.addColorStop(1, 'rgb(242,130,39)');
            context.fillStyle = gradient;
            context.strokeStyle = gradient;
            context.fill();
        }
    }
