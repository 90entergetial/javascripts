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
    
    var LaTex = String.raw`2 5 3 + * \frac{5}{3}`;

    var onindex = 0;
    var please_hold = false;
    function Latexrender() {
        var split_LaTex = LaTex.split(" ");
        AddItem(split_LaTex[onindex]);
    }
    function RemoveItem(item) {
        console.log(item)
        var goto = item.querySelector(".katex-display").getBoundingClientRect().width;
        ramptovalue(1, 0, 500, alpha => { item.style.color = `rgba(11, 12, 35, ${alpha})` }, "ease in out");
        ramptovalue(20, 0, 500, a => { item.style.marginLeft = `${a}px` }, "ease in out");
        ramptovalue(goto, 0, 500, a => { item.style.width = `${a}px` }, "ease in out");
            setTimeout(() => {
                container.removeChild(item);
            }, 500);
    }
    function Combinenumbers() {

        var split_LaTex = LaTex.split(" ");
        var current = split_LaTex[Math.min(onindex-1,split_LaTex.length)];
        try {
            if(current == String.raw`+`){
                let a = split_LaTex[onindex-2];
                let b = split_LaTex[onindex-3];
                let c = eval(b)+eval(a);
                console.log(c); 
                RemoveItem(container.children[onindex-1]);
                RemoveItem(container.children[onindex-2]);
                RemoveItem(container.children[onindex-3]);
                AddItem("8");
            } else if(current == String.raw`*`){
                let a = split_LaTex[onindex-2];
                let b = split_LaTex[onindex-3];
                let c = eval(b)*eval(a);
                console.log(c); 
                RemoveItem(container.children[onindex-1]);
                RemoveItem(container.children[onindex-2]);
                RemoveItem(container.children[onindex-3]);
                AddItem("8");
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
        String.raw`^`,
    ];
    function AddItem(display) {
        let a = document.createElement("div");

        a.style.marginLeft = "20px";

        katex.render(display, a, { displayMode: true, throwOnError: false });
        container.append(a);

        var lastlatex = container.children[container.childElementCount-1];
        var goto = lastlatex.querySelector(".katex-display").getBoundingClientRect().width;
        lastlatex.style.width = "0px";
        //lastlatex.style.overflow = "hidden";
        ramptovalue(0, 1, 500, alpha => { lastlatex.style.color = `rgba(11, 12, 35, ${alpha})` }, "ease in out");
        ramptovalue(0, 20, 500, a => { lastlatex.style.marginLeft = `${a}px` }, "ease in out");
        ramptovalue(0, goto, 500, a => { lastlatex.style.width = `${a}px` }, "ease in out");
        
        please_hold = true;
        setTimeout(() => {
            if(list_of_functions.includes(display)){
                console.log("heyy");
                Combinenumbers();
            } else {
            please_hold = false;
            }
        }, 500);
    }

    document.addEventListener("click", function(){
    if(!please_hold) {
        if(onindex >= 0 && onindex < LaTex.split(" ").length) Latexrender();
        onindex += 1;
    }
    })

};
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser