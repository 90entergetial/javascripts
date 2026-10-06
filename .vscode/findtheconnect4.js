var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

window.onload = function () {

    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    var mouseY = -1000;
    var mouseX = -1000;
    var clicked = false;
    var pressed = false;

    function playNote(frequency, duration, loudness) {
        // create Oscillator node
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        gainNode.gain.value = 0;
        gainNode.gain.linearRampToValueAtTime(loudness, audioCtx.currentTime + 0.02); // Fade in to 0.1 volume over 10ms
      
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
    var keys = [];
    window.addEventListener("keydown", (event) => {
        keys[event.key] = true;
    });
    window.addEventListener("keyup", (event) => {
        keys[event.key] = false;
    });

    var width = 7;
    var height = 6;
    var size = 60;
    var smoothmf = 0.1;

    var printmode = false;

    var grid = [];
    var showgrid = [];
    var funnoise = [];
    var d = new Date();
    var timelap = 0;
    var gamenum = 0;
    function creategrid(){
        gamenum++;
        document.getElementById("game").innerHTML = "game #" + gamenum;
        grid = [];
        showgrid = [];
        funnoise = [];
        //0 = empty
        //1 = red
        //2 = blue
        for(var y = 0; y < height; y++) {
            grid.push([]);
            showgrid.push([]);
            funnoise.push([]);
            for(var x = 0; x < width; x++) {
                grid[y].push(Math.floor(0));
                showgrid[y].push(Math.floor(0));
                funnoise[y].push(Math.random()-0.5);
            }
        }

        for(var y = 0; y < height; y++) {
            for(var x = 0; x < width; x++) {
                ctx.fillStyle = "rgb(0, 0, 0)"
                ctx.beginPath();
                ctx.arc(x*size, y*size, 5, 3, Math.PI*2);
                ctx.fill();
            }
        }
    }
    creategrid();
    var x = 0;
    var y = 0;
    var bad = 0;
    var yay = false;

    function short_checkforconnect4(x, y, col){
        var color = col;
        if(color == 0) return false;
        //check horizontal
        var count = 1;
        for(var i = 1; i < 4; i++){
            if(x-i >= 0 && grid[y][x-i] == color){
                count++;
            } else {
                break;
            }
        }
        if(count >= 4) return true;

        //check vertical
        count = 1;
        for(var i = 1; i < 4; i++){
            if(y-i >= 0 && grid[y-i][x] == color){
                count++;
            } else {
                break;
            }
        }
        if(count >= 4) return true;

        //check diagonal \
        count = 1;
        for(var i = 1; i < 4; i++){
            if(x-i >= 0 && y-i >= 0 && grid[y-i][x-i] == color){
                count++;
            } else {
                break;
            }
        }
        if(count >= 4) return true;

        //check diagonal /
        count = 1;
        for(var i = 1; i < 4; i++){
            if(x+i < width && y-i >= 0 && grid[y-i][x+i] == color){
                count++;
            } else {
                break;
            }
        }
        if(count >= 4) return true;
    }//only needs to check the ones that are below and to the left of the current piece, since the ones above and to the right will be checked when they are placed

    function total_checkforconnect4(x, y, col){
        var totalcount = 0;
        var color = col;
        if(color == 0) return false;
        for(var j = 0; j < 4; j++){
            //check horizontal
            var count = 0;
            for(var i = 0; i < 4; i++){
                if((x+j-i) >= 0 && (x+j-i) < width && grid[y][x+j-i] == color){
                    count++;
                } else {
                    break;
                }
            }
            if(count >= 4) totalcount+=2;

            //check vertical
            count = 0;
            for(var i = 0; i < 4; i++){
                if((y+j-i) >= 0 && (y+j-i) < height && grid[y+j-i][x] == color){
                    count++;
                } else {
                    break;
                }
            }
            if(count >= 4) totalcount+=2;

            //check diagonal \
            count = 0;
            for(var i = 0; i < 4; i++){
                if((x+j-i) >= 0 && (x+j-i) < width && (y+j-i) >= 0 && (y+j-i) < height && grid[y+j-i][x+j-i] == color){
                    count++;
                } else {
                    break;
                }
            }
            if(count >= 4) totalcount++;

            //check diagonal /
            count = 0;
            for(var i = 0; i < 4; i++){
                if((x+i-j) >= 0 && (x+i-j) < width && (y+j-i) >= 0 && (y+j-i) < height && grid[y+j-i][x+i-j] == color){
                    count++;
                } else {
                    break;
                }
            }
            if(count >= 4) totalcount++;
        }

        if(totalcount == 0) return false;
        return totalcount;
    }

    function place(){
        if(grid[height-1][width-1] != 0) return;
        if(grid[y][x] == 0){
        grid[y][x] = Math.floor(Math.random()*2)+1;
        }
        if(Math.random() < 0.1){
            grid[y][x] = Math.floor(Math.random()*2)+1;
        }

        if(short_checkforconnect4(x, y, grid[y][x])){
            //turn grid[y][x] to the opposite color
            grid[y][x] = grid[y][x] == 1 ? 2 : 1;
        }
        if(short_checkforconnect4(x, y, grid[y][x])){
            for(var i = 0; i < 4; i++){
            if(short_checkforconnect4(x, y, 1) || short_checkforconnect4(x, y, 2) || Math.random() < 0.01){
            if(x != 0) x--;
            if(y != 0) y--;
            }
            }
            return;
        }
        x++;
        if(x >= width){
            x = 0;
            y++;
        }

    }
    var done = false;
    function justoneconnect4(){
        var x = Math.floor(Math.random()*width);
        var y = Math.floor(Math.random()*height);
        //if(width > 10 && (x > width-6 || x < 5))
        //flip the color at this place and hope you only get one connect 4
        grid[y][x] = grid[y][x] == 1 ? 2 : 1;
        //console.log(total_checkforconnect4(x, y, grid[y][x]) + " " + x + " " + y);
        if(total_checkforconnect4(x, y, grid[y][x]) == 1){
            done = true;
            //console.log("ok" + x + " " + y);
        } else {
            grid[y][x] = grid[y][x] == 1 ? 2 : 1;
        }
        
    }
    counterupper = 0;
    function timelapseder(difference) {
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
    var aaaa = new Date();
    var transitiontime = new Date();
    function update() {
        
        var ctimelap = new Date() - aaaa;
        document.getElementById("runtime").innerHTML = "total runtime: " + timelapseder(ctimelap);

        if(done && !yay && dist(-1, -1, width-1, height-1) <= smoothmf){
            var dq = new Date();
            var timelap = dq - d;
            document.getElementById("nowtime").innerHTML = "# " + gamenum + " time: " + timelapseder(timelap);
        } else {
            subtractby = dq - d;
            d = new Date();
            if(!yay) document.getElementById("nowtime").innerHTML = "# " + gamenum + " time: 0ms";
        }


        if(keys['p']){
            printmode = !printmode;
            keys['p'] = false;
        }
        if(grid[height-1][width-1] <= 0){
            for(var i = 0; i < 10000; i++) place();
        } else if(!done){
            justoneconnect4();
        } else {
            smoothmf+=0.1;
            smoothmf*=1.01;
        }
        if(!printmode) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        } else {
        canvas.width = width*size+100;
        canvas.height = height*size+200;
        size = 40;
        }

        //bg
        ctx.fillStyle = "rgb(10, 10, 10)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for(var ty = 0; ty < height; ty++) {
            for(var tx = 0; tx < width; tx++) {
                funnoise[ty][tx] += Math.random()/1000;
                var coolshader = 2**Math.cos(new Date()/10000+Math.cos(funnoise[ty][tx])*100)+1;
                ctx.fillStyle = "rgb(44, 44, 44)"
                ctx.beginPath();
                ctx.arc(tx*size+(canvas.width/2)-((width-1)/2)*size, ty*size+100, size/2.5, 0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = "rgb(0, 0, 0)"
                
                if(grid[ty][tx] == 1) {
                    ctx.fillStyle = "hsl(0, 60.30%, "+(54.5+coolshader)+"%)"
                }
                if(grid[ty][tx] == 2) {
                    ctx.fillStyle = "hsl(240, 44.30%,  "+(50+coolshader)+"%)"
                }
                if(showgrid[ty][tx] == 1) {
                    ctx.fillStyle = "rgb(74, 229, 100)"
                }
                if(showgrid[ty][tx] == 2) {
                    ctx.fillStyle = "rgb(27, 27, 27)"
                }
                //if mouse is hovering over the circle
                if(dist(mouseX, mouseY, tx*size+(canvas.width/2)-((width-1)/2)*size, ty*size+100) <= size/2) {
                    if(grid[ty][tx] == 1) {
                        ctx.fillStyle = "rgb(218, 123, 123)"
                    }
                    if(grid[ty][tx] == 2) {
                        ctx.fillStyle = "rgb(119, 119, 193)"
                    }
                    if(showgrid[ty][tx] == 1) {
                        ctx.fillStyle = "rgb(74, 229, 100)"
                    }
                    if(showgrid[ty][tx] == 2) {
                        ctx.fillStyle = "rgb(36, 36, 36)"
                    }
                    if(clicked && done && dist(-1, -1, width-1, height-1) <= smoothmf){
                        if(total_checkforconnect4(tx, ty, grid[ty][tx])){
                            if(!yay){
                            console.log(width + "x" + height + " board took " + timelapseder(timelap) + ", " + bad + " incorrect guesses")
                            playNote(440, 100, 0.1);
                            setTimeout(() => {
                                smoothmf = 0.1;
                                width+=3;
                                height+=2;
                                yay = false;
                                done = false;
                                x = 0;
                                y = 0;
                                creategrid();
                                //playNote(300, 100, 0.1);
                            }, 3000);
                            }
                            yay = true;
                            showgrid[ty][tx] = 1;
                            for(var i = -3; i < 4; i++){
                                for(var j = -3; j < 4; j++){
                                    if(tx+i >= 0 && tx+i < width && ty+j >= 0 && ty+j < height && total_checkforconnect4(tx+i, ty+j, grid[ty+j][tx+i])){
                                        showgrid[ty+j][tx+i] = 1;
                                    }
                                }
                            }
                        } else {
                            if(!yay){
                            if(showgrid[ty][tx] != 2) {
                                bad++;
                                playNote(220, 100, 0.1);
                            } else {
                                playNote(110, 100, 0.1);
                            }
                            showgrid[ty][tx] = 2;
                            document.getElementById("fail").innerHTML = "incorrect guesses: " + bad;
                            
                            }
                        }
                        clicked = false;
                    }
                }
                if(dist(-1, -1, tx, ty) > smoothmf) {
                    var R = Math.random()*50;
                    ctx.fillStyle = "rgb("+R+", "+R+", "+R+")";
                }
                ctx.beginPath();
                ctx.arc(tx*size+(canvas.width/2)-((width-1)/2)*size, ty*size+100, size/3, 0, Math.PI*2);
                ctx.fill();
            }
        }
        if(dist(-1, -1, width-1, height-1) > smoothmf) {
            playNote(Math.random()*100+200, 50, cst((dist(-1, -1, width-1, height-1)-smoothmf)/(size*7), 0, 0.2));
        }
        if((width-1)*size+(canvas.width/2)-((width-1)/2)*size+size < canvas.width && (height-1)*size+100+size < canvas.height){
            size++;
        }
        if((width-1)*size+(canvas.width/2)-((width-1)/2)*size+size > canvas.width || (height-1)*size+100+size > canvas.height){
            size--;
        }

        //mouse
        if(!printmode){
        ctx.fillStyle = "rgb(200, 10, 10)"
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 5, 0, Math.PI*2);
        ctx.fill();
        }
        document.getElementById("board").innerHTML = width + "x" + height + " board";
        

        requestAnimationFrame(update);
        clicked = false;
    }

    // start boi
    update();
};
//we set the dark on fire
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser