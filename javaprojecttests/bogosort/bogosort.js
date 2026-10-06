var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

window.onload = function () {
    
    var notesbeingplayed = [];
    var cooldown = 0;
    function playNote(frequency, duration) {
        if(notesbeingplayed.length < 5 && !notesbeingplayed.includes(frequency)){
            notesbeingplayed.push(frequency);
            // create Oscillator node
            var oscillator = audioCtx.createOscillator();
            var gainNode = audioCtx.createGain();
            gainNode.gain.value = 0;
            gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + duration/1000); // Fade in to 0.1 volume over 10ms
        
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency; // value in hertz

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            setTimeout(() => {
                gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration/1000); // Fade out to 0 volume over duration
            }, duration);
            
            setTimeout(
            function() {
                oscillator.stop();
                notesbeingplayed.splice(notesbeingplayed.indexOf(frequency), 1);
                //console.log(notesbeingplayed.length)
            }, duration*2);
        }
    }
    var hummmm = false;
    function hummingNote(frequency, duration) {
            notesbeingplayed.push(frequency);
            // create Oscillator node
            var oscillator = audioCtx.createOscillator();
            var gainNode = audioCtx.createGain();
            gainNode.gain.value = 0;
            gainNode.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + duration/1000); // Fade in to 0.1 volume over 10ms
        
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency; // value in hertz

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            setInterval(() => {
                if(hummmm){
                oscillator.frequency.value = 55*(1.10408951367**(showingthebestfornow+(Math.round((array[0]/sizeofarray)*4)-2)))/2;
                if(finallysolved){
                oscillator.frequency.value = 110;
                }
                hummmm = false;
                }
            }, 50);
    }
    hummingNote(55, 1000)/2;

    function cst(num, min, max) {
        if(num < min) return min;
        if(num > max) return max;
        return num;
    }
    function addcommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function max(a, b) {
        return a > b ? a : b;
    }

    const sizeofrender = 20;
    const arraywidth = 30;
    const arraymargin = 10;
    const roundness = 3;

    var sizeofarray = 25 ;

    for(var i = 0; i < sizeofarray; i++){
    const para = document.createElement("p");
    const node = document.createTextNode("10");
    para.appendChild(node);
    const element = document.getElementById("listnumber");
    element.appendChild(para);
    }




    var moves = 0;
    var swaps = 0;
    var correct = 0;

    var movespersecond = [];
    var countsort = 0;

    var updateafter = 240;
    var superupdateafter = 1;

    var counterdowner = 1;
    var counterupper = 0;
    setInterval(() => {
        counterdowner--;
        counterupper++;
        if(!finallysolved){
        document.getElementById("untilnext").innerHTML = counterdowner + "s until next 2x";
        document.getElementById("untilnext").style.textAlign = "right";
        document.getElementById("untilnext").style.marginTop = "-140px";
        document.getElementById("untilnext").style.color = "rgb(228, 92, 92)";
        if(counterupper < 60){
        document.getElementById("runtime").innerHTML = "runtime: " + counterupper%60 + "s";
        }
        else if(counterupper < 3600){
        document.getElementById("runtime").innerHTML = "runtime: " + (Math.floor(counterupper/60))%60 + "m " + counterupper%60 + "s";
        }
        else if(counterupper < 3600*24){
        document.getElementById("runtime").innerHTML = "runtime: " + (Math.floor(counterupper/3600))%60 + "h " + (Math.floor(counterupper/60))%60 + "m " + counterupper%60 + "s";
        }
        else {
        document.getElementById("runtime").innerHTML = "runtime: " + (Math.floor(counterupper/(3600*24))) + "d " + (Math.floor(counterupper/3600))%60 + "h " + (Math.floor(counterupper/60))%60 + "m " + counterupper%60 + "s";
        }
        document.getElementById("runtime").style.textAlign = "right";
        document.getElementById("runtime").style.color = "rgb(228, 92, 92)";
        }
        if(counterdowner == 0){
            counterdowner = 1;
            if(!finallysolved){
                updateafter /= 2;
                //console.log("updateafter: " + updateafter);
                if(superupdateafter >= 10000){
                    theoreticalmultiplier *= 2;
                }
                if(updateafter <= 1){
                updateafter = 1;
                superupdateafter *= 2;
                console.log("superupdateafter: " + superupdateafter);
                }
                if(superupdateafter > 10000){
                    superupdateafter = 10000;
                }
            }
        }
    }, 1000);

    var updatemaxafter = true;

    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    var d = new Date();

    var bestfornow = -1;
    var showingthebestfornow = -1;
    var highestbestofalltime = -1;
    var array = []
    var bestarray = []
    var arraymaxed = []

    //sn,mmvcdjfert.ldrgkh
    var addamountcorrect = 0;
    var percentcurve = 0;
    var theoreticalmultiplier = 1;

    for(var i = 0; i < sizeofarray; i++){
        array.push(i+1);
        arraymaxed.push(i+1);
        bestarray.push(i+1);
    }

    function updatearraymaxed() {
        for(var i = 0; i < sizeofarray; i++){
            arraymaxed[i] = bestarray[i];
            bestarray[i] = -1;
        }
        bestfornow = -1;
    }

    function updatebestarray() {
        if(checker() > bestfornow){
            for(var i = 0; i < sizeofarray; i++){
                bestarray[i] = array[i];
            }
            bestfornow = checker();
            showingthebestfornow = bestfornow;
        }
    }

    function win(){
        
        for(var i = 0; i < sizeofarray; i++){
            bestarray[i] = i+1;
            arraymaxed[i] = i+1;
            array[i] = i+1;
        }
        bestfornow = sizeofarray;
        showingthebestfornow = sizeofarray;
        noisewin();
        // setTimeout(() => {
        //     if(finallysolved){
        //         sizeofarray+=1;
        //         finallysolved = false;
        //         array.push(sizeofarray);
        //         arraymaxed.push(sizeofarray);
        //         bestarray.push(sizeofarray);
        //         randomsort(addamountcorrect, true);
        //         updatebestarray();
        //         updatearraymaxed();
        //         const para = document.createElement("p");
        //         const node = document.createTextNode("10");
        //         para.appendChild(node);
        //         const element = document.getElementById("listnumber");
        //         element.appendChild(para);
        //     }
            
        // }, 5000);

    }

    function noisewin(){

        setTimeout(() => {
            playWin(440, 2000);
        }, 1000);
        setTimeout(() => {
            playWin(554.365261954, 2000);
        }, 2000);
        setTimeout(() => {
            playWin(659.255113826, 2000);
        }, 3000);
        setTimeout(() => {
            playWin(880, 2000);
        }, 4000);

    }
    function playWin(frequency, duration) {
            // create Oscillator node
            var oscillator = audioCtx.createOscillator();
            var gainNode = audioCtx.createGain();
            gainNode.gain.value = 0;
            gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.1); // Fade in to 0.1 volume over 10ms
        
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency; // value in hertz

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            setTimeout(() => {
                gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration/500); // Fade out to 0 volume over duration
            }, 100);
            
            setTimeout(
            function() {
                oscillator.stop();
                //console.log(notesbeingplayed.length)
            }, duration*10);
    }

    randomsort();
    updatebestarray();
    updatearraymaxed();

    function randomsort(Correct, override) {
        if(!finallysolved || override){
        for(var I = 0; I < superupdateafter; I++){
            for(var i = 0; i < sizeofarray; i++){
                var randing = Math.floor(Math.random() * sizeofarray);
                var savethis = array[randing];
                array[randing] = array[i];
                array[i] = savethis;
            }
            //forces an amount to be correct
            for(var i = 0; i < Correct; i++){
                var randing = Math.floor(Math.random() * sizeofarray);
                for(var II = 0; II < sizeofarray; II++){
                    if(array[randing] != randing+1){
                        continue;
                    } else {
                        randing++;
                        if(randing >= sizeofarray){
                            randing = 0;
                        }
                    }
                }
                if(array[randing] == randing+1){
                    break;
                }
                //look through sizeofarray to find the array with the amount "randing+1"
                for(var II = 0; II < sizeofarray; II++){
                    if(array[II] == randing+1){
                        var savethis = array[randing];
                        array[randing] = array[II];
                        array[II] = savethis;
                        //if(array[II] = II+1){
                            //Correct -= 1;
                        //}
                        break;
                    }
                }
            }
            updatebestarray();
        }
        swaps += sizeofarray*Math.floor(superupdateafter*theoreticalmultiplier);
        moves += Math.floor(superupdateafter*theoreticalmultiplier);
        countsort += Math.floor(superupdateafter*theoreticalmultiplier);
        }
        
    }

    function checker(){
        var correct = 0;
        for(var i = 0; i < sizeofarray; i++){
            if(array[i] == i+1){
                correct++;
            }
        }
        return correct;
    }

    var averagemps = 0;

    setInterval(function() {
        if(!finallysolved){
            movespersecond.push(countsort);
            countsort = 0;
            if(movespersecond.length > 3){
                movespersecond.shift();
            }
            averagemps = 0;
            for(var i = 0; i < movespersecond.length; i++){
                averagemps += movespersecond[i]/movespersecond.length;
            }
            if(averagemps < 60){
                averagemps = 60/max(updateafter,1);
            }
            if(theoreticalmultiplier > 1){
                document.getElementById("movespersec").style.color = "rgb(239, 255, 148)";
                if(averagemps < 3600*1000){
                document.getElementById("movespersec").innerHTML = addcommas(Math.floor(averagemps*60)) + " moves/min (" + addcommas(theoreticalmultiplier) + "x)";
                } else {
                document.getElementById("movespersec").innerHTML = addcommas(Math.floor(averagemps)) + " moves/sec (" + addcommas(theoreticalmultiplier) + "x)";
                }
            } else {
                document.getElementById("movespersec").style.color = "rgb(255, 255, 255)";
                if(averagemps < 3600*1000){
                document.getElementById("movespersec").innerHTML = addcommas(Math.floor(averagemps*60)) + " moves/min";
                } else {
                document.getElementById("movespersec").innerHTML = addcommas(Math.floor(averagemps)) + " moves/sec";
                }
            }
    }
        

    }, 1000);
    
    var finallysolved = false;

    function update() {
        (cooldown > 0) ? cooldown-- : true;
        if(theoreticalmultiplier > 1){
        addamountcorrect = max(0,Math.floor(Math.log2((theoreticalmultiplier*(10**((Math.random()*2)-1.4)))*25)/6));
        }
        var dq = new Date();
        var timelapsed = dq - d;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.fillStyle = "rgb(30, 30, 30)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        //randomize array 
        if(!finallysolved){
        a%Math.floor(max(updateafter,1)) == 0 ? randomsort(addamountcorrect, false) : true;
        a%Math.floor(max(updateafter,60)) == 0 ? updatemaxafter = true : true;
        a%Math.floor(max(updateafter,1)) == 0 ? hummmm = true : true;
        updatemaxafter ? updatearraymaxed() : true;
        correct = checker();
        }

        if(showingthebestfornow == sizeofarray && !finallysolved){
            finallysolved = true;
            updatemaxafter = true;
            win();
        }
        
        
        //render each frame array
        for(var i = 0; i < sizeofarray; i++){

            if(array[i] > arraymaxed[i]){
            ctx.fillStyle = "rgb(40, 40, 40)";
            ctx.beginPath();
            ctx.roundRect(canvas.width/2+(i-sizeofarray/2)*(arraywidth+arraymargin)+arraymargin/2, canvas.height/2-array[i]*sizeofrender+sizeofrender*sizeofarray/2, arraywidth, array[i]*sizeofrender, roundness);
            ctx.fill();
            }
            
        }

        //render array
        for(var i = 0; i < sizeofarray; i++){

            ctx.fillStyle = "rgb(228, 92, 92)";
            if(i+1 == arraymaxed[i]){
                ctx.fillStyle = "rgb(92, 228, 106)";
            }
            ctx.beginPath();
            ctx.roundRect(canvas.width/2+(i-sizeofarray/2)*(arraywidth+arraymargin)+arraymargin/2, canvas.height/2-arraymaxed[i]*sizeofrender+sizeofrender*sizeofarray/2, arraywidth, arraymaxed[i]*sizeofrender, roundness);
            ctx.fill();
            
        }
        
        //render text
        if(updatemaxafter) {
        if(showingthebestfornow > highestbestofalltime){
            highestbestofalltime = showingthebestfornow;
            document.getElementById("best").innerHTML = "best: " + addcommas(highestbestofalltime) + "/" + addcommas(sizeofarray) + " (" + addcommas(moves) + " moves " + addcommas(swaps) + " swaps in)";
        }
        document.getElementById("moves").innerHTML = "moves: " + addcommas(moves)
        document.getElementById("swaps").innerHTML = "swaps: " + addcommas(swaps);
        document.getElementById("correct").innerHTML = "correct: " + addcommas(showingthebestfornow) + "/" + addcommas(sizeofarray);
        if(finallysolved){
        document.getElementById("correct").innerHTML = "correct: " + addcommas(showingthebestfornow) + "/" + addcommas(sizeofarray) + " (solved!!!)";
        }

        //change 
        for(var i = 0; i < sizeofarray; i++){
            document.getElementById("listnumber").children[i].innerHTML = arraymaxed[i];
            if(arraymaxed[i] == i+1){
            document.getElementById("listnumber").children[i].style.color = "rgb(92, 228, 106)";
            } else {
            document.getElementById("listnumber").children[i].style.color = "rgb(65, 65, 65)";
            }
            document.getElementById("listnumber").children[i].style.position = "absolute";
            if(arraymaxed[i] > 9){
            document.getElementById("listnumber").children[i].style.left = canvas.width/2+(i-sizeofarray/2)*(arraywidth+arraymargin)+arraymargin/2-15 + "px";
            } else {
            document.getElementById("listnumber").children[i].style.left = canvas.width/2+(i-sizeofarray/2)*(arraywidth+arraymargin)+arraymargin/2-10 + "px";
            }
            document.getElementById("listnumber").children[i].style.top = canvas.height/2+sizeofrender*sizeofarray/2 + "px";
            document.getElementById("listnumber").children[i].style.textAlign = 'center';
        }

        if(correct > 0 && cooldown <= 0 && !finallysolved){
            playNote(220*(1.10408951367**(correct-5)), 2000);
            cooldown = 240;
        }
        }
        
        

        //done
        a++;
        updatemaxafter = false;
        requestAnimationFrame(update);
    }

    // start boi
    update();
};

// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser