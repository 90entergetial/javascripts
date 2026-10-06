var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
window.onload = function () {

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
    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    var mouseY = -1000;
    var mouseX = -1000;
    var clicked = false;
    var pressed = false;

    var state = "editing";
    document.getElementById("state").innerHTML = state;

    var data = "10/10/1000010001/0000011100/00000000000000000000000000000000000000000000000000000000000000000000000000000010011100010111111000100000000000|000000000000000000000000000000000000000000000000000000000000101000100010100100000000100000|0000000000000000000000000000000000000000000000000000000000001100000000110000011111000011110000000000";
    var Tdata = "";
    function convertdata(){
        if(data == "") return;
        d = data.split("/");
        grid.width = parseInt(d[0]);
        grid.height = parseInt(d[1]);
        startingpositions = d[2];
        endingpositions = d[3];
        positions = [];
        for(var i = 0; i < startingpositions.length; i++) {
            if(startingpositions[i] == "1") {
                positions.push({x:i, y:grid.height-1});
            }
        }
        d2 = d[4].split("|");
        for(var y = 0; y < grid.height; y++) {
            for(var x = 0; x < grid.width+1; x++) {
                if(d2[0][y*(grid.width+1)+x] == "1") {
                    moveable_walls[y][x] = true;
                } else {
                    moveable_walls[y][x] = false;
                }
            }
        }
        for(var y = 0; y < grid.height-1; y++) {
            for(var x = 0; x < grid.width; x++) {
                if(d2[1][y*(grid.width)+x] == "1") {
                    gaps[y][x] = true;
                } else {
                    gaps[y][x] = false;
                }
            }
        }
        for(var y = 0; y < grid.height; y++) {
            for(var x = 0; x < grid.width; x++) {
                if(d2[2][y*(grid.width)+x] == "1") {
                    walls[y][x] = true;
                } else {
                    walls[y][x] = false;
                }
            }
        }
    }

    function getcurrentstate(){
        Tdata = grid.width + "/" + grid.height + "/";
        Tdata += startingpositions + "/" + endingpositions + "/";
        for(var y = 0; y < grid.height; y++) {
            for(var x = 0; x < grid.width+1; x++) {
                if(moveable_walls[y][x]) {
                    Tdata += "1";
                } else {
                    Tdata += "0";
                }
            }
        }
        Tdata += "|";
        for(var y = 0; y < grid.height-1; y++) {
            for(var x = 0; x < grid.width; x++) {
                if(gaps[y][x]) {
                    Tdata += "1";
                } else {
                    Tdata += "0";
                }
            }
        }
        Tdata += "|";
        for(var y = 0; y < grid.height; y++) {
            for(var x = 0; x < grid.width; x++) {
                if(walls[y][x]) {
                    Tdata += "1";
                } else {
                    Tdata += "0";
                }
            }
        }

        document.getElementById("data").innerHTML = Tdata;
        //data = Tdata;
        console.log(Tdata);
    }

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

    let grid = {
        width:10,
        height:10,
        visual_size:50,
    }
    let moveable_walls = [

    ];
    let walls = [

    ];

    let gaps = [

    ];

    let startingpositions = "";
    let endingpositions = "";
    let positions = [];

    //walls are +1 of grid width, gaps are -1 of grid height.
    for(var y = 0; y < grid.height-1; y++) {
        gaps.push([]);
        for(var x = 0; x < grid.width; x++) {
        gaps[gaps.length-1].push(false);
        }
    }
    for(var y = 0; y < grid.height; y++) {
        moveable_walls.push([]);
        for(var x = 0; x < grid.width+1; x++) {
        moveable_walls[moveable_walls.length-1].push(false);
        }
    }
    for(var y = 0; y < grid.height; y++) {
        walls.push([]);
        for(var x = 0; x < grid.width; x++) {
        walls[walls.length-1].push(false);
        }
    }
    for(var i = 0; i < grid.width; i++) {
        startingpositions += "0";
        endingpositions += "0";
    }
    startingpositions = "1000010001";
    endingpositions = "0000011100";

    console.log(startingpositions);
    for(var i = 0; i < startingpositions.length; i++) {
        if(startingpositions[i] == "1") {
            positions.push({x:i, y:grid.height-1});
        }
    }

    //CURSOR
    let attempt_to_go_to = {x:0, y:0, holding: -1};


    function occupied(x, y){
        if(walls[y][x]){
            return true;
        }
        for(var i = 0; i < positions.length; i++){
            if(positions[i].x == x && positions[i].y == y && attempt_to_go_to.holding != i){
                return true;
            }
        }
        return false;
    }
    function massmove(x, y, tx){
        //x and y are the coords that will be moved to
        //tx is the direction of movement, -1 is left, 1 is right
        var z = [];
        if(walls[y][x]) return false;
        if(x < 0 || x > grid.width-1) return false;
        if(x < 0 && tx == -1) return false;
        if(x > grid.width-1 && tx == 1) return false;
        for(var i = 0; i < positions.length; i++){
            if(positions[i].x == x && positions[i].y == y){
                if(tx == 1){
                    if(occupied(x+1, y)){
                        if(!massmove(x+1, y, 1)){
                            return false;
                        }
                    }
                    positions[i].x++;
                    z.push(i);
                } else {
                    if(occupied(x-1, y)){
                        if(!massmove(x-1, y, -1)){
                            return false;
                        }
                    }
                    positions[i].x--;
                    z.push(i);
                }
            }
        }
        return z;
    }

    function canmoveto(x, y, tx, ty){
        var Cx = x;
        var Cy = y;
        if(ty < Cy){
            if(gaps[y-1][Cx]){
                Cy--;
                if(occupied(Cx, Cy)){
                    Cy++;
                }
            }
        }
        if(ty > Cy){
            if(gaps[y][Cx]){
                Cy++;
                if(occupied(Cx, Cy)){
                    Cy--;
                }
            }
        }
        if(tx > Cx){
            if(!moveable_walls[Cy][Cx+1]){
                Cx++;
                if(occupied(Cx, Cy)){
                    Cx--;
                }
            }
            else if(!moveable_walls[Cy][grid.width]){
                Cx++;
                if(occupied(Cx, Cy)){
                    Cx--;
                } else {
                    var Dont = false;
                    var keeptrack = [];
                    for(var i = 0; i < positions.length; i++){
                        if(positions[i].y == Cy && i != attempt_to_go_to.holding && moveable_walls[Cy][positions[i].x] && keeptrack.indexOf(i) == -1){
                            if(positions[i].x == grid.width-1 || walls[Cy][positions[i].x+1]){
                                Dont = true;
                                break;
                            } else {
                            var z = massmove(positions[i].x+1, positions[i].y, 1);
                            if(z){
                                positions[i].x++;
                                keeptrack.push(i);
                                for(var j = 0; j < z.length; j++){
                                keeptrack.push(z[j]);
                                }
                            } else {
                                Dont = true;
                            }
                            }
                        }
                    }
                    if(Dont){
                        for(var i = 0; i < keeptrack.length; i++){
                            positions[keeptrack[i]].x--;
                        }
                    }
                    if(!Dont){
                    moveable_walls[Cy].unshift(moveable_walls[Cy].pop());
                    moveable_walls[Cy][0] = false;
                    } else {
                        Cx--;
                    }
                }
            }
        }
        if(tx < Cx){
            if(x > 0 && !moveable_walls[Cy][Cx]){
                Cx--;
                if(occupied(Cx, Cy)){
                    Cx++;
                }
            }
            else if(!moveable_walls[Cy][0]){
                Cx--;
                if(occupied(Cx, Cy)){
                    Cx++;
                } else {
                    var Dont = false;
                    var keeptrack = [];
                    for(var i = 0; i < positions.length; i++){
                        if(positions[i].y == Cy && i != attempt_to_go_to.holding && x > 0 && moveable_walls[Cy][positions[i].x+1]  && keeptrack.indexOf(i) == -1){
                            if(positions[i].x == 0 || walls[Cy][positions[i].x-1]){
                                Dont = true;
                                break;
                            } else {
                            var z = massmove(positions[i].x-1, positions[i].y, -1);
                            if(z){
                                positions[i].x--;
                                keeptrack.push(i);
                                for(var j = 0; j < z.length; j++){
                                keeptrack.push(z[j]);
                                }
                            } else {
                                Dont = true;
                            }
                            }
                        }
                    }
                    if(Dont){
                        for(var i = 0; i < keeptrack.length; i++){
                            positions[keeptrack[i]].x++;
                        }
                    }
                    if(!Dont){
                    moveable_walls[Cy].shift();
                    moveable_walls[Cy].push(false);
                    } else {
                        Cx++;
                    }
                }
            }
        }
        return [Cx, Cy];
    }
    
    function update() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        //bg
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(canvas.width/2-grid.visual_size*grid.width/2, (-grid.height/2)*grid.visual_size+canvas.height/2-grid.visual_size/18, grid.visual_size*grid.width, grid.visual_size/9);
        ctx.fillRect(canvas.width/2-grid.visual_size*grid.width/2, (grid.height/2)*grid.visual_size+canvas.height/2-grid.visual_size/18, grid.visual_size*grid.width, grid.visual_size/9);
        ctx.fillRect((grid.width/2)*grid.visual_size+canvas.width/2-grid.visual_size/18, canvas.height/2-grid.visual_size*grid.height/2, grid.visual_size/9, grid.visual_size*grid.height);
        ctx.fillRect((-grid.width/2)*grid.visual_size+canvas.width/2-grid.visual_size/18, canvas.height/2-grid.visual_size*grid.height/2, grid.visual_size/9, grid.visual_size*grid.height);


        //-----------LINES-------
        for(var y = 0; y < grid.height; y++){
            for(var x = 0; x < grid.width; x++){
                ctx.fillStyle = "rgb(16, 16, 16)";
                ctx.fillRect((x-grid.width/2)*grid.visual_size+canvas.width/2+grid.visual_size/1.5/4, (y-grid.height/2)*grid.visual_size+canvas.height/2+grid.visual_size/1.5/4, grid.visual_size/1.5, grid.visual_size/1.5);
                if(walls[y][x]){
                    ctx.fillStyle = "rgb(255, 255, 255)";
                    ctx.fillRect((x-grid.width/2)*grid.visual_size+canvas.width/2, (y-grid.height/2)*grid.visual_size+canvas.height/2, grid.visual_size, grid.visual_size);
                }
                if(y > 0 && !gaps[y-1][x]){
                ctx.fillStyle = "rgb(255, 255, 255)";
                ctx.fillRect((x-grid.width/2)*grid.visual_size+canvas.width/2, (y-grid.height/2)*grid.visual_size+canvas.height/2-grid.visual_size/20, grid.visual_size, grid.visual_size/10);
                }
                if(pointonbox(mouseX,mouseY,(x-grid.width/2)*grid.visual_size+canvas.width/2+grid.visual_size/1.5/4, (y-grid.height/2)*grid.visual_size+canvas.height/2+grid.visual_size/1.5/4, grid.visual_size/1.5, grid.visual_size/1.5)){
                    attempt_to_go_to.x = x;
                    attempt_to_go_to.y = y;
                    if(clicked && state == "editing"){
                        if(walls[y][x]) {
                            walls[y][x] = false;
                        } else {
                            walls[y][x] = true;
                        }
                        clicked = false
                    }
                }
            }
        }
        for(var y = 0; y < grid.height; y++){
            for(var x = 0; x < grid.width+1; x++){
                if(moveable_walls[y][x]){
                    ctx.fillStyle = "rgb(147, 105, 179)";
                    ctx.fillRect((x-grid.width/2)*grid.visual_size+canvas.width/2-grid.visual_size/20, (y-grid.height/2)*grid.visual_size+canvas.height/2, grid.visual_size/10, grid.visual_size);
                }
                if(state == "editing"){
                    if(pointonbox(mouseX, mouseY, (x-grid.width/2)*grid.visual_size+canvas.width/2-grid.visual_size/4, (y-grid.height/2)*grid.visual_size+canvas.height/2+grid.visual_size/10, grid.visual_size/2, grid.visual_size/1.2)){
                        ctx.fillStyle = "rgba(209, 209, 209, 0.1)";
                        ctx.fillRect((x-grid.width/2)*grid.visual_size+canvas.width/2-grid.visual_size/4, (y-grid.height/2)*grid.visual_size+canvas.height/2+grid.visual_size/10, grid.visual_size/2, grid.visual_size/1.2);
                        if(clicked){
                            if(moveable_walls[y][x]) {
                                moveable_walls[y][x] = false;
                            } else {
                                moveable_walls[y][x] = true;
                            }
                            clicked = false
                        }
                    }

                    if(x < grid.width && y < grid.height-1){
                    
                        if(pointonbox(mouseX,mouseY,(x-grid.width/2)*grid.visual_size+canvas.width/2+grid.visual_size/10, (y-grid.height/2)*grid.visual_size+canvas.height/2-grid.visual_size/6+grid.visual_size, grid.visual_size/1.2, grid.visual_size/3)){
                            ctx.fillStyle = "rgba(209, 209, 209, 0.4)";
                            ctx.fillRect((x-grid.width/2)*grid.visual_size+canvas.width/2+grid.visual_size/10, (y-grid.height/2)*grid.visual_size+canvas.height/2-grid.visual_size/6+grid.visual_size, grid.visual_size/1.2, grid.visual_size/3);
                            
                            if(clicked){
                                if(gaps[y][x]) {
                                    gaps[y][x] = false;
                                } else {
                                    gaps[y][x] = true;
                                }
                                clicked = false
                            }
                        }
                    }
                }

            }
        }

        ctx.fillStyle = "rgb(134, 134, 134)";
        ctx.fillRect(5,canvas.height-55,50,50);
        //console.log(positions);

        //POSITIONS efhklsdfhlkdsjflks
        if(state == "playing" && attempt_to_go_to.x != -1 && attempt_to_go_to.holding == -1){
            for(var i = 0; i < positions.length; i++){
                if(positions[i].x == attempt_to_go_to.x && positions[i].y == attempt_to_go_to.y){
                    attempt_to_go_to.holding = i;
                }
            }
        }
        if(state == "playing" && attempt_to_go_to.x != -1 && attempt_to_go_to.holding != -1){
            if(pressed){
                var z = canmoveto(positions[attempt_to_go_to.holding].x, positions[attempt_to_go_to.holding].y, attempt_to_go_to.x, attempt_to_go_to.y);
                positions[attempt_to_go_to.holding].x = z[0];
                positions[attempt_to_go_to.holding].y = z[1];
            }
        }

        //-------POSITIONS-----
        for(var i = 0; i < positions.length; i++){
            if(i == 0){
            ctx.fillStyle = "rgb(255, 92, 77)";
            }
            if(i == 1){
            ctx.fillStyle = "rgb(77, 107, 255)";
            }
            if(i == 2){
            ctx.fillStyle = "rgb(90, 220, 43)";
            }
            if(i == 3){
            ctx.fillStyle = "rgb(189, 79, 228)";
            }
            ctx.beginPath();
            ctx.arc((positions[i].x-grid.width/2)*grid.visual_size+canvas.width/2+grid.visual_size/2, (positions[i].y-grid.height/2)*grid.visual_size+canvas.height/2+grid.visual_size/2, grid.visual_size/2.5, 0, Math.PI*2);
            ctx.fill();
        }  

        for(var i = 0; i < endingpositions.length; i++){
            if(endingpositions[i] == '1'){
            ctx.fillStyle = "rgb(162, 162, 162)";
            ctx.beginPath();
            ctx.arc((i-grid.width/2)*grid.visual_size+canvas.width/2+grid.visual_size/2, (0-grid.height/2)*grid.visual_size+canvas.height/2+grid.visual_size/2, grid.visual_size/3, 0, Math.PI*2);
            ctx.fill();
            }
        }

        if(state == "playing" && attempt_to_go_to.x != -1){
            if(pressed){
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
            }

            ctx.beginPath();
            ctx.arc((attempt_to_go_to.x-grid.width/2)*grid.visual_size+canvas.width/2+grid.visual_size/2, (attempt_to_go_to.y-grid.height/2)*grid.visual_size+canvas.height/2+grid.visual_size/2, grid.visual_size/2.5, 0, Math.PI*2);
            ctx.fill();
        }
                  

        //-----UI-----

        if(pointonbox(mouseX, mouseY, 5, canvas.height-55, 50, 50)){
            ctx.fillStyle = "rgb(161, 161, 161)";
            ctx.fillRect(5,canvas.height-55,50,50);
            if(clicked){
                getcurrentstate();
                clicked = false;
            }
        }

        ctx.fillStyle = "rgb(134, 134, 134)";
        ctx.fillRect(5,canvas.height-110,50,50);

        if(pointonbox(mouseX, mouseY, 5, canvas.height-110, 50, 50)){
            ctx.fillStyle = "rgb(161, 161, 161)";
            ctx.fillRect(5,canvas.height-110,50,50);
            if(clicked){
                convertdata();
                clicked = false;
            }
        }

        ctx.fillStyle = "rgb(134, 134, 134)";
        ctx.fillRect(5,canvas.height-55*3,50,50);

        if(pointonbox(mouseX, mouseY, 5, canvas.height-55*3, 50, 50)){
            ctx.fillStyle = "rgb(161, 161, 161)";
            ctx.fillRect(5,canvas.height-55*3,50,50);
            if(clicked){
                if(state == "editing"){
                    state = "playing";
                } else {
                    state = "editing";
                }
                document.getElementById("state").innerHTML = state;
                clicked = false;
            }
        }


        //mouse
        ctx.fillStyle = "rgb(200, 10, 10)"
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 5, 0, Math.PI*2);
        ctx.fill();

        requestAnimationFrame(update);
        clicked = false;
        attempt_to_go_to.x=-1;
        attempt_to_go_to.y=-1;
        if(!pressed){
        attempt_to_go_to.holding=-1;
        }
    }

    // start boi
    update();
};
//we set the dark on fire
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser