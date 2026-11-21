var a = 1;
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

window.onload = function () {

    const canvas = document.getElementById("cav");
    const ctx = canvas.getContext("2d");
    

    let run_next_interation_after = 3000;//usually 2000
    let until_start_eval = 1000;//usually 1000
    let card_speed = 1000;//usually 1000, in ms - slowest gap between eval cards (the rarest one, at index 0)
    let card_speed_max = 450;//usually 450, in ms - fastest gap between eval cards (the most common one, shown first)
    let card_transition_speed = 500;//usually 500
    let card_transitions = true;//usually true

    let number_movement = true;//usually true
    let number_movement_offset = 50;//usually 50, in ms
    let number_movement_duration = 750;//usually 750, in ms
    let number_movement_overlap = 150;//usually 150, in ms

    // run_next_interation_after = 0;//usually 2000
    // until_start_eval = 0;//usually 1000
    // card_speed = 0;//usually 80
    // card_transition_speed = 0;//usually 500
    // card_transitions = false;//usually true

    var number, j=randomBigInt(10000000n), addtoj=0n;
    number = j;
    var delayed_addtoj = addtoj;
    var delayed_number = number;
    var number_in_parts = number.toString().split("");
    var k = document.getElementById("number");

    function rarity_to_color(r, t, X=false){
        if(r == false) r = 1;
        r = 1/r;//inverse
        r = Math.round(r);
        /*

        r:
        <20       = common / grey
        <50       = uncommon / green
        <200      = rare / blue
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
        rarity - gives the rarity
        indication - brightest of the rarities

        X:
        increment - to preview every color, r turns into the respective rarity
        */
        const ra = [
            20,
            50,
            200,
            500,
            10 ** 3,
            10 ** 4,
            10 ** 5,
            10 ** 7,
            10 ** 9,
            10 ** 11,
            10 ** 30
        ];
        if(X == "increment"){
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
        if(X == "compliment"){
            if(r < ra[0]) r = ra[0] -1;
            else if(r < ra[1]) r = ra[0] +1;
            else if(r < ra[2]) r = ra[0] +1;
            else if(r < ra[3]) r = ra[1] +1;
            else if(r < ra[4]) r = ra[2] +1;
            else if(r < ra[5]) r = ra[3] +1;
            else if(r < ra[6]) r = ra[4] +1;
            else if(r < ra[7]) r = ra[5] +1;
            else if(r < ra[8]) r = ra[6] +1;
            else if(r < ra[9]) r = ra[7] +1;
            else if(r < ra[10]) r = ra[8] +1;
            else r = ra[9] + 1;
        }
        if(t == "rarity"){
            if(r < ra[0]) return "common";
            if(r < ra[1]) return "uncommon";
            if(r < ra[2]) return "rare";
            if(r < ra[3]) return "unusual";
            if(r < ra[4]) return "epic";
            if(r < ra[5]) return "mythical";
            if(r < ra[6]) return "legendary";
            if(r < ra[7]) return "unbelievable";
            if(r < ra[8]) return "incredible";
            if(r < ra[9]) return "outlier";
            if(r < ra[10]) return "improbable";
            return "precision error";
        }
        if(t == "bgcard"){
            if(r < ra[0]) return col.bgcard_common;
            if(r < ra[1]) return col.bgcard_uncommon;
            if(r < ra[2]) return col.bgcard_rare;
            if(r < ra[3]) return col.bgcard_unusual;
            if(r < ra[4]) return col.bgcard_epic;
            if(r < ra[5]) return col.bgcard_mythical;
            if(r < ra[6]) return col.bgcard_legendary;
            if(r < ra[7]) return col.bgcard_unbelievable;
            if(r < ra[8]) return col.bgcard_incredible;
            if(r < ra[9]) return col.bgcard_outlier;
            if(r < ra[10]) return col.bgcard_improbable;
            return col.bgcard_precisionerror;
        }
        if(t == "card"){
            if(r < ra[0]) return col.card_common;
            if(r < ra[1]) return col.card_uncommon;
            if(r < ra[2]) return col.card_rare;
            if(r < ra[3]) return col.card_unusual;
            if(r < ra[4]) return col.card_epic;
            if(r < ra[5]) return col.card_mythical;
            if(r < ra[6]) return col.card_legendary;
            if(r < ra[7]) return col.card_unbelievable;
            if(r < ra[8]) return col.card_incredible;
            if(r < ra[9]) return col.card_outlier;
            if(r < ra[10]) return col.card_improbable;
            return col.card_precisionerror;
        }
        if(t == "bgeval"){
            if(r < ra[0]) return col.bgeval_common;
            if(r < ra[1]) return col.bgeval_uncommon;
            if(r < ra[2]) return col.bgeval_rare;
            if(r < ra[3]) return col.bgeval_unusual;
            if(r < ra[4]) return col.bgeval_epic;
            if(r < ra[5]) return col.bgeval_mythical;
            if(r < ra[6]) return col.bgeval_legendary;
            if(r < ra[7]) return col.bgeval_unbelievable;
            if(r < ra[8]) return col.bgeval_incredible;
            if(r < ra[9]) return col.bgeval_outlier;
            if(r < ra[10]) return col.bgeval_improbable;
            return col.bgeval_precisionerror;
        }
        if(t == "eval"){
            if(r < ra[0]) return col.eval_common;
            if(r < ra[1]) return col.eval_uncommon;
            if(r < ra[2]) return col.eval_rare;
            if(r < ra[3]) return col.eval_unusual;
            if(r < ra[4]) return col.eval_epic;
            if(r < ra[5]) return col.eval_mythical;
            if(r < ra[6]) return col.eval_legendary;
            if(r < ra[7]) return col.eval_unbelievable;
            if(r < ra[8]) return col.eval_incredible;
            if(r < ra[9]) return col.eval_outlier;
            if(r < ra[10]) return col.eval_improbable;
            return col.eval_precisionerror;
        }
        if(t == "indication"){
            if(r < ra[0]) return col.indication_common;
            if(r < ra[1]) return col.indication_uncommon;
            if(r < ra[2]) return col.indication_rare;
            if(r < ra[3]) return col.indication_unusual;
            if(r < ra[4]) return col.indication_epic;
            if(r < ra[5]) return col.indication_mythical;
            if(r < ra[6]) return col.indication_legendary;
            if(r < ra[7]) return col.indication_unbelievable;
            if(r < ra[8]) return col.indication_incredible;
            if(r < ra[9]) return col.indication_outlier;
            if(r < ra[10]) return col.indication_improbable;
            return col.indication_precisionerror;
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
            card.style.backgroundColor = rarity_to_color(1/elementcount, "bgeval", "increment");
            card.style.color = rarity_to_color(1/elementcount, "eval", "increment");
            card.style.boxShadow = `0px 0px 10px 0px ${rarity_to_color(1/elementcount, "bgeval", "increment")}`
            k2.append(card);
        }
    }
    //colorprev_cardmaking();
    
    function updati() {
        var I = document.getElementById("i");
        I.innerHTML = addcommas(delayed_number);
        if(addtoj != 0){
            let II = document.getElementById("ii");
            II.innerHTML = `+${addcommas(delayed_addtoj)}`;
        } else {
            let II = document.getElementById("ii");
            II.innerHTML = `...`;
        }
    }
    updati();

    var succesfull_evals = [];
    function addcurrenttohistory() {


        let V = 1;
        for(var i = 0; i < succesfull_evals.length; i++){
            V = Math.max(succesfull_evals[i].rarity, V);
        }
        var history = document.getElementById("history_list");

            var b = document.createElement("div");
            b.className = "history_card";
                var hnum = document.createElement("div");
                hnum.className = "h_num";
                    for(var i = 0; i < number_in_parts.length; i++){
                        var B = document.createElement("div");
                        B.className = "h_card";
                        B.style.boxShadow = "0px 0px 10px 0px rgb(33, 32, 31)";
                        B.style.backgroundColor = rarity_to_color(1/V, "bgcard");
                        if(Math.round(V) < 20) B.style.backgroundColor = "rgb(38, 38, 38)";
                        B.style.color = rarity_to_color(1/V, "card");
                            var B_h = document.createElement("h1");
                            B_h.innerHTML = number_in_parts[i];
                            B_h.style.fontWeight = "bold";
                            B.append(B_h);
                        hnum.append(B);
                    }
                b.append(hnum);
                var B = document.createElement("div");
                B.id = "h_card_p";
                B.innerHTML = `${succesfull_evals.length} evals - Rolled at ${((new Date()).getHours() < 9) ? ("0" + (new Date()).getHours()) : (new Date()).getHours()}:${((new Date()).getMinutes() < 9) ? ("0" + (new Date()).getMinutes()) : (new Date()).getMinutes()}:${((new Date()).getSeconds() < 9) ? ("0" + (new Date()).getSeconds()) : (new Date()).getSeconds()}`;
                b.append(B);

                var B = document.createElement("div");
                B.className = "divider";
                b.append(B);

                var evals = document.createElement("div");
                evals.className = "h_evals";
                b.append(evals);

                var B = document.createElement("h1");
                if(Math.round(V) >= 20) B.style.background = rarity_to_color(1/V, "bgeval");
                B.innerHTML = `1 in ${addcommas(Math.round(V))} * ${rarity_to_color(1/Math.round(V), "rarity").toUpperCase()}`;
                B.style.color = rarity_to_color(1/V, "eval");
                evals.append(B);
                    for(var i = 0; i < succesfull_evals.length; i++){
                        const this_eval = evaluations[succesfull_evals[i].id];
                        var B = document.createElement("h1");
                        B.style.fontSize = `15px`;
                        B.innerHTML = `1 in ${addcommas(Math.round(succesfull_evals[i].rarity))} - ${this_eval.name} - ${this_eval.desc}`;
                        if(Math.round(succesfull_evals[i].rarity) >= 20) B.style.background = rarity_to_color(1/(succesfull_evals[i].rarity), "bgeval");
                        B.style.color = rarity_to_color(1/(succesfull_evals[i].rarity), "eval");
                        evals.append(B);
                    }
                    
        b.addEventListener("click", function(e){
            e.stopPropagation();
            openhistorydetail(b);
        });
        history_cards.push({el: b, date: history_cards.length, rarity: V, evals: succesfull_evals.length});
        sort_history();

        var CIH = document.getElementById("CIH");
        CIH.innerHTML = `${addcommas(history_cards.length)} cards in history`;
    }

    //every history card + what it can be sorted by
    //date = order it was rolled in (higher = more recent), rarity = highest rarity, evals = how many evals
    var history_cards = [];
    var history_sort = "By date-";
    var history_sorters = {
        "By date+":   function(a, b){ return b.date - a.date; },     //most recent on top
        "By date-":   function(a, b){ return a.date - b.date; },     //most recent on bottom
        "By rarity+": function(a, b){ return b.rarity - a.rarity; }, //highest rarity on top
        "By rarity-": function(a, b){ return a.rarity - b.rarity; }, //lowest rarity on top
        "By evals+":  function(a, b){ return b.evals - a.evals; },   //most evals on top
        "By evals-":  function(a, b){ return a.evals - b.evals; },   //fewest evals on top
    };
    //re-orders the cards inside history_list using the current history_sort
    function sort_history(){
        var sorter = history_sorters[history_sort] || history_sorters["By date-"];
        //ties keep date order (most recent last), so equal cards don't jump around
        var sorted = history_cards.slice().sort(function(a, b){ return sorter(a, b) || a.date - b.date; });
        //append() moves existing elements, so this just reorders them (click listeners are kept)
        document.getElementById("history_list").append(...sorted.map(function(c){ return c.el; }));
    }
    document.querySelectorAll("#dropdown .dd-content a").forEach(function(option){
        option.addEventListener("click", function(e){
            e.stopPropagation(); //don't count as a click outside the history detail
            history_sort = option.textContent.trim();
            document.getElementById("dd-button").innerHTML = history_sort;
            sort_history();
        });
    });

    function openhistorydetail(card) {
        var detail = document.getElementById("ui_history_detail");
        var list = document.getElementById("history_detail_list");
        var copy = card.cloneNode(true);
        copy.classList.add("expanded");
        list.replaceChildren(copy);
        detail.style.display = "flex";
    }

    function closehistorydetail() {
        document.getElementById("ui_history_detail").style.display = "none";
    }

    // --- resizing ui_history / ui_history_detail by dragging their edges ---
    const RESIZE_EDGE = 12; // how close (px) to the edge the pointer has to be
    const MIN_BOX = 300;
    var resizing = null; // info about the drag in progress, or null
    var justresized = false; // swallows the click that fires at the end of a drag

    // really big and complex resizing of the UI.. jeez
    function resizeedges(box, e) {
        var r = box.getBoundingClientRect();
        var x = 0, y = 0;
        if(e.clientX - r.left < RESIZE_EDGE) x = -1;
        else if(r.right - e.clientX < RESIZE_EDGE) x = 1;
        if(e.clientY - r.top < RESIZE_EDGE) y = -1;
        else if(r.bottom - e.clientY < RESIZE_EDGE) y = 1;
        return {x: x, y: y};
    }
    function resizecursor(edges) {
        if(edges.x == 0 && edges.y == 0) return "";
        if(edges.x == 0) return "ns-resize";
        if(edges.y == 0) return "ew-resize";
        return edges.x == edges.y ? "nwse-resize" : "nesw-resize";
    }
    function clampsize(w, h) {
        return {
            w: Math.min(Math.max(w, MIN_BOX), window.innerWidth * 0.9),
            h: Math.min(Math.max(h, MIN_BOX), window.innerHeight * 0.9)
        };
    }
    function setboxsize(w, h) {
        var s = clampsize(w, h);
        document.documentElement.style.setProperty("--history-w", s.w + "px");
        document.documentElement.style.setProperty("--history-h", s.h + "px");
    }
    //TBH i've never heard of a .forEach() before
    ["ui_history", "ui_history_detail"].forEach(function(id){
        var box = document.getElementById(id);
        box.addEventListener("pointermove", function(e){
            if(!resizing) box.style.cursor = resizecursor(resizeedges(box, e));
        });
        box.addEventListener("pointerdown", function(e){
            var edges = resizeedges(box, e);
            if(edges.x == 0 && edges.y == 0) return;
            e.preventDefault(); // no text selection while dragging
            var r = box.getBoundingClientRect();
            resizing = {
                edges: edges,
                startX: e.clientX,
                startY: e.clientY,
                startW: r.width,
                startH: r.height
            };
            document.body.style.cursor = resizecursor(edges);
        });
    });

    //for the UI boxes:
    window.addEventListener("pointermove", function(e){
        if(!resizing) return;
        // the box stays centered, so it grows on both sides:
        // double the movement so the dragged edge stays under the pointer
        var w = resizing.startW + 2 * resizing.edges.x * (e.clientX - resizing.startX);
        var h = resizing.startH + 2 * resizing.edges.y * (e.clientY - resizing.startY);
        setboxsize(w, h);
    });
    window.addEventListener("pointerup", function(){
        if(!resizing) return;
        resizing = null;
        document.body.style.cursor = "";
        justresized = true;
        setTimeout(function(){ justresized = false; }, 0);
    });
    document.addEventListener("click", function(e){
        if(justresized) return; // ending a drag isn't a click outside
        var detail = document.getElementById("ui_history_detail");
        if(detail && detail.style.display == "flex" && !detail.contains(e.target)){
            closehistorydetail();
        }
    });

    var number_bg_to_rarity_rarity = 0;
    function number_bg_to_rarity(t=-20){
        if(t != -20) number_bg_to_rarity_rarity = Math.max(t, number_bg_to_rarity_rarity);
        else number_bg_to_rarity_rarity = 0;
        let da = rarity_to_color(1/number_bg_to_rarity_rarity, "indication");

        let num = document.getElementById("number");
        num.animate(
            [   
                { offset: 0, easing: "ease-in-out" },
                {
                offset: 1,
                //animating the registered color (see @property --number-color in numgen.html)
                //smoothly fades both the gradient and the border, which use var(--number-color)
                "--number-color": da,
                }
            ],
            { duration: 500, fill: "forwards" }
        );
    }
    //resets everything
    function reiterate(){
        number_bg_to_rarity();
        addcurrenttohistory();
        let V = 0;
        for(var i = 0; i < succesfull_evals.length; i++){
            V += succesfull_evals[i].rarity;
        }
        console.log("Number: " + number + " | (+" + addcommas(addtoj) + ") | " + succesfull_evals.length + " successfull evals | 1 in " + addcommas(Math.round(V)));
        console.log("-----");
        for(var i = 0; i < succesfull_evals.length; i++){
        console.log(evaluations[succesfull_evals[i].id].name + " - " + evaluations[succesfull_evals[i].id].desc + " - 1 in " + addcommas(Math.round(succesfull_evals[i].rarity)));
        }
        console.log("-----");
        succesfull_evals = [];
        evals = document.getElementById("evals");
        evals.replaceChildren();
        addtoj = 0n;
        delayed_addtoj = addtoj;
        delayed_number = j;
        //number = j;
        number=randomBigInt(100000000n);
        number_in_parts = number.toString().split("");
        cardmaking();
        number_eval();
        updati();
    }

    //the transitions depending on what it's given
    //returns how long (ms) until the last number card finishes animating (0 if nothing animates)
    //Q = true: final pass, every digit plays (not just the ones the eval highlights) and
    //        ends on the color of the highest rarity reached (number_bg_to_rarity_rarity)
    //start = ms to wait before this pass begins (included in the returned time)
    function transite(ev, n, Q=false, start=0){
        //[{i:Number Index, t:Typeof, n:rarity}]
        /*
        Typeof:
        0 = none
        1 = flash n
        2 = flash comp n
        3 = flash n but don't jump
        4 = flash comp n but don't jump
        */
        if (typeof ev.transitions !== "function") return 0;
        var total_time = 0;
        try {
            var transitions = ev.transitions(n);
            if(Q){
                //include every digit; keep the eval's own type (1/2) for the digits it highlights
                var all = [];
                for(var d = 0; d < n.length; d++){
                    all.push({i: d, t: 3});
                }
                transitions = all;
            }
            //for typef 1
            var typ = [0,0,0,0,0];
            for(var i = 0; i < transitions.length; i++){
                const typef = transitions[i].t;
                const typei = transitions[i].i;
                if(typef == 1 || typef == 2){
                    const K = document.getElementById("number").children[typei];
                    let rarityBGcolor = rarity_to_color(ev.rarity(n), "bgcard");
                    let raritycolor = rarity_to_color(ev.rarity(n), "card");
                    if(typef == 2){
                        rarityBGcolor = rarity_to_color(ev.rarity(n), "bgcard", "compliment");
                        raritycolor = rarity_to_color(ev.rarity(n), "card", "compliment");
                    }
                    number_bg_to_rarity(1/ev.rarity(n));
                    let bgV = rarity_to_color(1/number_bg_to_rarity_rarity, "bgcard");
                    let V = rarity_to_color(1/number_bg_to_rarity_rarity, "card");
                    if(Q){
                    bgV = rarity_to_color(1/number_bg_to_rarity_rarity, "bgcard");
                    V = rarity_to_color(1/number_bg_to_rarity_rarity, "card");
                    } else {
                    bgV = col.bgcard_basic;
                    V = col.card_basic;
                    }
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
                                backgroundColor: bgV, 
                                color: V,
                                boxShadow: `0px 0px 10px 0px ${bgV}`
                            }
                        ],
                        { duration: number_movement_duration, fill: "forwards" }
                        );
                    }, start + typ[typef]*number_movement_offset);
                    //this card's animation ends at (its start delay + the animation length)
                    total_time = Math.max(total_time, start + typ[typef]*number_movement_offset + number_movement_duration);
                    typ[typef] += 1;
                }
                else if(typef == 3 || typef == 4){
                    const K = document.getElementById("number").children[typei];
                    let rarityBGcolor = rarity_to_color(ev.rarity(n), "bgcard");
                    let raritycolor = rarity_to_color(ev.rarity(n), "card");
                    if(typef == 4){
                        rarityBGcolor = rarity_to_color(ev.rarity(n), "bgcard", "compliment");
                        raritycolor = rarity_to_color(ev.rarity(n), "card", "compliment");
                    }
                    number_bg_to_rarity(1/ev.rarity(n));
                    let bgV = rarity_to_color(1/number_bg_to_rarity_rarity, "bgcard");
                    let V = rarity_to_color(1/number_bg_to_rarity_rarity, "card");
                    if(Q){
                    bgV = rarity_to_color(1/number_bg_to_rarity_rarity, "bgcard");
                    V = rarity_to_color(1/number_bg_to_rarity_rarity, "card");
                    } else {
                    bgV = col.bgcard_basic;
                    V = col.card_basic;
                    }
                    setTimeout(function(){
                        K.animate(
                        [
                            { offset: 0, easing: "ease-out" },
                            {
                                offset: 0.4,
                                backgroundColor: rarityBGcolor,
                                color: raritycolor,
                                boxShadow: `0px 0px 10px 0px ${rarityBGcolor}`
                            },
                            {
                                offset: 0.6,
                                backgroundColor: rarityBGcolor, 
                                color: raritycolor, 
                                easing: "ease-in",
                                boxShadow: `0px 0px 10px 0px ${rarityBGcolor}`
                            },
                            {
                                offset: 1,  
                                backgroundColor: bgV, 
                                color: V,
                                boxShadow: `0px 0px 10px 0px ${bgV}`
                            }
                        ],
                        { duration: number_movement_duration, fill: "forwards" }
                        );
                    }, start + typ[typef]*number_movement_offset);
                    //this card's animation ends at (its start delay + the animation length)
                    total_time = Math.max(total_time, start + typ[typef]*number_movement_offset + number_movement_duration);
                    typ[typef] += 1;
                }
            }
            
            const F = document.getElementById("i");
            const FF = document.getElementById("ii");
            let raritycolor = 'white';
            if(Math.round(1/ev.rarity(n)) >= 20){
            raritycolor = rarity_to_color(ev.rarity(n), "bgcard");
            }
            number_bg_to_rarity(1/ev.rarity(n));
            F.animate(
                [
                    { offset: 0, easing: "ease-out" },
                    {
                        offset: 0.4,
                        color: raritycolor,
                    },
                    {
                        offset: 0.6,
                        color: raritycolor, 
                        easing: "ease-in",
                    },
                    {
                        offset: 1,  
                        color: 'white',
                    }
                ],
                { duration: number_movement_duration, delay: start, fill: "forwards" }
            );
            FF.animate(
                [
                    { offset: 0, easing: "ease-out" },
                    {
                        offset: 0.4,
                        color: raritycolor,
                    },
                    {
                        offset: 0.6,
                        color: raritycolor, 
                        easing: "ease-in",
                    },
                    {
                        offset: 1,  
                        color: 'white',
                    }
                ],
                { duration: number_movement_duration, delay: start, fill: "forwards" }
            );
        } catch (err) {
            console.error("transite failed:", err);
        }
        return total_time;
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
                    c.innerHTML = `${rarity_to_color(1/wonned, "rarity")} * 1 in ${addcommas(BigInt(Math.round(wonned)))}`;
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
        //show one by one, from the last (most common) to index 0 (rarest), each one stacked on top
        //of the last. Each card waits for the one before it with a setTimeout chain.
        function show_next(i){
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
                    c.innerHTML = `${rarity_to_color(1/wonned, "rarity").toUpperCase()} * 1 in ${addcommas(BigInt(Math.round(wonned)))}`;
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

                var number_time = 0;
                if(number_movement && i != 0) number_time = transite(evali, number_in_parts);
                if(number_movement && i == 0){
                    //last card: play its normal pass, then right after it finishes,
                    //play again over every digit so they all end on the highest rarity color
                    number_time = transite(evali, number_in_parts);
                    number_time = transite(evali, number_in_parts, true, number_time);
                }

            addtoj += add_this;
            j += add_this;
            updati();

            //last card shown: wait for its number animations (if longer) before the next number
            if(i == 0){
                setTimeout(function(){reiterate();}, Math.max(run_next_interation_after, number_time));
                return;
            }

            //Gap before the next card: card_speed_max ms for the card farthest from 0,
            //sliding evenly up to card_speed ms for index 0
            var far = i / (succesfull_evals.length - 1);//1 = farthest from 0, 0 = at 0
            var delay = card_speed + (card_speed_max - card_speed) * far;

            //Unless the eval says it can overlap, wait until its number cards are done animating
            //(minus number_movement_overlap, so the next one starts a little early)
            if(!evali.overlap && number_time > 0){
                delay = Math.max(delay, number_time - number_movement_overlap);
            }

            setTimeout(function(){show_next(i - 1);}, delay);
        }
        if(succesfull_evals.length == 0){
            setTimeout(function(){reiterate();}, run_next_interation_after);
        } else {
            show_next(succesfull_evals.length - 1);
        }
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
    
    //For the UI button:
    var history_button = document.getElementById("history");
    var history = document.getElementById("ui_history");
    history.style.visibility = "hidden";
    history_button.addEventListener("click", function(){
        var history = document.getElementById("ui_history");
        console.log(history);
        if(history.style.visibility == "hidden") history.style.visibility = "visible";
        else {
            history.style.visibility = "hidden";
            closehistorydetail();
        }
    })
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
        if(delayed_addtoj != addtoj){
            delayed_addtoj -= addtoj;
            delayed_addtoj *= 8000n;
            delayed_addtoj /= 10000n;
            delayed_addtoj += addtoj;
            updati();
        }
        if(delayed_number != j){
            delayed_number -= j;
            delayed_number *= 8000n;
            delayed_number /= 10000n;
            delayed_number += j;
            updati();
        }
        

        requestAnimationFrame(update);
    }

    // start boi
    update();
};
// To start server, do "http-server" in .vscode terminal then open http://127.0.0.1:8080/main.html in browser