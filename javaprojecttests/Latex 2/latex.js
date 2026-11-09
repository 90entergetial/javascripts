var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
window.onload = function () {

    // const canvas = document.getElementById("cav");
    // const ctx = canvas.getContext("2d");
    // var mouseY = -1000;
    // var mouseX = -1000;

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
    
    var LaTex = String.raw`x ( b {-} b 2 \hat{} 4 a c * * - \sqrt{} \pm ){} 2 a * / = END`;
    var Excluded_LaTex = LaTex.split(" ");
    var split_LaTex = LaTex.split(" ");
    var onindex = 0;
    var please_hold = false;
    var steps = 0;

    var marginspace = 60;

    function RemoveItem(item) {
        console.log(item)
        // marginLeft is a string like "60px", so turn it into a number
        var marg = parseFloat(item.style.marginLeft) || 0;
        var goto = item.querySelector(".katex-display").getBoundingClientRect().width;
        ramptovalue(1, 0, 500, alpha => { item.style.color = `rgba(11, 12, 35, ${alpha})` }, "ease in out");
        ramptovalue(marg, 0, 500, a => { item.style.marginLeft = `${a}px` }, "ease in out");
        ramptovalue(goto, 0, 500, a => { item.style.width = `${a}px` }, "ease in out");
        setTimeout(() => {
            container.removeChild(item);
        }, 500);
    }
    function Combinenumbers() {
        var current = split_LaTex[Math.min(onindex-1,split_LaTex.length)];
        try {
            if(current == String.raw`+`){
                let a = split_LaTex[onindex-2];
                let b = split_LaTex[onindex-3];

                // Number("x") gives NaN instead of throwing, so check for that
                let c;
                if (isNaN(Number(a)) || isNaN(Number(b))) {
                    c = String.raw`${b}+${a}`;
                } else {
                    c = Number(a) + Number(b);
                }
                console.log(c); 
                RemoveItem(container.children[onindex-1]);
                RemoveItem(container.children[onindex-2]);
                RemoveItem(container.children[onindex-3]);
                AddItem(String.raw`${c}`);

                //gotta update it now
                split_LaTex = [...split_LaTex.slice(0, onindex-3), String.raw`${c}`, ...split_LaTex.slice(onindex)];
                console.log(split_LaTex); 
                onindex -= 2;

            } else if(current == String.raw`-`){
                let a = split_LaTex[onindex-2];
                let b = split_LaTex[onindex-3];

                // Number("x") gives NaN instead of throwing, so check for that
                let c;
                if (isNaN(Number(a)) || isNaN(Number(b))) {
                    c = String.raw`${b}-${a}`;
                } else {
                    c = Number(a) - Number(b);
                }
                console.log(c); 
                RemoveItem(container.children[onindex-1]);
                RemoveItem(container.children[onindex-2]);
                RemoveItem(container.children[onindex-3]);
                if(onindex == 3) AddItem(String.raw`${c}`, false);
                else AddItem(String.raw`${c}`);

                //gotta update it now
                split_LaTex = [...split_LaTex.slice(0, onindex-3), String.raw`${c}`, ...split_LaTex.slice(onindex)];
                console.log(split_LaTex); 
                onindex -= 2;

            } else if(current == String.raw`\hat{}`){
                let a = split_LaTex[onindex-2];
                let b = split_LaTex[onindex-3];

                // Number("x") gives NaN instead of throwing, so check for that
                let c;
                if (isNaN(Number(a)) || isNaN(Number(b))) {
                    c = String.raw`{${b}}^{${a}}`;
                } else {
                    c = Number(b) ** Number(a);
                }
                console.log(c); 
                RemoveItem(container.children[onindex-1]);
                RemoveItem(container.children[onindex-2]);
                RemoveItem(container.children[onindex-3]);
                if(onindex == 3) AddItem(String.raw`${c}`, false);
                else AddItem(String.raw`${c}`);

                //gotta update it now
                split_LaTex = [...split_LaTex.slice(0, onindex-3), String.raw`${c}`, ...split_LaTex.slice(onindex)];
                console.log(split_LaTex); 
                onindex -= 2;

            } else if(current == String.raw`*` || current == String.raw`\cdot`){
                let a = split_LaTex[onindex-2];
                let b = split_LaTex[onindex-3];
                let c;
                if (isNaN(Number(a)) || isNaN(Number(b))) {
                    c = String.raw`${b}${a}`;
                } else {
                    c = Number(a) * Number(b);
                }
                console.log(c); 
                RemoveItem(container.children[onindex-1]);
                RemoveItem(container.children[onindex-2]);
                RemoveItem(container.children[onindex-3]);
                if(onindex == 3) AddItem(String.raw`${c}`, false);
                else AddItem(String.raw`${c}`);
                
                //gotta update it now
                split_LaTex = [...split_LaTex.slice(0, onindex-3), String.raw`${c}`, ...split_LaTex.slice(onindex)];
                console.log(split_LaTex); 
                onindex -= 2;
                
            } else if(current == String.raw`/`){
                let a = split_LaTex[onindex-2];
                let b = split_LaTex[onindex-3];
                let c = String.raw`\frac{${b}}{${a}}`;
                console.log(c); 
                RemoveItem(container.children[onindex-1]);
                RemoveItem(container.children[onindex-2]);
                RemoveItem(container.children[onindex-3]);
                if(onindex == 3) AddItem(String.raw`${c}`, false);
                else AddItem(String.raw`${c}`);
                
                //gotta update it now
                split_LaTex = [...split_LaTex.slice(0, onindex-3), String.raw`${c}`, ...split_LaTex.slice(onindex)];
                console.log(split_LaTex); 
                onindex -= 2;
                
            } else if(current == String.raw`\pm`){
                let c = split_LaTex[onindex-2];
                RemoveItem(container.children[onindex-1]);
                RemoveItem(container.children[onindex-2]);
                if(onindex == 2){
                AddItem(String.raw`\pm ${c}`, false);
                } else {
                AddItem(String.raw`\pm ${c}`);
                }
                
                //gotta update it now
                split_LaTex = [...split_LaTex.slice(0, onindex-2), String.raw`\pm ${c}`, ...split_LaTex.slice(onindex)];
                console.log(split_LaTex);
                onindex -= 1;
                
            } else if(current == String.raw`)`){
                let close = onindex-1;
                let open = split_LaTex.lastIndexOf(String.raw`(`, close-1);
                if (open == -1) { please_hold = false; return; }
                let d = split_LaTex.slice(open+1, close).join(" ");
                for (let i = open; i <= close; i++) {
                    RemoveItem(container.children[i]);
                }
                if(open == 0){
                AddItem(String.raw`(${d})`, false)
                } else {
                AddItem(String.raw`(${d})`);
                }

                //gotta update it now
                split_LaTex = [...split_LaTex.slice(0, open), String.raw`(${d})`, ...split_LaTex.slice(onindex)];
                console.log(split_LaTex);
                onindex -= close - open;

            } else if(current == String.raw`){}`){
                let close = onindex-1;
                let open = split_LaTex.lastIndexOf(String.raw`(`, close-1);
                if (open == -1) { please_hold = false; return; }
                let d = split_LaTex.slice(open+1, close).join(" ");
                for (let i = open; i <= close; i++) {
                    RemoveItem(container.children[i]);
                }
                if(open == 0){
                AddItem(String.raw`${d}`, false)
                } else {
                AddItem(String.raw`${d}`);
                }

                //gotta update it now
                split_LaTex = [...split_LaTex.slice(0, open), String.raw`${d}`, ...split_LaTex.slice(onindex)];
                console.log(split_LaTex);
                onindex -= close - open;

            } else if(current == String.raw`\sqrt{}`){
                let c = split_LaTex[onindex-2];
                RemoveItem(container.children[onindex-1]);
                RemoveItem(container.children[onindex-2]);
                if(onindex == 2){
                AddItem(String.raw`\sqrt{${c}}`, false);
                } else {
                AddItem(String.raw`\sqrt{${c}}`);
                }
                
                //gotta update it now
                split_LaTex = [...split_LaTex.slice(0, onindex-2), String.raw`\sqrt{${c}}`, ...split_LaTex.slice(onindex)];
                console.log(split_LaTex);
                onindex -= 1;
                
            } else if(current == String.raw`{-}`){
                let c = split_LaTex[onindex-2];
                RemoveItem(container.children[onindex-1]);
                RemoveItem(container.children[onindex-2]);
                if(onindex == 2){
                AddItem(String.raw`- ${c}`, false);
                } else {
                AddItem(String.raw`- ${c}`);
                }
                
                //gotta update it now
                split_LaTex = [...split_LaTex.slice(0, onindex-2), String.raw`-${c}`, ...split_LaTex.slice(onindex)];
                console.log(split_LaTex);
                onindex -= 1;
                
            } else if(current == String.raw`=`){
                let c = split_LaTex[onindex-2];
                RemoveItem(container.children[onindex-1]);
                RemoveItem(container.children[onindex-2]);
                if(onindex == 2){
                AddItem(String.raw`= ${c}`, false);
                } else {
                AddItem(String.raw`= ${c}`);
                }
                
                //gotta update it now
                split_LaTex = [...split_LaTex.slice(0, onindex-2), String.raw`= ${c}`, ...split_LaTex.slice(onindex)];
                console.log(split_LaTex);
                onindex -= 1;
                
            } else if(current == String.raw`END`){
                let close = onindex-1;
                let d = split_LaTex.slice(0, close).join(" ");
                for (let i = 0; i <= close; i++) {
                    RemoveItem(container.children[i]);
                }
                AddItem(String.raw`${d}`, false);

                //gotta update it now
                split_LaTex = [String.raw`${d}`, ...split_LaTex.slice(onindex)];
                console.log(split_LaTex);
                onindex -= close - open;

            } else {
                please_hold = false;
            }
        } catch(error) {
            please_hold = false;
        }
    }
    let list_of_functions = [
        String.raw`+`,
        String.raw`-`,
        String.raw`*`,
        String.raw`/`,
        String.raw`\hat{}`,
        String.raw`\pm`,
        String.raw`=`,
        String.raw`{-}`,
        String.raw`\sqrt{}`,
        String.raw`)`,
        String.raw`){}`,
        String.raw`END`,
    ];
    function AddItem(display, aa=true) {
        let a = document.createElement("div");

        a.style.marginLeft = marginspace + "px";

        katex.render(display, a, { displayMode: true, throwOnError: false });
        container.append(a);

        var lastlatex = container.children[container.childElementCount-1];
        var goto = lastlatex.querySelector(".katex-display").getBoundingClientRect().width;
        lastlatex.style.width = "0px";
        //lastlatex.style.overflow = "hidden";
        ramptovalue(0, 1, 500, alpha => { lastlatex.style.color = `rgba(11, 12, 35, ${alpha})` }, "ease in out");
        if(container.childElementCount != 1 && aa){
        ramptovalue(0, marginspace, 500, a => { lastlatex.style.marginLeft = `${a}px` }, "ease in out");
        } else {
        a.style.marginLeft = "0px";
        }
        ramptovalue(0, goto, 500, a => { lastlatex.style.width = `${a}px` }, "ease in out");
        
        please_hold = true;
        setTimeout(() => {
            if(list_of_functions.includes(display)){
                console.log("heyy");
                pplaynote(true);
                Combinenumbers();
            } else {
            please_hold = false;
            }
        }, 500);
    }
    function pplaynote(combining=false) {
        setTimeout(() => {
        if(combining){
            playNote(2**((69+steps)/12), 0.5, 10, 0, 500);
        } else {
            playNote(2**((81+steps)/12), 0.5, 10, 0, 500);
        }
        }, 100);
    }

    document.addEventListener("click", function(){
    start();
    })
    var started = false;

    function start(){
        if(!started) {
            started = true;
            setInterval(function(){

            if(container.childElementCount > 0) container.children[0].style.marginLeft = "0px";
            if(!please_hold) {
                if(onindex >= 0 && onindex < split_LaTex.length) {
                AddItem(split_LaTex[onindex]);
                pplaynote();
                steps += 1;
                }
                onindex += 1;
            }
            }, 100);
        }
    }

};
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser