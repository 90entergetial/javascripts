var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
window.onload = function () {
    
    function playNote(frequency, duration) {
        // create Oscillator node
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        gainNode.gain.value = 0;
        gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.02); // Fade in to 0.1 volume over 10ms
      
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

    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    

    var x = 0;
    var y = 0;
    var moves = 0;

    //stuffs
    const borderwidth = 100;
    const borderheight = 60;
    const size = 6;

    // 2d vector
    var already = [];
    var orderedgrid = [];
    var randomwalkers = [];
    for(var i = 0; i < 2; i++){
        for(var ii = 0; ii < 2; ii++){
        randomwalkers.push([(i-0.5)*200, (ii-0.5)*120, [100+Math.random()*100,100+Math.random()*100,100+Math.random()*100]]);
        }
    }

    for(var i = 0; i < borderwidth*borderheight*4; i++) {
        orderedgrid.push(false);
    }
    var vroom = 1;
    var d = new Date();
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

    function checkorderedgrid(x, y) {
        if(x >= borderwidth || x < -borderwidth || y >= borderheight || y < -borderheight){
            return true;
        }
        return orderedgrid[(x+borderwidth)+((y+borderheight)*borderwidth*2)];
    }

    function numbertogrid(num) {
        return [num%(borderwidth*2)-borderwidth, Math.floor(num/(borderwidth*2))-borderheight];
    }

    var moves_track = 0;
    var move_per_sec = 0;

    setInterval(function() {
        move_per_sec = (moves - moves_track);
        moves_track = moves;
    }, 1000);



    var movers_index = 0;

    function moverandomly(i){

        var ok = false;
        var rand = Math.random();
            if(rand > 0.75){
                x++;
                (false)? playNote(440, 50) : true;
                
            } else if(rand > 0.5){
                x--;
                (false) ? playNote(440*1.5, 50) : true;
            } else if(rand > 0.25){
                y++;
                (false) ? playNote(440*1.25, 50) : true;
            } else {
                y--;
                (false) ? playNote(440*1.75, 50) : true;
            }
        
        if(x > borderwidth-1 || x < -borderwidth || y > borderheight-1 || y < -borderheight){
        ok = true;
        }

    }

    function rotateclockwise(i){
        var justmoved = false;
        for(var j = 0; j < 4; j++){

            if(movers_index == 0){
            
                //check if the next rotation will land on a already there piece
                if(!checkorderedgrid(x, y+1)){
                    //there is not a piece there
                    movers_index++;
                    if(j == 3){
                        x++;
                        justmoved = true;
                    }

                    (false) ? playNote(440, 50) : true;
                    
                } else {
                    x++;
                    justmoved = true;
                    if(checkorderedgrid(x, y)){
                        movers_index++;
                        x--;
                        justmoved = false;
                        (false) ? playNote(440, 50) : true;
                    } else {
                    break;
                    }
                }
                
                
            } else if(movers_index == 1){
            
                //check if the next rotation will land on a already there piece
                if(!checkorderedgrid(x-1, y)){
                    //there is not a piece there
                    movers_index++;
                    if(j == 3){
                        y++;
                        justmoved = true;
                    }
                    (false) ? playNote(440*1.25, 50) : true;

                } else {
                    y++;
                    justmoved = true;
                    if(checkorderedgrid(x, y)){
                        movers_index++;
                        y--;
                        justmoved = false;
                        (false) ? playNote(440*1.25, 50) : true;
                    } else {
                    break;
                    }
                }
                
                
            } else if(movers_index == 2){
            
                //check if the next rotation will land on a already there piece
                if(!checkorderedgrid(x, y-1)){
                    //there is not a piece there
                    movers_index++;
                    if(j == 3){
                        x--;
                        justmoved = true;
                    }
                    (false) ? playNote(440*1.5, 50) : true;

                } else {
                    x--;
                    justmoved = true;
                    if(checkorderedgrid(x, y)){
                        movers_index++;
                        x++;
                        justmoved = false;
                        (false) ? playNote(440*1.5, 50) : true;
                    } else {
                    break;
                    }
                }
                
                
            } else if(movers_index == 3){
            
                //check if the next rotation will land on a already there piece
                if(!checkorderedgrid(x+1, y)){
                    //there is not a piece there
                    movers_index++;
                    if(j == 3){
                        y--;
                        justmoved = true;
                        
                    }
                    (false) ? playNote(440*1.75, 50) : true;

                } else {
                    y--;
                    justmoved = true;
                    if(checkorderedgrid(x, y)){
                        movers_index++;
                        y++;
                        justmoved = false;
                        (false) ? playNote(440*1.75, 50) : true;
                    } else {
                    break;
                    }
                }
                
                
            }

            if(movers_index > 3){
                movers_index -= 4;
            }
            if(movers_index < 0){
                movers_index += 4;
            }

            if(j == 3 && !justmoved){
                //get the block boi
                targetnearestopenblock(i);
            }
        }


    }

    function targetnearestopenblock(i) {

        var targettheblock = [x,y, 9999999];//x, y

        for(var j = 0; j < orderedgrid.length; j++){
            if(!orderedgrid[j]){
                var blockcords = numbertogrid(j);
                var blockx = blockcords[0];
                var blocky = blockcords[1];
                var distance = Math.sqrt((blockx-x)**2+(blocky-y)**2);
                if(!checkorderedgrid(blockx, blocky) && distance < targettheblock[2]){
                    targettheblock = [blockx, blocky, distance];
                }
            }
        }

        //moves to the block
        if(Math.abs(targettheblock[0]-x) >= Math.abs(targettheblock[1]-y)){

            if(x > targettheblock[0]){
                x--;
                (false)? playNote(440, 50) : true;
            } else if (x < targettheblock[0]){
                x++;
                (false)? playNote(440*1.25, 50) : true;
            }

        } else {
            if(y > targettheblock[1]){
                y--;
                (false)? playNote(440*1.5, 50) : true;
            } else {
                y++;
                (false)? playNote(440*1.75, 50) : true;
            }
        }

    }

    function update() {
        var dq = new Date();
        var timelapsed = dq - d;
        

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgb(10, 10, 10)";
        ctx.fillRect(canvas.width/2-borderwidth*size, canvas.height/2-borderheight*size, borderwidth*size*2, borderheight*size*2);
        
        //show all the already been to places
        for(var i = 0; i < already.length; i++) {
            //already[i][3][0],already[i][3][1],already[i][3][2]
            if(already[i][2] > a-100){
            ctx.fillStyle = "rgb(" + (already[i][3][0] +(already[i][2]+100-a)/1) + ", " + (already[i][3][1] +(already[i][2]+100-a)/1) + ", " + (already[i][3][2] +(already[i][2]+100-a)/1) + ")";
            } else {
            ctx.fillStyle = "rgb(" + already[i][3][0] + ", " + already[i][3][1] + ", " + already[i][3][2] + ")";
            }
            ctx.beginPath();
            ctx.roundRect(canvas.width/2+already[i][0]*size, canvas.height/2+already[i][1]*size, size/1.1+0.5, size/1.1+0.5, size/4);
            ctx.fill();
        }

        //show all the blank spaces
        for(var i = 0; i < orderedgrid.length; i++) {
            if(!orderedgrid[i]){
                ctx.fillStyle = "rgb(20, 20, 20)";
                ctx.beginPath();
                ctx.roundRect(canvas.width/2+(i%(borderwidth*2)-borderwidth)*size, canvas.height/2+(Math.floor(i/(borderwidth*2))-borderheight)*size, size/1.1+0.5, size/1.1+0.5, size/4);
                ctx.fill();
            }
        }

        if(a%1 == 0){
            for(var i = 0; i < vroom; i++) {
                for(var II = 0; II < randomwalkers.length; II++){
                    x = randomwalkers[II][0];
                    y = randomwalkers[II][1];

                        var ok = false;
                        var bug = Math.random();
                        if(II%2 == 0){
                            rotateclockwise(i + II);
                        } else {
                            targetnearestopenblock(i + II);
                        }
                        //moverandomly(i);
                        //rotateclockwise(i);
                        
                        x = cst(x, -borderwidth, borderwidth-1);
                        y = cst(y, -borderheight, borderheight-1);

                        // for(var I = 0; I < already.length; I++) {
                        //     if(already[I][0] == x && already[I][1] == y) {
                        //         ok = true;
                        //         break;
                        //     }
                        // }
                        if(!ok && checkorderedgrid(x, y)){
                            ok = true;
                        }

                        if(!ok){
                            already.push([Math.round(x), Math.round(y), a, randomwalkers[II][2]]);
                            orderedgrid[(x+borderwidth)+((y+borderheight)*borderwidth*2)] = true;
                        }

                        //display
                        if(i == vroom-1){
                        ctx.fillStyle = "rgb(" + (a*2)%255 + ", 255, 255)";
                        } else {
                            ctx.fillStyle = "rgba(50, 50, 50, 10)";
                        }
                        if(i == vroom-1){
                        ctx.beginPath();
                        ctx.roundRect(canvas.width/2+x*size, canvas.height/2+y*size, size/1.1, size/1.1, size/4);
                        ctx.fill();
                        } else {
                        ctx.beginPath();
                        ctx.roundRect(canvas.width/2+x*size+size/4, canvas.height/2+y*size+size/4, size/2, size/2, size/4);
                        ctx.fill();
                        }

                        
                    
                    randomwalkers[II][0] = x;
                    randomwalkers[II][1] = y;
                }
            }
            moves+=vroom;

        } else {
        for(var II = 0; II < randomwalkers.length; II++){
            ctx.fillStyle = "rgb(" + (a*2)%255 + ", 255, 255)";
            ctx.beginPath();
            ctx.roundRect(canvas.width/2+(randomwalkers[II][0])*size, canvas.height/2+(randomwalkers[II][1])*size, size/1.1, size/1.1, size/4);
            ctx.fill();
        }
        }
        
        document.getElementById("moved").innerHTML = "moves: " + addcommas(moves);
        document.getElementById("amount").innerHTML = "filled: " + addcommas(already.length) + "/" + addcommas((borderwidth*2)*(borderheight*2)) + " (" + Math.round(already.length/(borderwidth*2*borderheight*2)*10000)/100 + "%)";
        document.getElementById("time").innerHTML = "time: " + timelapseder(timelapsed);
        document.getElementById("speed").innerHTML = "speed: " + Math.round(move_per_sec) + " moves/second";

        //done
        a++;
        requestAnimationFrame(update);
    }

    // start boi
    update();
};

// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser