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
        damage: 1,
        hits: 0,
    }

    var heights = [];
    for(var i = 0; i < box.blocks.length; i++){
        heights.push(150*((i)-box.blocks.length/2))
    }
    function blocks() {
        var blocks = document.getElementById("blocks");
        while(blocks.children.length < box.blocks.length){
            const para = document.createElement("p");
            para.style.position = "absolute";
            para.style.color = "rgb(0, 0, 0)";
            para.style.fontSize = "50px";
            para.style.transform = "translate(-50%, -50%)";
            blocks.appendChild(para);
        }
        for(var i = 0; i < box.blocks.length; i++){
            var block = blocks.children[i];
            if(box.blocks[i] == 0) {
                block.innerHTML = " ";
                continue;
            }
            block.innerHTML = box.blocks[i];
            block.style.left = canvas.width/2 + "px";
            block.style.top  = (canvas.height/2 + heights[i] + 75) + "px";

            ctx.fillStyle = "rgb(19, 19, 20)";
            ctx.fillRect(canvas.width/2-box.w/2,canvas.height/2+heights[i], box.w, 151);
            ctx.fillStyle = "rgb(222, 226, 240)";
            ctx.fillRect(canvas.width/2-box.w/2+10,canvas.height/2+10+heights[i], box.w-20, 130);
        }

    }
    function damage(i, B) {
        B.hits += 1;
        box.blocks[i] -= B.damage;
        if(box.blocks[i] <= 0) playNote([1000, 8000], 0.2, 0, 10, 200);
        else playNote(2**((94+B.hits/4)/12), 0.2, 0, 100, 100);
        box.blocks[i] = cst(box.blocks[i], 0, box.blocks[i]);
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
        for(var i = 0; i < box.blocks.length; i++){
            if(box.blocks[i] == 0) continue;
            if(-B.y+B.r > heights[i]){
                B.dy = cst(Math.abs(B.dy*B.bounciness), box.elastic, 1000000000000) * -sign(B.dy);
                this.diff = Math.abs((heights[i])-(-B.y+B.r))
                B.y += 2*this.diff * sign(B.dy);
                damage(i, B);
            }
            break;
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