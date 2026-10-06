export class Spawn {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.priority = 5;
        this.redTeam = true;
        this.blueTeam = true;
        this.greenTeam = true;
        this.yellowTeam = true;
        this.freeForAll = true;
        this.name = "Spawn";
    }

    draw(ctx, map) {
        this.colors = [];
        if(this.freeForAll) {
        this.colors.push('#1abc9c');
        }
        if(this.redTeam) {
        this.colors.push('#D32F2F');
        }
        if(this.blueTeam) {
        this.colors.push('#448aff');
        }
        if(this.greenTeam) {
        this.colors.push('#177819');
        }
        if(this.yellowTeam) {
        this.colors.push('#ffd90e');
        }
        if(!this.freeForAll && !this.redTeam && !this.blueTeam && !this.greenTeam && !this.yellowTeam) {
        this.colors.push('#91ada7');
        }

        if(this.colors.length <= 1) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[0];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        }

        if(this.colors.length == 2) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[0];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[1];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, Math.PI * -1/4, Math.PI * 3/4);
        ctx.fill();
        ctx.restore();
        }

        if(this.colors.length == 3) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[1];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[0];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, Math.PI * -8/7, Math.PI * -5/14);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[2];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, Math.PI * -1/7, Math.PI * 9/14);
        ctx.fill();
        ctx.restore();
        }

        if(this.colors.length == 4) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[0];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[1];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, Math.PI * -5/12, Math.PI * 11/12);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[2];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, Math.PI * -1/4, Math.PI * 3/4);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[3];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, Math.PI * -1/12, Math.PI * 7/12);
        ctx.fill();
        ctx.restore();

        }

        if(this.colors.length == 5) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[0];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[1];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, Math.PI * -21/46, Math.PI * 22/23);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[2];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, Math.PI * -7/22, Math.PI * 9/11);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[3];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, Math.PI * -2/11, Math.PI * 15/22);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.colors[4];
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, Math.PI * -1/23, Math.PI * 25/46);
        ctx.fill();
        ctx.restore();

        }

    }
    shadow(ctx, map) {
        ctx.save();
        ctx.translate(this.x+2, this.y+2);
        ctx.fillStyle = '#0000001a';
        ctx.beginPath();
        ctx.arc(0, 0, map.physics.partsPerMeter, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            xv: this.xVelocity,
            yv: this.yVelocity,
            priority: this.priority,
            r: this.redTeam,
            b: this.blueTeam,
            gr: this.greenTeam,
            ye: this.yellowTeam,
            f: this.freeForAll,
            n: this.name
        }
    }

    static fromJSON(json) {
        const spawn = new Spawn();
        spawn.x = json.x;
        spawn.y = json.y;
        spawn.xVelocity = json.xv;
        spawn.yVelocity = json.yv;
        spawn.priority = json.priority;
        spawn.redTeam = json.r;
        spawn.blueTeam = json.b;
        spawn.greenTeam = json.gr;
        spawn.yellowTeam = json.ye;
        spawn.freeForAll = json.f;
        spawn.name = json.n;
        return spawn;
    }
}