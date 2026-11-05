var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
window.onload = function () {

    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    var mouseY = -1000;
    var mouseX = -1000;
    window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    let grid = {
        x:8,
        y:5,
        size:80,

    }

    let contains = [];
    for(var i = 0; i < grid.x; i++) {
        contains.push([]);
        for(var j = 0; j < grid.y; j++) {
            contains[i].push(-1);
        }
    }
    contains[3][3] = 0;
    contains[3][4] = 1;
    contains[3][2] = 1;
    
    //make the grid
    var html_grid = document.getElementById("grid");
    while(html_grid.children.length < grid.y){
        var c = document.createElement("div");
        c.style.position = "relative";
        c.id = "column";
        while(c.children.length < grid.x){
            var d = document.createElement("div");
            d.style.position = "relative";
            d.id = "square";
            d.style.width = grid.size + "px";
            d.style.height = grid.size + "px";
            c.appendChild(d);
        }
        html_grid.appendChild(c);
    }
    html_grid.style.transform = "translate(-50%, -50%)";

    function update() {
        
        if(canvas.width != window.innerWidth) canvas.width = window.innerWidth;
        if(canvas.height = window.innerHeight) canvas.height = window.innerHeight;

        grid.size = Math.min(canvas.width, canvas.height)/10;
        
        //box + load
        // for(let i = 0; i < grid.x; i++) {
        //     for(let j = 0; j < grid.y; j++) {
        //         ctx.fillStyle = "rgb(85, 192, 192)";
        //         if(pointonbox(mouseX, mouseY, (i-grid.x/2)*grid.size+canvas.width/2, (j-grid.y/2)*grid.size+canvas.height/2, grid.size*0.9, grid.size*0.9)){
        //             ctx.fillStyle = "rgb(112, 206, 206)";
        //         }
        //         ctx.fillRect((i-grid.x/2)*grid.size+canvas.width/2, (j-grid.y/2)*grid.size+canvas.height/2, grid.size*0.9, grid.size*0.9);

        //         if(contains[i][j] == 0) {
        //             ctx.fillStyle = "rgb(93, 255, 142)";
        //             ctx.fillRect((i-grid.x/2)*grid.size+canvas.width/2+grid.size*0.25, (j-grid.y/2)*grid.size+canvas.height/2+grid.size*0.25, grid.size*0.4, grid.size*0.4);
        //         }
        //         if(contains[i][j] == 1) {
        //             ctx.fillStyle = "rgb(10, 15, 19)";
        //             ctx.fillRect((i-grid.x/2)*grid.size+canvas.width/2+grid.size*0.25, (j-grid.y/2)*grid.size+canvas.height/2+grid.size*0.25, grid.size*0.4, grid.size*0.4);
        //         }
        //     }
        // }

        //mouse
        ctx.fillStyle = "rgb(200, 10, 10)"
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 5, 0, Math.PI*2);
        ctx.fill();
        
        requestAnimationFrame(update);
    }

    // start boi
    update();
};
//we set the dark on fire
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser