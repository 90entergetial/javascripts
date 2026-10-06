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

    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    
    var x = 0;
    var y = 0;
    var moves = 0;

    //stuffs
    const borderwidth = 80;
    const borderheight = 40;
    const size = 10;

    // 2d vector
    var already = [];

    var EVILmode = false;
    var vroom = 1;
    function update() {
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgb(20, 20, 20)";
        ctx.fillRect(canvas.width/2-borderwidth*size, canvas.height/2-borderheight*size, borderwidth*size*2, borderheight*size*2);
        for(var i = 0; i < already.length; i++) {
            if(already[i][2] > a-1000){
            ctx.fillStyle = "rgb(200, 100, " + (100+(already[i][2]+1000-a)/10) + ")";
            } else {
            ctx.fillStyle = "rgb(200, 100, 100)";
            }
            ctx.beginPath();
            ctx.roundRect(canvas.width/2+already[i][0]*size, canvas.height/2+already[i][1]*size, size+0.5, size+0.5, size/4);
            ctx.fill();
        }
        if(a%1 == 0){
            for(var i = 0; i < vroom; i++) {
                var ok = false;
                var rand = Math.random();
                var justchecking = 0;
                var up = false;
                var dow = false;
                var le = false;
                var ri = false;
                for(var I = 0; I < already.length; I++) {
                    if(already[I][0] == x+1 && already[I][1] == y && !up) {
                        justchecking++;
                        up = true;
                    }
                    if(already[I][0] == x && already[I][1] == y+1 && !dow) {
                        justchecking++;
                        dow = true;
                    }
                    if(already[I][0] == x-1 && already[I][1] == y && !le) {
                        justchecking++;
                        le = true;
                    }
                    if(already[I][0] == x && already[I][1] == y-1 && !ri) {
                        justchecking++;
                        ri = true;
                    }
                }
                if(!EVILmode){
                if(x == -borderwidth){justchecking++;}
                if(y == -borderheight){justchecking++;}
                if(x == borderwidth-1){justchecking++;}
                if(y == borderheight-1){justchecking++;}
                }
                //checking and switching

                if(justchecking > 3 && !EVILmode){
                    EVILmode = true;
                }
                else if(justchecking == 0 && EVILmode){
                    EVILmode = false;
                }
                //also checking and switching

                if(!EVILmode){
                    if(rand > 0.75){
                        for(var I = 0; I < already.length; I++) {
                            if(already[I][0] == x+1 && already[I][1] == y) {
                                i--;
                                x--;
                                ok = true;
                                break;
                            }
                        }
                        x++;
                        
                        (i == vroom-1 && !ok)? playNote(440, 50) : true;
                        
                    } else if(rand > 0.5){
                        for(var I = 0; I < already.length; I++) {
                            if(already[I][0] == x-1 && already[I][1] == y) {
                                i--;
                                x++;
                                ok = true;
                                break;
                            }
                        }
                        x--;
                        
                        (i == vroom-1 && !ok) ? playNote(440*1.5, 50) : true;
                    } else if(rand > 0.25){
                        for(var I = 0; I < already.length; I++) {
                            if(already[I][0] == x && already[I][1] == y+1) {
                                i--;
                                y--;
                                ok = true;
                                break;
                            }
                        }
                        y++;
                        
                        (i == vroom-1 && !ok) ? playNote(440*1.25, 50) : true;
                    } else {
                        for(var I = 0; I < already.length; I++) {
                            if(already[I][0] == x && already[I][1] == y-1) {
                                i--;
                                y++;
                                ok = true;
                                break;
                            }
                        }
                        
                        y--;
                        (i == vroom-1 && !ok) ? playNote(440*1.75, 50) : true;
                    }
                
                if(x > borderwidth-1 || x < -borderwidth || y > borderheight-1 || y < -borderheight){
                ok = true;
                }
                x = cst(x, -borderwidth, borderwidth-1);
                y = cst(y, -borderheight, borderheight-1);

                if(!ok){already.push([Math.round(x), Math.round(y), a]);}
                
                } else {
                var splicethis = -1;
                for(var I = 0; I < already.length; I++) {
                    if(already[I][0] == x && already[I][1] == y) {
                        splicethis = I;
                    }
                }
                    if(rand > 0.75){
                        for(var I = 0; I < already.length; I++) {
                            if(already[I][0] == x+1 && already[I][1] == y) {
                                ok = true;
                                break;
                            }
                        }
                        if(ok){x++;} else {i--;}
                        (i == vroom-1 && ok)? playNote(220, 50) : true;
                        
                    } else if(rand > 0.5){
                        for(var I = 0; I < already.length; I++) {
                            if(already[I][0] == x-1 && already[I][1] == y) {
                                ok = true;
                                break;
                            }
                        }
                        if(ok){x--;} else {i--;}
                        (i == vroom-1 && ok) ? playNote(220*1.5, 50) : true;
                    } else if(rand > 0.25){
                        for(var I = 0; I < already.length; I++) {
                            if(already[I][0] == x && already[I][1] == y+1) {
                                ok = true;
                                break;
                            }
                        }
                        if(ok){y++;} else {i--;}
                        (i == vroom-1 && ok) ? playNote(220*1.25, 50) : true;
                    } else {
                        for(var I = 0; I < already.length; I++) {
                            if(already[I][0] == x && already[I][1] == y-1) {
                                ok = true;
                                break;
                            }
                        }
                        if(ok){y--;} else {i--;}
                        (i == vroom-1 && ok) ? playNote(220*1.75, 50) : true;
                    }
                
                x = cst(x, -borderwidth, borderwidth-1);
                y = cst(y, -borderheight, borderheight-1);

                if(splicethis > -1){already.splice(splicethis, 1);}
                }

                if(i == vroom-1){
                ctx.fillStyle = "rgb(" + (a*2)%255 + ", 255, 255)";
                if(EVILmode){
                ctx.fillStyle = "rgb(255, 255, " + (a*2)%255 + ")";
                }
                } else {
                    ctx.fillStyle = "rgba(50, 50, 50, 10)";
                }

                if(i == vroom-1){
                ctx.beginPath();
                ctx.roundRect(canvas.width/2+x*size, canvas.height/2+y*size, size, size, size/4);
                ctx.fill();
                } else {
                ctx.beginPath();
                ctx.roundRect(canvas.width/2+x*size+size/4, canvas.height/2+y*size+size/4, size/2, size/2, size/4);
                ctx.fill();
                }

                
            }
            if((!EVILmode && !ok) || (EVILmode && ok)){
            moves+=vroom;
            }

        } else {
        ctx.fillStyle = "rgb(" + (a*2)%255 + ", 255, 255)";
        if(EVILmode){
            ctx.fillStyle = "rgb(255, 255, " + (a*2)%255 + ")";
        }
        ctx.beginPath();
        ctx.roundRect(canvas.width/2+x*size, canvas.height/2+y*size, size, size, size/4);
        ctx.fill();
        }

        document.getElementById("time").innerHTML = "moves: " + addcommas(moves);

        //done
        a++;
        requestAnimationFrame(update);
    }

    // start boi
    update();
};

// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser