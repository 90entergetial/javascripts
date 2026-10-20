
    var subproblemtypes = {
        "Basic Arithmetic": {
            "Straight Addition": [
                {
                    discovered: false,
                    format: function(a, b) { return "x =  " + a + " + " + b; },
                    answer: function(a, b) { return a + b; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 11), b: Math.floor(Math.random() * 11)};
                    }
                },
            ],
            "Variable Addition": [
                {
                    discovered: false,
                    format: function(a, b) { return a + " = x + " + b; },
                    answer: function(a, b) { return a - b; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 11), b: Math.floor(Math.random() * 11)};
                    }
                },
                {
                    discovered: false,
                    format: function(a, b) { return a + " =  " + b + " + x"; },
                    answer: function(a, b) { return a - b; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 11), b: Math.floor(Math.random() * 11)};
                    }
                }
            ],
            "Straight Subtraction": [
                {
                    discovered: false,
                    format: function(a, b) { return "x =  " + a + " - " + b; },
                    answer: function(a, b) { return a - b; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 11), b: Math.floor(Math.random() * 11)};
                    }
                },
            ],
            "Variable Subtraction": [
                {
                    discovered: false,
                    format: function(a, b) { return a + " = x - " + b; },
                    answer: function(a, b) { return a + b; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 11), b: Math.floor(Math.random() * 11)};
                    }
                },
                {
                    discovered: false,
                    format: function(a, b) { return a + " = " + b + " - x"; },
                    answer: function(a, b) { return b - a; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 11), b: Math.floor(Math.random() * 11)};
                    }
                },
            ],
            "Repeated Addition": [
                {
                    discovered: false,
                    format: function(a, b) { 
                        var str = (" + " + a).repeat(b-1);
                        return "x =  " + a + str;
                    },
                    answer: function(a, b) { return a * b; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 10) + 1, b: Math.floor(Math.random() * 5) + 1};
                    }
                },
            ],
            "Straight Mutliplication": [
                {
                    discovered: false,
                    format: function(a, b) { return "x =  " + a + " \\cdot " + b; },
                    answer: function(a, b) { return a * b; },
                    customrandom: function() { 
                        return {a: Math.floor(Math.random() * 11), b: Math.floor(Math.random() * 11)};
                    }
                },
            ],

        }
    }