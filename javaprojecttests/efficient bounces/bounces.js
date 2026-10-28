var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

window.onload = function () {

    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    var mouseY = -1000;
    var mouseX = -1000;
    var clicked = false;
    var pressed = false;

    /*
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
    */
    
    var box = {
        w:600,
        h:1000,
        elastic: 10,
        blocks: [10, 100, 1000],
    }

    var ball = {
        gravity:0.5,
        r:20,
        x:0,
        y:400,
        dx:10,
        dy:4,
        bounciness: 0.5,
    }

    function blocks() {
        var blocks = document.getElementById("blocks");
        var heights = [];
        for(var i = 0; i < box.blocks.length; i++){
            
        }
        for(var i = 0; i < box.blocks.length; i++){
            ctx.fillStyle = "rgb(19, 19, 20)";
            ctx.fillRect(canvas.width/2-box.w/2,canvas.height/2-75, box.w, 150);
            ctx.fillStyle = "rgb(222, 226, 240)";
            ctx.fillRect(canvas.width/2-box.w/2+10,canvas.height/2-65, box.w-20, 130);
        }

    }

    function step(B) {
        B.dy -= B.gravity;

        B.x += B.dx;
        B.y += B.dy;
        if(Math.abs(B.y)+B.r > box.h/2){
            B.dy = cst(Math.abs(B.dy*B.bounciness), box.elastic, 1000000000000) * -sign(B.dy);
            this.diff = Math.abs((box.h/2)-(Math.abs(B.y)+B.r))
            B.y += 2*this.diff * sign(B.dy);
        }
        if(Math.abs(B.x)+B.r > box.w/2){
            B.dx = -B.dx;
            this.diff = Math.abs((box.w/2)-(Math.abs(B.x)+B.r))
            B.x += 2 * this.diff * sign(B.dx);
        }

    }

    function update() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        step(ball);

        //bg
        ctx.fillStyle = "rgb(222, 226, 240)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgb(19, 19, 20)";
        ctx.fillRect(canvas.width/2-box.w/2-10,canvas.height/2-box.h/2-10, box.w+20, box.h+20);
        
        ctx.fillStyle = "rgb(222, 226, 240)";
        ctx.fillRect(canvas.width/2-box.w/2,canvas.height/2-box.h/2, box.w, box.h);
        blocks()
        //ball
        ctx.fillStyle = "rgb(98, 104, 176)"
        ctx.beginPath();
        ctx.arc(canvas.width/2-ball.x, canvas.height/2-ball.y, ball.r, 0, Math.PI*2);
        ctx.fill();

        //mouse
        // ctx.fillStyle = "rgb(200, 10, 10)"
        // ctx.beginPath();
        // ctx.arc(mouseX, mouseY, 5, 0, Math.PI*2);
        // ctx.fill();

        requestAnimationFrame(update);
        clicked = false;
    }

    // start boi
    update();
};
//we set the dark on fire
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser