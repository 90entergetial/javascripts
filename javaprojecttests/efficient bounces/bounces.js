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

    var totalpower = 0n;
    var totalhits = 0n;

    var amountofboxes = 1;

    //optional box titles set by me
    var boxtitles = ["Fibonacci", "Triangle", "Powers of Two"];
    var textsize = 48;

    var boxparts = {
        w:500,
        h:900,
        elastic: 0.01,
        blocks: [100n, 10n**5n, 10n**13n],
        box_seperation: 1.3,
    }
    //making the stats and blocks divs and blocktitles
    var stats = document.getElementById("blockstats");
    while(stats.children.length < amountofboxes){
        const para = document.createElement("div");
        para.style.position = "absolute";

        const para2 = document.createElement("p");
        para2.id = "damage";
        para2.style.position = "absolute";
        para2.innerHTML = "Power: " + addcommas(totalpower);
        para.appendChild(para2);
        const para3 = document.createElement("p");
        para3.id = "hits";
        para3.style.position = "absolute";
        para3.innerHTML = "Hits: " + addcommas(totalhits);
        para.appendChild(para3);


        stats.appendChild(para);
    }
    var blocks = document.getElementById("blocks");
    while(blocks.children.length < amountofboxes){
        const para = document.createElement("div");
        para.style.position = "absolute";
        blocks.appendChild(para);
    }
    var blocktitles = document.getElementById("blocktitles");
    while(blocktitles.children.length < amountofboxes){
        // position is set every frame in _blocks(), once the canvas has its real size
        var btitle = document.createElement("p");
        btitle.style.position = "absolute";
        btitle.style.color = "rgba(0, 0, 0, 0.1)";
        btitle.style.boxSizing = "border-box";
        btitle.style.width = boxparts.w + "px";
        btitle.style.padding = "5px";
        btitle.style.fontSize = textsize + "px";
        //btitle.innerHTML = "Power: " + bigaddcommas(ball[0].damage);
        btitle.innerHTML = boxtitles[blocktitles.children.length];
        blocktitles.appendChild(btitle);
    }
    var blockswins = document.getElementById("blockwins");
    while(blockswins.children.length < amountofboxes){
        // position is set every frame in _blocks(), once the canvas has its real size
        var btitle = document.createElement("p");
        btitle.style.position = "absolute";
        btitle.style.color = "rgba(0, 0, 0, 0.1)";
        btitle.style.boxSizing = "border-box";
        btitle.style.width = boxparts.w + "px";
        btitle.style.padding = "5px";
        btitle.style.fontSize = textsize + "px";
        //btitle.innerHTML = "Power: " + bigaddcommas(ball[0].damage);
        blockswins.appendChild(btitle);
    }
    //actual boxes
    var box = []
    for(var i = 0; i < amountofboxes; i++){
        box.push({
            w:boxparts.w,
            h:boxparts.h,
            xoffset: ((i+0.5)-amountofboxes/2)*boxparts.w*boxparts.box_seperation,
            yoffset: 0,
            elastic: boxparts.elastic,
            blocks: boxparts.blocks.slice(),
            hits: 0n,
            damage: 0n,
            time: 0,
            done: false,
            color: "rgb(19, 19, 20)",
            mutedcolor: "rgba(19, 19, 20, 0.3)",
            hitcolor: "rgba(255, 255, 255, 0.2)",
            hit_animation: 0,
        });
    }

    var ball = [];

    // Adds a separate copy of a preset ball (from ball_presets.js) into box number boxid.
    function addBall(type, boxid, speedmultiplier=1) {
        var variant = ball_variants.find(v => v.type === type);
        if(!variant){
            console.warn("addBall: no ball variant named " + type);
            return;
        }
        // {...} makes a new object, so each ball moves on its own.
        var newBall = {...variant.ball, in_box: boxid};
        // Any value written as a function gets called now (like dx and dy),
        // except real methods the ball keeps using.
        var methods = ["note", "sequence"];
        for(var key in newBall){
            if(typeof newBall[key] === "function" && !methods.includes(key)){
                newBall[key] = newBall[key]();
            }
        }
        newBall.damage = newBall.sequence(0n);
        if(speedmultiplier != 1){
            newBall.dx *= (speedmultiplier);
            newBall.dy *= (speedmultiplier);
            // gravity is acceleration, so it scales with the square of speed.
            newBall.gravity *= speedmultiplier**2;
            newBall.bouncemax *= (speedmultiplier);
        }

        ball.push(newBall);
        return newBall;
    }
    addBall("3rd Tetration", 0, 1/10);
    //addBall("fibonacci", 0,1/3);
    //addBall("triangle", 1,4.195215326500528/3);
    //addBall("powers of two", 2,1.2516743213463186/3);

    //before anything, change the damage of every ball to the 0th term of the sequence.
    for(var i = 0; i < ball.length; i++){
        ball[i].damage = ball[i].sequence(0n);
        box[ball[i].in_box].damage += ball[i].damage;
        totalpower += ball[i].damage;
    }

    for(var i = 0; i < box.length; i++){
        var heights = [];
        for(var j = 0; j < box[i].blocks.length; j++){
            heights.push(150*((j)-box[i].blocks.length/2))
        }
    }

    function _blocks(boxi) {
        var blocks = document.getElementById("blocks").children[boxi];
        while(blocks.children.length < box[boxi].blocks.length){
            const para = document.createElement("p");
            para.style.position = "absolute";
            para.style.color = box[boxi].color;
            para.style.fontSize = textsize + "px";
            para.style.transform = "translate(-50%, -50%)";
            blocks.appendChild(para);
        }
        for(var i = 0; i < box[boxi].blocks.length; i++){
            var block = blocks.children[i];
            if(box[boxi].blocks[i] == 0) {
                block.innerHTML = " ";
                continue;
            }
            block.style.color = box[boxi].color;
            if(box[boxi].blocks[i-1] == 0 || i == 0) block.style.color = box[boxi].hitcolor;
            block.innerHTML = bigaddcommas(box[boxi].blocks[i]);
            block.style.left = (canvas.width/2 + box[boxi].xoffset) + "px";
            block.style.top  = (canvas.height/2 + heights[i] + 75 + box[boxi].yoffset) + "px";
            if(box[boxi].blocks[i-1] == 0 || i == 0) block.style.top  = (canvas.height/2 + heights[i] + 75 + box[boxi].yoffset + (-5+10/(-box[boxi].hit_animation/30+2))) + "px";

            ctx.fillStyle = box[boxi].color;
            ctx.fillRect(canvas.width/2-box[boxi].w/2+box[boxi].xoffset,canvas.height/2+heights[i]+box[boxi].yoffset, box[boxi].w, 151);
            ctx.fillStyle = box[boxi].color;
            ctx.fillRect(canvas.width/2-box[boxi].w/2+10+box[boxi].xoffset,canvas.height/2+10+heights[i]+box[boxi].yoffset, box[boxi].w-20, 130);
            
            if(box[boxi].blocks[i-1] == 0 || i == 0){
            ctx.fillStyle = box[boxi].hitcolor;
            ctx.fillRect(canvas.width/2-box[boxi].w/2+box[boxi].xoffset,canvas.height/2+heights[i]+box[boxi].yoffset, box[boxi].w, 151);
            }
            
            ctx.fillStyle = "rgba(222, 226, 240, 0.98)";
            ctx.fillRect(canvas.width/2-box[boxi].w/2+10+box[boxi].xoffset,canvas.height/2+10+heights[i]+box[boxi].yoffset, box[boxi].w-20, 130);

        }

        // box title: top-left of the inside of the box (the 5px padding is set on the element)
        var btitle = document.getElementById("blocktitles").children[boxi];
        btitle.style.color = box[boxi].mutedcolor;
        btitle.style.left = (canvas.width/2 - box[boxi].w/2 + box[boxi].xoffset) + "px";
        btitle.style.top  = (canvas.height/2 - box[boxi].h/2 + box[boxi].yoffset) + "px";
        // box win: bottom-left of the inside of the box (the 5px padding is set on the element)
        var btitle = document.getElementById("blockwins").children[boxi];
        btitle.style.left = (canvas.width/2 - box[boxi].w/2 + box[boxi].xoffset) + "px";
        btitle.style.top  = (canvas.height/2 + box[boxi].h/2 + box[boxi].yoffset) + "px";
        btitle.style.transform = "translate(0, -100%)";
        btitle.style.color = box[boxi].mutedcolor;
        btitle.innerHTML = "Time Spent: ---- " + timeelapsed(Math.round((box[boxi].time*1000)/60));

        var damage = document.getElementById("blockstats").children[boxi].children[0];
        damage.style.color = box[boxi].color;
        damage.style.top = (canvas.height/2-box[boxi].h/2-10+box[boxi].yoffset) + "px";
        damage.style.left = (canvas.width/2-box[boxi].w/2+box[boxi].xoffset) + "px";
        damage.style.transform = "translate(0%, -100%)";
        damage.style.padding = "0px";
        damage.style.fontSize = textsize + "px";
        damage.style.width = (boxparts.w*1.5) + "px";
        //damage.innerHTML = "Power: " + bigaddcommas(ball[0].damage);
        damage.innerHTML = "Power: " + bigaddcommas(box[boxi].damage);

        var damage = document.getElementById("blockstats").children[boxi].children[1];
        damage.style.color = box[boxi].color;
        damage.style.top = (canvas.height/2+box[boxi].h/2-10+box[boxi].yoffset) + "px";
        damage.style.left = (canvas.width/2-box[boxi].w/2+box[boxi].xoffset) + "px";
        damage.style.transform = "translate(0%, 50%)";
        damage.style.padding = "0px";
        damage.style.fontSize = textsize + "px";
        damage.style.width = (boxparts.w*1.5) + "px";
        //damage.innerHTML = "Hits: " + addcommas(ball[0].hits);
        damage.innerHTML = "Hits: " + addcommas(box[boxi].hits);

    }
    function damage(i, B, sound, balli, boxi) {
        B.hits += 1;
        box[boxi].hits += 1n;
        box[boxi].blocks[i] -= B.damage;
        totalpower -= B.damage;
        box[boxi].damage -= B.damage;
        B.damage = ball[balli].sequence(box[boxi].hits);
        totalpower += B.damage;
        box[boxi].damage += B.damage;
        totalhits += 1n;
        box[boxi].hit_animation = 30;
        if(box[boxi].blocks[i] <= 0) {
            var note = ball[balli].note(B.hits, "break");
            playNote(note[0], note[1], note[2], note[3], note[4]);
        }
        else if(sound && ball[balli].note(B.hits, "checkmax")) {
            var note = ball[balli].note(B.hits, "sound");
            playNote(note[0], note[1], note[2], note[3], note[4]);
        }
        box[boxi].blocks[i] = cst(box[boxi].blocks[i], 0, box[boxi].blocks[i]);
    }

    // The y the ball's center sits at when touching the floor:
    // the top of the first live block, or the bottom of the box if none are left.
    function floorY(B, box_) {
        for(var i = 0; i < box_.blocks.length; i++){
            if(box_.blocks[i] != 0) return { y: B.r - heights[i], block: i };
        }
        return { y: -box_.h/2 + B.r, block: -1 };
    }

    function bounceSpeed(v, B) {
        return cst(Math.abs(v*B.bounciness), box.elastic, B.bouncemax);
    }

    const REST_SPEED = 0; // bounces slower than this count as "at rest"
    const MAX_HITS_PER_STEP = 2000000; // safety cap so a step can never loop forever

    function step(B, i) {

        // the box the ball is in
        var box_ = box[B.in_box];

        // x has no acceleration, so mirroring the overshoot is already exact
        B.x += B.dx;
        if(Math.abs(B.x)+B.r > box_.w/2){
            B.dx = -B.dx;
            var diff = Math.abs((box_.w/2)-(Math.abs(B.x)+B.r));
            B.x += 2 * diff * sign(B.dx);
        }

        // y: move along the exact curve  y(t) = y0 + v0*t - g*t^2/2  for one frame (t from 0 to 1).
        // If it hits something partway, stop at the moment of contact, bounce,
        // then use the rest of the frame with the new velocity.
        var g = B.gravity;
        var ceil = box_.h/2 - B.r;
        var T = 1; // time left in this frame

        for(var n = 0; n < MAX_HITS_PER_STEP && T > 0; n++){
            var fl = floorY(B, box_);
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
            // If the ball is on the floor, stop the timer.
            if(fl.block < 0){
                B.dy = a*10;
                //To get the exact time, remove by the amount of time remaining in the frame:
                if(!box[ball[i].in_box].done) {
                    box[ball[i].in_box].time += 1-T;
                    if(firstwin[0] == -1) {
                        firstwin[0] = box[ball[i].in_box].time;
                        console.log("first win: " + box[ball[i].in_box].time + "ms, box #" + ball[i].in_box);
                    } else {
                        console.log("Won at " + box[ball[i].in_box].time + "ms; ");
                        console.log((box[ball[i].in_box].time)/(firstwin[0]) + "x longer than fastest, box #" + ball[i].in_box);
                    }
                }
                box[ball[i].in_box].done = true;
                continue;
            }
            if(Math.abs(vHit) < REST_SPEED){ // already resting on the floor
                B.dy = 0;
                break;
            }
            if(fl.block >= 0 && n < 10) damage(fl.block, B, true, i, B.in_box);
            else if(fl.block >= 0) damage(fl.block, B, false, i, B.in_box);
            var vOut = bounceSpeed(vHit, B);
            if(vOut < REST_SPEED){ // too slow to leave the floor
                B.dy = 0;
                break;
            }
            B.dy = vOut;
        }

    }
    var firstwin = [-1];
    var run = true;
    var play = -3;
    // start after some time
    setInterval(() => {
        if(run) play+=1;
        else play = -3;
    }, 250);

    function update() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if(play >= 0) {
            //play the ones by the amount in each box, not all of them so one doesn't start before the other
            var insections = [];
            for(var i = 0; i < amountofboxes; i++){
                insections.push([]);
            }
            for(var i = 0; i < ball.length; i++){
                insections[ball[i].in_box].push(i);
            }

            for(var j = 0; j < insections.length; j++){
                for(var i = 0; i < Math.min(play, insections[j].length); i++){
                    step(ball[insections[j][i]], insections[j][i]);
                }
            }
        }
        //bg
        ctx.fillStyle = "rgb(222, 226, 240)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for(var i = 0; i < box.length; i++){

            //get the average color of all the balls inside the box
            var r = 0, g = 0, b = 0, count = 0;
            for(var j = 0; j < ball.length; j++){
                if(ball[j].in_box == i){
                    count+=1;
                    var rgb = toRGB(ball[j].color);
                    r += rgb[0];
                    g += rgb[1];
                    b += rgb[2];
                }
            }
            if(count == 0) {
                box[i].color = "rgb(19, 19, 20)"; // empty box: avoid dividing by 0
                box[i].mutedcolor = "rgba(19, 19, 20, 0.3)";
                box[i].hitcolor = "rgb(255, 255, 255)";
            } else {
                box[i].color = "rgb(" + (r/count) + ", " + (g/count) + ", " + (b/count) + ")";
                box[i].mutedcolor = "rgba(" + (r/count) + ", " + (g/count) + ", " + (b/count) + ", 0.3)";
                box[i].hitcolor = "rgb(" + ((r*(1+box[i].hit_animation/200))/count) + ", " + ((g*(1+box[i].hit_animation/200))/count) + ", " + ((b*(1+box[i].hit_animation/200))/count) + ")";
            }

            if(box[i].hit_animation > 0) box[i].hit_animation -= 1;
            if(box[i].hit_animation <= 0) box[i].hit_animation = 0;

            ctx.fillStyle = "rgb(19, 19, 20)";
            ctx.fillRect(canvas.width/2-box[i].w/2-15+box[i].xoffset,canvas.height/2-box[i].h/2-15+box[i].yoffset, box[i].w+30, box[i].h+30);
            
            ctx.fillStyle = box[i].color;
            ctx.fillRect(canvas.width/2-box[i].w/2-10+box[i].xoffset,canvas.height/2-box[i].h/2-10+box[i].yoffset, box[i].w+20, box[i].h+20);

            ctx.fillStyle = box[i].hitcolor;
            ctx.fillRect(canvas.width/2-box[i].w/2-10+box[i].xoffset,canvas.height/2-box[i].h/2-10+box[i].yoffset, box[i].w+20, box[i].h+20);
            
            ctx.fillStyle = box[i].color;
            ctx.fillRect(canvas.width/2-box[i].w/2+box[i].xoffset,canvas.height/2-box[i].h/2+box[i].yoffset, box[i].w, box[i].h);
            ctx.fillStyle = "rgba(222, 226, 240, 0.98)";
            ctx.fillRect(canvas.width/2-box[i].w/2+box[i].xoffset,canvas.height/2-box[i].h/2+box[i].yoffset, box[i].w, box[i].h);
            _blocks(i);
            if(!box[i].done && run && play >= 0) box[i].time += 1; // in frames
        }
        //ball
        for(var i = 0; i < ball.length; i++){
        ctx.fillStyle = ball[i].color;
        ctx.beginPath();
        ctx.arc(canvas.width/2-ball[i].x+box[ball[i].in_box].xoffset, canvas.height/2-ball[i].y+box[ball[i].in_box].yoffset, ball[i].r, 0, Math.PI*2);
        ctx.fill();
        }

        //mouse
        // ctx.fillStyle = "rgb(200, 10, 10)"
        // ctx.beginPath();
        // ctx.arc(mouseX, mouseY, 5, 0, Math.PI*2);
        // ctx.fill();

        requestAnimationFrame(update);
        clicked = false;
    }

    // Turns any CSS color ("rgb(...)", "hsl(...)", "#abc", "red", ...) into [r, g, b].
    // The browser does the conversion: give a canvas a color, and reading it back
    // gives "#rrggbb" (or "rgba(r, g, b, a)" if the color is see-through).
    var colorCtx = document.createElement("canvas").getContext("2d");
    function toRGB(color){
        colorCtx.fillStyle = "#000";
        colorCtx.fillStyle = color;
        var c = colorCtx.fillStyle;
        if(c[0] == "#"){
            return [
                parseInt(c.slice(1, 3), 16),
                parseInt(c.slice(3, 5), 16),
                parseInt(c.slice(5, 7), 16),
            ];
        }
        var nums = c.match(/[\d.]+/g);
        return [parseFloat(nums[0]), parseFloat(nums[1]), parseFloat(nums[2])];
    }

    // start boi
    update();
};
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser