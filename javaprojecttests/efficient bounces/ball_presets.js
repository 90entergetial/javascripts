//For me, preset balls.
var ball_variants = [
    {type: "triangle",
        ball: {
            in_box: 0, // replaced by addBall()
            gravity:0.6,
            r:20,
            x:0,
            y:300,
            color: "rgb(98, 104, 176)",
            // Functions get called by addBall(), so each ball gets its own random value.
            dx: () => Math.random()*0.1 + 3,
            dy: () => Math.random()*0.1 + 3,
            bounciness: 0.994,
            bouncemax: 8,
            damage: 1n,
            hits: 0,
            note: function (n, type){
                var sounds = [92,96,99,101,103,104,108,104,103,101,99,96,92,91];
                
                // The frequency of the note with and without time-dependency.
                this.freq = "sin(x/10)*(x/10)+" + (2**((sounds[n%(sounds.length)]+(Math.floor(n/(14*5))%12)*2)/12));
                this.freq_no_x = 2**((sounds[n%(sounds.length)]+(Math.floor(n/(14*5))%12)*2)/12);

                // return [frequency, volume, start time, sustain time, end time]
                if(type === "sound"){
                    return [this.freq, 0.05, 0, 0, 100];
                }
                if(type == "checkmax"){
                    if(this.freq_no_x > 80000) return false;
                    if(this.freq_no_x < 20) return false;
                    return true;
                }

                //plays if it breaks a block.
                if(type == "break"){
                    return [[1000, 8000], 0.05, 0, 10, 200];
                }
            },
            sequence: function (N){
                return (N * (N-1n))/2n;
            }
        }
    },
    {type: "factorial",
        ball: {
        in_box: 0,
        gravity:0.6,
        r:25,
        x:0,
        y:300,
        color: "rgb(74, 151, 150)",
        dx:() => Math.random()*0.1 + 3,
        dy:() => Math.random()*0.1,
        bounciness: 0.995,
        bouncemax: 20,
        damage: 1n,
        hits: 0,
        note: function (n, type){
            
            // The frequency of the note with and without time-dependency.
            this.freq = "(1/((x/300)+1))*" + (2**((80+n)/12));
            this.freq_no_x = (2**((80+n)/12));

            // return [frequency, volume, start time, sustain time, end time]
            if(type === "sound"){
                return [this.freq, 0.3, 0, 100, 2000];
            }
            if(type == "checkmax"){
                if(this.freq_no_x > 80000) return false;
                if(this.freq_no_x < 20) return false;
                return true;
            }

            //plays if it breaks a block.
            if(type == "break"){
                return [[500, 2000], 0.03, 0, 10, 2000];
            }
        },
        sequence: function (N){
            if(N == 0n) return 1n;
            return (N * this.sequence(N-1n));
        }
        },
    },
    {type: "powers of two",
        ball: {
        in_box: 0,
        gravity:0.6,
        r:20,
        x:0,
        y:300,
        color: "hsl(16, 34%, 44%)",
        dx:() => Math.random()*0.1 + 3,
        dy:() => Math.random()*0.1,
        bounciness: 0.99,
        bouncemax: 15,
        damage: 1n,
        hits: 0,
        note: function (n, type){
            
            // The frequency of the note with and without time-dependency.
            this.freq_no_x = (2**((75+n)/12));
            this.freq = "-(0.5)*" + (this.freq_no_x)+ "*exp(-(x)/150)+" + (2**((75+n)/12));

            // return [frequency, volume, start time, sustain time, end time]
            if(type === "sound"){
                return [this.freq, 0.3, 0, 0, 800];
            }
            if(type == "checkmax"){
                if(this.freq_no_x > 80000) return false;
                if(this.freq_no_x < 20) return false;
                return true;
            }

            //plays if it breaks a block.
            if(type == "break"){
                    return [[1000, 8000], 0.05, 0, 10, 200];
            }
        },
        sequence: function (N){
            return 2n**N;
        }
        },
    },
    {type: "Pell",
        ball: {
        in_box: 0,
        gravity:0.6,
        r:30,
        x:0,
        y:300,
        color: "hsl(261, 64%, 43%)",
        dx:() => Math.random()*0.1 + 1,
        dy:() => Math.random()*0.1,
        bounciness: 0.9,
        bouncemax: 15,
        damage: 1n,
        hits: 0,
        note: function (n, type){
            
            // The frequency of the note with and without time-dependency.
            this.freq_no_x = (2**((80+n)/12));
            this.freq = "55*((-1)^x)+" + (2**((80+n)/12));

            // return [frequency, volume, start time, sustain time, end time]
            if(type === "sound"){
                return [this.freq, 0.3, 0, 0, 1000];
            }
            if(type == "checkmax"){
                if(this.freq_no_x > 80000) return false;
                if(this.freq_no_x < 20) return false;
                return true;
            }

            //plays if it breaks a block.
            if(type == "break"){
                    return ["220+55*((-1)^x)", 0.3, 0, 10, 2000];
            }
        },
        sequence: function (N){
            return N**N**N;
        }
        },
    }
]