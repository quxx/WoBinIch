
function start(){
  document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady(){
  alert('123');

        var ct = {
        canvas:null,
        ctx:null,
    
        values:[13, 44, 22, 153],
        barWidth:30,
        barFill:null,
        backgroundFill:null,
    
        scale:0,
        duration:2.0,
        fps:30,
        startTime:0,
        timer:null,
    
    
    
    init: function() {
        ct.canvas = document.getElementById("canvas");
        
        if(ct.canvas && ct.canvas.getContext) {
            ct.ctx = ct.canvas.getContext("2d");
                
            //Farbverläufe
            ct.barFill = ct.ctx.createLinearGradient(0, 0, 0, 200);
            ct.barFill.addColorStop(0.0, "white");
            ct.barFill.addColorStop(1.0, "#6E6E6E");
            
            ct.backgroundFill = "black";
            
            //Array aufsteigen sortieren
            ct.values.sort(function(a,b){return b-a});
        
            ct.animStart();
        }
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
        for(var i = 0; i < ct.values.length; i++) {
            ct.ctx.fillStyle = ct.barFill;
            ct.ctx.fillRect(i * (ct.barWidth +10), 0, ct.barWidth, ct.scale * ct.values[i]);
        }
        
        ct.ctx.restore();
      
    }
};
}

