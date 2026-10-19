var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

window.onload = function () {

    // const canvas = document.getElementById("cav");
    // const ctx = canvas.getContext("2d");
    // var mouseY = -1000;
    // var mouseX = -1000;
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

    // window.addEventListener("mouseup", (event) => {
    //     clicked = true;
    //     pressed = false;
    // });
    // window.addEventListener("mousedown", (event) => {
    //     pressed = true;
    // });
    // window.addEventListener("mousemove", (event) => {
    //     mouseX = event.clientX;
    //     mouseY = event.clientY;
    // });

    var container = document.getElementById("container");
    
    var Latex_List = [
        [String.raw`2 = e^x`, Math.log(2)/Math.log(Math.E)],
        [String.raw`x = 3`, 3],
        [String.raw`x = 4`, 4],
        [String.raw`x = 5`, 5],
        [String.raw`x = 6`, 6],
    ];
    var LaTex = [String.raw`x = 1`, 1];
    var answer = String.raw`x = (?)`;
    var list = document.getElementById("list");

    var stage = "Basic Arithmetic";

    var problemtypes = [
        "Basic Arithmetic",
        "Exponents",
        "Logarithms",
        "Fractions",
        "Square Roots"
    ]
    var subproblemtypes = {
        "Basic Arithmetic": {
            "Straight Addition": [
                {
                    discovered: false,
                    format: function(a, b) { return "x =  " + a + " + " + b; },
                    answer: function(a, b) { return a + b; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 11), b: Math.floor(Math.random() * 11)};
                    }
                },
            ],
            "Variable Addition": [
                {
                    discovered: false,
                    format: function(a, b) { return a + " = x + " + b; },
                    answer: function(a, b) { return a - b; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 11), b: Math.floor(Math.random() * 11)};
                    }
                },
                {
                    discovered: false,
                    format: function(a, b) { return a + " =  " + b + " + x"; },
                    answer: function(a, b) { return a - b; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 11), b: Math.floor(Math.random() * 11)};
                    }
                }
            ],
            "Straight Subtraction": [
                {
                    discovered: false,
                    format: function(a, b) { return "x =  " + a + " - " + b; },
                    answer: function(a, b) { return a - b; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 11), b: Math.floor(Math.random() * 11)};
                    }
                },
            ],
            "Variable Subtraction": [
                {
                    discovered: false,
                    format: function(a, b) { return a + " = x - " + b; },
                    answer: function(a, b) { return a + b; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 11), b: Math.floor(Math.random() * 11)};
                    }
                },
                {
                    discovered: false,
                    format: function(a, b) { return a + " = " + b + " - x"; },
                    answer: function(a, b) { return b - a; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 11), b: Math.floor(Math.random() * 11)};
                    }
                },
            ],
            "Repeated Addition": [
                {
                    discovered: false,
                    format: function(a, b) { 
                        var str = (" + " + a).repeat(b-1);
                        return "x =  " + a + str;
                    },
                    answer: function(a, b) { return a * b; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 10) + 1, b: Math.floor(Math.random() * 5) + 1};
                    }
                },
            ],

        }
    }

    function Listrender() {
        //renders the 5 most recent LaTeX strings into the list (only needs to run when Latex_List changes)
        list.innerHTML = "";
        for (var i = Math.min(5, Latex_List.length) - 1; i >= 0; i--) {
            var item = document.createElement("div");
            item.className = "list-item";
            list.appendChild(item);
            katex.render(Latex_List[i][0], item, { throwOnError: false });

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
        katex.render(LaTex[0], container, { displayMode: true, throwOnError: false });
        katex.render(answer, document.getElementById("answer"), { displayMode: true, throwOnError: false });
    }
    function nextLaTeX() {
        //gets the next LaTeX string from the list and updates the display
        if (Latex_List.length > 0) {
            LaTex = Latex_List[0];
            Latex_List.splice(0, 1);
            playNote(220, 100, 0.6); // Play a note when moving to the next LaTeX
        }
        while (Latex_List.length < 6) {
            generateRandomLaTeX();
        }
        Latexrender();
        Listrender();
    }
    function generateRandomLaTeX() {
        //generates a random LaTeX string and adds it to the list
        //(placeholder)
        var rn = 0;
        var randomLaTeX = [String.raw`x = ${rn}`, rn];

        var selectype = Object.keys(subproblemtypes["Basic Arithmetic"]);
        //var selectype = ["Straight Addition", "Variable Addition", "Straight Subtraction", "Variable Subtraction", "Repeated Addition"];
        var selectedtype = selectype[Math.floor(Math.random() * selectype.length)];
        
        var vars = subproblemtypes["Basic Arithmetic"][selectedtype][0].customrandom();
        randomLaTeX = [subproblemtypes["Basic Arithmetic"][selectedtype][0].format(vars.a, vars.b), subproblemtypes["Basic Arithmetic"][selectedtype][0].answer(vars.a, vars.b)];

        Latex_List.push(randomLaTeX);
        Listrender();
    }
    function check(guess) {

        //simplifying guess down to a number and checking if it matches the answer
        //just in case someone uses \frac or \cdot or other LaTex commands
        guess = guess.replace(/\\cdot/g, "*");
        guess = guess.replace(/\\frac{([^}]*)}{([^}]*)}/g, "( $1 )/( $2 )");
        guess = guess.replace(/\\sqrt{([^}]*)}/g, "Math.sqrt( $1 )");
        guess = guess.replace(/\\left/g, "");
        guess = guess.replace(/\\right/g, "");

        //changing things like ln to Math.ln()
        guess = guess.replace(/log\(([^)]*)\)/g, "Math.log( $1 )");
        guess = guess.replace(/log_([^}]*)\(([^}]*)\)/g, "Math.log( $1 )/Math.log( $2 )");
        guess = guess.replace(/sqrt/g, "Math.sqrt");
        guess = guess.replace(/ln\(([^)]*)\)/g, "Math.log( $1 )/Math.log(Math.E)");
        guess = guess.replace(/(^|\s)e($|\s)/g, "Math.E");
        guess = guess.replace(/pi/g, "Math.PI");
        guess = guess.replace(/(^|\s)sin\(([^)]*)\)/g, "Math.sin( $2 )");
        guess = guess.replace(/(^|\s)cos\(([^)]*)\)/g, "Math.cos( $2 )");
        guess = guess.replace(/(^|\s)tan\(([^)]*)\)/g, "Math.tan( $2 )");
        guess = guess.replace(/\^/g, "**");
        console.log("guess after replacements: " + guess);

        //convert guess to a number
        try {
            guess = eval(guess);
        } catch (e) {
            return false;
        }
        if(guess == LaTex[1]) {
            return true;
        }
        return false;
    }
    Latexrender();
    Listrender();
    window.addEventListener("resize", Listrender);

    var nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", nextLaTeX);

    var inputField = document.getElementById("input");

    var answerb = document.getElementById("answer");
    if(inputField.value == "" || inputField.value.trim() == "") {
        answerb.style.color = "rgba(255, 255, 255, 0.5)";
    } else {
        answerb.style.color = "white";
    }

    inputField.addEventListener("input", function() {
        if(inputField.value == "" || inputField.value.trim() == "") {
            answer = String.raw`x = (?)`;
            answerb.style.color = "rgba(255, 255, 255, 0.5)";
        } else {
            answer = String.raw`x = ${inputField.value}`;
            answerb.style.color = "white";
        }
        Latexrender();
    });

    // keep the cursor pinned to the end of the input, since the user can't see it
    function cursorToEnd() {
        var end = inputField.value.length;
        if(inputField.selectionStart !== end || inputField.selectionEnd !== end) {
            inputField.setSelectionRange(end, end);
        }
    }
    inputField.addEventListener("mousedown", function(event) {
        event.preventDefault(); // stops clicking/dragging from placing the cursor
        inputField.focus();
        cursorToEnd();
    });
    ["focus", "select", "keyup", "selectionchange"].forEach(function(type) {
        inputField.addEventListener(type, cursorToEnd);
    });
    inputField.addEventListener("keydown", function(event) {
        //cursor to end
        if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            cursorToEnd();
        }
        //entering an answer
        if(event.key === "Enter" && !(inputField.value == "" || inputField.value.trim() == "")) {
            if(check(inputField.value.trim())) {
                nextLaTeX();
                inputField.value = "";
                answer = String.raw`x = (?)`;
                answerb.style.color = "rgba(255, 255, 255, 0.5)";
                Latexrender();
            } else {
                playNote(110, 100, 0.6);
                answerb.style.transition = "none";
                answerb.style.color = "rgba(255, 0, 0, 1)";
                setTimeout(function() {
                answerb.style.transition = "all 0.3s ease-in-out";
                    answerb.style.color = "white";
                }, 100);
            }
        }
    });

};
//we set the dark on fire
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser