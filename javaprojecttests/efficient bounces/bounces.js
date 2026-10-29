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
        h:900,
        elastic: 0,
        blocks: [10n, 10n**10n, 10n**100n],
    }

    var ball = {
        gravity:10.5,
        r:20,
        x:0,
        y:400,
        dx:10,
        dy:4,
        bounciness: 1.01,
        damage: 1n,
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
            block.innerHTML = bigaddcommas(box.blocks[i]);
            block.style.left = canvas.width/2 + "px";
            block.style.top  = (canvas.height/2 + heights[i] + 75) + "px";

            ctx.fillStyle = "rgb(19, 19, 20)";
            ctx.fillRect(canvas.width/2-box.w/2,canvas.height/2+heights[i], box.w, 151);
            ctx.fillStyle = "rgb(222, 226, 240)";
            ctx.fillRect(canvas.width/2-box.w/2+10,canvas.height/2+10+heights[i], box.w-20, 130);
        }

        var damage = document.getElementById("damage");
        damage.style.color = "rgb(0, 0, 0)";
        damage.style.top = (canvas.height/2-box.h/2-10) + "px";
        damage.style.left = (canvas.width/2-box.w/2) + "px";
        damage.style.transform = "translate(0%, -100%)";
        damage.style.padding = "0px";
        damage.style.fontSize = "60px";
        damage.innerHTML = "Power: " + bigaddcommas(ball.damage);

        var damage = document.getElementById("hits");
        damage.style.color = "rgb(0, 0, 0)";
        damage.style.top = (canvas.height/2+box.h/2-10) + "px";
        damage.style.left = (canvas.width/2-box.w/2) + "px";
        damage.style.transform = "translate(0%, 50%)";
        damage.style.padding = "0px";
        damage.style.fontSize = "60px";
        damage.innerHTML = "Hits: " + addcommas(ball.hits);

    }
    function damage(i, B, sound) {
        B.hits += 1;
        box.blocks[i] -= B.damage;
        B.damage += B.damage/10000n;
        B.damage += 1n;
        if(box.blocks[i] <= 0) playNote([1000, 8000], 0.2, 0, 10, 200);
        else if(sound && B.hits <= 1000) playNote(2**((94+B.hits/8)/12), 0.2, 0, 100, 100);
        box.blocks[i] = cst(box.blocks[i], 0, box.blocks[i]);
    }

    // The y the ball's center sits at when touching the floor:
    // the top of the first live block, or the bottom of the box if none are left.
    function floorY(B) {
        for(var i = 0; i < box.blocks.length; i++){
            if(box.blocks[i] != 0) return { y: B.r - heights[i], block: i };
        }
        return { y: -box.h/2 + B.r, block: -1 };
    }

    function bounceSpeed(v, B) {
        return cst(Math.abs(v*B.bounciness), box.elastic, 1000000000000);
    }

    const REST_SPEED = 0.001; // bounces slower than this count as "at rest"
    const MAX_HITS_PER_STEP = 200000000; // safety cap so a step can never loop forever

    function step(B) {
        // x has no acceleration, so mirroring the overshoot is already exact
        B.x += B.dx;
        if(Math.abs(B.x)+B.r > box.w/2){
            B.dx = -B.dx;
            var diff = Math.abs((box.w/2)-(Math.abs(B.x)+B.r));
            B.x += 2 * diff * sign(B.dx);
        }

        // y: move along the exact curve  y(t) = y0 + v0*t - g*t^2/2  for one frame (t from 0 to 1).
        // If it hits something partway, stop at the moment of contact, bounce,
        // then use the rest of the frame with the new velocity.
        var g = B.gravity;
        var ceil = box.h/2 - B.r;
        var T = 1; // time left in this frame

        for(var n = 0; n < MAX_HITS_PER_STEP && T > 0; n++){
            var fl = floorY(B);
            var y0 = B.y, v0 = B.dy;
            var tHit = Infinity, hit = 0; // hit: -1 floor, 1 ceiling

            // floor: does the ball end the remaining time below it?
            var yEnd = y0 + v0*T - g*T*T/2;
            if(yEnd < fl.y){
                var d = Math.max(0, y0 - fl.y);
                var root = Math.sqrt(v0*v0 + 2*g*d);
                if(v0 > 0) tHit = (v0 + root) / g;               // going up first, then comes down
                else if(root - v0 > 0) tHit = 2*d / (root - v0); // already falling
                else tHit = 0;                                   // sitting on the floor, not moving
                hit = -1;
            }

            // ceiling: does the ball reach it before slowing to a stop?
            if(v0 > 0){
                var dc = Math.max(0, ceil - y0);
                var disc = v0*v0 - 2*g*dc;
                if(disc >= 0){
                    var tc = 2*dc / (v0 + Math.sqrt(disc));
                    if(tc <= T && tc < tHit){ tHit = tc; hit = 1; }
                }
            }

            if(hit == 0){ // nothing hit for the rest of the frame
                B.y = yEnd;
                B.dy = v0 - g*T;
                break;
            }

            // advance to the moment of contact
            var vHit = v0 - g*tHit; // velocity at contact
            T -= tHit;

            if(hit == 1){
                B.y = ceil;
                B.dy = -bounceSpeed(vHit, B);
                continue;
            }

            B.y = fl.y;
            if(fl.block < 0){ // all blocks gone: fixed hop of speed = gravity (lasts 2 frames)
                B.dy = g*10;
                continue;
            }
            if(Math.abs(vHit) < REST_SPEED){ // already resting on the floor
                B.dy = 0;
                break;
            }
            if(fl.block >= 0 && n < 10) damage(fl.block, B, true);
            else if(fl.block >= 0) damage(fl.block, B, false);
            var vOut = bounceSpeed(vHit, B);
            if(vOut < REST_SPEED){ // too slow to leave the floor
                B.dy = 0;
                worked = false;
                break;
            }
            B.dy = vOut;
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