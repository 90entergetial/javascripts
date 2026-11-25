
//whatever the heck Integer Newton's method is, jeez..
function isPerfectPower(digits, k){
    var x = BigInt(digits);
    if(x < 2n) return true;// 0 and 1
    var K = BigInt(k);
    // Start above the real root: 10^(ceil(length/k)) is always bigger than it
    var r = 10n ** BigInt(Math.ceil(digits.length / k));
    // Integer Newton's method: shrinks toward floor(x^(1/k))
    while(true){
        var next = ((K - 1n) * r + x / r ** (K - 1n)) / K;
        if(next >= r) break;
        r = next;
    }
    return r ** K == x;
}

// takes a number "lookfor" and the length of the number, and outputs a rarity
// this was genuinely really complicated so I got claude to do this :p
// `times` (default 1) = how many separate (non-overlapping) copies of lookfor it needs,
// e.g. containsRarity("777", 2, length) for 7773777 or 777777
function containsRarity(lookfor, length, times = 1){
    var p = lookfor.split("");
    var m = p.length;
    if(m == 0 || times <= 0) return 1;
    if(length < m * times) return 0;

    // fail[i] = length of the longest proper prefix of p[0..i] that is also a suffix of it
    var fail = [0];
    for(var i = 1, k = 0; i < m; i++){
        while(k > 0 && p[i] != p[k]) k = fail[k-1];
        if(p[i] == p[k]) k++;
        fail.push(k);
    }
    // next[s][d] = how many digits of `lookfor` are matched after reading digit d,
    // when s digits were matched before
    var next = [];
    for(var s = 0; s < m; s++){
        next.push([]);
        for(var d = 0; d < 10; d++){
            var k = s;
            while(k > 0 && p[k] != String(d)) k = fail[k-1];
            if(p[k] == String(d)) k++;
            next[s].push(k);
        }
    }

    // state[c][s] = probability of "c copies found so far, and s digits of the next copy matched"
    // When a copy is completed, matching restarts from 0 so the copies can't overlap
    // (77777 only counts as one 777, but 777777 counts as two)
    var empty = function(){
        var a = [];
        for(var c = 0; c < times; c++) a.push(new Array(m).fill(0));
        return a;
    };
    var state = empty();
    var found = 0;
    // Feeds digit d into state (c, s) with probability `chance`
    var step = function(into, c, s, d, chance){
        var t = next[s][d];
        if(t < m) into[c][t] += chance;
        else if(c + 1 == times) found += chance;// that was the last copy needed
        else into[c+1][0] += chance;
    };
    // First digit is 1-9 (never 0)
    for(var d = 1; d <= 9; d++) step(state, 0, 0, d, 1/9);
    // Every other digit is 0-9
    for(var i = 1; i < length; i++){
        var ns = empty();
        for(var c = 0; c < times; c++){
            for(var s = 0; s < m; s++){
                if(state[c][s] == 0) continue;
                for(var d = 0; d < 10; d++) step(ns, c, s, d, state[c][s] / 10);
            }
        }
        state = ns;
    }
    return found;
}

// Probability that a random number with `length` digits (first digit 1-9, the rest 0-9)
// has a digit sum that passes `test`, e.g. digitSumRarity(5, sum => sum >= 35)
// dist[x] = probability that the digits so far add up to x; each new digit spreads it out
function digitSumRarity(length, test){
    var dist = [0];
    for(var d = 1; d <= 9; d++) dist[d] = 1/9;// first digit is 1-9
    for(var i = 1; i < length; i++){
        var nd = new Array(dist.length + 9).fill(0);
        for(var x = 0; x < dist.length; x++){
            if(dist[x] == 0) continue;
            for(var d = 0; d <= 9; d++) nd[x + d] += dist[x] / 10;
        }
        dist = nd;
    }
    var p = 0;
    for(var x = 0; x < dist.length; x++){
        if(test(x)) p += dist[x];
    }
    return p;
}

// Probability that a random number with `length` digits (first digit 1-9) passes shapeFind()
// state[d][phase] = probability the last digit is d and the shape is in that phase
function shapeRarity(length, valley){
    if(length < 3) return 0;
    var state = [];
    for(var d = 0; d <= 9; d++) state.push([d == 0 ? 0 : 1/9, 0, 0]);// first digit is 1-9
    for(var i = 1; i < length; i++){
        var ns = [];
        for(var d = 0; d <= 9; d++) ns.push([0, 0, 0]);
        for(var d = 0; d <= 9; d++){
            for(var e = 0; e <= 9; e++){
                var step = valley ? e - d : d - e;
                for(var ph = 0; ph < 3; ph++){
                    var pr = state[d][ph] / 10;
                    if(pr == 0) continue;
                    if(step == 0) ns[e][ph] += pr;// same digit: phase doesn't change
                    else if(step < 0){ if(ph != 2) ns[e][1] += pr; }// moving away
                    else { if(ph != 0) ns[e][2] += pr; }// moving back
                }
            }
        }
        state = ns;
    }
    var total = 0;
    for(var d = 0; d <= 9; d++) total += state[d][2];
    return total;
}

// ---------- Exact rarity for "includes a window that fits a pattern" (times, dates, ...) ----------
// A pattern is a list of slots, and each slot is the list of digits allowed there,
// e.g. [[0,1], ANY, [0,1,2,3,4,5], ANY] for "HHMM-ish". `patterns` is a list of those.
// The patterns are merged into a small automaton that tracks every partial match at once,
// then the chance of a random number (first digit 1-9) containing a full match is worked out
// one digit at a time, like containsRarity(). The automaton is built once per `key` and cached.
const ANY = [0,1,2,3,4,5,6,7,8,9];
var patternCache = {};
function patternRarity(key, makePatterns, length){
    if(!patternCache[key]) patternCache[key] = buildPatternDFA(makePatterns());
    var dfa = patternCache[key];
    if(length < dfa.width) return 0;
    // state[s] = chance of being in automaton state s with no full match yet
    var state = new Array(dfa.next.length).fill(0);
    var found = 0;
    for(var d = 1; d <= 9; d++){// first digit is 1-9
        var t = dfa.next[0][d];
        if(t == -1) found += 1/9; else state[t] += 1/9;
    }
    for(var i = 1; i < length; i++){
        var ns = new Array(dfa.next.length).fill(0);
        for(var s = 0; s < state.length; s++){
            if(state[s] == 0) continue;
            var pr = state[s] / 10;
            for(var d = 0; d <= 9; d++){
                var t = dfa.next[s][d];
                if(t == -1) found += pr; else ns[t] += pr;
            }
        }
        state = ns;
    }
    return found;
}
function buildPatternDFA(patterns){
    // 1. a trie of the patterns (each edge is a set of digits)
    var nodes = [{kids:{}, end:false}];
    for(var p = 0; p < patterns.length; p++){
        var at = 0;
        for(var k = 0; k < patterns[p].length; k++){
            var sig = patterns[p][k].join("");
            if(nodes[at].kids[sig] === undefined){
                nodes.push({kids:{}, end:false});
                nodes[at].kids[sig] = nodes.length - 1;
            }
            at = nodes[at].kids[sig];
        }
        nodes[at].end = true;
    }
    // 2. merge identical branches (all the "any year" endings become one shared chain)
    var canon = {}, id = new Array(nodes.length);
    var visit = function(v){
        if(id[v] !== undefined) return id[v];
        var parts = [];
        for(var sig in nodes[v].kids) parts.push(sig + ">" + visit(nodes[v].kids[sig]));
        parts.sort();
        var h = (nodes[v].end ? "E" : "") + "|" + parts.join(",");
        if(canon[h] === undefined) canon[h] = v;
        return id[v] = canon[h];
    };
    visit(0);
    // step[v][d] = nodes reached from node v on digit d
    var step = {};
    var stepOf = function(v){
        if(step[v]) return step[v];
        var out = [];
        for(var d = 0; d <= 9; d++) out.push([]);
        for(var sig in nodes[v].kids){
            for(var c = 0; c < sig.length; c++) out[+sig[c]].push(id[nodes[v].kids[sig]]);
        }
        return step[v] = out;
    };
    // 3. turn "every partial match at once" into single states (subset construction)
    //    A state is the set of trie nodes we are currently at; the root is always included,
    //    because a new match can start at any digit. -1 means a full match was reached.
    var width = 0;
    for(var p = 0; p < patterns.length; p++) width = Math.max(width, patterns[p].length);
    var keyOf = function(set){ return set.join(","); };
    var states = [[0]], index = {"0":0}, next = [];
    for(var s = 0; s < states.length; s++){
        var row = [];
        for(var d = 0; d <= 9; d++){
            var set = {0:true}, hit = false;
            for(var a = 0; a < states[s].length; a++){
                var go = stepOf(states[s][a])[d];
                for(var b = 0; b < go.length; b++){
                    if(nodes[go[b]].end) hit = true;
                    set[go[b]] = true;
                }
            }
            if(hit){ row.push(-1); continue; }
            var arr = Object.keys(set).map(Number).sort(function(x, y){ return x - y; });
            var k = keyOf(arr);
            if(index[k] === undefined){ index[k] = states.length; states.push(arr); }
            row.push(index[k]);
        }
        next.push(row);
    }
    return {next:next, width:width};
}
function digitsOf(x, size){// 7 -> [0,7] for size 2
    var s = String(x).padStart(size, "0");
    return s.split("").map(function(c){ return [+c]; });
}
// All valid (day, month) pairs as digit slots, in DDMM (us = false) or MMDD (us = true) order,
// followed by a 4-digit year. 29/02 needs year % 4 == 0, which only depends on the last 2 year digits:
// tens digit even -> ones digit 0, 4 or 8;  tens digit odd -> ones digit 2 or 6.
function datePatterns(us, leapOnly){
    var days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var out = [];
    for(var m = 1; m <= 12; m++){
        for(var d = 1; d <= days[m-1]; d++){
            var leap = (m == 2 && d == 29);
            if(leapOnly && !leap) continue;
            var head = us ? digitsOf(m, 2).concat(digitsOf(d, 2)) : digitsOf(d, 2).concat(digitsOf(m, 2));
            if(!leap){
                out.push(head.concat([ANY, ANY, ANY, ANY]));
            } else {
                out.push(head.concat([ANY, ANY, [0,2,4,6,8], [0,4,8]]));
                out.push(head.concat([ANY, ANY, [1,3,5,7,9], [2,6]]));
            }
        }
    }
    return out;
}

// Probability that a random number with `length` digits (first digit 1-9) has the same digit
// k times in a row somewhere. Each new digit matches the one before it with chance 1/10 (whatever
// the first digit is), so only the length of the current run matters.
// run[r] = chance the current run is r long (1 to k-1) and there's been no run of k yet
function runRarity(length, k){
    if(length < k) return 0;
    if(k <= 1) return 1;
    var run = new Array(k).fill(0);
    run[1] = 1;// the first digit starts a run of 1
    var found = 0;
    for(var i = 1; i < length; i++){
        var nr = new Array(k).fill(0);
        for(var r = 1; r < k; r++){
            nr[1] += run[r] * 9/10;// different digit: run resets to 1
            if(r + 1 == k) found += run[r] / 10;// same digit: the run reaches k
            else nr[r+1] += run[r] / 10;// same digit: run grows by 1
        }
        run = nr;
    }
    return found;
}

// Start index of the first `times` separate (non-overlapping) copies of lookfor, or false
function findCopies(n, lookfor, times){
    var z = n.join("");
    var starts = [];
    var from = 0;
    while(starts.length < times){
        var at = z.indexOf(lookfor, from);
        if(at == -1) return false;
        starts.push(at);
        from = at + lookfor.length;
    }
    return starts;
}

// exactEval({name:"Devil", desc:"Includes 6 three times in a row.", lookfor:"666"})
function exactEval(e){
    const lookfor = String(e.lookfor);
    evaluations.push({
        name: e.name,
        desc: e.desc,
        overlap:true,
        find: function(n){
            return n.join("").includes(lookfor);
        },
        rarity: function(n){
            return containsRarity(lookfor, n.length);
        },
        transitions: function(n){
            
            var start = n.join("").indexOf(lookfor);
            if(start == -1) return false;
            var Z = [];
            for(var i = 0; i < lookfor.length; i++){
                Z.push({i:start+i, t:1});
            }
            return Z;
        }
    });
}

function HasZeros() {
    let names = [
        "Zero Gap",//2
        "Zero Hole",//3
        "Zero Trench",//4
        "Zero Valley",//5
        "Zero Canyon",//6
        "Zero Chasm",//7
        "Zero Rift",//8
        "Zero Black Hole",//9
        "Zero Void",//10
    ];
    let amounts = [
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
    ]
    for(var i = 0; i < 9; i++){
        exactEval({
            name: names[i],
            desc: `Number contains ${amounts[i]} 0s in a row.`,
            lookfor: "0".repeat(i+2),
        });
    }
}

evaluations = [
    //exacts (Includes 1 once, Includes 800)

    {
        name:"Zero",
        desc:"Zero shows up exactly once.",
        overlap:true,
        find: function(n){
            var z = n.join("");
            if (z.split("0").length - 1 == 1){
                return true;
            }
            return false;
        },
        rarity: function(n){
            var s = n.length;
            if(s == 1) return (1/10)
            return ((s-1)*(9)**(s-2))/(10**(s-1));
        },
        transitions: function(n){
            var z = n.indexOf("0");
            if(z == -1) return false;
            return [{i:z, t:1}];
        }
    },//0 once
    {
        name:"One",
        desc:"One shows up exactly once.",
        overlap:true,
        find: function(n){
            var z = n.join("");
            if (z.split("1").length - 1 == 1){
                return true;
            }
            return false;
        },
        rarity: function(n){
            var s = n.length;
            if(s == 1) return (1/9)//a 1-digit number is 1-9
            return ((8*s+1)*((9)**(s-3)))/(10**(s-1));
        },
        transitions: function(n){
            var z = n.indexOf("1");
            if(z == -1) return false;
            return [{i:z, t:1}];
        }
    },//1 once
    {
        name:"Two",
        desc:"Two shows up exactly once.",
        overlap:true,
        find: function(n){
            var z = n.join("");
            if (z.split("2").length - 1 == 1){
                return true;
            }
            return false;
        },
        rarity: function(n){
            var s = n.length;
            if(s == 1) return (1/9)//a 1-digit number is 1-9
            return ((8*s+1)*((9)**(s-3)))/(10**(s-1));
        },
        transitions: function(n){
            var z = n.indexOf("2");
            if(z == -1) return false;
            return [{i:z, t:1}];
        }
    },//2 once
    {
        name:"Three",
        desc:"Three shows up exactly once.",
        overlap:true,
        find: function(n){
            var z = n.join("");
            if (z.split("3").length - 1 == 1){
                return true;
            }
            return false;
        },
        rarity: function(n){
            var s = n.length;
            if(s == 1) return (1/9)//a 1-digit number is 1-9
            return ((8*s+1)*((9)**(s-3)))/(10**(s-1));
        },
        transitions: function(n){
            var z = n.indexOf("3");
            if(z == -1) return false;
            return [{i:z, t:1}];
        }
    },//3 once
    {
        name:"Four",
        desc:"Four shows up exactly once.",
        overlap:true,
        find: function(n){
            var z = n.join("");
            if (z.split("4").length - 1 == 1){
                return true;
            }
            return false;
        },
        rarity: function(n){
            var s = n.length;
            if(s == 1) return (1/9)//a 1-digit number is 1-9
            return ((8*s+1)*((9)**(s-3)))/(10**(s-1));
        },
        transitions: function(n){
            var z = n.indexOf("4");
            if(z == -1) return false;
            return [{i:z, t:1}];
        }
    },//4 once
    {
        name:"Five",
        desc:"Five shows up exactly once.",
        overlap:true,
        find: function(n){
            var z = n.join("");
            if (z.split("5").length - 1 == 1){
                return true;
            }
            return false;
        },
        rarity: function(n){
            var s = n.length;
            if(s == 1) return (1/9)//a 1-digit number is 1-9
            return ((8*s+1)*((9)**(s-3)))/(10**(s-1));
        },
        transitions: function(n){
            var z = n.indexOf("5");
            if(z == -1) return false;
            return [{i:z, t:1}];
        }
    },//5 once
    {
        name:"Six",
        desc:"Six shows up exactly once.",
        overlap:true,
        find: function(n){
            var z = n.join("");
            if (z.split("6").length - 1 == 1){
                return true;
            }
            return false;
        },
        rarity: function(n){
            var s = n.length;
            if(s == 1) return (1/9)//a 1-digit number is 1-9
            return ((8*s+1)*((9)**(s-3)))/(10**(s-1));
        },
        transitions: function(n){
            var z = n.indexOf("6");
            if(z == -1) return false;
            return [{i:z, t:1}];
        }
    },//6 once
    {
        name:"Seven",
        desc:"Seven shows up exactly once.",
        overlap:true,
        find: function(n){
            var z = n.join("");
            if (z.split("7").length - 1 == 1){
                return true;
            }
            return false;
        },
        rarity: function(n){
            var s = n.length;
            if(s == 1) return (1/9)//a 1-digit number is 1-9
            return ((8*s+1)*((9)**(s-3)))/(10**(s-1));
        },
        transitions: function(n){
            var z = n.indexOf("7");
            if(z == -1) return false;
            return [{i:z, t:1}];
        }
    },//7 once
    {
        name:"Eight",
        desc:"Eight shows up exactly once.",
        overlap:true,
        find: function(n){
            var z = n.join("");
            if (z.split("8").length - 1 == 1){
                return true;
            }
            return false;
        },
        rarity: function(n){
            var s = n.length;
            if(s == 1) return (1/9)//a 1-digit number is 1-9
            return ((8*s+1)*((9)**(s-3)))/(10**(s-1));
        },
        transitions: function(n){
            var z = n.indexOf("8");
            if(z == -1) return false;
            return [{i:z, t:1}];
        }
    },//8 once
    {
        name:"Nine",
        desc:"Nine shows up exactly once.",
        overlap:true,
        find: function(n){
            var z = n.join("");
            if (z.split("9").length - 1 == 1){
                return true;
            }
            return false;
        },
        rarity: function(n){
            var s = n.length;
            if(s == 1) return (1/9)//a 1-digit number is 1-9
            return ((8*s+1)*((9)**(s-3)))/(10**(s-1));
        },
        transitions: function(n){
            var z = n.indexOf("9");
            if(z == -1) return false;
            return [{i:z, t:1}];
        }
    },//9 once
    {
        name:"Divisble by 10",
        desc:"Number ends with a 0.",
        overlap:true,
        find: function(n){
            if(n.length == 1) return false;
            if(n[n.length-1] == '0') return true;
            return false;
        },
        rarity: function(n){
            return (1 / 10);
        },
        transitions: function(n){
            return [{i:n.length-2, t:1},{i:n.length-1, t:1}];
        }
    },//Divisble by 10
    {
        name:"DOUBLE JACKPOT",
        desc:"Includes 777, seperately, twice.",
        find: function(n){
            return findCopies(n, "777", 2) != false;
        },
        rarity: function(n){
            return containsRarity("777", n.length, 2);
        },
        transitions: function(n){
            // flash the digits of the first two separate 777s
            var starts = findCopies(n, "777", 2);
            if(!starts) return false;
            var Z = [];
            for(var c = 0; c < starts.length; c++){
                if(c%2 == 0){
                for(var i = 0; i < 3; i++) Z.push({i:starts[c]+i, t:1});
                } else {
                for(var i = 0; i < 3; i++) Z.push({i:starts[c]+i, t:2});
                }
            }
            return Z;
        }
    },//DOUBLE JACKPOT
    {
        name:"6767",
        desc:"Includes 67, seperately, twice.",
        find: function(n){
            return findCopies(n, "67", 2) != false;
        },
        rarity: function(n){
            return containsRarity("67", n.length, 2);
        },
        transitions: function(n){
            // flash the digits of the first two separate 67s
            var starts = findCopies(n, "67", 2);
            if(!starts) return false;
            var Z = [];
            for(var c = 0; c < starts.length; c++){
                for(var i = 0; i < 2; i++) Z.push({i:starts[c]+i, t:1});
            }
            return Z;
        }
    },//6767
    {
        name:"6969",
        desc:"Includes 69, seperately, twice.",
        find: function(n){
            return findCopies(n, "69", 2) != false;
        },
        rarity: function(n){
            return containsRarity("69", n.length, 2);
        },
        transitions: function(n){
            // flash the digits of the first two separate 67s
            var starts = findCopies(n, "69", 2);
            if(!starts) return false;
            var Z = [];
            for(var c = 0; c < starts.length; c++){
                for(var i = 0; i < 2; i++) Z.push({i:starts[c]+i, t:1});
            }
            return Z;
        }
    },//6969
    {
        name:"Square",
        desc:"The number is a square of another.",
        find: function(n){
            return isPerfectPower(n.join(""), 2);
        },
        rarity: function(n){
            // Squares m^2 with n digits: 10^(n-1) <= m^2 < 10^n, so m runs from
            // ceil(10^((n-1)/2)) to ceil(10^(n/2)) - 1
            var count = Math.ceil(10 ** (n.length / 2)) - Math.ceil(10 ** ((n.length - 1) / 2));
            return count / (9 * 10 ** (n.length - 1));
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Square
    {
        name:"Cubic",
        desc:"The number is a cube of another.",
        find: function(n){
            return isPerfectPower(n.join(""), 3);
        },
        rarity: function(n){
            // Cubes m^3 with n digits: 10^(n-1) <= m^3 < 10^n, so m runs from
            // ceil(10^((n-1)/3)) to ceil(10^(n/3)) - 1
            var count = Math.ceil(10 ** (n.length / 3)) - Math.ceil(10 ** ((n.length - 1) / 3));
            return count / (9 * 10 ** (n.length - 1));
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Cubic
    {
        name:"Quartic",
        desc:"The number is the 4th power of another.",
        find: function(n){
            return isPerfectPower(n.join(""), 4);
        },
        rarity: function(n){
            var power = 4;
            var count = Math.ceil(10 ** (n.length / power)) - Math.ceil(10 ** ((n.length - 1) / power));
            return count / (9 * 10 ** (n.length - 1));
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Quartic
    {
        name:"Quintic",
        desc:"The number is the 5th power of another.",
        find: function(n){
            return isPerfectPower(n.join(""), 5);
        },
        rarity: function(n){
            var power = 5;
            var count = Math.ceil(10 ** (n.length / power)) - Math.ceil(10 ** ((n.length - 1) / power));
            return count / (9 * 10 ** (n.length - 1));
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Quintic
    {
        name:"Sextic",
        desc:"The number is the 6th power of another.",
        find: function(n){
            return isPerfectPower(n.join(""), 6);
        },
        rarity: function(n){
            var power = 6;
            var count = Math.ceil(10 ** (n.length / power)) - Math.ceil(10 ** ((n.length - 1) / power));
            return count / (9 * 10 ** (n.length - 1));
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Sextic
    {
        name:"Heptic",
        desc:"The number is the 7th power of another.",
        find: function(n){
            return isPerfectPower(n.join(""), 7);
        },
        rarity: function(n){
            var power = 7;
            var count = Math.ceil(10 ** (n.length / power)) - Math.ceil(10 ** ((n.length - 1) / power));
            return count / (9 * 10 ** (n.length - 1));
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Heptic
    {
        name:"Prime",
        desc:"Number is prime.",
        find: function(n){
            var z = eval(n.join(""));
            if(z == 1) return false;//teehee
            for(var i = 2; i * i <= z; i++){
                if(z%i == 0){
                    return false;
                }
            }
            return true;
        },
        //yeah so there isn't an exact number for when it's a prime lol
        rarity: function(n){
            // Exact count of primes with exactly k digits (k = 1..12)
            const primesWithDigits = [0, 4, 21, 143, 1061, 8363, 68906, 586081, 5096876, 45086079, 404204977, 3663002302, 33489857205];
            const size = n.length;
            if(size < primesWithDigits.length) return primesWithDigits[size] / (9 * Math.pow(10, size - 1));
            // Prime number theorem approximation for larger sizes
            return 1 / (Math.LN10 * (size - 1/3));
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Prime
    {
        name:"Quarter",
        desc:"Number is divisible by 25.",
        overlap:true,
        find: function(n){
            if(n.length == 1) return false;
            if(n[n.length-2] == '2' && n[n.length-1] == '5') return true;
            if(n[n.length-2] == '5' && n[n.length-1] == '0') return true;
            if(n[n.length-2] == '7' && n[n.length-1] == '5') return true;
            if(n[n.length-2] == '0' && n[n.length-1] == '0' && n.length != 2) return true;
            return false;
        },
        rarity: function(n){
            if(n == 2) return (3 / 90);
            return (4 / 90);
        },
        transitions: function(n){
            return [{i:n.length-2, t:1},{i:n.length-1, t:1}];
        }
    },//Divisble by 10

    //Triple touble - Inucdes a 3-digits segment twice

    //ranges (Heavy as a rock, Light as a feather)

    {
        name:"All At Once",
        desc:"Every Digit is the Same.",
        find: function(n){
            var z = n.join("");
            var Z = n[0];
            if (z.split(Z).length - 1 == n.length){
                return true;
            }
            return false;
        },
        rarity: function(n){
            var s = n.length;
            return (1/10)**(s-1);
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//All At Once
    {
        name:"Heavy as a Rock",
        desc:"All Digits sum to at least 7 times the digit count.",
        find: function(n){
            var x = 0;
            for(var i = 0; i < n.length; i++){
                x += eval(n[i]);
            }
            if(x >= n.length*7) return true;
            return false;
        },
        rarity: function(n){
            var s = n.length;
            return digitSumRarity(s, sum => sum >= s*7);
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Heavy as a Rock
    {
        name:"Light as a Feather",
        desc:"All Digits sum to at most 3 times the digit count.",
        find: function(n){
            var x = 0;
            for(var i = 0; i < n.length; i++){
                x += eval(n[i]);
            }
            if(x <= n.length*3) return true;
            return false;
        },
        rarity: function(n){
            var s = n.length;
            return digitSumRarity(s, sum => sum <= s*3);
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Light as a Feather
    {
        name:"Heavy Digits",
        desc:"All Digits are least 6.",
        find: function(n){
            for(var i = 0; i < n.length; i++){
                if(n[i] < 6) return false;
            }
            return true;
        },
        rarity: function(n){
            var s = n.length;
            return (4 / 9) * (4 / 10) ** (s - 1);
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Heavy Digits
    {
        name:"Light Digits",
        desc:"All Digits are at most 4.",
        find: function(n){
            for(var i = 0; i < n.length; i++){
                if(n[i] > 4) return false;
            }
            return true;
        },
        rarity: function(n){
            var s = n.length;
            return (4 / 9) * (5 / 10) ** (s - 1);
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Light Digits
    {
        name:"Constant Increase",
        desc:"Every Digit is equal or greater than the previous.",
        find: function(n){
            for(var i = 0; i < n.length-1; i++){
                if(n[i] > n[i+1]){
                    return false;
                }
            }
            return true;
        },
        rarity: function(n){
            let count = 1;
            for (let i = 1; i <= 8; i++) {
                count = count * (n.length + i) / i;
            }
            return count / (9 * 10 ** (n.length - 1));
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Const Inc
    {
        name:"Constant Decrease",
        desc:"Every Digit is equal or less than the previous.",
        find: function(n){
            for(var i = 0; i < n.length-1; i++){
                if(n[i] < n[i+1]){
                    return false;
                }
            }
            return true;
        },
        rarity: function(n){
            let count = 1;
            for (let i = 1; i <= 9; i++) {
                count = count * (n.length + i) / i;
            }
            count -= 1; //remove the all-zeros sequence
            return count / (9 * 10 ** (n.length - 1));
        },
        transitions: function(n){
            //whatever sorcery this is but in REVERSE
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:n.length-(x), t:1}));
        }
    },//Const Dec
    {
        name:"Palindrone",
        desc:"The digits are the same in reverse.",
        find: function(n){
            for(var i = 0; i < n.length; i++){
                if(n[i] != n[n.length-i-1]){
                    return false;
                }
            }
            return true;
        },
        rarity: function(n){
            return  (1/10) ** Math.floor(n.length/2);
        },
        transitions: function(n){
            var x = [];
            for(var i = 0; i < Math.ceil(n.length/2); i++){
                x.push({i:i, t:1}, {i:(Math.ceil(n.length))-(i+1), t:1});
            }
            return x;
        }
    },//Palindrome
    {
        name:"Pairs",
        desc:"The first half is the second half of the number.",
        find: function(n){
            if(n.length%2 == 1) return false;
            for(var i = 0; i < n.length/2; i++){
                if(n[i] != n[(n.length/2)+i]){
                    return false;
                }
            }
            return true;
        },
        rarity: function(n){
            return  (1/10) ** Math.floor(n.length/2);
        },
        transitions: function(n){
            var x = [];
            for(var i = 0; i < n.length/2; i++){
                x.push({i:i, t:1},{i:i+(n.length/2), t:2});
            }
            return x;
        }
    },//Pairs
    {
        name:"Stairs",
        desc:"Every digit is one greater than the digit before.",
        find: function(n){
            for(var i = 0; i < n.length-1; i++){
                if((eval(n[i])+1)%10 != n[i+1]){
                    return false;
                }
            }
            return true;
        },
        rarity: function(n){
            return (1 / 9) * 1 / 10 ** (n.length - 2);
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Stairs
    {
        name:"Reverse Stairs",
        desc:"Every digit is one less than the digit before.",
        find: function(n){
            for(var i = 0; i < n.length-1; i++){
                if(n[i] != (eval(n[i+1])+1)%10){
                    return false;
                }
            }
            return true;
        },
        rarity: function(n){
            return 1 / 10 ** (n.length - 1);
        },
        transitions: function(n){
            //whatever sorcery this is but in REVERSE
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:n.length-(x), t:1}));
        }
    },//Reverse Stairs
    {
        name:"Heterogenus",
        desc:"Every digit is unique.",
        find: function(n){
            if(n.length > 10) return false;
            for(var i = 0; i < n.length; i++){
                for(var j = 0; j < n.length; j++){
                    if(n[i] == n[j] && i != j){
                        return false;
                    }
                }
            }
            return true;
        },
        rarity: function(n){
            // First digit: 9 choices (1-9), then 9, 8, 7, ... choices for the rest
            // P = (9 * 9!/(10-n)!) / (9 * 10^(n-1)) = product of (10-k)/10 for k = 1..n-1
            if(n.length > 10) return 0;
            var p = 1;
            for(var k = 1; k < n.length; k++) p *= (10 - k) / 10;
            return p;
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Heterogenus
    {
        name:"One or the Other",
        desc:"Every Digit is one of two digits.",
        find: function(n){
            var z = n.join("");
            var Z = n[0];
            var Z2 = "a";
            for(var i = 0; i < n.length; i++){
                if(Z != n[i]){
                    Z2 = n[i];
                    break;
                }
            }
            if(Z2 == "a") return false;//there is only one, not two.
            if ((z.split(Z).length - 1) + (z.split(Z2).length - 1) == n.length){
                return true;
            }
            return false;
        },
        rarity: function(n){
            return 9 * (Math.pow(2, n.length - 1) - 1) / Math.pow(10, n.length - 1);
        },
        transitions: function(n){
            var z = n.join("");
            var Z = n[0];
            var Z2;
            for(var i = 0; i < n.length; i++){
                if(Z != n[i]){
                    Z2 = n[i];
                    break;
                }
            }
            var ta = []
            for(var i = 0; i < n.length; i++){
                if(n[i] == Z) ta.push({i:i, t:1});
                if(n[i] == Z2) ta.push({i:i, t:2});
            }
            return ta;
        }
    },//One or the Other
    {
        name:"Loop",
        desc:"The first and last digit are the same.",
        overlap:true,
        find: function(n){
            if(n.length == 0) return false;
            if(n[0] == n[n.length-1]){
                return true;
            }
            return false;
        },
        rarity: function(n){
            if(n.length == 1) return 1;//a single digit is always its own first and last
            return (1/10);
        },
        transitions: function(n){
            if(n.length == 1) return [{i:0, t:1}];
            return [{i:0, t:1},{i:n.length-1, t:1}];
        }
    },//Loop
    {
        name:"Loop 2",
        desc:"The first and last two digits are the same.",
        overlap:true,
        find: function(n){
            if(n.length < 3) return false;
            if(n[0] == n[n.length-2] && n[1] == n[n.length-1]){
                return true;
            }
            return false;
        },
        rarity: function(n){
            return (1/100);
        },
        transitions: function(n){
            return [{i:0, t:1},{i:n.length-2, t:1},{i:1, t:1},{i:n.length-1, t:1}];
        }
    },//Loop 2
    {
        name:"Mirror",
        desc:"The first and last two digits are inverses of eachother.",
        overlap:true,
        find: function(n){
            if(n.length < 3) return false;
            if(n[0] == n[n.length-1] && n[1] == n[n.length-2]){
                return true;
            }
            return false;
        },
        rarity: function(n){
            return (1/100);
        },
        transitions: function(n){
            return [{i:0, t:1},{i:n.length-1, t:2},{i:1, t:1},{i:n.length-2, t:2}];
        }
    },//Mirror
    {
        name:"All Even",
        desc:"Every digit is Even.",
        find: function(n){
            for(var i = 0; i < n.length; i++){
                if(n[i]%2 == 1) return false;
            }
            return true;
        },
        rarity: function(n){
            return (4/9) * (1/2) ** (n.length-1);
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//All Even
    {
        name:"All Odd",
        desc:"Every digit is Odd.",
        find: function(n){
            for(var i = 0; i < n.length; i++){
                if(n[i]%2 == 0) return false;
            }
            return true;
        },
        rarity: function(n){
            return (5/9) * (1/2) ** (n.length-1);
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//All Odd
    {
        name:"Consistent Steps",
        desc:"The seperation of one digit to the next is the same for all digits.",
        find: function(n){
            if(n.length <= 2) return false;
            var sep = eval(n[1])-eval(n[0]);
            for(var i = 0; i < n.length-1; i++){
                if(((eval(n[i])+sep)%10+10)%10 != n[i+1]) return false;//+10 so negative steps wrap around too
            }
            return true;
        },
        rarity: function(n){
            return (1/(10**(n.length-2)))
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Consistent Steps
    {
        name:"Shuffled Deck",
        desc:"Sorting the digits will make every digit one greater than the one before, starting at 0.",
        find: function(n){
            if(n.length > 10) return false;
            var z = n.join("");
            for(var i = 0; i < n.length; i++){
                if (z.split(i.toString()).length - 1 != 1){
                    return false;
                }
            }
            return true;
        },
        rarity: function(n){
            // P = (n-1) * (n-1)! / (9 * 10^(n-1))
            // the f below is (n-1)!
            if(n.length == 1) return 1/10;
            var f = 1;
            for(var i = 2; i < n.length; i++) f *= i;
            return (n.length - 1) * f / (9 * Math.pow(10, n.length - 1));
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Shuffled Deck
    {
        name:"Sorted Deck",
        desc:"Every digit is one greater than the one before, starting at 1.",
        find: function(n){
            if(n[0] != 1) return false;
            if(n.length > 10) return false;
            for(var i = 0; i < n.length-1; i++){
                if((eval(n[i])+1)%10 != n[i+1]){
                    return false;
                }
            }
            return true;
        },
        rarity: function(n){
            // first digit must be 1 (1/9), then every next digit is decided (1/10 each)
            return 1 / (9 * 10 ** (n.length - 1));
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//Sorted Deck
    {
        name:"Couples",
        desc:"Every digit repeats twice.",
        find: function(n){
            if(n.length%2 == 1) return false;
            if(n.length < 3) return false;
            for(var i = 0; i < n.length/2; i++){
                if(n[i*2] != n[i*2+1]) return false;
            }
            return true;
        },
        rarity: function(n){
            // every second digit must match the one before it
            return 1 / 10 ** (n.length/2);
        },
        transitions: function(n){
            var x = [];
            for(var i = 0; i < n.length; i++){
                if(i%4 == 0) x.push({i:i, t:1});
                else if(i%4 == 1) x.push({i:i, t:1});
                else if(i%4 == 2) x.push({i:i, t:2});
                else x.push({i:i, t:2});
            }
            return x;
        }
    },//Couples
    {
        name:"Sister Pairs",
        desc:"Both sides share the same twin and single patterns, and have at least one twin on each size.",
        find: function(n){
            if(n.length%2 == 1) return false;
            if(n.length < 5) return false;
            var pattern = [0];
            var pattern2 = [0];
            for(var i = 1; i < n.length/2; i++){
                if(n[i] == n[i-1]){
                    pattern.push(pattern[pattern.length-1]);
                } else {
                    if(pattern[pattern.length-1] == 1){
                        pattern.push(0);
                    } else {
                        pattern.push(1);
                    }
                }
            }
            for(var i = n.length/2+1; i < n.length; i++){
                if(n[i] == n[i-1]){
                    pattern2.push(pattern2[pattern2.length-1]);
                } else {
                    if(pattern2[pattern2.length-1] == 1){
                        pattern2.push(0);
                    } else {
                        pattern2.push(1);
                    }
                }
            }
            for(var i = 0; i < pattern.length; i++){
            if(pattern[i] != pattern2[i]) return false;
            }
            for(var i = 0; i < pattern.length-1; i++){
            if(pattern[i] == pattern[i+1]) return true;
            }
            
            return false;
        },
        rarity: function(n){
            // Each half has m-1 neighbour pairs; each pair is a twin with chance 1/10.
            // Chance both halves get the same twin/single pattern: (1/100 + 81/100)^(m-1) = 0.82^(m-1)
            // Minus the pattern with no twins at all: 0.81^(m-1)
            var m = n.length / 2;
            return 0.82 ** (m - 1) - 0.81 ** (m - 1);
        },
        transitions: function(n){
            var x = [];
            for(var i = 0; i < n.length/2; i++){
                x.push({i:i, t:1},{i:i+(n.length/2), t:2});
            }
            return x;
        }
    },//Sister Pairs

    {
        name:"Valley",
        desc:"Digits fall to a number then rise back up.",
        find: function(n){
            var phase = 0;
            for(var i = 0; i < n.length-1; i++){
                var step = n[i+1] - n[i];
                if(step < 0){// moving away (down for Valley)
                    if(phase == 2) return false;// dropped again after rising
                    phase = Math.max(phase, 1);
                } else if(step > 0){// moving back (up for Valley)
                    if(phase == 0) return false;// rose before any real drop
                    phase = 2;
                }
            }
            return phase == 2;
        },
        rarity: function(n){
            return shapeRarity(n.length, true);
        },
        transitions: function(n){
            //find the smallest number
            let R = [];
            let small = 1000;
            let s_i = 0;
            for(var i = 0; i < n.length; i++){
                if(small != Math.min(small, n[i])){
                    s_i = i;
                    small = Math.min(small, n[i]);
                }
            }
            R.push({i:s_i, t:1});
            for(var i = s_i+1; i < n.length; i++){
                R.push({i:i, t:4});
            }
            for(var i = s_i-1; i >= 0; i--){
                R.push({i:i, t:4});
            }
            return R;
        }
    },//Valley
    {
        name:"Hill",
        desc:"Digits rise to a number then fall back down.",
        find: function(n){
            var phase = 0;
            for(var i = 0; i < n.length-1; i++){
                var step = n[i+1] - n[i];
                step = -step;// flip a Hill into a Valley
                if(step < 0){// moving away (down for Valley)
                    if(phase == 2) return false;// dropped again after rising
                    phase = Math.max(phase, 1);
                } else if(step > 0){// moving back (up for Valley)
                    if(phase == 0) return false;// rose before any real drop
                    phase = 2;
                }
            }
            return phase == 2;
        },
        rarity: function(n){
            return shapeRarity(n.length, false);
        },
        transitions: function(n){
            //find the smallest number
            let R = [];
            let small = 0;
            let s_i = 0;
            for(var i = 0; i < n.length; i++){
                if(small != Math.max(small, n[i])){
                    s_i = i;
                    small = Math.max(small, n[i]);
                }
            }
            R.push({i:s_i, t:1});
            for(var i = n.length-1; i >= s_i+1; i--){
                R.push({i:i, t:4});
            }
            for(var i = 0; i < s_i; i++){
                R.push({i:i, t:4});
            }
            return R;
        }
    },//Hill
    {
        name:"Trench",
        desc:"The two largest digits are the first and last ones.",
        find: function(n){
            if(n.length < 3) return false;
            for(var i = 1; i < n.length-1; i++){
                if(n[i] >= n[0]) return false;
                if(n[i] >= n[n.length-1]) return false;
            }
            return true;
        },
        rarity: function(n){
            // m = the smaller of the first and last digit. Every middle digit must be below m.
            // (first, last) pairs with smaller one = m: 19 - 2m  (first is 1-9, last is 0-9)
            // P = sum over m of (19 - 2m)/90 * (m/10)^(L-2)
            var L = n.length;
            if(L < 3) return 0;
            var p = 0;
            for(var m = 1; m <= 9; m++) p += (19 - 2*m) / 90 * (m / 10) ** (L - 2);
            return p;
        },
        transitions: function(n){
            //find the smallest number
            let R = [];
            for(var i = 1; i < n.length-1; i++){
                R.push({i:i, t:1});
            }
            R.push({i:0, t:2},{i:n.length-1, t:2});
            return R;
        }
    },//Trench
    {
        name:"Plateau",
        desc:"The two smallest digits are the first and last ones.",
        find: function(n){
            if(n.length < 3) return false;
            for(var i = 1; i < n.length-1; i++){
                if(n[i] <= n[0]) return false;
                if(n[i] <= n[n.length-1]) return false;
            }
            return true;
        },
        rarity: function(n){
            // M = the bigger of the first and last digit. Every middle digit must be above M.
            // (first, last) pairs with bigger one = M: 2M  (first is 1-9, last is 0-9)
            // P = sum over M of 2M/90 * ((9-M)/10)^(L-2)
            var L = n.length;
            if(L < 3) return 0;
            var p = 0;
            for(var M = 1; M <= 8; M++) p += 2*M / 90 * ((9 - M) / 10) ** (L - 2);
            return p;
        },
        transitions: function(n){
            //find the smallest number
            let R = [];
            for(var i = 1; i < n.length-1; i++){
                R.push({i:i, t:1});
            }
            R.push({i:0, t:2},{i:n.length-1, t:2});
            return R;
        }
    },//Plateau
    // Alternation - Digits alternate between two different digits
    {
        name:"It's Time",
        desc:"Includes a proper timestamp in HHMMSS.",
        find: function(n){
            if(n.length < 6) return false;
            for(var i = 0; i <= n.length-6; i++){
                if(
                    eval(n[i])*10 + eval(n[i+1]) < 24 &&
                    eval(n[i+2])*10 + eval(n[i+3]) < 60 &&
                    eval(n[i+4])*10 + eval(n[i+5]) < 60
                ){
                    return true;
                }
            }
            return false;
        },
        rarity: function(n){
            // HH = 00-23, MM = 00-59, SS = 00-59
            return patternRarity("time", function(){
                var M = [0,1,2,3,4,5];
                return [[[0,1], ANY, M, ANY, M, ANY], [[2], [0,1,2,3], M, ANY, M, ANY]];
            }, n.length);
        },
        transitions: function(n){
            //find the smallest number
            let R = [];
            for(var i = 0; i < n.length-5; i++){
                if(
                    eval(n[i])*10 + eval(n[i+1]) < 24 &&
                    eval(n[i+2])*10 + eval(n[i+3]) < 60 &&
                    eval(n[i+4])*10 + eval(n[i+5]) < 60
                ){
                    return [{i:i, t:1},{i:i+1, t:1},{i:i+2, t:2},{i:i+3, t:2},{i:i+4, t:1},{i:i+5, t:1}];
                }
            }
        }
    },//It's time
    {
        name:"It's Date",
        desc:"Includes a proper date in DDMMYYYY.",
        find: function(n){
            if(n.length < 8) return false;
            for(var i = 0; i <= n.length-8; i++){
                if(
                    eval(n[i+2])*10 + eval(n[i+3]) < 13 &&
                    eval(n[i+2])*10 + eval(n[i+3]) > 0
                ){
                    let year = eval(n[i+4])*1000 + eval(n[i+5])*100 + eval(n[i+6])*10 + eval(n[i+7]);
                    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if(year%4 == 0) days[1] = 29; 
                    let j = days[eval(n[i+2])*10 + eval(n[i+3]) - 1];
                    if(
                        eval(n[i])*10 + eval(n[i+1]) > 0 &&
                        eval(n[i])*10 + eval(n[i+1]) <= j
                    ){
                        return true;
                    }
                }
            }
            return false;
        },
        rarity: function(n){
            return patternRarity("date", function(){ return datePatterns(false, false); }, n.length);
        },
        transitions: function(n){
            //find the smallest number
            let R = [];
            for(var i = 0; i <= n.length-8; i++){
                if(
                    eval(n[i+2])*10 + eval(n[i+3]) < 13 &&
                    eval(n[i+2])*10 + eval(n[i+3]) > 0
                ){
                    let year = eval(n[i+4])*1000 + eval(n[i+5])*100 + eval(n[i+6])*10 + eval(n[i+7]);
                    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if(year%4 == 0) days[1] = 29; 
                    let j = days[eval(n[i+2])*10 + eval(n[i+3]) - 1];
                    if(
                        eval(n[i])*10 + eval(n[i+1]) > 0 &&
                        eval(n[i])*10 + eval(n[i+1]) <= j
                    ){
                        return [{i:i, t:1},{i:i+1, t:1},{i:i+2, t:2},{i:i+3, t:2},{i:i+4, t:1},{i:i+5, t:1},{i:i+6, t:1},{i:i+7, t:1}];
                    }
                }
            }
        }
    },//It's date
    {
        name:"It's Date (US)",
        desc:"Includes a proper date in MMDDYYYY.",
        find: function(n){
            if(n.length < 8) return false;
            for(var i = 0; i <= n.length-8; i++){
                if(
                    eval(n[i])*10 + eval(n[i+1]) < 13 &&
                    eval(n[i])*10 + eval(n[i+1]) > 0
                ){
                    let year = eval(n[i+4])*1000 + eval(n[i+5])*100 + eval(n[i+6])*10 + eval(n[i+7]);
                    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if(year%4 == 0) days[1] = 29; 
                    let j = days[eval(n[i])*10 + eval(n[i+1]) - 1];
                    if(
                        eval(n[i+2])*10 + eval(n[i+3]) > 0 &&
                        eval(n[i+2])*10 + eval(n[i+3]) <= j
                    ){
                        return true;
                    }
                }
            }
            return false;
        },
        rarity: function(n){
            return patternRarity("dateUS", function(){ return datePatterns(true, false); }, n.length);
        },
        transitions: function(n){
            //find the smallest number
            let R = [];
            for(var i = 0; i <= n.length-8; i++){
                if(
                    eval(n[i])*10 + eval(n[i+1]) < 13 &&
                    eval(n[i])*10 + eval(n[i+1]) > 0
                ){
                    let year = eval(n[i+4])*1000 + eval(n[i+5])*100 + eval(n[i+6])*10 + eval(n[i+7]);
                    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if(year%4 == 0) days[1] = 29; 
                    let j = days[eval(n[i])*10 + eval(n[i+1]) - 1];
                    if(
                        eval(n[i+2])*10 + eval(n[i+3]) > 0 &&
                        eval(n[i+2])*10 + eval(n[i+3]) <= j
                    ){
                        return [{i:i, t:1},{i:i+1, t:1},{i:i+2, t:2},{i:i+3, t:2},{i:i+4, t:1},{i:i+5, t:1},{i:i+6, t:1},{i:i+7, t:1}];
                    }
                }
            }
        }
    },//It's date (US)
    {
        name:"It's a Leap Day!",
        desc:"Includes a leap day in DDMMYYYY.",
        find: function(n){
            if(n.length < 8) return false;
            for(var i = 0; i <= n.length-8; i++){
                if(
                    (eval(n[i+4])*1000 + eval(n[i+5])*100 + eval(n[i+6])*10 + eval(n[i+7]))%4 == 0 &&
                    eval(n[i])*10 + eval(n[i+1]) == 29 &&
                    eval(n[i+2])*10 + eval(n[i+3]) == 2
                ){
                    return true;
                }
            }
            return false;
        },
        rarity: function(n){
            return patternRarity("leap", function(){ return datePatterns(false, true); }, n.length);
        },
        transitions: function(n){
            //find the smallest number
            let R = [];
            for(var i = 0; i <= n.length-8; i++){
                if(
                    (eval(n[i+4])*1000 + eval(n[i+5])*100 + eval(n[i+6])*10 + eval(n[i+7]))%4 == 0 &&
                    eval(n[i])*10 + eval(n[i+1]) == 29 &&
                    eval(n[i+2])*10 + eval(n[i+3]) == 2
                ){
                    return [{i:i, t:1},{i:i+1, t:1},{i:i+2, t:2},{i:i+3, t:2},{i:i+4, t:1},{i:i+5, t:1},{i:i+6, t:1},{i:i+7, t:1}];
                }
            }
        }
    },//It's a leap day
    {
        name:"It's a Leap Day! (US)",
        desc:"Includes a leap day in MMDDYYYY.",
        find: function(n){
            if(n.length < 9) return false;
            for(var i = 0; i <= n.length-8; i++){
                if(
                    (eval(n[i+4])*1000 + eval(n[i+5])*100 + eval(n[i+6])*10 + eval(n[i+7]))%4 == 0 &&
                    eval(n[i+2])*10 + eval(n[i+3]) == 29 &&
                    eval(n[i])*10 + eval(n[i+1]) == 2
                ){
                    return true;
                }
            }
            return false;
        },
        rarity: function(n){
            return patternRarity("leapUS", function(){ return datePatterns(true, true); }, n.length);
        },
        transitions: function(n){
            //find the smallest number
            let R = [];
            for(var i = 0; i <= n.length-8; i++){
                if(
                    (eval(n[i+4])*1000 + eval(n[i+5])*100 + eval(n[i+6])*10 + eval(n[i+7]))%4 == 0 &&
                    eval(n[i+2])*10 + eval(n[i+3]) == 29 &&
                    eval(n[i])*10 + eval(n[i+1]) == 2
                ){
                    return [{i:i, t:1},{i:i+1, t:1},{i:i+2, t:2},{i:i+3, t:2},{i:i+4, t:1},{i:i+5, t:1},{i:i+6, t:1},{i:i+7, t:1}];
                }
            }
        }
    },//It's a leap day (US)
    {
        name:"Pesky Heterogenus",
        desc:"Every digit is unique... except one shows up twice.",
        find: function(n){
            if(n.length > 11) return false;
            let p = 0;
            for(var i = 0; i < n.length; i++){
                for(var j = i+1; j < n.length; j++){// j > i so each pair is only counted once
                    if(n[i] == n[j]){
                        p += 1;
                        if(p == 2) return false;
                    }
                }
            }
            if(p == 1) return true;
            return false;
        },
        rarity: function(n){
            // Ignoring the "no leading 0" rule: pick the doubled digit (10), pick the other L-2
            // different digits (C(9, L-2)), then arrange them (L!/2).
            // Every digit is equally likely to be first, so 1/10 of those start with 0.
            // P = (9/10 * 10 * C(9,L-2) * L!/2) / (9 * 10^(L-1)) = 5 * C(9,L-2) * L! / 10^L
            var L = n.length;
            if(L < 2 || L > 11) return 0;
            var C = 1;// C(9, L-2)
            for(var k = 0; k < L-2; k++) C = C * (9 - k) / (k + 1);
            var f = 1;// L!
            for(var k = 2; k <= L; k++) f *= k;
            return 5 * C * f / 10 ** L;
        },
        transitions: function(n){
            //whatever sorcery this is
            var N = [];
            for(var i = 0; i < n.length; i++){
                var c = false;
                for(var j = 0; j < n.length; j++){
                    if(n[i] == n[j] && i != j){
                        c = true;
                        N.push({i:i, t:2});
                        break;
                    }
                }
                if(!c){
                    N.push({i:i, t:3});
                }
            }
            return N;
        }
    },//Pesky Heterogenus
    {
        name:"Three's a Match",
        desc:"The same digit appears three times in a row.",
        find: function(n){
            if(n.length < 3) return false;
            for(var i = 0; i <= n.length-3; i++){
                if(
                    n[i] == n[i+1] && n[i+1] == n[i+2]
                ){
                    return true;
                }
            }
            return false;
        },
        rarity: function(n){
            return runRarity(n.length, 3);// same digit 3 times in a row
        },
        transitions: function(n){
            //find the smallest number
            let R = [];
            for(var i = 0; i <= n.length-3; i++){
                if(
                    n[i] == n[i+1] && n[i+1] == n[i+2]
                ){
                    R.push({i:i, t:1},{i:i+1, t:1},{i:i+2, t:1});
                    return R;
                }
            }
        }
    },//Three's a Match
    {
        name:"Four's a Match",
        desc:"The same digit appears four times in a row.",
        find: function(n){
            if(n.length < 4) return false;
            for(var i = 0; i <= n.length-4; i++){
                if(
                    n[i] == n[i+1] && n[i+1] == n[i+2] && n[i+2] == n[i+3]
                ){
                    return true;
                }
            }
            return false;
        },
        rarity: function(n){
            return runRarity(n.length, 4);// same digit 4 times in a row
        },
        transitions: function(n){
            //find the smallest number
            let R = [];
            for(var i = 0; i <= n.length-4; i++){
                if(
                    n[i] == n[i+1] && n[i+1] == n[i+2] && n[i+2] == n[i+3]
                ){
                    R.push({i:i, t:1},{i:i+1, t:1},{i:i+2, t:1},{i:i+3, t:1});
                    return R;
                }
            }
        }
    },//Four's a Match
    {
        name:"Five's a Match",
        desc:"The same digit appears five times in a row.",
        find: function(n){
            if(n.length < 5) return false;
            for(var i = 0; i <= n.length-5; i++){
                if(
                    n[i] == n[i+1] && n[i+1] == n[i+2] && n[i+2] == n[i+3] && n[i+3] == n[i+4]
                ){
                    return true;
                }
            }
            return false;
        },
        rarity: function(n){
            return runRarity(n.length, 5);// same digit 5 times in a row
        },
        transitions: function(n){
            //find the smallest number
            let R = [];
            for(var i = 0; i <= n.length-5; i++){
                if(
                    n[i] == n[i+1] && n[i+1] == n[i+2] && n[i+2] == n[i+3] && n[i+3] == n[i+4]
                ){
                    R.push({i:i, t:1},{i:i+1, t:1},{i:i+2, t:1},{i:i+3, t:1},{i:i+4, t:1});
                    return R;
                }
            }
        }
    },//Five's a Match
    {
        name:"Zigzag",
        desc:"Every digits swaps between increasing and decreasing.",
        find: function(n){
            if(n.length < 3) return false;
            // every step has to go up or down (no flat steps), and the opposite way to the step before
            var last = 0;// +1 = last step went up, -1 = went down
            for(var i = 0; i < n.length-1; i++){
                var step = Math.sign(n[i+1] - n[i]);
                if(step == 0 || step == last) return false;
                last = step;
            }
            return true;
        },
        rarity: function(n){
            // Whether the next step can go up or down depends on the last digit (after a 9 it can't
            // go up), so the steps aren't independent. Track the last digit and the last step instead:
            // up[d] / down[d] = chance the digits zigzag so far, ending on digit d after an up / down step
            var L = n.length;
            if(L < 3) return 0;
            var up = new Array(10).fill(0), down = new Array(10).fill(0);
            // first step: first digit a is 1-9, second digit b is 0-9
            for(var a = 1; a <= 9; a++){
                for(var b = 0; b <= 9; b++){
                    if(b > a) up[b] += 1/90;
                    if(b < a) down[b] += 1/90;
                }
            }
            for(var i = 2; i < L; i++){
                var nu = new Array(10).fill(0), nd = new Array(10).fill(0);
                for(var d = 0; d <= 9; d++){
                    for(var e = 0; e <= 9; e++){
                        if(e < d) nd[e] += up[d] / 10;// went up, so now go down
                        if(e > d) nu[e] += down[d] / 10;// went down, so now go up
                    }
                }
                up = nu; down = nd;
            }
            var total = 0;
            for(var d = 0; d <= 9; d++) total += up[d] + down[d];
            return total;


        },
        transitions: function(n){
            //{ i:index, t:(1 = basic bounce, 2 = comp bounce, 3 = basic, 4 = comp) }
            var x = [];
            for(var i = 0; i < n.length/2; i++){
                x.push({i:i*2, t:1},{i:i*2+1, t:2});
            }
            return x;
        }
    },//Zigzag
    {
        name:"Rugged Landscape",
        desc:"Every digits swaps between increasing and decreasing, with flat areas allowed.",
        find: function(n){
            if(n.length < 3) return false;
            // every step has to go up or down (no flat steps), and the opposite way to the step before
            var last = 0;// +1 = last step went up, -1 = went down
            for(var i = 0; i < n.length-1; i++){
                var step = Math.sign(n[i+1] - n[i]);
                if(step == last) return false;
                if(step != 0) last = step;
            }
            return true;
        },
        rarity: function(n){
            // Whether the next step can go up or down depends on the last digit (after a 9 it can't go up),
            // so the steps aren't independent. Track the last digit and the last step instead:
            // up[d] / down[d] = chance the digits zigzag so far, ending on digit d after an up / down step
            var L = n.length;
            if(L < 3) return 0;
            var up = new Array(10).fill(0), down = new Array(10).fill(0);
            // first step: first digit a is 1-9, second digit b is 0-9
            for(var a = 1; a <= 9; a++){
                for(var b = 0; b <= 9; b++){
                    if(b >= a) up[b] += 1/90;
                    if(b <= a) down[b] += 1/90;
                }
            }
            for(var i = 2; i < L; i++){
                var nu = new Array(10).fill(0), nd = new Array(10).fill(0);
                for(var d = 0; d <= 9; d++){
                    for(var e = 0; e <= 9; e++){
                        if(e <= d) nd[e] += up[d] / 10;// went up, so now go down
                        if(e >= d) nu[e] += down[d] / 10;// went down, so now go up
                    }
                }
                up = nu; down = nd;
            }
            var total = 0;
            for(var d = 0; d <= 9; d++) total += up[d] + down[d];
            return total;


        },
        transitions: function(n){
            //{ i:index, t:(1 = basic bounce, 2 = comp bounce, 3 = basic, 4 = comp) }
            var x = [];
            for(var i = 0; i < n.length/2; i++){
                x.push({i:i*2, t:1},{i:i*2+1, t:2});
            }
            return x;
        }
    },//Rugged Landscape

    // Rolle's Theorem - The first, last, and one of the middle digits are the same digit.
    // Majority Digit - A digit appears more times than all the other digits combined.

    //exceptions (All But One)

    {
        name:"All But One",
        desc:"Incudes every digit except one.",
        find: function(n){
            var t = ['0','1','2','3','4','5','6','7','8','9'];
            var V = 0;
            var z = n.join("");
            for(var j = 0; j < t.length; j++){
                if (z.split(t[j]).length - 1 != 0){
                    V++;
                }
            }
            if(V == 9) return true;
            return false;
        },
        rarity: function(n){
            // S = ways to fill L spots so all 9 digits of a 9-digit set show up (inclusion-exclusion):
            //     S = sum over k of (-1)^k * C(9,k) * (9-k)^L
            // Missing 0: first digit is never 0, so S numbers.
            // Missing 1-9 (9 ways): 1/9 of them start with 0, so 8/9 * S each.
            // Total = 9 * S, out of 9 * 10^(L-1) numbers  ->  P = S / 10^(L-1)
            var L = n.length;
            if(L < 9) return 0;
            var C = 1, p = 0;// C = C(9,k)
            for(var k = 0; k <= 9; k++){
                p += (k % 2 == 0 ? 1 : -1) * C * 10 * ((9 - k) / 10) ** L;
                C = C * (9 - k) / (k + 1);
            }
            return p;
        },
        transitions: function(n){
            //whatever sorcery this is
            const N = Array.from({ length: n.length }, (_, i) => i + 1);
            return N.map(x => ({i:x-1, t:1}));
        }
    },//All But One


]

/*
    {
        name:"Example Name",
        desc:"Example: The number doesn't have a six.",
        find: function(n){
            for(var i = 0; i < n.length; i++){
                if(n[i] == "6"){
                    return false;
                }
            }
            return true;
        },
        rarity: function(n){
            return  (8/9) * (9/10) ** (n.length-1);
        },
        transitions: function(n){
            //{ i:index, t:(1 = basic bounce, 2 = comp bounce, 3 = basic, 4 = comp) }
            var x = [];
            for(var i = 0; i < n.length/2; i++){
                x.push({i:i, t:1},{i:i+(n.length/2), t:2});
            }
            return x;
        }
    },//Example Name

*/

//exacts
exactEval({name:"Devil", desc:"Includes 6 three times in a row.", lookfor:"666"});
exactEval({name:"Nice", desc:"Includes 69.", lookfor:"69"});
exactEval({name:"PERFECT 1 DECK", desc:"Includes 1234567890.", lookfor:"1234567890"});
exactEval({name:"PERFECT 0 DECK", desc:"Includes 0123456789.", lookfor:"0123456789"});
exactEval({name:"PERFECT INVERSE DECK", desc:"Includes 9876543210.", lookfor:"9876543210"});
exactEval({name:"PI", desc:"Includes 314.", lookfor:"314"});
exactEval({name:"Extended PI", desc:"Includes 3141.", lookfor:"3141"});
exactEval({name:"Extended PI 2", desc:"Includes 31415.", lookfor:"31415"});
exactEval({name:"E", desc:"Includes 271.", lookfor:"271"});
exactEval({name:"Extended E", desc:"Includes 2718.", lookfor:"2718"});
exactEval({name:"Extended E 2", desc:"Includes 27182.", lookfor:"27182"});
exactEval({name:"Jackpot", desc:"Includes 777.", lookfor:"777"});
exactEval({name:"67", desc:"Includes 67.", lookfor:"67"});
exactEval({name:"1337", desc:"Includes 1337.", lookfor:"1337"});
exactEval({name:"Bond", desc:"Includes 007.", lookfor:"007"});
exactEval({name:"An A+!", desc:"Includes 100.", lookfor:"100"});
exactEval({name:"Not Found", desc:"Includes 404.", lookfor:"404"});
exactEval({name:"Police", desc:"Includes 911.", lookfor:"911"});
exactEval({name:"Police (EU)", desc:"Includes 112.", lookfor:"112"});
exactEval({name:"Police (VIET)", desc:"Includes 113.", lookfor:"113"});
exactEval({name:"AHHHHHHH", desc:"Includes 800.", lookfor:"800"});
exactEval({name:"Calculator joke", desc:"Includes 8008.", lookfor:"8008"});
exactEval({name:"Calculator joke 2", desc:"Includes 80085.", lookfor:"80085"});
exactEval({name:"Calculator joke 3", desc:"Includes 8008135.", lookfor:"8008135"});
exactEval({name:"42", desc:"Includes the answer to the universe.", lookfor:"42"});
exactEval({name:"Boeing 737", desc:"Includes 737.", lookfor:"737"});
exactEval({name:"Boeing 747", desc:"Includes 747.", lookfor:"747"});
exactEval({name:"Monosodium Glutamate", desc:"Includes 621.", lookfor:"621"});
exactEval({name:"Monosodium Glutamate 2", desc:"Includes 3621.", lookfor:"3621"});

exactEval({name:"Three of Threes", desc:"Includes three three times in a row.", lookfor:"333"});
exactEval({name:"Four of Fours", desc:"Includes four four times in a row.", lookfor:"4444"});
exactEval({name:"Five of Fives", desc:"Includes five five times in a row.", lookfor:"55555"});
exactEval({name:"Six of Sixes", desc:"Includes six six times in a row.", lookfor:"666666"});
exactEval({name:"Seven of Sevens", desc:"Includes seven seven times in a row.", lookfor:"7777777"});
exactEval({name:"Eight of Eights", desc:"Includes eight eight times in a row.", lookfor:"88888888"});
exactEval({name:"Nine of Nines", desc:"Includes nine nine times in a row.", lookfor:"999999999"});

HasZeros();