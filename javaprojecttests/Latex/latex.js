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

        //--------------------------------
        //Looks at all subproblem types in a problem type and randomly selects one that has been discovered
        var selectype = Object.keys(subproblemtypes["Basic Arithmetic"]);
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
        //innermost fractions first, so fractions inside fractions work
        while(/\\frac{([^{}]*)}{([^{}]*)}/.test(guess)) {
            guess = guess.replace(/\\frac{([^{}]*)}{([^{}]*)}/g, "( $1 )/( $2 )");
        }
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

    function updateAnswer() {
        if(inputField.value == "" || inputField.value.trim() == "") {
            answer = String.raw`x = (?)`;
            answerb.style.color = "rgba(255, 255, 255, 0.5)";
        } else {
            answer = String.raw`x = ${inputField.value}`;
            answerb.style.color = "white";
        }
        Latexrender();
    }
    inputField.addEventListener("input", updateAnswer);

    // number of characters after the cursor (the closing brackets of any fractions we're inside)
    var tail = 0;

    // keep the cursor pinned to the end of the input (before any closing brackets), since the user can't see it
    function cursorToEnd() {
        tail = Math.max(0, Math.min(tail, inputField.value.length));
        var end = inputField.value.length - tail;
        if(inputField.selectionStart !== end || inputField.selectionEnd !== end) {
            inputField.setSelectionRange(end, end);
        }
    }

    // finds the index of the opening bracket matching the closing bracket at s[i], or -1
    function matchBack(s, i) {
        var close = s[i], open = close === ")" ? "(" : "{", depth = 0;
        for(var j = i; j >= 0; j--) {
            if(s[j] === close) depth++;
            else if(s[j] === open && --depth === 0) return j;
        }
        return -1;
    }
    // finds where the "thing" ending at s[end - 1] starts: a number/variable, a (...) group, or a \command{...}{...}
    function atomStart(s, end) {
        var c = s[end - 1];
        if(c === ")" || c === "}") {
            var j = matchBack(s, end - 1);
            if(j < 0) return end;
            while(c === "}" && s[j - 1] === "}") { //\frac{a}{b} has two groups
                var k = matchBack(s, j - 1);
                if(k < 0) break;
                j = k;
            }
            var command = s.slice(0, j).match(/\\[a-zA-Z]+$/);
            if(command) j -= command[0].length;
            return j;
        }
        var start = end;
        while(start > 0 && /[A-Za-z0-9.]/.test(s[start - 1])) start--;
        return start;
    }
    // finds where the numerator starts, including exponents like 3^x or 2^{10}
    function numeratorStart(s) {
        var start = atomStart(s, s.length);
        while(start < s.length && (s[start - 1] === "^" || s[start - 1] === "_")) {
            var next = atomStart(s, start - 1);
            if(next === start - 1) break;
            start = next;
        }
        return start;
    }

    // turns "8/" into "\frac{8}{|}" with the cursor in the denominator
    function makeFraction() {
        var pos = inputField.value.length - tail;
        var before = inputField.value.slice(0, pos).replace(/\s+$/, "");
        var after = inputField.value.slice(pos);
        var start = numeratorStart(before);
        var numerator = before.slice(start);
        if(numerator === "") {
            //nothing to put on top, so start in the numerator: \frac{|}{}
            inputField.value = before + String.raw`\frac{` + "}{}" + after;
            tail += 3;
        } else {
            inputField.value = before.slice(0, start) + String.raw`\frac{` + numerator + "}{" + "}" + after;
            tail += 1;
        }
    }
    // backspacing an empty bracket undoes the fraction
    function undoFraction() {
        var pos = inputField.value.length - tail;
        var before = inputField.value.slice(0, pos);
        var after = inputField.value.slice(pos);
        //only when the cursor is really inside the brackets (after stepping out, the closing brackets are already deleted)
        if(before.endsWith(String.raw`\frac{`) && after.startsWith("}{}")) { //empty numerator: \frac{|}{}
            inputField.value = before.slice(0, -6) + after.slice(3);
            tail -= 3;
            return true;
        }
        if(before.endsWith("}{") && after.startsWith("}")) { //empty denominator: \frac{8}{|}
            var open = matchBack(before, before.length - 2);
            if(open >= 5 && before.slice(open - 5, open) === String.raw`\frac`) {
                inputField.value = before.slice(0, open - 5) + before.slice(open + 1, -2) + after.slice(1);
                tail -= 1;
                return true;
            }
        }
        return false;
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
        //right arrow steps out of a bracket (from numerator straight into the denominator)
        if(event.key === "ArrowRight" && tail > 0) {
            tail -= inputField.value.slice(-tail).startsWith("}{") ? 2 : 1;
        }
        //cursor to end
        if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Delete"].includes(event.key)) {
            event.preventDefault();
            cursorToEnd();
        }
        //fractions
        if(event.key === "/") {
            event.preventDefault();
            makeFraction();
            cursorToEnd();
            updateAnswer();
        }
        if(event.key === "Backspace" && undoFraction()) {
            event.preventDefault();
            cursorToEnd();
            updateAnswer();
        } else if(event.key === "Backspace" && inputField.value.slice(0, inputField.value.length - tail).endsWith("}")) {
            //backspace steps back into a bracket instead of deleting it (the opposite of right arrow)
            event.preventDefault();
            tail += 1;
            cursorToEnd();
        }
        //entering an answer
        if(event.key === "Enter" && !(inputField.value == "" || inputField.value.trim() == "")) {
            if(check(inputField.value.trim())) {
                nextLaTeX();
                inputField.value = "";
                tail = 0;
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
    
    //toggles UI
    function toggleUI() {
        var UI = document.getElementById("UI");
        UI.style.top = "-50%";
        if(UI.style.visibility == "hidden"){
            UI.style.visibility = "inherit";
            UI.style.top = "50%";
        } else {
            UI.style.visibility = "hidden";
        }
    }
    var UIbutton = document.getElementById("UIToggle");
    UIbutton.addEventListener("click", toggleUI);

};
//we set the dark on fire
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser