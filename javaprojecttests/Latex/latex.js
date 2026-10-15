var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

window.onload = function () {

    // const canvas = document.getElementById("cav");
    // const ctx = canvas.getContext("2d");
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
    var container = document.getElementById("container");

    var Latex_List = [
        String.raw`2`,
        String.raw`3`,
        String.raw`4`,
        String.raw`5`,
        String.raw`6`,
    ];
    var LaTex = String.raw`1`;

    var list = document.getElementById("list");

    function Listrender() {
        //renders the 5 most recent LaTeX strings into the list (only needs to run when Latex_List changes)
        list.innerHTML = "";
        for (var i = Math.min(5, Latex_List.length) - 1; i >= 0; i--) {
            var item = document.createElement("div");
            item.className = "list-item";
            list.appendChild(item);
            katex.render(Latex_List[i], item, { throwOnError: false });

            //shrink font until it fits inside the list
            var size = 1.5;
            while (item.scrollWidth > item.clientWidth && size > 0.3) {
                size -= 0.05;
                item.style.fontSize = size + "em";
            }
        }
    }
    function Latexrender() {
        //renders LaTeX into container (only needs to run when LaTex changes)
        katex.render(LaTex, container, { displayMode: true, throwOnError: false });
    }
    function nextLaTeX() {
        //gets the next LaTeX string from the list and updates the display
        if (Latex_List.length > 0) {
            LaTex = Latex_List[0];
            Latex_List.splice(0, 1);
            playNote(220, 100, 0.1); // Play a note when moving to the next LaTeX
        }
        Latexrender();
        Listrender();
    }

    Latexrender();
    Listrender();
    window.addEventListener("resize", Listrender);

    var nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", nextLaTeX);

};
//we set the dark on fire
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser