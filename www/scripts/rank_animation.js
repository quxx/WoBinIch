var ct = {
    canvas:null,
    ctx:null,
    
    values:[13, 93, 22, 53],
    barWidth:30,
    barFill:null,
    backgroundFill:null,
    
    scale:0,
    duration:1.5,
    fps:25,
    startTime:0,
    timer:null,
    
    init: function() {
        ct.canvas = document.getElementById("canvas");
    
        if(ct.canvas && ct.canvas.getContext) {
            ct.ctx = ct.canvas.getContext("2d");
                
            //Farbverläufe
            ct.barFill = ct.ctx.createLinearGradient(0, 0, 0, 120);
            ct.barFill.addColorStop(0.0, "#F1F8E0");
            ct.barFill.addColorStop(1.0, "#31B404");
            
            ct.backgroundFill = ct.ctx.createLinearGradient(0, 0, 0, ct.canvas.height);
            ct.backgroundFill.addColorStop(0.0, "#FA5858");
            ct.backgroundFill.addColorStop(1.0, "white"); 
            
            ct.values.sort();
            ct.values.reverse();
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
        
window.onload = ct.init;
