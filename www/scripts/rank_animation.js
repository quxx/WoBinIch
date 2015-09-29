/*document.addEventListener("pageinit", function (e) {
    if (e.target.id == "my-ranking") {
        var viewport = {
            width  : $(window).width(),
            height : $(window).height()
        };
        
//        alert(viewport.height);
//        alert(viewport.width);
        
        var c = document.getElementById("myCanvas");
        c.width = viewport.width-5;
        c.height = viewport.height-50;

        //Text Technsiche Hochschule
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#2E3F4B";
        ctx.font = "19px Arial";
        ctx.fillText("TECHNISCHE HOCHSCHULE MITTELHESSEN",30,150);
        
        //Text THM
        ctx.font = "bold 137px Arial";
        ctx.fillStyle = "#88C63F";
        ctx.fillText("THM",155,120);
        
        //Linie
        ctx.moveTo(130,20);
        ctx.lineTo(130,120);
        ctx.stroke();
        
        //Quadrate
        ctx.fillRect(55,25,20,20)
        ctx.fillRect(80,25,20,20)
        var y = 25;
        var v = 30;
            
        for (var z = 50; z<=100; z=z+25) {
            for (var x = 30; x<=80; x=x+25) {
                 ctx.fillRect(x,z,20,20)
            }
        }
    }
});
*/


document.addEventListener("pageinit", function (e) {
    if (e.target.id == "my-ranking") {
        var viewport = {
            width  : $(window).width(),
            height : $(window).height()
        };
        
    ct.canvas = document.getElementById("canvas");
    
        if(ct.canvas && ct.canvas.getContext) {
            ct.ctx = ct.canvas.getContext("2d");
        }
     
var ct = {
    canvas:null,
    ctx:null,
    
    values:[1223, 344, 4422, 5555],
    newValues:[],
    barWidth:30,
    barFill:null,
    backgroundFill:null,
    
    scale:0,
    duration:2.0,
    fps:30,
    startTime:0,
    timer:null,
    maxP:0,
    
    
    
    init: function() {
            //Farbverläufe
            ct.barFill = ct.ctx.createLinearGradient(0, 0, 0, 350);
            ct.barFill.addColorStop(0.0, "white");
            ct.barFill.addColorStop(0.0, "#BDBDBD");
            ct.barFill.addColorStop(1.0, "#6E6E6E");
        
            ct.backgroundFill = "#black";
            
            //Array aufsteigend sortieren
            ct.values.sort(function(a,b){return b-a});
            
            //Punkte in relation zum höchsten Punktestand setzen
            ct.maxP = ct.values[0];
            
            for(var i = 0; i < ct.values.length; i++) {
                ct.newValues[i] = ((ct.values[i] * (ct.canvas.height - 50)) / ct.maxP);
            }
        }
            
        
            ct.animStart();
    },
    
    animStart: function() {
        ct.startTime = new Date().getTime();
        ct.timer = setInterval(ct.animate, 1000 / ct.fps);
    },
    
    animate: function() {
        var diffTime = new Date().getTime() - ct.startTime;
        
        //Skallierungsfaktor
        ct.scale = diffTime / (1000 * ct.duration);
        
        //Ende
        if(diffTime >= 1000 * ct.duration) {
            ct.scale = 1.0; //auf 1.0 setzen damit Säule am Ende den richtigen Wert/Größe hat
            clearInterval(ct.timer);
        }
        ct.draw();
    },
    
    draw: function() {
         //Hintergrund zeichnen
        ct.ctx.fillStyle = ct.backgroundFill;
        ct.ctx.fillRect(0, 0, ct.canvas.width, ct.canvas.height);
        
        ct.ctx.save();
        
        ct.ctx.translate(20, ct.canvas.height - 30);
        ct.ctx.scale(1, -1);
   
        //Säulen zeichnen
        for(var i = 0; i < ct.newValues.length; i++) {
            ct.ctx.fillStyle = ct.barFill;
            ct.ctx.fillRect(i * (ct.barWidth +10), 0, ct.barWidth, ct.scale * ct.newValues[i]);
        }
        
        ct.ctx.restore();
      
    }
}

function GenerateTable() {
    //Build an array containing Customer records.
    var customers = new Array();
    customers.push(["Customer Id", "Name", "Country"]);
    customers.push([1, "John Hammond", "United States"]);
    customers.push([2, "Mudassar Khan", "India"]);
    customers.push([3, "Suzanne Mathews", "France"]);
    customers.push([4, "Robert Schidner", "Russia"]);
 
    //Tabellen Element erstellen
    var table = document.createElement("TABLE");
    table.border = "1";
 
    //Spalten Anzahl
    var columnCount = customers[0].length;
 
    //Hinzufügen der Kopfzeilen
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = customers[0][i];
        row.appendChild(headerCell);
    }
 
    //Daten einfügen
    for (var i = 1; i < customers.length; i++) {
        row = table.insertRow(-1);
        for (var j = 0; j < columnCount; j++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = customers[i][j];
        }
    }
 
    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}



}
});

