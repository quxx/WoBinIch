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
     // chart sample data
    var ret = scoreArray();
    var arrVisitors = new Array();
    for (var i=0; i < ret[0].length-1;i++) {
        arrVisitors[i] = ret[0][i] + "," + ret[1][i];
    }

    var canvas;
    var context;
     // chart properties
    var cWidth, cHeight, cMargin, cSpace;
    var cMarginSpace, cMarginHeight;
     // bar properties
    var bWidth, bMargin, totalBars, maxDataValue;
    var bWidthMargin;
     // bar animation
    var ctr, numctr, speed;
     // axis property
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
            //        alert(viewport.height);
            //        alert(viewport.width);
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
     // initialize the chart and bar values
    function chartSettings()
    {
        // chart properties
        cMargin = 25;
        cSpace = 30;
        cHeight = canvas.height - 2 * cMargin - cSpace;
        cWidth = canvas.width - 2 * cMargin - cSpace;
        cMarginSpace = cMargin + cSpace;
        cMarginHeight = cMargin + cHeight;
        // bar properties
        bMargin = 15;
        totalBars = arrVisitors.length;
        bWidth = (cWidth / totalBars) - bMargin;
        // find maximum value to plot on chart
        maxDataValue = 0;
        for (var i = 0; i < totalBars; i++)
        {
            var arrVal = arrVisitors[i].split(",");
            var barVal = parseInt(arrVal[1]);
            if (parseInt(barVal) > parseInt(maxDataValue)) maxDataValue = barVal;
        }
        totLabelsOnYAxis = 10;
        context.font = "10pt Garamond";
        // initialize Animation variables
        ctr = 0;
        numctr = 100;
        speed = 10;
    }
     // draw chart axis, labels and markers
    function drawAxisLabelMarkers()
    {
        context.lineWidth = "2.0";
        // draw y axis
        drawAxis(cMarginSpace, cMarginHeight, cMarginSpace, cMargin);
        // draw x axis
        drawAxis(cMarginSpace, cMarginHeight, cMarginSpace + cWidth, cMarginHeight);
        context.lineWidth = "1.0";
        drawMarkers();
    }
     // draw X and Y axis
    function drawAxis(x, y, X, Y)
    {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(X, Y);
        context.closePath();
        context.stroke();
    }
     // draw chart markers on X and Y Axis
    function drawMarkers()
    {
        var numMarkers = parseInt(maxDataValue / totLabelsOnYAxis);
        context.textAlign = "right";
        context.fillStyle = "#000";;
        // Y Axis
        for (var i = 0; i <= totLabelsOnYAxis; i++)
        {
            markerVal = i * numMarkers;
            markerValHt = i * numMarkers * cHeight;
            var xMarkers = cMarginSpace - 5;
            var yMarkers = cMarginHeight - (markerValHt / maxDataValue);
            context.fillText(markerVal, xMarkers, yMarkers, cSpace);
        }
        // X Axis
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
        // Add Y Axis title
        context.translate(cMargin - 10, cHeight / 2);
        context.rotate(Math.PI * -90 / 180);
        context.fillText('Punkte', 0, 0);
        context.restore();
        // Add X Axis Title
        context.fillText('Spieler', cMarginSpace + (cWidth / 2), cMarginHeight + 30);
    }
    
    function drawChartWithAnimation()
    {
        // Loop through the total bars and draw
        for (var i = 0; i < totalBars; i++)
        {
            var arrVal = arrVisitors[i].split(",");
            bVal = parseInt(arrVal[1]);
            bHt = (bVal * cHeight / maxDataValue) / numctr * ctr;
            bX = cMarginSpace + (i * (bWidth + bMargin)) + bMargin;
            bY = cMarginHeight - bHt - 2;
            drawRectangle(bX, bY, bWidth, bHt, true);
        }
        // timeout runs and checks if bars have reached
        // the desired height; if not, keep growing
        if (ctr < numctr)
        {
            ctr = ctr + 1;
            setTimeout(arguments.callee, speed);
        }
    }
    
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
