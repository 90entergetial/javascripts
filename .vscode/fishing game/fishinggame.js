var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
window.onload = function () {

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
    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    var mouseY = -1000;
    var mouseX = -1000;
    window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    let grid = {
        x:8,
        y:5,
        size:50,

    }

    let contains = [];
    for(var i = 0; i < grid.x; i++) {
        contains.push([]);
        for(var j = 0; j < grid.y; j++) {
            contains[i].push(-1);
        }
    }
    contains[3][3] = 0;
    contains[3][4] = 1;
    contains[3][2] = 1;
    
    function update() {
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        grid.size = Math.min(canvas.width, canvas.height)/10;

        //bg
        ctx.fillStyle = "rgb(76, 174, 174)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        //box + load
        for(let i = 0; i < grid.x; i++) {
            for(let j = 0; j < grid.y; j++) {
                ctx.fillStyle = "rgb(85, 192, 192)";
                if(pointonbox(mouseX, mouseY, (i-grid.x/2)*grid.size+canvas.width/2, (j-grid.y/2)*grid.size+canvas.height/2, grid.size*0.9, grid.size*0.9)){
                    ctx.fillStyle = "rgb(112, 206, 206)";
                }
                ctx.fillRect((i-grid.x/2)*grid.size+canvas.width/2, (j-grid.y/2)*grid.size+canvas.height/2, grid.size*0.9, grid.size*0.9);

                if(contains[i][j] == 0) {
                    ctx.fillStyle = "rgb(93, 255, 142)";
                    ctx.fillRect((i-grid.x/2)*grid.size+canvas.width/2+grid.size*0.25, (j-grid.y/2)*grid.size+canvas.height/2+grid.size*0.25, grid.size*0.4, grid.size*0.4);
                }
                if(contains[i][j] == 1) {
                    ctx.fillStyle = "rgb(10, 15, 19)";
                    ctx.fillRect((i-grid.x/2)*grid.size+canvas.width/2+grid.size*0.25, (j-grid.y/2)*grid.size+canvas.height/2+grid.size*0.25, grid.size*0.4, grid.size*0.4);
                }
            }
        }

        //mouse
        ctx.fillStyle = "rgb(200, 10, 10)"
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 5, 0, Math.PI*2);
        ctx.fill();
        
        requestAnimationFrame(update);
    }

    // start boi
    update();
};
//we set the dark on fire
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser