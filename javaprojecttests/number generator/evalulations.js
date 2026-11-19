
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
                for(var i = 0; i < 3; i++) Z.push({i:starts[c]+i, t:1});
            }
            return Z;
        }
    },//DOUBLE JACKPOT

    //conditions  (Palindromes, Primes, includes pairs)

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

    //ranges (Heavy as a rock, Light as a feather)

    //exceptions (Doesn't include a digit)

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
                x.push({i:i, t:1},{i:i+(n.length/2), t:1});
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
    },//One or the Other
    {
        name:"Loop",
        desc:"The first and last digit are the same.",
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
            return [{i:0, t:1},{i:n.length-1, t:1}];
        }
    },//Loop
    {
        name:"Loop 2",
        desc:"The first and last two digits are the same.",
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
        desc:"The first and last two digits are mirrrors.",
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
            return [{i:0, t:1},{i:n.length-1, t:1},{i:1, t:1},{i:n.length-2, t:1}];
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
            for(var i = 0; i < n.length/2; i++){
                x.push({i:i*2, t:1});
            }
            for(var i = 0; i < n.length/2; i++){
                x.push({i:i*2+1, t:1});
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
                x.push({i:i, t:1},{i:i+(n.length/2), t:1});
            }
            return x;
        }
    },//Sister Pairs
]

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
exactEval({name:"Bond", desc:"Includes 007.", lookfor:"007"});
exactEval({name:"An A+!", desc:"Includes 100.", lookfor:"100"});

HasZeros();