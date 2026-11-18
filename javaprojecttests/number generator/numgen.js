var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

window.onload = function () {

    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    


    let run_next_interation_after = 2000;//usually 2000
    let until_start_eval = 1000;//usually 1000
    let card_speed = 80;//usually 80
    let card_speed_max = 20;//usually 100
    let card_transition_speed = 500;//usually 500
    let card_transitions = true;//usually true

    // run_next_interation_after = 0;//usually 2000
    // until_start_eval = 0;//usually 1000
    // card_speed = 0;//usually 80
    // card_transition_speed = 0;//usually 500
    // card_transitions = false;//usually true

    var number, j=randomBigInt(1000000n), addtoj=0n;
    j = 11111n;
    number = j;
    var number_in_parts = number.toString().split("");
    var k = document.getElementById("number");
    
    function cardmaking(){
        k.replaceChildren();
        //make the cards
        while(number_in_parts.length > k.childElementCount){
            var card = document.createElement("div");
            var p = document.createElement("h1");
            p.innerHTML = number_in_parts[k.childElementCount];
            card.append(p);
            card.id = "card";
            k.append(card);
        }
    }
    cardmaking();
    
    function updati() {
        var I = document.getElementById("i");
        I.innerHTML = j;
        if(addtoj != 0){
            let II = document.getElementById("ii");
            II.innerHTML = `+${addtoj}`;
        } else {
            let II = document.getElementById("ii");
            II.innerHTML = `...`;
        }
    }
    updati();
    var succesfull_evals = [];
    function reiterate(){
        succesfull_evals = [];
        addtoj = 0n;
        number = j;
        number_in_parts = number.toString().split("");
        cardmaking();
        number_eval();
        updati();
    }

    function transite(ev, n){
        //[{i:Number Index, t:Typeof}]
        /*
        Typeof:
        0 = none
        1 = flash green
        */
        if (typeof ev.transitions !== "function") return;
        try {
            var transitions = ev.transitions(n);
            console.log(transitions);
            for(var i = 0; i < transitions.length; i++){
                let typef = transitions[i].t;
                let typei = transitions[i].i;
                if(typef == 1){
                    var K = document.getElementById("number").children[typei];
                    console.log(K);
                    K.animate(
                    [
                        { offset: 0,   transform: "translateY(0px)",  backgroundColor: col.cardbasic,  easing: "ease-out" },
                        { offset: 0.4, transform: "translateY(-5px)", backgroundColor: col.cardhighlight},
                        { offset: 0.6, transform: "translateY(-5px)", backgroundColor: col.cardhighlight, easing: "ease-in" },
                        { offset: 1,   transform: "translateY(0px)",  backgroundColor: col.cardbasic }
                    ],
                    { duration: 750, fill: "forwards" }
                    );
                }
            }
        } catch (err) {
            console.error("transite failed:", err);
        }
    }
    function show_succesfull_evals(){
        
        var evals = document.getElementById("evals");
        evals.replaceChildren();

        var c = document.createElement("div");
        c.innerHTML = `${succesfull_evals.length} evals`;
        c.id = "num_evals"
        evals.append(c);

        //show all at once
        if(!card_transitions){
        for(var i = 0; i < succesfull_evals.length; i++){
            var evali = evaluations[succesfull_evals[i].id];
            var wonned = succesfull_evals[i].rarity;

            var add_this = BigInt(Math.round(wonned)*(2**number_in_parts.length));

            var raritycolor = "rgb(178, 178, 178)";
            var divcolor = "rgb(12, 12, 12)";
            if(wonned > 20) raritycolor = "rgb(85, 174, 79)", divcolor = "rgb(42, 38, 38)";
            if(wonned > 500) raritycolor = "rgb(31, 94, 194)", divcolor = "rgb(46, 46, 53)";
            if(wonned > 1000) raritycolor = "rgb(251, 255, 0)", divcolor = "rgb(61, 62, 45)";
            if(wonned > 10000) raritycolor = "rgb(255, 98, 0)", divcolor = "rgb(112, 63, 30)";
            if(wonned > 100000) raritycolor = "rgb(53, 255, 235)", divcolor = "rgb(30, 109, 112)";

            var evlcrd = document.createElement("div");
                evlcrd.id = "evlcrd";
                evlcrd.style.background = divcolor;
                evlcrd.style.boxShadow = `0px 0px 10px -3px ${raritycolor}`;
                    var s1 = document.createElement("div");
                    s1.style.display = "flex";
                    s1.style.alignItems = "center";
                        var c = document.createElement("h1");
                        c.innerHTML = `${evali.name}`;
                        c.style.color = raritycolor;
                    s1.append(c);
                        var c = document.createElement("p");
                        c.innerHTML = `+${addcommas(add_this)}`;
                        c.style.color = raritycolor;
                    s1.append(c);
                evlcrd.append(s1);
                    var c = document.createElement("div");
                    c.innerHTML = `1 in ${BigInt(Math.round(wonned))}`;
                        c.style.color = raritycolor;
                    c.id = "prob"
                evlcrd.append(c);
                    var c = document.createElement("div");
                    c.innerHTML = `${evali.desc}`;
                    c.style.color = raritycolor;
                    c.id = "c_desc"
                evlcrd.append(c);
                evals.append(evlcrd);
                evlcrd.animate(
                [
                    { transform: "translateY(-10px)", opacity: 0 },
                    { transform: `translateY(0px))`, opacity: 1 }
                ],
                { duration: 500, easing: "ease-out", fill: "forwards" }
                );

            addtoj += add_this;
            j += add_this;
            updati();
        }
        setTimeout(function(){reiterate();},run_next_interation_after);
        } else {
        //show one by one
        var i = succesfull_evals.length-1;
        var speed = 10;
        var timer = setInterval(function(){
            if(i < 0){
                clearInterval(timer);
                setTimeout(function(){reiterate();},run_next_interation_after);
                return;
            }
            if(i >= 0 && speed <= 0){
            var evali = evaluations[succesfull_evals[i].id];
            var wonned = succesfull_evals[i].rarity;

            var add_this = BigInt(Math.round(wonned)*(2**number_in_parts.length));

            var raritycolor = "rgb(178, 178, 178)";
            var divcolor = "rgb(38, 38, 38)";
            if(wonned > 20) raritycolor = "rgb(85, 174, 79)", divcolor = "rgb(42, 38, 38)";
            if(wonned > 500) raritycolor = "rgb(31, 94, 194)", divcolor = "rgb(46, 46, 53)";
            if(wonned > 1000) raritycolor = "rgb(251, 255, 0)", divcolor = "rgb(61, 62, 45)";
            if(wonned > 10000) raritycolor = "rgb(255, 98, 0)", divcolor = "rgb(112, 63, 30)";
            if(wonned > 100000) raritycolor = "rgb(53, 255, 235)", divcolor = "rgb(30, 109, 112)";

            var evlcrd = document.createElement("div");
                evlcrd.id = "evlcrd";
                evlcrd.style.background = divcolor;
                evlcrd.style.boxShadow = `0px 0px 10px -3px ${raritycolor}`;
                    var s1 = document.createElement("div");
                    s1.style.display = "flex";
                    s1.style.alignItems = "center";
                        var c = document.createElement("h1");
                        c.innerHTML = `${evali.name}`;
                        c.style.color = raritycolor;
                    s1.append(c);
                        var c = document.createElement("p");
                        c.innerHTML = `+${addcommas(add_this)}`;
                        c.style.color = raritycolor;
                    s1.append(c);
                evlcrd.append(s1);
                    var c = document.createElement("div");
                    c.innerHTML = `1 in ${BigInt(Math.round(wonned))}`;
                        c.style.color = raritycolor;
                    c.id = "prob"
                evlcrd.append(c);
                    var c = document.createElement("div");
                    c.innerHTML = `${evali.desc}`;
                    c.style.color = raritycolor;
                    c.id = "c_desc"
                evlcrd.append(c);
                evals.insertBefore(evlcrd, evals.firstChild.nextSibling);
                evlcrd.animate(
                [
                    { transform: "translateY(-10px)", opacity: 0 },
                    { transform: `translateY(0px)`, opacity: 1 }
                ],
                { duration: card_transition_speed, easing: "ease-out", fill: "forwards" }
                );

                transite(evali, number_in_parts);

            addtoj += add_this;
            j += add_this;
            updati();
            i--;
            }
            if(speed <= 0){
                speed = Math.max((evals.childElementCount/(succesfull_evals.length))*card_speed,card_speed_max);
            }
            if(speed > 0){
                speed -= 1;
            }
        }, 10);
        }

    }
    function number_eval() {
        setTimeout(function(){
        //number_in_parts
        for(var i = 0; i < evaluations.length; i++){
            var evali = evaluations[i];
            if(evali.find(number_in_parts)){
                let wonned = (1/evali.rarity(number_in_parts));
                succesfull_evals.push({id: i, rarity: wonned});
            }
        }
        succesfull_evals.sort((a,b) => b.rarity - a.rarity);
        show_succesfull_evals();
        }, until_start_eval);
    }
    number_eval();

    // setInterval(function(){
    //     succesfull_evals = [];
    //     addtoj = 0n;
    //     number = j;
    //     number_in_parts = number.toString().split("");
    //     cardmaking();
    //     number_eval();
    // }, 100000000);

    // var h = 2;
    // var lotto = [0, []];
    // var x = setInterval(function(){
    //     for(var j = 0; j < 1000; j++){
    //         if(h <= 1000000){
    //             var H = h.toString().split("");
    //             var s_e = [];
    //             for(var i = 0; i < evaluations.length; i++){
    //                 var evali = evaluations[i];
    //                 if(evali.find(H)){
    //                     s_e.push({id: i});
    //                 }
    //             }
    //             if(lotto[0] == s_e.length){
    //                 lotto[1].push(h);
    //             }
    //             else if(lotto[0] < s_e.length){
    //                 lotto = [s_e.length, [h]];
    //             }
    //             h++;
    //         } else {
    //             console.log("done!");
    //             console.log(h + " " + lotto[0] + " numbers: " + lotto[1]);
    //             clearInterval(x);
    //             return;
    //         }
    //     }
    //     console.log("Currently " + h + " " + lotto[0] + " " + lotto[1]);
        
    // }, 100);

    //background stuffs
    function update() {
        if(window.innerWidth != canvas.width) canvas.width = window.innerWidth;
        if(window.innerHeight != canvas.height) canvas.height = window.innerHeight;


        requestAnimationFrame(update);
    }

    // start boi
    update();
};
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser