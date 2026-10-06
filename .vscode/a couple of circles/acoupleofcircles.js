var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

window.onload = function () {

    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    var mouseY = -1000;
    var mouseX = -1000;
    var clicked = false;
    var pressed = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function playNote(frequency, duration) {
        // create Oscillator node
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        gainNode.gain.value = 0;
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.02); // Fade in to 0.1 volume over 10ms
      
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency; // value in hertz

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        setTimeout(() => {
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration / 1000);
        }, 20);
        
        setTimeout(
          function() {
            oscillator.stop();
          }, duration*1.5);
    }
    function cst(num, min, max) {
        if(num < min) return min;
        if(num > max) return max;
        return num;
    }
    function addcommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function pointonbox(x, y, boxx, boxy, boxw, boxh) {
        return x > boxx && x < boxx+boxw && y > boxy && y < boxy+boxh;
    }
    function dist(x1, y1, x2, y2) {
        return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
    }
    function timeelapsed(difference) {
        var days = Math.floor((difference) / (60 * 1000 * 60 * 24));
        var hours = Math.floor((difference % (60 * 1000 * 60 * 24)) / (60 * 1000 * 60));
        var minutes = Math.floor((difference % (60 * 1000 * 60)) / (60 * 1000));
        var seconds = Math.floor((difference % (60 * 1000)) / 1000);
        var milliseconds = difference % 1000;

        if(days > 0){
        return days + "d " + hours + "h " + minutes + "m " + seconds + "s " + milliseconds + "ms";
        } else if(hours > 0){
            return hours + "h " + minutes + "m " + seconds + "s " + milliseconds + "ms";
        } else if(minutes > 0){
            return minutes + "m " + seconds + "s " + milliseconds + "ms";
        } else if(seconds > 0){
            return seconds + "s " + milliseconds + "ms";
        } else {
            return milliseconds + "ms";
        }

    }
    function random(min, max){
        return Math.random()*(max-min) + min;
    }

    window.addEventListener("mouseup", (event) => {
        clicked = true;
        pressed = false;
    });
    window.addEventListener("mousedown", (event) => {
        pressed = true;
    });
    window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    var amount = 20000;
    var trail = 0.15;
    
    var dots = [];
    for(var i = 0; i < amount; i++){
    
        dots.push([random(0,canvas.width),random(0,canvas.height),random(0,Math.PI*2),random(0.5,2)]);
        
    }

    var follow = {x:300,y:300,q:2,v:1,mx:0,my:0};
    var hm = 10;
    
    function update() {
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        //{
            hm--;
            if(hm <= 0){
                hm = random(500,3000);
                follow = {x:random(0,canvas.width),y:random(0,canvas.height),q:random(0,Math.PI*2),v:follow.q+random(Math.PI/18,Math.PI/4),mx:random(-0.5,0.5),my:random(-0.5,0.5)};
            }
            follow.x += follow.mx;
            follow.y += follow.my;

            if(follow.x < 0){
                follow.x += canvas.width;
            }
            if(follow.x > canvas.width){
                follow.x -= canvas.width;
            }
            if(follow.y < 0){
                follow.y += canvas.height;
            }
            if(follow.y > canvas.height){
                follow.y -= canvas.height;
            }
        //} folow dot stuff

        //bg
        //making an alpha trail effect, but this doesn't seem to work for some reason
        ctx.fillStyle = "rgba(255, 255, 255, "+trail+")";
        ctx.fillRect(canvas.width/2-250, canvas.height/2-250, 500, 500);
        
        for(var i = 0; i < dots.length; i++){
        
            //dots[i][2] += dots[i][4];
            
            //dots[i][4] += random(-0.1,0.1);
            
            var d = Math.atan2(dots[i][1]-follow.y, dots[i][0]-follow.x);
            
            if(d-dots[i][2]+follow.q > 0){
                dots[i][2]+=0.01;
            }
            if(d-dots[i][2]+follow.v < 0){
                dots[i][2]-=0.01;
            }
            
            dots[i][0] += Math.cos(dots[i][2])*dots[i][3];
            dots[i][1] -= Math.sin(dots[i][2])*dots[i][3];
            
            if(dots[i][0] > canvas.width+5){
                dots[i][0] -= canvas.width+10;
            }
            if(dots[i][0] < -5){
                dots[i][0] += canvas.width+10;
            }
            if(dots[i][1] > canvas.height+5){
                dots[i][1] -= canvas.height+10;
            }
            if(dots[i][1] < -5){
                dots[i][1] += canvas.height+10;
            }
            
            
            ctx.fillStyle = "rgb(" + (dots[i][0]/(canvas.width/228)+(-follow.q+follow.v)/(canvas.width/342)-40) + "," + (dots[i][1]/(canvas.height/131)+(follow.y/(canvas.height/394))%255) + "," + ((((follow.x*(canvas.height/197))%255)/3+follow.x/(canvas.height/131))%255) + ")";
            ctx.beginPath();
            ctx.arc(dots[i][0],dots[i][1],2,0,Math.PI*2);
            ctx.fill();
            
            
        }
        //mouse
        // ctx.fillStyle = "rgb(200, 10, 10)"
        // ctx.beginPath();
        // ctx.arc(mouseX, mouseY, 5, 0, Math.PI*2);
        // ctx.fill();

        requestAnimationFrame(update);
        clicked = false;
    }

    // start boi
    update();
};
//we set the dark on fire
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser