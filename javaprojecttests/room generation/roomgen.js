var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

window.onload = function () {

    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    var mouseY = -1000;
    var mouseX = -1000;

    function playNote(frequency, duration) {
        // create Oscillator node
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        gainNode.gain.value = 0;
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.02); // Fade in to 0.1 volume over 10ms
      
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
    function fullmod(num, mod) {
        return ((num % mod) + mod) % mod;
    }

    var clicked = false;
    var pressed = false;
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
    var keys = [];
    window.addEventListener("keydown", (event) => {
        keys[event.key] = true;
    });
    window.addEventListener("keyup", (event) => {
        keys[event.key] = false;
    });
    
    var camera = {
        x: window.innerWidth/2,
        y: window.innerHeight/2,
        zoom: 1,
        gridsize: 25,
        relativegridsize: 25,
        depth: 10,
    }
    var roomgrid = [
        {
        x:[0,0,0,0,0,0,0,0,0,0,0],
        y:[0,0,0,0,0,0,0,0,0,0,0],
        w:12,
        h:12,
        id:-2,
        depth:11,
    }
    ];
    var glue = [

    ];//basically sucessfull nodes
    var nodes = [
        {
        x:[0,0,0,0,0,0,0,0,0,0,12],
        y:[0,0,0,0,0,0,0,0,0,0,6],
        depth:11,
        },
        {
        x:[0,0,0,0,0,0,0,0,0,0,6],
        y:[0,0,0,0,0,0,0,0,0,0,12],
        depth:11,
        },
        {
        x:[-1,15,15,15,15,15,15,15,15,15,15],
        y:[0,0,0,0,0,0,0,0,0,0,6],
        depth:11,
        },
        {
        x:[0,0,0,0,0,0,0,0,0,0,6],
        y:[-1,15,15,15,15,15,15,15,15,15,15],
        depth:11,
        },
    ];
    function coordcomparsion(c1, c2, cond){
        var minlength = Math.min(c1.length, c2.length);
        if(cond == ">"){
            for(var i = 0; i < minlength; i++) {
                if(c1[i] == c2[i]) continue; //idk could be a tie lets see
                if(c1[i] > c2[i]) return true;
                if(c1[i] < c2[i]) return false;
            }
            return false; //they are EXACLTLY equal
        }
        if(cond == "<"){
            for(var i = 0; i < minlength; i++) {
                if(c1[i] == c2[i]) continue; //idk could be a tie lets see
                if(c1[i] > c2[i]) return false;
                if(c1[i] < c2[i]) return true;
            }
            return false; //they are EXACLTLY equal
        }
        if(cond == "="){
            for(var i = 0; i < minlength; i++) {
                if(c1[i] == c2[i]) continue; //idk could be a tie lets see
                if(c1[i] > c2[i]) return false;
                if(c1[i] < c2[i]) return false;
            }
            return true; //they are EXACLTLY equal
        }
        if(cond == ">="){
            for(var i = 0; i < minlength; i++) {
                if(c1[i] == c2[i]) continue; //idk could be a tie lets see
                if(c1[i] > c2[i]) return true;
                if(c1[i] < c2[i]) return false;
            }
            return true; //they are EXACLTLY equal
        }
        if(cond == "<="){
            for(var i = 0; i < minlength; i++) {
                if(c1[i] == c2[i]) continue; //idk could be a tie lets see
                if(c1[i] > c2[i]) return false;
                if(c1[i] < c2[i]) return true;
            }
            return true; //they are EXACLTLY equal
        }
    }

    function boxcollide(x1, y1, w1, h1, d1, x2, y2, w2, h2, d2, cond) {
        //presume the boxes have the same depth
        //check neighboring boxes for collision
        if(d1 != d2 && cond == "sizematters") return false;
        
        var Aleft, Aright, Atop, Abottom, Bleft, Bright, Btop, Bbottom;
        Aleft = x1;
        Aright = changeposition(x1, easyoffset(d1, d1, w1));
        Atop = y1;
        Abottom = changeposition(y1, easyoffset(d1, d1, h1));
        Bleft = x2;
        Bright = changeposition(x2, easyoffset(d2, d2, w2));
        Btop = y2;
        Bbottom = changeposition(y2, easyoffset(d2, d2, h2));

        //Aleft - Bright && Aright - Bleft && Atop - Bbottom && Abottom - Btop
        
        if(coordcomparsion(Aright,  Bleft, "<=") || coordcomparsion(Aleft,  Bright, ">=") || coordcomparsion(Abottom,  Btop, "<=") || coordcomparsion(Atop,  Bbottom, ">=")) {
            return false;
        }
        //they are most definetly colliding
        return true;
    }

    function Gzoom(multiplier) {
        camera.zoom *= multiplier;
        //keep the camera centered at the center of the window
        camera.x -= (window.innerWidth/2 - camera.x) * (multiplier-1);
        camera.y -= (window.innerHeight/2 - camera.y) * (multiplier-1);

        camera.gridsize = 25*camera.zoom;
        //relativegridsize equals to gridsize, but is for showing the grid size by factors of 16
        if(camera.zoom >= 1) camera.relativegridsize = 25*Math.pow(16,(Math.log(camera.zoom)/Math.log(16))%1);
        //do the same thing but the modulus can do negative numbers
        else camera.relativegridsize = 25*Math.pow(16,(Math.log(camera.zoom)/Math.log(16))%1+1);
        camera.depth = Math.ceil(Math.log(camera.zoom)/Math.log(16))+10;
    }

    function changeposition(inpu, add){
        var input = [...inpu];
        if (input.length > add.length) add = [...add, ...Array(input.length-add.length).fill(0)];
        if (input.length < add.length) input = [...input, ...Array(add.length-input.length).fill(0)];
        for(var i = input.length-1; i >= 0; i--) {
            input[i] += add[i];
            if (i != 0) input[i-1] += Math.floor(input[i]/16);
            if (i != 0) input[i] = fullmod(input[i], 16);

        }
        return input;

    }
    function easyoffset(neededdepth, depth, amount){
        return [...Array(depth-1).fill(0), amount, ...Array(neededdepth-depth).fill(0)];
    }

    function attemptplaceblock(boxx, boxy, boxw, boxh, boxid, depth, Snode) {
        var skip = false;
        for(var i = 0; i < roomgrid.length; i++) {
            //if this already collides with a box then dont spawn and retry
            if(roomgrid[i].depth < depth && roomgrid[i].id == -1) continue;
            if(roomgrid[i].depth < depth) continue;
            if(boxcollide(boxx, boxy, boxw, boxh, depth, roomgrid[i].x, roomgrid[i].y, roomgrid[i].w, roomgrid[i].h, roomgrid[i].depth)) {
                skip = true;
                break;
            }
        }
        if(skip) return false;
        //it doesn't collide, spawn it
        roomgrid.push(
            {
                x:boxx,
                y:boxy,
                w:boxw,
                h:boxh,
                id:boxid,
                depth:depth,
            }
        )



        return true;
    }

    var vcvcv = 0;
    var vc = 16;
    function makerooms() {
        if(nodes.length == 0) return;
        var Selectednode = Math.floor(Math.random()*nodes.length);
        var Snode = nodes[Selectednode];
        //atempt this ten times (if it fails for all ten times it's just a dead end)
        var keep = false;
        var destroy = false;
        for(var J = 0; J < 10; J++){
            var h = Math.floor(Math.random()*13)+3;
            var facing = Math.floor(Math.random()*4);
            var chance = Math.random();
            var skip = false;
            for(var i = 0; i < roomgrid.length; i++) {
                //if this already collides with a box then dont spawn and retry
                if(boxcollide(Snode.x, Snode.y, 1, 1, Snode.depth, roomgrid[i].x, roomgrid[i].y, roomgrid[i].w, roomgrid[i].h, roomgrid[i].depth, "sizematters")) {
                    skip = true;
                    keep = true;
                    //juuust marking it
                    roomgrid.push(
                        {
                            x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -1)),
                            y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, -1)),
                            w:3,
                            h:3,
                            id:-1,
                            depth:Snode.depth,
                        }
                    );
                    Snode.depth++;
                    
                    break;
                }
            }
            if(skip) break;
            // if(chance < 0.7) {

            //     if(facing == 0) {
            //         if(attemptplaceblock(Snode.x, Snode.y, 1, h, roomgrid.length%2, Snode.depth, Snode)) {
            //         //also spawn a node
            //         nodes.push(
            //             {
            //                 x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, 0)),
            //                 y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, h)),
            //                 depth:Snode.depth,
            //             }
            //         );
            //         } else {
            //             continue;
            //         }

            //     }
            //     else if(facing == 1) {
            //         if(attemptplaceblock(Snode.x, Snode.y, h, 1, roomgrid.length%2, Snode.depth, Snode)) {
            //             //also spawn a node
            //             nodes.push(
            //                 {
            //                     x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, h)),
            //                     y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, 0)),
            //                     depth:Snode.depth,
            //                 }
            //             );
            //         } else {
            //                 continue;
            //         }
                    

            //     }
            //     else if(facing == 2) {
            //         if(attemptplaceblock(changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -h+1)), Snode.y, h, 1, roomgrid.length%2, Snode.depth, Snode)) {
            //             //also spawn a node
            //             nodes.push(
            //                 {
            //                     x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -h)),
            //                     y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, 0)),
            //                     depth:Snode.depth,
            //                 }
            //             );
            //         } else {
            //                 continue;
            //         }

            //     }
            //     else {
            //         if(attemptplaceblock(Snode.x, changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, -h+1)), 1, h, roomgrid.length%2, Snode.depth, Snode)) {
            //             //also spawn a node
            //             nodes.push(
            //                 {
            //                     x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, 0)),
            //                     y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, -h)),
            //                     depth:Snode.depth,
            //                 }
            //             );
            //         } else {
            //                 continue;
            //         }
            //     }
            // } else {
            //     var h = Math.floor(Math.random()*11)+4;
            //     var theid = (roomgrid.length%2)+3
            //     if(chance < 0.71) h = Math.floor(Math.random()*32)+32;
            //     if(chance < 0.71) theid = -2;
            //     var h2 = Math.floor(Math.random()*(h-1))+1;
            //     if(attemptplaceblock(changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -h2)), Snode.y, h, h, theid, Snode.depth, Snode)) {
            //         //also spawn a node
            //         destroy = true;
            //         nodes.push(
            //             {
            //                 x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -h2)),
            //                 y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, h)),
            //                 depth:Snode.depth,
            //             }
            //         );
            //         nodes.push(
            //             {
            //                 x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, h-h2)),
            //                 y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, Math.floor(h/2))),
            //                 depth:Snode.depth,
            //             }
            //         );
            //         nodes.push(
            //             {
            //                 x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -h2-1)),
            //                 y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, Math.floor(h/2))),
            //                 depth:Snode.depth,
            //             }
            //         );
            //         if(chance < 0.71) {
            //             nodes.push(
            //                 {
            //                     x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, h-h2)),
            //                     y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, Math.floor(h/4))),
            //                     depth:Snode.depth,
            //                 }
            //             );
            //             nodes.push(
            //                 {
            //                     x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -h2-1)),
            //                     y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, Math.floor(h/4))),
            //                     depth:Snode.depth,
            //                 }
            //             );
            //             nodes.push(
            //                 {
            //                     x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, h-h2)),
            //                     y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, Math.floor(h*(3/4)))),
            //                     depth:Snode.depth,
            //                 }
            //             );
            //             nodes.push(
            //                 {
            //                     x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -h2-1)),
            //                     y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, Math.floor(h*(3/4)))),
            //                     depth:Snode.depth,
            //                 }
            //             );
            //             nodes.push(
            //                 {
            //                     x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, h-h2-1)),
            //                     y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, h)),
            //                     depth:Snode.depth,
            //                 }
            //             );
            //             nodes.push(
            //                 {
            //                     x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, Math.floor(h/2)-h2)),
            //                     y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, h)),
            //                     depth:Snode.depth,
            //                 }
            //             );
            //         }
            //     } else {
            //         continue;
            //     }
            // }
            var h = Math.floor(Math.random()*11)+4;
            var theid = (roomgrid.length%2)+3
            if(chance < 0.01) h = Math.floor(Math.random()*32)+32;
            if(chance < 0.01) theid = -2;
            var h2 = Math.floor(Math.random()*(h));
            if(attemptplaceblock(changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -h2)), changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, 1)), h, h, theid, Snode.depth, Snode)) {
                //also spawn a node
                destroy = true;
                nodes.push(
                    {
                        x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -h2)),
                        y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, h+1)),
                        depth:Snode.depth,
                    }
                );
                nodes.push(
                    {
                        x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, h-h2)),
                        y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, Math.floor(h/2)+1)),
                        depth:Snode.depth,
                    }
                );
                nodes.push(
                    {
                        x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -h2-1)),
                        y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, Math.floor(h/2)+1)),
                        depth:Snode.depth,
                    }
                );
                if(chance < 0.01) {
                    nodes.push(
                        {
                            x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, h-h2)),
                            y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, Math.floor(h/4)+1)),
                            depth:Snode.depth,
                        }
                    );
                    nodes.push(
                        {
                            x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -h2-1)),
                            y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, Math.floor(h/4)+1)),
                            depth:Snode.depth,
                        }
                    );
                    nodes.push(
                        {
                            x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, h-h2)),
                            y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, Math.floor(h*(3/4))+1)),
                            depth:Snode.depth,
                        }
                    );
                    nodes.push(
                        {
                            x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -h2-1)),
                            y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, Math.floor(h*(3/4))+1)),
                            depth:Snode.depth,
                        }
                    );
                    nodes.push(
                        {
                            x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, h-h2-1)),
                            y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, h+1)),
                            depth:Snode.depth,
                        }
                    );
                    nodes.push(
                        {
                            x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, Math.floor(h/2)-h2)),
                            y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, h+1)),
                            depth:Snode.depth,
                        }
                    );
                }
            } else {
                continue;
            }
            break;
        }
        //if(skip)

        if(destroy) {
            glue.push(nodes[Selectednode]);
        }
        if((Math.random()*2 < 1.4 && nodes.length > 2 && !keep) || destroy) {
        nodes.splice(Selectednode, 1);
        } else {
        // if(Math.random() < 0.01 && Snode.depth > 1 && J < 3) {
        //     Snode.depth--;
        //     var testy = false;
        //     for(var i = 0; i < roomgrid.length; i++) {
        //         //if this already collides with a box then dont spawn and retry
        //         if(roomgrid[i].depth > Snode.depth) break; //its ordered by depth so we dont have to check anything smaller
        //         if(roomgrid[i].depth != Snode.depth) continue;
        //         if(boxcollide(changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -1)), changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, -1)), 3, 3, Snode.depth, roomgrid[i].x, roomgrid[i].y, roomgrid[i].w, roomgrid[i].h, roomgrid[i].depth, "sizematters")) {
        //             testy = true;
        //             break;
        //         }
        //     }
        //     if(!testy) {
        //         roomgrid.push(
        //             {
        //                 x:changeposition(Snode.x, easyoffset(Snode.depth, Snode.depth, -1)),
        //                 y:changeposition(Snode.y, easyoffset(Snode.depth, Snode.depth, -1)),
        //                 w:3,
        //                 h:3,
        //                 id:-1,
        //                 depth:Snode.depth,
        //             }
        //         );
        //     } else {
        //         Snode.depth++;
        //     }
        // }
        }

        roomgrid.sort((a, b) => a.depth - b.depth); // sort by depth so that we can render in the correct order
        //console.log(roomgrid.length);

    }

    var rend = 0, rend2 = 0;
    function update() {
        for(var Q = 0; Q < (100)+((roomgrid.length-5000)/5000)*90; Q++){
            if(roomgrid.length < 5000) {
                makerooms();
            }
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if(keys["q"]) {
            Gzoom(1.1);
        }
        if(keys["e"]) {
            Gzoom(0.9);
        }
        if(keys["ArrowUp"]) camera.y += 10;
        if(keys["ArrowDown"]) camera.y -= 10;
        if(keys["ArrowLeft"]) camera.x += 10;
        if(keys["ArrowRight"]) camera.x -= 10;

        document.getElementById("depth").innerHTML = "Depth: " + camera.depth;

        //bg
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //mouse
        ctx.fillStyle = "rgb(200, 10, 10)"
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 5, 0, Math.PI*2);
        ctx.fill();
        
        //grid
        for(var i = 0; i < 100; i++) {
            var room = roomgrid[i];
            ctx.fillStyle = "rgb(50, 50, 50)";
            ctx.fillRect(i*camera.relativegridsize+camera.x%camera.relativegridsize, 0, 1, canvas.height);
            ctx.fillRect(0, i*camera.relativegridsize+camera.y%camera.relativegridsize, canvas.width, 1);
        }
        for(var i = 0; i < 10; i++) {
            var room = roomgrid[i];
            ctx.fillStyle = "rgb(78, 78, 78)";
            ctx.fillRect(i*camera.relativegridsize*16+camera.x%(camera.relativegridsize*16), 0, 1, canvas.height);
            ctx.fillRect(0, i*camera.relativegridsize*16+camera.y%(camera.relativegridsize*16), canvas.width, 1);
        }
        rend = 0;
        rend2 = 0;
        for(var i = 0; i < roomgrid.length; i++) {
            var room = roomgrid[i];
            ctx.fillStyle = "hsl(0, 0.00%, " + ((47.10+room.depth*5)%70+30) + "%)";
            
            if(room.id == -2) ctx.fillStyle = "hsl("+ ((27+room.depth*20)%360) + ", 100.00%, 50.00%)";
            if(room.id == 0) ctx.fillStyle = "hsl("+ ((140+room.depth*20)%360) + ", 64.90%, 55.30%)";
            if(room.id == 1) ctx.fillStyle = "hsl("+ ((240+room.depth*20)%360) + ", 64.90%, 55.30%)";
            if(room.id == 2) ctx.fillStyle = "hsl("+ ((63+room.depth*20)%360) + ", 64.90%, 55.30%)";
            if(room.id == 3) ctx.fillStyle = "hsl("+ ((300+room.depth*20)%360) + ", 64.90%, 55.30%)";
            if(room.id == 4) ctx.fillStyle = "hsl("+ ((191+room.depth*20)%360) + ", 64.90%, 55.30%)";
            var actualx = 0, actualy = 0, actualw = 0, actualh = 0;
            for(var j = 0; j < room.depth; j++) {
                actualx += Math.pow(16,10-j)*room.x[j];
                actualy += Math.pow(16,10-j)*room.y[j];
            }
            actualw = room.w*Math.pow(16,11-room.depth);
            actualh = room.h*Math.pow(16,11-room.depth);
            
            rend2++;
            if(room.depth-camera.depth >= 3) break;
            if(actualx*camera.gridsize+camera.x+actualw*camera.gridsize < 0 || actualx*camera.gridsize+camera.x > canvas.width || actualy*camera.gridsize+camera.y+actualh*camera.gridsize < 0 || actualy*camera.gridsize+camera.y > canvas.height) continue;
            
            ctx.fillRect(actualx*camera.gridsize+camera.x, actualy*camera.gridsize+camera.y, camera.gridsize*actualw, camera.gridsize*actualh);
            if(room.id == -1) ctx.fillStyle = "hsl(0, 0.00%, " + ((47.10+room.depth*5)%70+35) + "%)";
            if(room.id == -1) ctx.fillRect(actualx*camera.gridsize+camera.x+camera.gridsize*actualw/20, actualy*camera.gridsize+camera.y+camera.gridsize*actualw/20, camera.gridsize*actualw/1.1, camera.gridsize*actualh/1.1);
            rend++;
        }
        if(roomgrid.length < 5000) {
        for(var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            ctx.fillStyle = "rgb(209, 209, 209)";
            var actualx = 0, actualy = 0, actualw = 0, actualh = 0;
            for(var j = 0; j < node.depth; j++) {
                actualx += Math.pow(16,10-j)*node.x[j];
                actualy += Math.pow(16,10-j)*node.y[j];
            }
            actualw = Math.pow(16,11-node.depth);
            actualh = Math.pow(16,11-node.depth);
            
            rend2++;
            //if(node.depth-camera.depth >= 3) break;
            if(actualx*camera.gridsize+camera.x+actualw*camera.gridsize < 0 || actualx*camera.gridsize+camera.x > canvas.width || actualy*camera.gridsize+camera.y+actualh*camera.gridsize < 0 || actualy*camera.gridsize+camera.y > canvas.height) continue;
            
            ctx.fillRect(actualx*camera.gridsize+camera.x, actualy*camera.gridsize+camera.y, camera.gridsize*actualw, camera.gridsize*actualh);
            rend++;
        }
        }
        for(var i = 0; i < glue.length; i++) {
            var node = glue[i];
            ctx.fillStyle = "rgb(172, 105, 105)";
            var actualx = 0, actualy = 0, actualw = 0, actualh = 0;
            for(var j = 0; j < node.depth; j++) {
                actualx += Math.pow(16,10-j)*node.x[j];
                actualy += Math.pow(16,10-j)*node.y[j];
            }
            actualw = Math.pow(16,11-node.depth);
            actualh = Math.pow(16,11-node.depth);
            
            rend2++;
            //if(node.depth-camera.depth >= 3) break;
            if(actualx*camera.gridsize+camera.x+actualw*camera.gridsize < 0 || actualx*camera.gridsize+camera.x > canvas.width || actualy*camera.gridsize+camera.y+actualh*camera.gridsize < 0 || actualy*camera.gridsize+camera.y > canvas.height) continue;
            
            ctx.fillRect(actualx*camera.gridsize+camera.x, actualy*camera.gridsize+camera.y, camera.gridsize*actualw, camera.gridsize*actualh);
            rend++;
        }
        document.getElementById("ren").innerHTML = "total obj: " + roomgrid.length + "/ looked at " + rend2 + " objects";
        document.getElementById("ren2").innerHTML = "rendered obj: " + rend;

        requestAnimationFrame(update);
        clicked = false;
    }

    // start boi
    update();
};
//we set the dark on fire
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser