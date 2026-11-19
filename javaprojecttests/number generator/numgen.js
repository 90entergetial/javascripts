var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

window.onload = function () {

    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    

    let run_next_interation_after = 2000;//usually 2000
    let until_start_eval = 1000;//usually 1000
    let card_speed = 80;//usually 80
    let card_speed_max = 60;//usually 100
    let card_transition_speed = 500;//usually 500
    let card_transitions = true;//usually true

    let number_movement = true;//usually true

    // run_next_interation_after = 0;//usually 2000
    // until_start_eval = 0;//usually 1000
    // card_speed = 0;//usually 80
    // card_transition_speed = 0;//usually 500
    // card_transitions = false;//usually true

    var number, j=randomBigInt(1000000n), addtoj=0n;
    number = j;
    var number_in_parts = number.toString().split("");
    var k = document.getElementById("number");

    function rarity_to_color(r, t, X=false){
        if(r == false) r = 1;
        r = 1/r;//inverse
        /*

        r:
        <20       = common / grey
        <45       = uncommon / green
        <100      = rare / blue
        <500      = unusual / orange
        <10 ** 3  = epic / purple
        <10 ** 4  = mythical / blue-green
        <10 ** 5  = legendary / red-orange
        <10 ** 7  = unbelievable / yellow-green
        <10 ** 9  = incredible / red
        <10 ** 11 = outlier / yellow
        <10 ** 30 = improbable / pink
        >10 ** 30 = precisionerror / white

        t:
        bgcard - for the number cards
        card - for the text for number cards
        bgeval - for the background for evals
        eval - for the text for evals
        p - to see every color

        X:
        true - to preview every color, r turns into the respective rarity
        */
        if(X){
            if(r == 0) r = 0;
            if(r == 1) r = 20;
            if(r == 2) r = 45;
            if(r == 3) r = 100;
            if(r == 4) r = 500;
            if(r == 5) r = 10 ** 3;
            if(r == 6) r = 10 ** 4;
            if(r == 7) r = 10 ** 5;
            if(r == 8) r = 10 ** 6;
            if(r == 9) r = 10 ** 9;
            if(r == 10) r = 10 ** 11;
            if(r == 11) r = 10 ** 20;
        }
        r += 0.01;//just in case it's 99.9999999999
        if(t == "bgcard"){
            if(r < 20) return col.bgcard_common;
            if(r < 45) return col.bgcard_uncommon;
            if(r < 100) return col.bgcard_rare;
            if(r < 500) return col.bgcard_unusual;
            if(r < 10 ** 3) return col.bgcard_epic;
            if(r < 10 ** 4) return col.bgcard_mythical;
            if(r < 10 ** 5) return col.bgcard_legendary;
            if(r < 10 ** 6) return col.bgcard_unbelievable;
            if(r < 10 ** 9) return col.bgcard_incredible;
            if(r < 10 ** 11) return col.bgcard_outlier;
            if(r < 10 ** 20) return col.bgcard_improbable;
            return col.bgcard_precisionerror;
        }
        if(t == "card"){
            if(r < 20) return col.card_common;
            if(r < 45) return col.card_uncommon;
            if(r < 100) return col.card_rare;
            if(r < 500) return col.card_unusual;
            if(r < 10 ** 3) return col.card_epic;
            if(r < 10 ** 4) return col.card_mythical;
            if(r < 10 ** 5) return col.card_legendary;
            if(r < 10 ** 6) return col.card_unbelievable;
            if(r < 10 ** 9) return col.card_incredible;
            if(r < 10 ** 11) return col.card_outlier;
            if(r < 10 ** 20) return col.card_improbable;
            return col.card_precisionerror;
        }
        if(t == "bgeval"){
            if(r < 20) return col.bgeval_common;
            if(r < 45) return col.bgeval_uncommon;
            if(r < 100) return col.bgeval_rare;
            if(r < 500) return col.bgeval_unusual;
            if(r < 10 ** 3) return col.bgeval_epic;
            if(r < 10 ** 4) return col.bgeval_mythical;
            if(r < 10 ** 5) return col.bgeval_legendary;
            if(r < 10 ** 6) return col.bgeval_unbelievable;
            if(r < 10 ** 9) return col.bgeval_incredible;
            if(r < 10 ** 11) return col.bgeval_outlier;
            if(r < 10 ** 20) return col.bgeval_improbable;
            return col.bgeval_precisionerror;
        }
        if(t == "eval"){
            if(r < 20) return col.eval_common;
            if(r < 45) return col.eval_uncommon;
            if(r < 100) return col.eval_rare;
            if(r < 500) return col.eval_unusual;
            if(r < 10 ** 3) return col.eval_epic;
            if(r < 10 ** 4) return col.eval_mythical;
            if(r < 10 ** 5) return col.eval_legendary;
            if(r < 10 ** 6) return col.eval_unbelievable;
            if(r < 10 ** 9) return col.eval_incredible;
            if(r < 10 ** 11) return col.eval_outlier;
            if(r < 10 ** 20) return col.eval_improbable;
            return col.eval_precisionerror;
        }

    }
    function cardmaking(){
        k.replaceChildren();
        //make the cards
        while(number_in_parts.length > k.childElementCount){
            var card = document.createElement("div");
            var p = document.createElement("h1");
            p.innerHTML = number_in_parts[k.childElementCount];
            card.append(p);
            card.id = "card";
            card.style.backgroundColor =  col.bgcard_basic;
            k.append(card);
        }
    }
    cardmaking();
    function colorprev_cardmaking(){
        var k2 = document.getElementById("pnumber");
        k2.replaceChildren();
        //make the cards
        while(12 > k2.childElementCount){
            var card = document.createElement("div");
            var p = document.createElement("h1");
            const elementcount = k2.childElementCount;
            p.innerHTML = Math.floor(Math.random()*10);
            card.append(p);
            card.id = "card";
            card.style.backgroundColor = rarity_to_color(1/elementcount, "bgeval", true);
            card.style.color = rarity_to_color(1/elementcount, "eval", true);
            card.style.boxShadow = `0px 0px 10px 0px ${rarity_to_color(1/elementcount, "bgeval", true)}`
            k2.append(card);
        }
    }
    //colorprev_cardmaking();
    
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
        //number = j;
        number=randomBigInt(1000000n);
        number_in_parts = number.toString().split("");
        cardmaking();
        number_eval();
        updati();
    }

    //the transitions depending on what it's given
    function transite(ev, n){
        //[{i:Number Index, t:Typeof, n:rarity}]
        /*
        Typeof:
        0 = none
        1 = flash n
        */
        if (typeof ev.transitions !== "function") return;
        try {
            var transitions = ev.transitions(n);
            console.log(transitions);
            for(var i = 0; i < transitions.length; i++){
                const typef = transitions[i].t;
                const typei = transitions[i].i;
                if(typef == 1){
                    const K = document.getElementById("number").children[typei];
                    const rarityBGcolor = rarity_to_color(ev.rarity(n), "bgcard");
                    const raritycolor = rarity_to_color(ev.rarity(n), "card");
                    setTimeout(function(){
                        K.animate(
                        [
                            { offset: 0, easing: "ease-out" },
                            {
                                offset: 0.4,
                                transform: "translateY(-5px)",
                                backgroundColor: rarityBGcolor,
                                color: raritycolor,
                                boxShadow: `0px 0px 10px 0px ${rarityBGcolor}`
                            },
                            {
                                offset: 0.6,
                                transform: "translateY(-5px)",  
                                backgroundColor: rarityBGcolor, 
                                color: raritycolor, 
                                easing: "ease-in",
                                boxShadow: `0px 0px 10px 0px ${rarityBGcolor}`
                            },
                            {
                                offset: 1,  
                                transform: "translateY(0px)",  
                                backgroundColor: col.bgcard_basic, 
                                color: col.card_basic,
                                boxShadow: `0px 0px 10px 0px ${col.bgcard_basic}`
                            }
                        ],
                        { duration: 750, fill: "forwards" }
                        );
                    }, i*50);
                }
            }
        } catch (err) {
            console.error("transite failed:", err);
        }
    }
    //displaying the evaluations
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

            var raritycolor = "rgb(93, 92, 92)";
            var divcolor = "rgb(12, 12, 12)";
            raritycolor = rarity_to_color(1/wonned, "eval");
            divcolor = rarity_to_color(1/wonned, "bgeval");
            /*
            if(wonned > 20) raritycolor = "rgb(85, 174, 79)", divcolor = "rgb(42, 38, 38)";
            if(wonned > 500) raritycolor = "rgb(31, 94, 194)", divcolor = "rgb(46, 46, 53)";
            if(wonned > 1000) raritycolor = "rgb(251, 255, 0)", divcolor = "rgb(61, 62, 45)";
            if(wonned > 10000) raritycolor = "rgb(255, 98, 0)", divcolor = "rgb(112, 63, 30)";
            if(wonned > 100000) raritycolor = "rgb(53, 255, 235)", divcolor = "rgb(30, 109, 112)";
            */

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
                    c.innerHTML = `1 in ${addcommas(BigInt(Math.round(wonned)))}`;
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

            var raritycolor = "rgb(131, 131, 131)";
            var divcolor = "rgb(38, 38, 38)";
            raritycolor = rarity_to_color(1/wonned, "eval");
            divcolor = rarity_to_color(1/wonned, "bgeval");
            /*
            if(wonned > 20) raritycolor = "rgb(85, 174, 79)", divcolor = "rgb(42, 38, 38)";
            if(wonned > 500) raritycolor = "rgb(31, 94, 194)", divcolor = "rgb(46, 46, 53)";
            if(wonned > 1000) raritycolor = "rgb(251, 255, 0)", divcolor = "rgb(61, 62, 45)";
            if(wonned > 10000) raritycolor = "rgb(255, 98, 0)", divcolor = "rgb(112, 63, 30)";
            if(wonned > 100000) raritycolor = "rgb(53, 255, 235)", divcolor = "rgb(30, 109, 112)";
            */

            var evlcrd = document.createElement("div");
                evlcrd.id = "evlcrd";
                evlcrd.style.background = divcolor;
                evlcrd.style.boxShadow = `0px 0px 10px -2px ${divcolor}`;
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
                    c.innerHTML = `1 in ${addcommas(BigInt(Math.round(wonned)))}`;
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

                if(number_movement) transite(evali, number_in_parts);

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