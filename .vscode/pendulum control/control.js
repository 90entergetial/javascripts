var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

window.onload = function () {

    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    var mouseY = -1000;
    var mouseX = -1000;
    var clicked = false;
    var pressed = false;

    function playNote(frequency, duration) {
        // create Oscillator node
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        gainNode.gain.value = 0;
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.02); // Fade in to 0.1 volume over 10ms
      
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
    function fullmod(num, mod) {
        return ((num % mod) + mod) % mod;
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

    var target = window.innerWidth/2;
    var vtarget = (Math.random()-0.5)*2;
    var atarget = (Math.random()-0.5)/150;

    var c = [];
    for(var i = 0; i < 1000; i++){
        c.push({
            //car variables
            tx: window.innerWidth/2,
            vx: 0,
            ax: 0,

            //pendulum variables
            intangle: 0,
            tangle: Math.PI,
            vangle:0,
            aangle:0,
            intangle2: 0,
            tangle2: Math.PI,
            vangle2:0,

            //world variables
            friction: 0.98,
            maxspeed: 20,
            gravity: 0.005,

            //car movement variables
            dist: -0.00017127284811413053,
            deri: -0.00019772091045344416,

            //pendulum movement variables
            pdist: -0.6271436563819834,
            pderi: -0.3654116222762429,
            pint: -0.008815363340552955,

        });
    }
    /*
    (randomness)
    //car movement variables
    dist: (Math.random()-0.5)/1000,
    deri: (Math.random()-0.5)/1000,

    //pendulum movement variables
    pdist: -(Math.random())/1,
    pderi: (Math.random()-0.5)/1,
    pint: (Math.random()-0.5)/10,
    */
    setTimeout(() => {
        for(var i = 0; i < c.length; i++){
            c[i].vangle += (Math.random()-0.5)/100;
        }
    }, 1000);
    var allscores = [];
    var evol = 0;
    setInterval(() => {
        if(true){
        playNote(440, 100);
        evol++;
        console.log("   ");
        console.log("--- Scores ---");
        allscores = [];
        for(var i = 0; i < c.length; i++){
            var scoree = 0;
            scoree += (Math.abs(c[i].tx - target))**2;
            scoree += (Math.abs(c[i].tangle - Math.PI)*2)**5;
            scoree += Math.abs(c[i].vx - vtarget)*20;
            allscores.push({score: scoree, index: i, car: c[i]});
        }
        target = Math.random()*window.innerWidth;
        vtarget = (Math.random()-0.5)*2;
        atarget = (Math.random()-0.5)/150;
        allscores.sort((a, b) => a.score - b.score);
        for(var i = cst(c.length, 0, 20)-1; i >= 0; i--){
            console.log("#" + (i+1) + " | Score: "+allscores[i].score+" Index: "+allscores[i].index + " | Car: " + JSON.stringify(c[allscores[i].index]));
        }
        if(allscores.length > 100){
            var goodbye = [...Array(allscores.length).fill(false)];
            var removed_them = 0;
            for(var i = Math.round(allscores.length/2); i < allscores.length; i++){
                goodbye[allscores[i].index] = true;
            }
            for(var i = 0; i < goodbye.length; i++){
                if(goodbye[i]){
                c.splice(i, 1);
                removed_them++;
                }
            }
            console.log("Removed " + removed_them + " cars");
        }
        for(var i = 0; i < cst(50, 0, c.length); i++){
            var C = allscores[i].car;
                for(var j = 0; j < 5; j++){
                c.push({
                    //car variables
                    tx: C.tx,
                    vx: C.vx,
                    ax: C.ax,
        
                    //pendulum variables
                    intangle: C.intangle,
                    tangle: C.tangle,
                    vangle: C.vangle,
                    aangle: C.aangle,
                    intangle2: C.intangle2,
                    tangle2: C.tangle2,
                    vangle2: C.vangle2,
        
                    //world variables
                    friction: C.friction,
                    maxspeed: C.maxspeed,
                    gravity: C.gravity,
        
                    //car movement variables
                    dist: C.dist + (Math.random()-0.5)/(10000*(3**((evol+9)/10) -2)),
                    deri: C.deri + (Math.random()-0.5)/(10000*(3**((evol+9)/10) -2)),
        
                    //pendulum movement variables
                    pdist: C.pdist + (Math.random())/(10*(3**((evol+9)/10) -2)),
                    pderi: C.pderi + (Math.random()-0.5)/(10*(3**((evol+9)/10) -2)),
                    pint: C.pint + (Math.random()-0.5)/(100*(3**((evol+9)/10) -2)),
        
                });
            }
        }
        for(var i = 0; i < c.length; i++){
            c[i].tx = window.innerWidth/2;
            c[i].vx = 0;
            c[i].ax = 0;
        
            //pendulum variables
            c[i].intangle = 0;
            c[i].tangle = Math.PI;
            c[i].vangle =0;
            c[i].aangle =0;
            c[i].intangle2 = 0;
            c[i].tangle2 = Math.PI;
            c[i].vangle2 =0;
        }
        }
    }, 10000);

    function movec(i) {
        //c[i].tangle = fullmod(c[i].tangle, Math.PI*2);
        var accel = c[i].vx;
        var accel2 = c[i].vangle;
        var diff = target - c[i].tx;
        var deri = c[i].vx;
    
        // Modes
        c[i].vx += diff * c[i].dist;
        c[i].vx += deri * c[i].deri;
        c[i].vx += Math.sin(c[i].tangle-Math.PI) * c[i].pdist;
        c[i].vx += c[i].vangle * c[i].pderi;
        c[i].vx += c[i].intangle * c[i].pint;
    
        // Pendulum dynamics
        let g = c[i].gravity; // Gravitational acceleration
        let l = 1; // Length of the pendulum (unit 1)
        let m = 1; // Mass of the pendulum (same as the car)

        //Accelating the pendulum based on gravity
        c[i].vangle += -g / l * Math.sin(c[i].tangle); // Angular acceleration
        c[i].vangle2 += -g / l * Math.sin(c[i].tangle2); // Angular acceleration
        
        //c[i].vangle -= Math.cos(c[i].tangle) * Math.sin(c[i].tangle2) * c[i].vangle2; // Linear acceleration of the car due to pendulum
        c[i].vx += Math.sin(c[i].tangle) * Math.abs(c[i].vangle); // Linear acceleration of the car due to pendulum
        c[i].vangle -= Math.cos(c[i].tangle) * c[i].ax;
        c[i].vangle2 -= Math.cos(c[i].tangle2) * (c[i].aangle + c[i].ax);
        
    
    
        // Apply friction
        c[i].vx *= c[i].friction;
        c[i].vangle *= c[i].friction;
        c[i].vangle2 *= c[i].friction;
        c[i].vangle2 *= c[i].friction;
    
        // maxspeed
        c[i].vx = cst(c[i].vx, -c[i].maxspeed, c[i].maxspeed);
        c[i].vangle = cst(c[i].vangle, -c[i].maxspeed, c[i].maxspeed);
        c[i].vangle2 = cst(c[i].vangle2, -c[i].maxspeed, c[i].maxspeed);
    
        // Actually moving
        c[i].tx += c[i].vx;
        c[i].tangle += c[i].vangle;
        c[i].tangle2 += c[i].vangle2;
        c[i].ax = (c[i].vx - accel)/60;
        c[i].aangle = (c[i].vangle - accel2)/60;
        c[i].intangle += Math.sin(c[i].tangle - Math.PI);
        c[i].intangle *= 0.9995;
        // if(Math.abs(c[i].tangle) < Math.PI/2 || Math.abs(c[i].tangle) > Math.PI*3/2){
        //     c.splice(i, 1);
        //     i--;
        // }
    }
    
    function update() {
        vtarget += atarget;
        //target = cst(mouseX, 0, canvas.width-1);
        target += vtarget;
        if(Math.random() < 0.001){
            for(var i = 0; i < c.length; i++){
                c[i].vangle += (Math.random()-0.5)/100;
            }
        }
        //target += (Math.random()-0.5)*1;
        //target = cst(mouseX, 0, canvas.width-1);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        //bg
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //target
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(target-1, 0, 2, canvas.height);
        for(var i = 0; i < c.length; i++){
            movec(i);
        }
        for(var i = 0; i < c.length; i++){
            //c
            ctx.fillStyle = "hsl("+(125+i*1)+", 48.70%, 37.50%)";
            ctx.fillRect(c[i].tx-5, canvas.height/2-5, 10, 10);
            //pendulum
            ctx.fillRect(c[i].tx-5+(Math.sin(c[i].tangle)*50), canvas.height/2-5+(Math.cos(c[i].tangle)*50), 10, 10);
            ctx.fillRect(c[i].tx-5+(Math.sin(c[i].tangle)*50 + Math.sin(c[i].tangle2)*50), canvas.height/2-5+(Math.cos(c[i].tangle)*50 + Math.cos(c[i].tangle2)*50), 10, 10);
        }

        //mouse
        ctx.fillStyle = "rgb(200, 10, 10)"
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 5, 0, Math.PI*2);
        ctx.fill();
        document.getElementById("amount").innerHTML = "cars: " + c.length;
        document.getElementById("evo").innerHTML = "evolution: " + evol;
        document.getElementById("error").innerHTML = "error amount: " + (1/(3**((evol+9)/10) -2));
        requestAnimationFrame(update);
        clicked = false;
    }

    // start boi
    update();
};
//we set the dark on fire
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser