smooth();
noStroke();
rectMode(CENTER);
textAlign(CENTER,CENTER);

//If other things are playing with sound, this tab will interrupt them (even when muted). Put this to false if that happens!
//If you set this to false, you can't make squares while afk (no problem).
var activewhentabbed = true;

/**

Mar 31 2024:
- I did some very smol stuff but i forgot to record them in here its fine lol
- If you want dev mode try changing the variable isclosed to "idk"
- Posted this to my real account thing because why not its an update i guess

Feb 15 2024:
- I accidentally left this tab open for the entire day while my pc was off and this said 12 hours spent and I got 10 billion freaking squares (using math I would've gotten 12 billion instead, checks out) wow I guess this works lol 


Feb 14 2024:
- yes hi
- added more upgrades so now every helper has 5
- 3000+ LINES NICE

Feb 12 2024:
- it was a weekend ok
- made the biggest number a vingintillion now the text goes over but eh ok
- the amount of squares you get per second is now dependent on your framerate and not just thinking you are always on 60fps
- another helper, the multiplier!
- added shortfor so i can show big num bers easier, only a code thing you wont see it
- im currently making upgrades for the condenser

Feb 8 2024:
- Procrastination 999 anyways im back hi there
- Golden squares spawn after 307 seconds and not 177 because ITS TOO FAST
- Made it so helpers are only visible if you unlocked the one two before it
- Moved activewhentabbed on the top because easier to reach
- My code is clean as it can be but it looks very confusing lol this is crazy
- YO CHILL +2500 lines

Nov 15 2023:
- Im back and im addone MORE UPGRADES YEAHHHHHH

Nov 2 2023:
- Golden square no longer appears after first frame of program opening
- Golden squares give you C L I C K I N G  P O W E R
- added factor upgrades
- added click power timer thing

Oct 30 2023:
- Make clicking upgrades more powerful

Oct 29 2023:
- After a bit (a lot) of tweaking, upgrades are now seperated easier AND orders by cost! Thanks to 1001programmer1001 with the sorting!

Oct 28 2023:
- OOPS I forgot to change the desc of Condenser, ok fixed that

Oct 27 2023:
- Added Condenser, it's 128 times more expensive then factor, and 64 times more powerful!
- THE GOLDEN SQUARE SAID COOKIES AND NOT SQUARES WHATTETYRETYRERTHRFEUJTYU
- Making more clicking upgrades because clicking is becoming more useless which is bad
- Fixed that

Oct 26 2023:
- Added some duper upgrades
- 24 upgrades so far!
- All helper upgrades end at 25 helpers so far, except Maker, which ends at 50
- Factor has no upgrades yet I need a icon for it and I dont got idea for it yet

Oct 25 2023:
- Added Maker upgrade at 5 Makers
- Added 5 more square multiplier thingies
- back to 2000+ lines!!!
- Added Factor helper thing
- Your cursor changes to pointer when hovering over a golden square

Oct 24 2023:
- gold square boi made, spawns every 177 seconds (wanted something to do with 7) and gives you squares/7+10 more squares
- Achievements gone for now, it's useless lel
- Deleting Achievements removed like 300 lines so now im at 1900 lines lel

Oct 23 2023:
- added square multipliers
- Yeah I need to sort upgrades by price... uhhhh I'll do that later
- fixed upgrade bug where it shows an invisible upgrade that doesn't exist
- Might add another helper..
- Oh yeah, need to make golden cookies but not cookies they are squares
- 2% increases are something you can't see in early game, made prices of square multipliers higher
- gg 2000 lines

Oct 21 2023:
- balanced some stuff
- added timer, goes into hours

Oct 20 2023:
- Added a way to play when tabbed
- more upgrades :p
- Man I gottta rebalance... this is supposed to be a partially quick game btw


Oct 19 2023:
- back lol
- changed some descriptions on helpers

Sep 14 2023:
- 2 upgrades added... uhhhhh thats all

Sep 13 2023:
- I am no longer stuck, made the first one, the price is EXACTLY like the cursor in cookie clicker (it was *=1.15! And it took me 2 tries!)
- Made Square Maker, first helper thing

Sep 5 2023:
- Man I'm stuck :/

Sep 1 2023:
- going to start making helpers now
- anytime now

August 31 2023:
- Upgrades actually work now!

August 30 2023:
- Made code 0.1% less confusing, trying to made upgrades :P
- Icons exist

August 29 2023:
- Made the first achievement, click 10 times, my code is a pain

August 25 2023:
- achivememnts... yeah

August 24 2023:
- made stats less complicated
- Wow I made the abbreviation of squares per second into SPC wow just wow

August 23 2023:
- hi just started making this
- not a lot so far
- numbershortener goes up to quadrillion for starts
- only thing I made is the big square and the square counters so far
- haha big square go wobble wobble
- added +(# of squares per click) thing that appears when the big square is clicked
- made screen bigger (700x900) starting to regret it because the editor is now smaller
- use (?height=700&width=900) please i beg
- stats button, also border lines
- Got achivements button, no achievements yet
- squares, per click, and per second work perfectly
**/
//Thank You Center: 1001programmer1001

var sond = getSound("rpg/hit-thud");

var keys = [];
keyPressed = function(){keys[keyCode] = true;};
keyReleased = function(){delete keys[keyCode];};

var font = createFont("monospace");
//i dont know why this exists but ok
var Wh = width;
var Ht = height;

var square = 0;
var SPS = 0;
var SPCLICK = 0;
var SPSBONUS = 0;
var SPCLICKSPSBONUS = 0;
var SPCLICKBONUS = 1;

var isopen = "none";
var isclosed = "none";
//equality to opensesame

var mousex = mouseX;
var mousey = mouseY;

var thefps = 60;

var shortfor = {
    
    million:1e6,
    billion:1e9,
    trillion:1e12,
    quadillion:1e15,
    quintillion:1e18,
    
};

//dont touch this
var goldentype = {

bigtimerthing: (~~(millis()/1000)),
bigtimething2: -1000,
s: 0,
update: false,
on: false,

};

//for stats
{
var STAT = {
    
    clicks:0,
    clicks2:0,
    total:0,
    sec:0,
    min:0,
    hour:0,
    raw:0,
    helpersbought:0,
    upgradesbought:0,
    
};

var statnum = [SPS,SPCLICK + (SPS*(SPCLICKSPSBONUS/100)),STAT.clicks];

var statshow = [
    
    ["Current amount of squares:"],
    ["Squares per second:"],
    ["Raw squares per second:"],
    ["Squares per click:"],
    ["Times big square was clicked:"],
    ["Squares made from clicking:"],
    ["Squares made (all time):"],
    ["Time since start:"],
    ["Helpers bought:"],
    ["Upgrades bought:"],
    
    
    
    ];
}//stats

//IDs:
var upgradeID = [
    
    //{
    {
    
        name:"Square to click",
        desc:"Get +1 extra CPS.",
        descdesc:' \n"Finally! \nMy clicks have meaning!"',
        ID:2,
        Hsize:81,
        amount:0,
        
        typeID:0,
        typeAM:1,
        
        put:false,
        active:false,
        aactive:false,
    
    },//cursor 0
    {
    
        name:"More sqaures",
        desc:"Square Makers are twice as efficient.",
        descdesc:' \n\n"Square, but more"',
        ID:4,
        Hsize:81,
        amount:75,
        
        typeID:1,
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//maker 1
    {
    
        name:"Even more squares",
        desc:"Square Makers are twice as efficient.",
        descdesc:' \n\n"Wasn\'t fast enough!"',
        ID:5,
        Hsize:81,
        amount:250,
        
        typeID:1,
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//maker x2 2
    {
    
        name:"Just way faster",
        desc:"Square Makers are twice as efficient.",
        descdesc:' \n\n"Oh yeah.."',
        ID:6,
        Hsize:81,
        amount:2500,
        
        typeID:1,
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//maker x3 3
    {
    
        name:"Double speed",
        desc:"Square Makers are twice as efficient.",
        descdesc:' \n"Hehe square go\nBRRRRRRRRRR"',
        ID:7,
        Hsize:81,
        amount:25000,
        
        typeID:1,
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//maker x4 4
    {
    
        name:"Click",
        desc:"Clicking is twice as efficient.",
        descdesc:' \n\n"Multiply by 2"',
        ID:"cursor1",
        Hsize:81,
        amount:200,
        
        typeID:"Multiply CPS",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//cursor x2 5
    {
    
        name:"Times two",
        desc:"Square Adders are twice as efficient.",
        descdesc:' \n"Does this have to do\nwith addition?"',
        ID:"adder1",
        Hsize:81,
        amount:500,
        
        typeID:"Adder Multiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//adder 6
    {
    
        name:"Times four",
        desc:"Square Adders are twice as efficient.",
        descdesc:' \n\n"Creative title."',
        ID:"adder2",
        Hsize:81,
        amount:1500,
        
        typeID:"Adder Multiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//adder x2 7
    {
    
        name:"Times eight",
        desc:"Square Adders are twice as efficient.",
        descdesc:' \n\n"Once again..."',
        ID:"adder3",
        Hsize:81,
        amount:15000,
        
        typeID:"Adder Multiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//adder x3 8
    {
    
        name:"Times Sixteen",
        desc:"Square Adders are twice as efficient.",
        descdesc:' \n\n"...Wow."',
        ID:"adder4",
        Hsize:81,
        amount:1e5+5e4,
        
        typeID:"Adder Multiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//adder x4 9
    //} 0 to 9
    //{
    {
    
        name:"White Square",
        desc:"Squares per second multiplier +2%.",
        descdesc:' \n\n"First one, eh?"',
        ID:"whitesquare",
        Hsize:81,
        amount:500,
        
        typeID:"Bonus",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// WHITE square 10
    {
    
        name:"Black Square",
        desc:"Squares per second multiplier +2%.",
        descdesc:' \n"Honestly,\npretty nice color."',
        ID:"blacksquare",
        Hsize:81,
        amount:500,
        
        typeID:"Bonus",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// BLACK square 11
    {
    
        name:"Blue Square",
        desc:"Squares per second multiplier +2%.",
        descdesc:' \n"Got me thinking 0 0 255!\nPretty blue."',
        ID:"bluesquare",
        Hsize:81,
        amount:1000,
        
        typeID:"Bonus",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// BLUE square 12
    {
    
        name:"Green Square",
        desc:"Squares per second multiplier +2%.",
        descdesc:' \n\n"Grass green."',
        ID:"greensquare",
        Hsize:81,
        amount:2000,
        
        typeID:"Bonus",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// GREEN square 13
    {
    
        name:"Orange Square",
        desc:"Squares per second multiplier +2%.",
        descdesc:' \n\n"Orangeeeeeeeeee"',
        ID:"orangesquare",
        Hsize:81,
        amount:5000,
        
        typeID:"Bonus",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// ORANGE square 14
    {
    
        name:"Grey Square",
        desc:"Squares per second multiplier +2%.",
        descdesc:' \n"Grey, gray, I don\'t care, they\'re\nthe same color!"',
        ID:"greysquare",
        Hsize:81,
        amount:10000,
        
        typeID:"Bonus",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// GREY square 15
    {
    
        name:"One more square",
        desc:"Square Makers are twice as efficient.",
        descdesc:' \n\n"One isn\'t enough!"',
        ID:"squarewhite",
        Hsize:81,
        amount:150,
        
        typeID:1,
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// square x1 16
    {
    
        name:"Purple Square",
        desc:"Squares per second multiplier +2%.",
        descdesc:' \n\n"It\'s not pink."',
        ID:"purplesquare",
        Hsize:81,
        amount:50000,
        
        typeID:"Bonus",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// PURPLE square 17
    {
    
        name:"Yellow Square",
        desc:"Squares per second multiplier +2%.",
        descdesc:' \n"Hard to tell from orange. For me, at least."',
        ID:"yellowsquare",
        Hsize:81,
        amount:75000,
        
        typeID:"Bonus",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// YELLOW square 18
    {
    
        name:"Pink Square",
        desc:"Squares per second multiplier +2%.",
        descdesc:' \n"Not something you\'d see in a rainbow."',
        ID:"pinksquare",
        Hsize:81,
        amount:100000,
        
        typeID:"Bonus",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// PINK square 19
    //} 10 to 19
    //{
    
    {
    
        name:"Over and Over",
        desc:"Dupers are twice as efficient.",
        descdesc:' \n"I wonder...\nhow does it dupe?"',
        ID:"duper0",
        Hsize:81,
        amount:15000,
        
        typeID:"dupermultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// Duper x1 20
    {
    
        name:"Once again",
        desc:"Dupers are twice as efficient.",
        descdesc:' \n\n"Newfound exploits."',
        ID:"duper1",
        Hsize:81,
        amount:50000,
        
        typeID:"dupermultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// Duper x2 21
    {
    
        name:"Confusing Duping",
        desc:"Dupers are twice as efficient.",
        descdesc:' \n"This can\'t get more confusing!\n..I spoke too soon."',
        ID:"duper2",
        Hsize:81,
        amount:500000,
        
        typeID:"dupermultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// Duper x3 22
    {
    
        name:"Multiply Rapidly",
        desc:"Dupers are twice as efficient.",
        descdesc:' \n"I think that\'s called exponental growth."',
        ID:"duper3",
        Hsize:81,
        amount:5000000,
        
        typeID:"dupermultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },// Duper x4 23
    
    {
    
        name:"Time to click",
        desc:"Clicking gains 1% of your squares per second.",
        descdesc:' \n\n"clickity"',
        ID:"cursor2",
        Hsize:81,
        amount:2000,
        
        typeID:"clickcpsboost",
        typeAM:1,
        
        put:false,
        active:false,
        aactive:false,
    
    },//cursor x2 24
    {
    
        name:"Clickity time",
        desc:"Clicking gains 1% of your squares per second.",
        descdesc:' \n\n"clickityclickity"',
        ID:"cursor3",
        Hsize:81,
        amount:15000,
        
        typeID:"clickcpsboost",
        typeAM:1,
        
        put:false,
        active:false,
        aactive:false,
    
    },//cursor x3 25
    {
    
        name:"ITS CLICKING TIME",
        desc:"Clicking gains 2% of your squares per second.",
        descdesc:' \n\n"clickity; sponsored by Cookie Clicker"',
        ID:"cursor4",
        Hsize:96,
        amount:50000,
        
        typeID:"clickcpsboost",
        typeAM:1,
        
        put:false,
        active:false,
        aactive:false,
    
    },//cursor x4 26
    {
    
        name:"Factorial",
        desc:"Factors are twice as efficient.",
        descdesc:' \n"Got me thinking...\n..!"',
        ID:"factor0",
        Hsize:81,
        amount:85000,
        
        typeID:"factormultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//factor x1 27
    {
    
        name:"Multiply multiply",
        desc:"Factors are twice as efficient.",
        descdesc:' \n\n"Hehehehehehe"',
        ID:"factor1",
        Hsize:81,
        amount:250000,
        
        typeID:"factormultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//factor x2 28
    {
    
        name:"Question mark",
        desc:"Factors are twice as efficient.",
        descdesc:' \n\n"Huh? HUH????"',
        ID:"factor2",
        Hsize:81,
        amount:2500000,
        
        typeID:"factormultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//factor x3 29
    //} 20 to 29
    //{
    
    {
    
        name:"Semicolon",
        desc:"Factors are twice as efficient.",
        descdesc:' \n"Half of a colon..? I\ndon\'t get it."',
        ID:"factor3",
        Hsize:81,
        amount:25000000,
        
        typeID:"factormultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//factor x3 30
    {
    
        name:"Times Thirty-two",
        desc:"Square Adders are twice as efficient.",
        descdesc:' \n"How much powers\nis that?"',
        ID:"adder5",
        Hsize:81,
        amount:1500000,
        
        typeID:"Adder Multiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//maker x5 31
    {
    
        name:"Light Blue Square",
        desc:"Squares per second multiplier +2%.",
        descdesc:' \n"Is light blue the sky\nor the water?"',
        ID:"lightbluesquare",
        Hsize:81,
        amount:500000,
        
        typeID:"Bonus",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//LIGHT BLUE square 32
    {
    
        name:"Not Linear",
        desc:"Square Condesnsers are twice as efficient.",
        descdesc:' \n"1, 2, 4, 8, 16, 32... \nwait, what?"',
        ID:"condenser0",
        Hsize:81,
        amount:14*shortfor.million,
        
        typeID:"condensermultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//Condenser x1 33
    {
    
        name:"10^x",
        desc:"Square Condesnsers are twice as efficient.",
        descdesc:' \n"Powers of ten,\nI see."',
        ID:"condenser1",
        Hsize:81,
        amount:35*shortfor.million,
        
        typeID:"condensermultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//Condenser x2 34
    {
    
        name:"Log of x",
        desc:"Square Condesnsers are twice as efficient.",
        descdesc:' \n"NOT the powers of ten,\nI see."',
        ID:"condenser2",
        Hsize:81,
        amount:350*shortfor.million,
        
        typeID:"condensermultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//Condenser x3 35
    {
    
        name:"Huge Functions",
        desc:"Square Condesnsers are twice as efficient.",
        descdesc:' \n"5 equals 25 but 6 equals\ninfinity!?!"',
        ID:"condenser3",
        Hsize:81,
        amount:3.50*shortfor.billion,
        
        typeID:"condensermultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//Condenser x4 36
    {
    
        name:"Log of Log",
        desc:"Square Condesnsers are twice as efficient.",
        descdesc:' \n"0 is 10, but 1 is 10^10.\nOk."',
        ID:"condenser4",
        Hsize:81,
        amount:35*shortfor.billion,
        
        typeID:"condensermultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//Condenser x5 37
    {
    
        name:"2 and 5 is 10",
        desc:"Factors are twice as efficient.",
        descdesc:' \n"it\'s also 20, 40, 60, 80, 85,\nand... uhh..."',
        ID:"factor4",
        Hsize:81,
        amount:250*shortfor.million,
        
        typeID:"factormultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//Factor x4 38
    {
    
        name:"Not just twos",
        desc:"Dupers are twice as efficient.",
        descdesc:' \n"3, 6, 9, 12, 15...\nthrees! What!"',
        ID:"duper4",
        Hsize:81,
        amount:50*shortfor.million,
        
        typeID:"dupermultiply",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//Duper x5 39
    
    //} 30 to 39
    //{
    
    {
    
        name:"Red Orange Square",
        desc:"Squares per second multiplier +2%.",
        descdesc:' \n"Why does this color\neven exist!?"',
        ID:"redorangesquare",
        Hsize:81,
        amount:500000,
        
        typeID:"Bonus",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,
    
    },//RED ORANGE square 40
    {
    
        name:"Brown Square",
        desc:"Squares per second multiplier +2%.",
        descdesc:' \n"It\'s better than red orange,\nat least!"',
        ID:"brownsquare",
        Hsize:81,
        amount:750000,
        
        typeID:"Bonus",
        typeAM:2,
        
        put:false,
        active:false,
        aactive:false,

    },//BROWN square 41
    
    //} 40 to 49
    
    ];

var lesize = 100;

var lesiz = 120;

var lesi = 0;

{

var clicked = false;
var pressed = false;
var released = false;
mouseClicked = function(){clicked = true;};
mousePressed = function(){pressed = true; released = false;};
mouseReleased = function(){pressed = false; released = true;};
}//mousestuff

var numbrs = ["septillion","octillion","nonillion","decillion","undecillion","duodecillion","tredecillion","quatturodecillion","quindecillion","sedecillion","septendecillion","octodecillion","novendecillion","vingintillion"];

function numbershortener(num,dec){
    
    
    if(num < 1000){
        
        if(dec){
        return ~~(num*10)/10;
        } else {
        return ~~num;
        }
    }
    else if(num < 1e6){
        
        
        var y = "";
        y += ~~num;
        var yy = "";
        for(var i = 0; i < y.length; i++){
            
            yy += y[i];
            
            if(i - y.length === -4){
                
                yy += ",";
                
            }
            
        }
        
        return yy;
        
        
    }
    else if(num < 1e9){
        
        return ~~(~~(num/1e3))/1e3 + " million";
        
    }
    else if(num < 1e12){
        
        return ~~(~~(num/1e6))/1e3 + " billion";
        
    }
    else if(num < 1e15){
        
        return ~~(~~(num/1e9))/1e3 + " trillion";
        
    }
    else if(num < 1e18){
        
        return ~~(~~(num/1e12))/1e3 + " quadrillion";
        
    }
    else if(num < 1e21){
        
        return ~~(~~(num/1e15))/1e3 + " quintillion";
        
    }
    else if(num < 1e24){
        
        return ~~(~~(num/1e18))/1e3 + " sextillion";
        
    }
    var biig = 1e24;
    var biiig = 1e18;
    for(var i = 0; i < numbrs.length; i++){
        biig *= 1000;
        biiig *= 1000;
        if(num < biig){
            return ~~(~~(num/biiig))/1e3 + " " + numbrs[i];
            
        }
        
    }
    
    
}

//{

var things = [];

var golden = function(select){
    
    this.x = random(270,630);
    this.y = random(20,680);
    
    while(true){
        
        if(dist(450,350,this.x,this.y) > 100){
            
            break;
            
        }
        this.x = random(270,640);
        this.y = random(20,680);
        
    }
    
    this.time = 0;
    this.size = 0;
    this.siz = 0.12;
    this.woble = 0;
    
    this.state = "go";
    this.sta = 10;
    this.st = -5;
    this.s = 0;
    if(select !== -1){
    this.sl = select;//specific boi
    }
    else {
    this.sl = ~~random(0,2);//random
    
    //ye random BUT IFFFFFFF...
    if(STAT.total < 45000){
    this.sl = 0;
    }
    }
    
    
    this.yeahhh = (square/17)+10;
    
};
golden.prototype.draw = function(){
    
    this.woble = sin(this.time*3.14)*2;
    this.time++;
    this.size+=this.siz;
    this.siz-=0.00015;
    
    if(this.state === "go"){
    this.yeahhh = (square/7)+11;
    if(
    dist(mousex,mousey,this.x,this.y) < this.size/2){
        cursor("pointer");
    {
    pushMatrix();
    
    translate(this.x,this.y);
    rotate(cos(this.time*7)*7);
    
    fill(255, 255, 0);
    rect(0,0,this.woble+this.size*1.05,this.woble+this.size*1.05);
    fill(250, 250, 0);
    rect(0,0,this.woble+this.size/1.75,this.woble+this.size/1.75);
    
    fill(255, 255, 0, 10);
    rect(0,0,this.woble+this.size*1.5,this.woble+this.size*1.5);
    
    popMatrix();
    }//this
    if(pressed){
        
        pressed = false;
        this.state = "bye";
        if(this.sl === 0){
        square += this.yeahhh;
        }
        if(this.sl === 1){
        goldentype.update = true;
        }
        
    }
    
    } else {
    
    pushMatrix();
    
    translate(this.x,this.y);
    rotate(cos(this.time*7)*7);
    
    fill(255, 255, 0);
    rect(0,0,this.woble+this.size,this.woble+this.size);
    fill(240, 240, 0);
    rect(0,0,this.woble+this.size/1.75,this.woble+this.size/1.75);
    
    fill(255, 255, 0, 5);
    rect(0,0,this.woble+this.size*1.5,this.woble+this.size*1.5);
    
    popMatrix();
    }
    
    if(this.siz < 0 && this.woble+this.size < 0){
        
        return true;
        
    }
    }
    else if(this.state === "bye"){
        this.s-=5;
        this.sta += this.st;
        this.st /= 1.1;
        
        if(this.sl === 0){
        textSize(20);
        fill(255, 255, 255,1100+this.s);
        text("Lucky! +" + 
        numbershortener(this.yeahhh) + " squares!",this.x,this.y+this.sta);
        }
        if(this.sl === 1){
        textSize(20);
        fill(255, 255, 255,1100+this.s);
        text("Lucky! Click power x77 for 17 seconds!",this.x,this.y+this.sta);
        }
        
        if(this.s < -1100){
            
            return true;
            
        }
        
    }
    
};

var whenclick = function(){
    
    this.x = mousex;
    this.y = mousey;
    this.px = random(-1,1);
    this.py = random(-2,-3);
    this.r = 280;
    this.thismuch = (SPCLICK + 
    (SPS*(SPCLICKSPSBONUS/100))) * 
    (SPCLICKBONUS);
    square += this.thismuch;
    STAT.clicks2 += this.thismuch;
    STAT.total += this.thismuch;
    STAT.clicks += 1;
};

whenclick.prototype.draw = function(){
    
    this.x += this.px;
    this.y += this.py;
    
    this.py += 0.10;
    this.r -= 3;
    
    fill(255, 255, 255, this.r);
    
    var thatmuch = numbershortener(this.thismuch, true);
    
    textAlign(CENTER,CENTER);
    textFont(font,15);
    text("+" + thatmuch,this.x,this.y);
    
    if(this.y > 800){
        
        return true;
        
    }
    
};

function thingshower(){
    
    for(var i = things.length-1; i >= 0; i--){
        
        if(things[i].draw()){
            
            things.splice(i,1);
            
        }
        
    }
    
}//showthing
//} whenclick

//{

function iconshower(x,y,a){

//{
if(a === 0){
    
    fill(61);
    //rect(x+14,y+14,30,30);
    
    fill(148, 0, 0);
    rect(x+7,y+7,4,4);
    rect(x+9,y+5,4,4);
    rect(x+13,y+3,8,4);
    rect(x+19,y+8,4,6);
    rect(x+17,y+5,4,4);
    rect(x+17,y+11,4,4);
    rect(x+15,y+13,4,4);
    rect(x+13,y+16,4,6);
    
    rect(x+13,y+24,4,4);
    
}//?
else if(a === 1){
    
    fill(61);
    //rect(x+14,y+14,30,30);
    
    fill(204, 38, 38);
    rect(x+7,y+7,4,4);
    rect(x+9,y+5,4,4);
    rect(x+13,y+3,8,4);
    rect(x+19,y+8,4,6);
    rect(x+17,y+5,4,4);
    rect(x+17,y+11,4,4);
    rect(x+15,y+13,4,4);
    rect(x+13,y+16,4,6);
    
    rect(x+13,y+24,4,4);
    
}// brighter ?
//}question marks
//{
else if(a === 2){
    
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    fill(255, 3, 3);
    rect(x+14,y+14,8,8);
    fill(158, 29, 29);
    rect(x+14,y+14,4,4);

    fill(77, 77, 77);
    rect(x+22,y+14,3,18);
    rect(x+6,y+14,3,18);
    rect(x+14,y+22,18,3);
    rect(x+14,y+6,18,3);
    
}//tiny square w/ halo
else if(a === 3){
    
    
    fill(61);
    //rect(x+14,y+14,30,30);
    
    
    fill(255, 3, 3);
    rect(x+14,y+14,8,8);
    fill(158, 29, 29);
    rect(x+14,y+14,4,4);
    
}//tiny square
else if(a === "squarewhite"){
    
    
    fill(61);
    //rect(x+14,y+14,30,30);
    
    
    fill(171, 171, 171);
    rect(x+18,y+10,10.5,10.5);
    fill(255, 3, 3);
    rect(x+18,y+10,8,8);
    fill(158, 29, 29);
    rect(x+18,y+10,4,4);
    
    fill(184, 184, 184);
    rect(x+12,y+16,12.5,12.5);
    
    fill(255, 3, 3);
    rect(x+12,y+16,10,10);
    fill(158, 29, 29);
    rect(x+12,y+16,5,5);
    
}//tiny square
else if(a === 4){
    
    
    fill(61);
    //rect(x+14,y+14,30,30);
    
    
    fill(0, 0, 0);
    rect(x+18,y+10,10.5,10.5);
    fill(255, 3, 3);
    rect(x+18,y+10,8,8);
    fill(158, 29, 29);
    rect(x+18,y+10,4,4);
    
    fill(0, 0, 0);
    rect(x+12,y+16,12.5,12.5);
    
    fill(255, 3, 3);
    rect(x+12,y+16,10,10);
    fill(158, 29, 29);
    rect(x+12,y+16,5,5);
    
}//tiny square black
else if(a === 5){
    
    
    fill(61);
    //rect(x+14,y+14,30,30);
    
    
    fill(181, 181, 22);
    rect(x+18,y+10,10.5,10.5);
    fill(255, 3, 3);
    rect(x+18,y+10,8,8);
    fill(158, 29, 29);
    rect(x+18,y+10,4,4);
    
    fill(181, 181, 22);
    rect(x+12,y+16,12.5,12.5);
    
    fill(255, 3, 3);
    rect(x+12,y+16,10,10);
    fill(158, 29, 29);
    rect(x+12,y+16,5,5);
    
}//tiny squares gold
else if(a === 6){
    
    
    fill(61);
    //rect(x+14,y+14,30,30);
    
    
    fill(23, 179, 153);
    rect(x+18,y+10,12,12);
    fill(255, 3, 3);
    rect(x+18,y+10,8,8);
    fill(158, 29, 29);
    rect(x+18,y+10,4,4);
    
    fill(23, 179, 153);
    rect(x+12,y+16,14,14);
    
    fill(255, 3, 3);
    rect(x+12,y+16,10,10);
    fill(158, 29, 29);
    rect(x+12,y+16,5,5);
    
}//tiny squares blue
else if(a === 7){
    
    
    fill(61);
    //rect(x+14,y+14,30,30);
    
    
    fill(125, 176, 52);
    rect(x+18,y+10,14,14);
    fill(255, 3, 3);
    rect(x+18,y+10,8,8);
    fill(158, 29, 29);
    rect(x+18,y+10,4,4);
    
    fill(136, 186, 65);
    rect(x+12,y+16,16,16);
    
    fill(255, 3, 3);
    rect(x+12,y+16,10,10);
    fill(158, 29, 29);
    rect(x+12,y+16,5,5);
    
}//tiny squares gold 2
//}tiny square
//{
else if(a === "cursor1"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    fill(255, 3, 3);
    rect(x+14,y+14,8,8);
    fill(158, 29, 29);
    rect(x+14,y+14,4,4);

    fill(189, 157, 27);
    rect(x+22,y+14,2,18);
    rect(x+6,y+14,2,18);
    rect(x+14,y+22,18,2);
    rect(x+14,y+6,18,2);
    
}
else if(a === "cursor2"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    fill(255, 3, 3);
    rect(x+14,y+14,8,8);
    fill(158, 29, 29);
    rect(x+14,y+14,4,4);

    fill(28, 168, 189);
    rect(x+22,y+14,2,18);
    rect(x+6,y+14,2,18);
    rect(x+14,y+22,18,2);
    rect(x+14,y+6,18,2);
    
}
else if(a === "cursor3"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    fill(255, 3, 3);
    rect(x+14,y+14,8,8);
    fill(158, 29, 29);
    rect(x+14,y+14,4,4);

    fill(48, 199, 53);
    rect(x+22,y+14,2,18);
    rect(x+6,y+14,2,18);
    rect(x+14,y+22,18,2);
    rect(x+14,y+6,18,2);
    
}
else if(a === "cursor4"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    fill(255, 3, 3);
    rect(x+14,y+14,8,8);
    fill(158, 29, 29);
    rect(x+14,y+14,4,4);

    fill(148, 255, 205);
    rect(x+22,y+14,2,18);
    rect(x+6,y+14,2,18);
    rect(x+14,y+22,18,2);
    rect(x+14,y+6,18,2);
    
}
//}cursor
//{
else if(a === "adder1"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(138, 138, 138);
    rect(x+16,y+16,20,6);
    rect(x+16,y+16,6,20);
    
    fill(230, 230, 230);
    rect(x+14,y+14,20,6);
    rect(x+14,y+14,6,20);
    
}
else if(a === "adder2"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(145, 141, 87);
    rect(x+16,y+16,20,6);
    rect(x+16,y+16,6,20);
    
    fill(215, 217, 106);
    rect(x+14,y+14,20,6);
    rect(x+14,y+14,6,20);
    
}
else if(a === "adder3"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(19, 125, 114);
    rect(x+16,y+16,20,6);
    rect(x+16,y+16,6,20);
    
    fill(46, 224, 230);
    rect(x+14,y+14,20,6);
    rect(x+14,y+14,6,20);
    
}
else if(a === "adder4"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(110, 138, 51);
    rect(x+16,y+16,20,6);
    rect(x+16,y+16,6,20);
    
    fill(148, 235, 54);
    rect(x+14,y+14,20,6);
    rect(x+14,y+14,6,20);
    
    
    
}
else if(a === "adder5"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(138, 51, 128);
    rect(x+16,y+16,20,6);
    rect(x+16,y+16,6,20);
    
    fill(229, 54, 235);
    rect(x+14,y+14,20,6);
    rect(x+14,y+14,6,20);
    
    
    
}
//}adder
//{
    
else if(a === "duper0"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    pushMatrix();
    translate(2,2);
    fill(128, 128, 128);
    rect(x+6,y+6,6,6);
    rect(x+6,y+22,6,6);
    rect(x+22,y+6,6,6);
    rect(x+22,y+22,6,6);
    rect(x+14,y+14,6,6);
    rect(x+10,y+10,6,6);
    rect(x+18,y+18,6,6);
    rect(x+10,y+18,6,6);
    rect(x+18,y+10,6,6);
    popMatrix();
    
    fill(255, 255, 255);
    rect(x+6,y+6,6,6);
    rect(x+6,y+22,6,6);
    rect(x+22,y+6,6,6);
    rect(x+22,y+22,6,6);
    rect(x+14,y+14,6,6);
    rect(x+10,y+10,6,6);
    rect(x+18,y+18,6,6);
    rect(x+10,y+18,6,6);
    rect(x+18,y+10,6,6);
    
}
else if(a === "duper1"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    pushMatrix();
    translate(2,2);
    fill(122, 120, 27);
    rect(x+6,y+6,6,6);
    rect(x+6,y+22,6,6);
    rect(x+22,y+6,6,6);
    rect(x+22,y+22,6,6);
    rect(x+14,y+14,6,6);
    rect(x+10,y+10,6,6);
    rect(x+18,y+18,6,6);
    rect(x+10,y+18,6,6);
    rect(x+18,y+10,6,6);
    popMatrix();
    
    fill(240, 237, 57);
    rect(x+6,y+6,6,6);
    rect(x+6,y+22,6,6);
    rect(x+22,y+6,6,6);
    rect(x+22,y+22,6,6);
    rect(x+14,y+14,6,6);
    rect(x+10,y+10,6,6);
    rect(x+18,y+18,6,6);
    rect(x+10,y+18,6,6);
    rect(x+18,y+10,6,6);
    
}
else if(a === "duper2"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    pushMatrix();
    translate(2,2);
    fill(28, 120, 112);
    rect(x+6,y+6,6,6);
    rect(x+6,y+22,6,6);
    rect(x+22,y+6,6,6);
    rect(x+22,y+22,6,6);
    rect(x+14,y+14,6,6);
    rect(x+10,y+10,6,6);
    rect(x+18,y+18,6,6);
    rect(x+10,y+18,6,6);
    rect(x+18,y+10,6,6);
    popMatrix();
    
    fill(57, 240, 237);
    rect(x+6,y+6,6,6);
    rect(x+6,y+22,6,6);
    rect(x+22,y+6,6,6);
    rect(x+22,y+22,6,6);
    rect(x+14,y+14,6,6);
    rect(x+10,y+10,6,6);
    rect(x+18,y+18,6,6);
    rect(x+10,y+18,6,6);
    rect(x+18,y+10,6,6);
    
}
else if(a === "duper3"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    pushMatrix();
    translate(2,2);
    fill(63, 120, 30);
    rect(x+6,y+6,6,6);
    rect(x+6,y+22,6,6);
    rect(x+22,y+6,6,6);
    rect(x+22,y+22,6,6);
    rect(x+14,y+14,6,6);
    rect(x+10,y+10,6,6);
    rect(x+18,y+18,6,6);
    rect(x+10,y+18,6,6);
    rect(x+18,y+10,6,6);
    popMatrix();
    
    fill(106, 240, 57);
    rect(x+6,y+6,6,6);
    rect(x+6,y+22,6,6);
    rect(x+22,y+6,6,6);
    rect(x+22,y+22,6,6);
    rect(x+14,y+14,6,6);
    rect(x+10,y+10,6,6);
    rect(x+18,y+18,6,6);
    rect(x+10,y+18,6,6);
    rect(x+18,y+10,6,6);
    
}
else if(a === "duper4"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    pushMatrix();
    translate(2,2);
    fill(114, 30, 120);
    rect(x+6,y+6,6,6);
    rect(x+6,y+22,6,6);
    rect(x+22,y+6,6,6);
    rect(x+22,y+22,6,6);
    rect(x+14,y+14,6,6);
    rect(x+10,y+10,6,6);
    rect(x+18,y+18,6,6);
    rect(x+10,y+18,6,6);
    rect(x+18,y+10,6,6);
    popMatrix();
    
    fill(231, 57, 240);
    rect(x+6,y+6,6,6);
    rect(x+6,y+22,6,6);
    rect(x+22,y+6,6,6);
    rect(x+22,y+22,6,6);
    rect(x+14,y+14,6,6);
    rect(x+10,y+10,6,6);
    rect(x+18,y+18,6,6);
    rect(x+10,y+18,6,6);
    rect(x+18,y+10,6,6);
    
}

//}duper
//{

else if(a === "factor0"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    fill(117, 117, 117);
    rect(x+16,y+24,8,8);
    rect(x+16,y+9,8,14);
    
    fill(255, 255, 255);
    rect(x+14,y+22,8,8);
    rect(x+14,y+7,8,14);
    
}
else if(a === "factor1"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    fill(117, 115, 9);
    rect(x+16,y+24,8,8);
    rect(x+16,y+9,8,14);
    
    fill(255, 242, 0);
    rect(x+14,y+22,8,8);
    rect(x+14,y+7,8,14);
    
}
else if(a === "factor2"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    fill(9, 110, 115);
    rect(x+16,y+24,8,8);
    rect(x+16,y+9,8,14);
    
    fill(74, 243, 255);
    rect(x+14,y+22,8,8);
    rect(x+14,y+7,8,14);
    
}
else if(a === "factor3"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    fill(75, 120, 53);
    rect(x+16,y+24,8,8);
    rect(x+16,y+9,8,14);
    
    fill(144, 217, 60);
    rect(x+14,y+22,8,8);
    rect(x+14,y+7,8,14);
    
}
else if(a === "factor4"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    fill(111, 54, 120);
    rect(x+16,y+24,8,8);
    rect(x+16,y+9,8,14);
    
    fill(207, 60, 217);
    rect(x+14,y+22,8,8);
    rect(x+14,y+7,8,14);
    
}
    
//}factor
//{
else if(a === "condenser0"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    fill(117, 117, 117);
    rect(x+11,y+24,6,6);
    rect(x+11,y+7,6,6);
    rect(x+7,y+16,6,16);
    
    rect(x+21,y+24,6,6);
    rect(x+21,y+7,6,6);
    rect(x+25,y+16,6,16);
    
    rect(x+16,y+16,6,6);
    
    fill(255, 255, 255);
    rect(x+9,y+22,6,6);
    rect(x+9,y+5,6,6);
    rect(x+5,y+14,6,16);
    
    rect(x+19,y+22,6,6);
    rect(x+19,y+5,6,6);
    rect(x+23,y+14,6,16);
    
    rect(x+14,y+14,6,6);
    
}
else if(a === "condenser1"){
    
    fill(59, 59, 59);
    //rect(x+14,y+14,30,30);
    
    fill(112, 111, 91);
    rect(x+11,y+24,6,6);
    rect(x+11,y+7,6,6);
    rect(x+7,y+16,6,16);
    
    rect(x+21,y+24,6,6);
    rect(x+21,y+7,6,6);
    rect(x+25,y+16,6,16);
    
    rect(x+16,y+16,6,6);
    
    fill(234, 237, 33);
    rect(x+9,y+22,6,6);
    rect(x+9,y+5,6,6);
    rect(x+5,y+14,6,16);
    
    rect(x+19,y+22,6,6);
    rect(x+19,y+5,6,6);
    rect(x+23,y+14,6,16);
    
    rect(x+14,y+14,6,6);
    
}
else if(a === "condenser2"){
    
    fill(59, 59, 59);
    //rect(x+14,y+14,30,30);
    
    fill(52, 126, 130);
    rect(x+11,y+24,6,6);
    rect(x+11,y+7,6,6);
    rect(x+7,y+16,6,16);
    
    rect(x+21,y+24,6,6);
    rect(x+21,y+7,6,6);
    rect(x+25,y+16,6,16);
    
    rect(x+16,y+16,6,6);
    
    fill(33, 235, 228);
    rect(x+9,y+22,6,6);
    rect(x+9,y+5,6,6);
    rect(x+5,y+14,6,16);
    
    rect(x+19,y+22,6,6);
    rect(x+19,y+5,6,6);
    rect(x+23,y+14,6,16);
    
    rect(x+14,y+14,6,6);
    
}
else if(a === "condenser3"){
    
    fill(59, 59, 59);
    //rect(x+14,y+14,30,30);
    
    fill(51, 128, 54);
    rect(x+11,y+24,6,6);
    rect(x+11,y+7,6,6);
    rect(x+7,y+16,6,16);
    
    rect(x+21,y+24,6,6);
    rect(x+21,y+7,6,6);
    rect(x+25,y+16,6,16);
    
    rect(x+16,y+16,6,6);
    
    fill(45, 235, 35);
    rect(x+9,y+22,6,6);
    rect(x+9,y+5,6,6);
    rect(x+5,y+14,6,16);
    
    rect(x+19,y+22,6,6);
    rect(x+19,y+5,6,6);
    rect(x+23,y+14,6,16);
    
    rect(x+14,y+14,6,6);
    
}
else if(a === "condenser4"){
    
    fill(59, 59, 59);
    //rect(x+14,y+14,30,30);
    
    fill(115, 51, 128);
    rect(x+11,y+24,6,6);
    rect(x+11,y+7,6,6);
    rect(x+7,y+16,6,16);
    
    rect(x+21,y+24,6,6);
    rect(x+21,y+7,6,6);
    rect(x+25,y+16,6,16);
    
    rect(x+16,y+16,6,6);
    
    fill(225, 35, 235);
    rect(x+9,y+22,6,6);
    rect(x+9,y+5,6,6);
    rect(x+5,y+14,6,16);
    
    rect(x+19,y+22,6,6);
    rect(x+19,y+5,6,6);
    rect(x+23,y+14,6,16);
    
    rect(x+14,y+14,6,6);
    
}
//}condenser
//{
else if(a === "brownsquare"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(115, 31, 31);
    rect(x+14,y+14,18,18);
    fill(89, 19, 19);
    rect(x+14,y+14,8,8);
    
}
else if(a === "whitesquare"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(255, 255, 255);
    rect(x+14,y+14,18,18);
    fill(214, 214, 214);
    rect(x+14,y+14,8,8);
    
}
else if(a === "blacksquare"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(26, 26, 26);
    rect(x+14,y+14,18,18);
    fill(41, 41, 41);
    rect(x+14,y+14,8,8);
    
}
else if(a === "bluesquare"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(81, 107, 237);
    rect(x+14,y+14,18,18);
    fill(65, 89, 209);
    rect(x+14,y+14,8,8);
    
}
else if(a === "greensquare"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(82, 235, 90);
    rect(x+14,y+14,18,18);
    fill(67, 207, 78);
    rect(x+14,y+14,8,8);
    
}
else if(a === "orangesquare"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(235, 181, 82);
    rect(x+14,y+14,18,18);
    fill(207, 154, 68);
    rect(x+14,y+14,8,8);
    
}
else if(a === "greysquare"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(128, 128, 128);
    rect(x+14,y+14,18,18);
    fill(102, 102, 102);
    rect(x+14,y+14,8,8);
    
}
else if(a === "purplesquare"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(132, 64, 184);
    rect(x+14,y+14,18,18);
    fill(116, 26, 184);
    rect(x+14,y+14,8,8);
    
}
else if(a === "yellowsquare"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(217, 205, 78);
    rect(x+14,y+14,18,18);
    fill(179, 171, 65);
    rect(x+14,y+14,8,8);
    
}
else if(a === "pinksquare"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(217, 78, 215);
    rect(x+14,y+14,18,18);
    fill(182, 69, 186);
    rect(x+14,y+14,8,8);
    
}
else if(a === "lightbluesquare"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(83, 212, 224);
    rect(x+14,y+14,18,18);
    fill(32, 179, 172);
    rect(x+14,y+14,8,8);
    
}
else if(a === "redorangesquare"){
    
    fill(61, 61, 61);
    //rect(x+14,y+14,30,30);
    
    
    fill(222, 110, 84);
    rect(x+14,y+14,18,18);
    fill(179, 79, 32);
    rect(x+14,y+14,8,8);
    
}

//}multiplier squares
    
}

//} icon shower

function bg(){
    
    var thatmuch = numbershortener(square);
    var thatmuch2 = numbershortener(SPS,true);
    fill(68, 98, 120);
    rect(450,350,350,700);
    
    fill(64, 95, 115);
    rect(267.5,350,15,700);
    rect(632.5,350,15,700);
    
    rect(0,47.5,550,15);
    rect(840,200,400,15);
    
    if(goldentype.on === true){
        
        //7 bomb
        fill(777+cos(frameCount)*577, 777+cos(frameCount)*577, 7+cos(frameCount)*77);
        rect(605,110,35,35);
        
        fill(0, 0, 0,50);
        rect(605,110,32,32);
        
        fill(31, 31, 2);
        rect(605,110,28,28);
        
        fill(255, 255, 255);
        textSize(15);
        if(goldentype.s > -1){
        text(goldentype.s,605,110);
        //hover over to see wtf this is
        if(mouseX >= 590 &&
        mouseX <= 620 && 
        mouseY >= 95 &&
        mouseY <= 125){
        text("Click power x77 for 17 seconds!",435,110);
        }
        
        }
        
    }
    
    fill(0, 0, 0, 100);
    rect(450,60,350,60);
    
    textFont(font,20);
    text("Upgrades",780,100);
    
    fill(255, 255, 255);
    textFont(font,21);
    if(~~square !== 1){
    text(thatmuch + " squares",450,50);
    } else {
    text(thatmuch + " square",450,50);
    }//grammar issue no more
    
    textFont(font,14);
    text(thatmuch2 + " per second",450,75);
    
    
}

function Bsquare(){
    
    {
    if(lesiz > lesize){
        
        if(lesi <= 0){
        lesi-=(lesiz-lesize)/50;
        } else {
        lesi-=(lesiz-lesize)/7;
        }
        
    }
    if(lesiz < lesize){
        
        if(lesi >= 0){
        lesi+=(lesize-lesiz)/50;
        } else {
        lesi+=(lesize-lesiz)/7;
        }
        
    }
    lesiz += lesi;
    }//boing
    
    fill(196, 19, 19);
    
    lesize = 105;
    if(mousex <= Wh/2+50 && mousey <= Ht/2+50 && mousex >= Wh/2-50 && mousey >= Ht/2-50){
        
        fill(201, 20, 20);
        if(pressed === true){
            
            fill(196, 19, 19);
            lesize = 100;
            
            
            
            
        } else {
            
        lesize = 110;
        
        }
        if(clicked === true){
            things.push(new whenclick());
        }
        
        
    }
    
    rect(Wh/2,Ht/2,lesiz,lesiz);
    
    fill(0, 0, 0, 10);
    rect(Wh/2,Ht/2,lesiz/1.5,lesiz/1.5);
    
}

//{
function stats(){
    statnum = [SPS,SPCLICK + 
    (SPS*(SPCLICKSPSBONUS/100)),STAT.clicks];
    fill(81, 148, 150);
    rect(20,20,100,40);
    textFont(font,15);
    fill(255, 255, 255);
    text("stats",34,20);
    
    if(mousex <= 70 && mousey <= 40 && mousex >= 0 && mousey >= 0 && isopen !== "stats"){
        
        
        fill(94, 172, 173);
        rect(20,20,100,40);
        textFont(font,15);
        fill(255, 255, 255);
        text("stats",34,20);
        
        if(clicked){
            
            isopen = "stats";
            clicked = false;
        }
        
    }
    
    if(isopen === "stats"){
        
        fill(94, 172, 173);
        rect(20,20,100,40);
        textFont(font,15);
        fill(255, 255, 255);
        text("stats",34,20);
        
        fill(0, 0, 0);
        rect(125,385,270,660);
        
        //thinking space:tm:
        fill(255, 255, 255);
        textFont(font,26);
        text("Stats",125,70);
        
        fill(255, 255, 255, 50);
        rect(125,90,200,2);
        
        textAlign(LEFT,CENTER);
        fill(255, 255, 255);
        textFont(font,11);
        for(var i = 0; i < statshow.length; i++){
        
        var mewhen = 0;
        
        if(i === 0){
            mewhen = square;
        }
        if(i === 1){
            mewhen = SPS;
        }
        if(i === 2){
            mewhen = STAT.raw;
        }
        if(i === 3){
            mewhen = SPCLICK + 
    (SPS*(SPCLICKSPSBONUS/100));
        }
        if(i === 4){
            mewhen = STAT.clicks;
        }
        if(i === 5){
            mewhen = STAT.clicks2;
        }
        if(i === 6){
            mewhen = STAT.total;
        }
        
        if(i < 7){
        text(statshow[i] + "\n" + 
        numbershortener(mewhen, true),10,60+i*30,250,100);
        }
        
        }
        
        
        
        STAT.sec = (~~(millis()/1000))%60;
        STAT.min = (~~(millis()/60000))%60;
        STAT.hour = (~~(millis()/3600000))%60;
        
        textAlign(LEFT,UP);
        
        text(statshow[8] + "\n" + STAT.helpersbought,10,315,250,100);
        text(statshow[9] + "\n" + STAT.upgradesbought + "/" + upgradeID.length + " (" + 
        ~~(STAT.upgradesbought/upgradeID.length*100) +
        "%)",10,345,250,100);
        
        text(
        "Time since start:\n" + 
        STAT.sec + 
        " second(s), " +
        STAT.min + 
        " minute(s), " +
        STAT.hour + 
        " hour(s)",
        10,400,250,100);
        
        textAlign(CENTER,CENTER);
        
        if(clicked && mousex <= 70 && mousey <= 40 && mousex >= 0 && mousey >= 0){
            
            isopen = "none";
            clicked = false;
            
        }
        
    }
    
    
    
}
//} topleft seection

var hellpers = [[15,0,"Maker",0.1,"Makes squares for you.",0],
[190,0,"Adder",2,"Adds squares for you...?",0],
[3500,0,"Duper",37,"Yeah, I'm not questioning this.",0],
[57300,0,"Factor",452,"Can't explain this function.",0],
[7334400,0,"Condenser",43392,"Condenses... something...",0],
[517*shortfor.million,0,"Multiplier",553920,"Dupers got nothing on this.",0]];

//{
var thisisalist = [
    
        ];

function putthelistinthelist(id){
    
    if(!upgradeID[id].put){
    thisisalist.push([upgradeID[id].name,upgradeID[id].desc,upgradeID[id].descdesc,upgradeID[id].ID,upgradeID[id].Hsize,upgradeID[id].amount,id]);
        
    upgradeID[id].put = true;
    
    thisisalist.sort(function(a, b) {
    return a[5] - b[5]; // a - b is smallest to largest
    });//credit to 1001programmer1001!!!
    }
    
}

function upgradee(){
    
    if(mousex > 640 &&
    mousey > 145){
    fill(64, 95, 115);
    rect(840,200,400,15);
        for(var i = thisisalist.length-1; i >= 0; i--){
        
    var thismuchX = 664 + i%6*42;
    var thismuchY = 169 + ~~(i/6)*42;
        
        
    var canaccess = false;
    if(thisisalist[i][5] <= square){
        
        canaccess = true;
        
    }
        
        if(canaccess){
        fill(105, 136, 148);
        rect(thismuchX,thismuchY,42,42);
        fill(90, 116, 125);
        rect(thismuchX,thismuchY,40,40);
        fill(0, 0, 0);
        rect(thismuchX,thismuchY,35,35);
        }
        if(!canaccess){
        fill(78, 110, 122);
        rect(thismuchX,thismuchY,42,42);
        fill(64, 86, 94);
        rect(thismuchX,thismuchY,40,40);
        fill(0, 0, 0);
        rect(thismuchX,thismuchY,35,35);
        }
        
        if(mousex > thismuchX-20 &&
        mousey > thismuchY-20 && 
        mousex < thismuchX+20 &&
        mousey < thismuchY+20){
            
            
        
        {
    
    fill(64, 82, 84);
    rect(510,thisisalist[i][4]/2 + thismuchY - 40,
    250,thisisalist[i][4]+10);
    fill(0, 0, 0);
    rect(510,thisisalist[i][4]/2 + thismuchY - 40,
    240,thisisalist[i][4]);
    
    textAlign(LEFT,UP);
    //namez`
    textSize(18);
    fill(255, 255, 255);
    text(thisisalist[i][0],393,thismuchY - 20);
    //desc
    textAlign(LEFT,UP);
    textSize(11);
    text(thisisalist[i][1],393,thismuchY - 10, 240, 150);
    
    //amount
    fill(255, 71, 71);
    if(canaccess){
    fill(15, 250, 101);
    }
    text(numbershortener(thisisalist[i][5]) + " squares",393,
    thismuchY + thisisalist[i][4] - 55,
    240, 150);
    
    textAlign(RIGHT,UP);
    //descdesc
    fill(184, 184, 184);
    text(thisisalist[i][2],386,thismuchY - 4,240,1500);  
    iconshower(597,thismuchY-36,
    thisisalist[i][3]);
    //id
    if(isclosed === "idk"){
    fill(184, 184, 184);
    text("ID: " + thisisalist[i][6],386,thismuchY - 56,240,1500);
    }
    
    textAlign(LEFT,UP);
    
    textAlign(CENTER,CENTER);
        }//dont look at this hellhole
        
        if(canaccess === true){
        fill(105, 136, 148);
        rect(thismuchX,thismuchY,42,42);
        fill(115, 161, 176);
        rect(thismuchX,thismuchY,40,40);
        fill(0, 0, 0);
        rect(thismuchX,thismuchY,35,35);
        }
        
        iconshower(thismuchX-14,thismuchY-15,thisisalist[i][3]);
        
        if(canaccess && clicked){
            
            
        upgradeID[thisisalist[i][6]].active = true;
            
            
            square -= thisisalist[i][5];
            
            
            thisisalist.splice(i,1);
            
            
            
            }
        }
        else {
            iconshower(thismuchX-14,thismuchY-14,thisisalist[i][3]);
        }
        
    }
    } else {
        
    if(thisisalist.length > 5){
    for(var i = 5; i >= 0; i--){
        
    var thismuchX = 664 + i%6*42;
    var thismuchY = 169 + ~~(i/6)*42;
        
        
    var canaccess = false;
    if(thisisalist[i][5] <= square){
        
        canaccess = true;
        
    }
        
        if(canaccess){
        fill(105, 136, 148);
        rect(thismuchX,thismuchY,42,42);
        fill(90, 116, 125);
        rect(thismuchX,thismuchY,40,40);
        fill(0, 0, 0);
        rect(thismuchX,thismuchY,35,35);
        }
        if(!canaccess){
        fill(78, 110, 122);
        rect(thismuchX,thismuchY,42,42);
        fill(64, 86, 94);
        rect(thismuchX,thismuchY,40,40);
        fill(0, 0, 0);
        rect(thismuchX,thismuchY,35,35);
        }
        
        iconshower(thismuchX-14,thismuchY-14,thisisalist[i][3]);
        
        
    }
    } else {
    for(var i = thisisalist.length-1; i >= 0; i--){
        
    var thismuchX = 664 + i%6*42;
    var thismuchY = 169 + ~~(i/6)*42;
        
        
    var canaccess = false;
    if(thisisalist[i][5] <= square){
        
        canaccess = true;
        
    }
        
        if(canaccess){
        fill(105, 136, 148);
        rect(thismuchX,thismuchY,42,42);
        fill(90, 116, 125);
        rect(thismuchX,thismuchY,40,40);
        fill(0, 0, 0);
        rect(thismuchX,thismuchY,35,35);
        }
        if(!canaccess){
        fill(78, 110, 122);
        rect(thismuchX,thismuchY,42,42);
        fill(64, 86, 94);
        rect(thismuchX,thismuchY,40,40);
        fill(0, 0, 0);
        rect(thismuchX,thismuchY,35,35);
        }
        
        iconshower(thismuchX-14,thismuchY-14,thisisalist[i][3]);
        
        
    }
    }
    
    
    }
    
}
//}//update stuff

function updatee(){

    {
    for(var i = 0; i < upgradeID.length; i++){
    
    if(upgradeID[i].active && !upgradeID[i].aactive){
     
    {   
    if(upgradeID[i].typeID === 0){
    SPCLICK+=upgradeID[i].typeAM;
    }}//Add this amount to clicking
    
    
    {
    if(upgradeID[i].typeID === "Maker Multiply SPC" || upgradeID[i].typeID === 1){
    hellpers[0][3] *= upgradeID[i].typeAM;
    }}//multiply this amount to Maker
    
    {
    if(upgradeID[i].typeID === "Multiply CPS"){
    SPCLICK *= upgradeID[i].typeAM;
    }}//multiply this much to SPC
    
    
    {
    if(upgradeID[i].typeID === "Adder Multiply"){
    hellpers[1][3] *= upgradeID[i].typeAM;
    }}//multiply this amount to Adder
    
    {
    if(upgradeID[i].typeID === "dupermultiply"){
    hellpers[2][3] *= upgradeID[i].typeAM;
    }}//multiply this amount to Duper
    
    {
    if(upgradeID[i].typeID === "factormultiply"){
    hellpers[3][3] *= upgradeID[i].typeAM;
    }}//multiply this amount to Factor
    
    {
    if(upgradeID[i].typeID === "condensermultiply"){
    hellpers[4][3] *= upgradeID[i].typeAM;
    }}//multiply this amount to Condenser
    
    {
    if(upgradeID[i].typeID === "Bonus"){
    SPSBONUS += upgradeID[i].typeAM;
    }}//add this much % to bonus
    
    {
    if(upgradeID[i].typeID === "clickcpsboost"){
    SPCLICKSPSBONUS += upgradeID[i].typeAM;
    }}//add this much % to SPC boost
    
    
    
    //this is last, remeber this
    upgradeID[i].aactive = true;
    
    //and this too
    STAT.upgradesbought++;
    
    
    }
    }
    }//upgrade thingy
    
    //vvv only updating upgrades vvv
    {
    
    //vvv clicks vvv
    {
    if(STAT.clicks2 >= 1500){
        
        putthelistinthelist(26);
        
    }
    if(STAT.clicks2 >= 750){
        
        putthelistinthelist(25);
        
    }
    if(STAT.clicks2 >= 250){
        
        putthelistinthelist(24);
        
    }
    if(STAT.clicks2 >= 50){
        
        putthelistinthelist(5);
        
    }
    if(STAT.clicks >= 10){
        putthelistinthelist(0);
        
    }
    }
    
    //THE LIST TO PUT UPGRADES:
    //1, 5, 10, 25, 50, 75, 100, 125, 150, 175, 200
    //vvv Maker vvv
    {
    if(hellpers[0][1] >= 50){
        
        putthelistinthelist(4);
        
    }
    if(hellpers[0][1] >= 25){
        
        putthelistinthelist(3);
        
    }
    if(hellpers[0][1] >= 10){
        
        putthelistinthelist(2);
        
    }
    if(hellpers[0][1] >= 5){
        
        putthelistinthelist(16);
        
    }
    if(hellpers[0][1] >= 1){
        
        putthelistinthelist(1);
        
    }
    }
    //vvv Adder vvv
    {
    if(hellpers[1][1] >= 50){
        
        putthelistinthelist(31);
        
    }
    if(hellpers[1][1] >= 25){
        
        putthelistinthelist(9);
        
    }
    if(hellpers[1][1] >= 10){
        
        putthelistinthelist(8);
        
    }
    if(hellpers[1][1] >= 5){
        
        putthelistinthelist(7);
        
    }
    if(hellpers[1][1] >= 1){
        
        putthelistinthelist(6);
        
    }
    }
    //vvv Duper vvv
    {
    
    if(hellpers[2][1] >= 50){
        
        putthelistinthelist(39);
        
    }
    if(hellpers[2][1] >= 25){
        
        putthelistinthelist(23);
        
    }
    if(hellpers[2][1] >= 10){
        
        putthelistinthelist(22);
        
    }
    if(hellpers[2][1] >= 5){
        
        putthelistinthelist(21);
        
    }
    if(hellpers[2][1] >= 1){
        
        putthelistinthelist(20);
        
    }
    
    }
    //vvv Factor vvv
    {
    
    if(hellpers[3][1] >= 50){
        
        putthelistinthelist(38);
    
    }
    if(hellpers[3][1] >= 25){
        
        putthelistinthelist(30);
    
    }
    if(hellpers[3][1] >= 10){
        
        putthelistinthelist(29);
    
    }
    if(hellpers[3][1] >= 5){
        
        putthelistinthelist(28);
        
    }
    if(hellpers[3][1] >= 1){
        
        putthelistinthelist(27);
        
    }
    
    }
    //vvv Condenser vvv
    {
    
    if(hellpers[4][1] >= 50){
        
        putthelistinthelist(37);
    
    }
    if(hellpers[4][1] >= 25){
        
        putthelistinthelist(36);
    
    }
    if(hellpers[4][1] >= 10){
        
        putthelistinthelist(35);
    
    }
    if(hellpers[4][1] >= 5){
        
        putthelistinthelist(34);
    
    }
    if(hellpers[4][1] >= 1){
        
        putthelistinthelist(33);
    
    }
    
    }
    
    
    //vvv Square Multiplier vvv
    {
    
    if(STAT.total >= 75000){
        
        putthelistinthelist(41);
        
    }//brown
    if(STAT.total >= 50000){
        
        putthelistinthelist(40);
        
    }//red orange
    if(STAT.total >= 50000){
        
        putthelistinthelist(32);
        
    }//light blue
    if(STAT.total >= 25000){
        
        putthelistinthelist(19);
        
    }//pink
    if(STAT.total >= 20000){
        
        putthelistinthelist(18);
        
    }//yellow
    if(STAT.total >= 10000){
        
        putthelistinthelist(17);
        
    }//pr
    //16 is One more square
    if(STAT.total >= 2500){
        
        putthelistinthelist(15);
        
    }//gray
    if(STAT.total >= 1000){
        
        putthelistinthelist(14);
        
    }//or
    if(STAT.total >= 500){
        
        putthelistinthelist(13);
        
    }//green
    if(STAT.total >= 250){
        
        putthelistinthelist(12);
        
    }//bu
    if(STAT.total >= 20){
        
        putthelistinthelist(11);
        
    }//bl
    if(STAT.total >= 20){
        
        putthelistinthelist(10);
        
    }//w
    
    }
    
    }
    
    //vvv helpers thing vvv
    {
    for(var i = 0; i < hellpers.length; i++){
        
        SPS += hellpers[i][1]*hellpers[i][3];
        
        hellpers[i][5] += hellpers[i][1]*hellpers[i][3]/thefps;
        
        
    }
    }
    
    STAT.raw += SPS;
    SPS *= SPSBONUS/100 + 1;
    square += SPS/thefps;
    STAT.total += SPS/thefps;
    
}

function helperers(y,ieee){
    
    fill(148, 115, 9);
    rect(400,y,260,160);
    fill(0, 0, 0);
    rect(400,y,250,150);
    
    textAlign(LEFT,CENTER);
    textSize(20);
    fill(255, 255, 255);
    text(hellpers[ieee][2],282,y-60);
    
    textSize(12.5);
    fill(184, 184, 184);
    text(hellpers[ieee][4],282,y-40);
    
    textAlign(LEFT,DOWN);
    textSize(10);
    fill(255, 255, 255);
    text("This helper gives you " +
    numbershortener(hellpers[ieee][3], true) + 
    " squares per second, with " +
    numbershortener(hellpers[ieee][5], true) + 
    " squares made so far. " +
    numbershortener(hellpers[ieee][1]) +
    " " + hellpers[ieee][2] + 
    "s gives you " +
    numbershortener(hellpers[ieee][3]*hellpers[ieee][1], true) +
    " squares per second.",
    282,
    y-20, 240, 100);
    
    textAlign(CENTER,CENTER);
    
}

function helpers(y,anum){
    if(isopen === "none"){
    var num = hellpers[anum][0];
    var amount = hellpers[anum][1];
    var titleofthing = hellpers[anum][2];
    
    if(mousex >= 0 &&
    mousex <= 255 &&
    mousey >= y - 21 &&
    mousey <= y + 21){
    if(clicked && num <= square){
        square -= num;
        hellpers[anum][1] += 1;
        hellpers[anum][0] *= 1.15;
    }
    
    helperers(y,anum);
    
    }
    {
    if(num > square){
    fill(94, 94, 94);
    rect(130,y,260,50);
    fill(74, 74, 74);
    rect(130,y,250,40);
    if(mousex >= 0 &&
    mousex <= 255 &&
    mousey >= y - 21 &&
    mousey <= y + 21){
    fill(209, 209, 209);
    rect(130,y,260,50);
    fill(94, 94, 94);
    rect(130,y,255,45);
    fill(74, 74, 74);
    rect(130,y,250,40);
        
    }
    } else {
    
    fill(112, 112, 112);
    rect(130,y,260,50);
    fill(133, 133, 133);
    rect(130,y,250,40);
    
    if(mousex >= 0 &&
    mousex <= 255 &&
    mousey >= y - 21 &&
    mousey <= y + 21){
    fill(209, 209, 209);
    rect(130,y,260,50);
    fill(112, 112, 112);
    rect(130,y,255,45);
    fill(133, 133, 133);
    rect(130,y,250,40);
        
    }
    
    if(mousex >= 0 &&
    mousex <= 255 &&
    mousey >= y - 21 &&
    mousey <= y + 21 && pressed){
        
    fill(166, 166, 166);
    rect(130,y,260,50);
    fill(102, 102, 102);
    rect(130,y,255,45);
    fill(120, 120, 120);
    rect(130,y,250,40);
        
    }
    }
    
    
    textAlign(LEFT,CENTER);
    textSize(20);
    fill(194, 194, 194);
    text(titleofthing,12,y-7);
    textSize(12.1);
    if(num > square){
    fill(250, 35, 35);
    } else {
    fill(5, 255, 72);
    }
    text(numbershortener(num) + " squares",12,y+11);
    
    textAlign(RIGHT,CENTER);
    textSize(30);
    fill(0, 0, 0, 50);
    text(amount,245,y);
    textAlign(CENTER,CENTER);
    }//stuff
    
    }
    //make sure there isn't two of the same helper or else this will double
    STAT.helpersbought += hellpers[anum][1];
    
}

function goldensquareupdate(){
    goldentype.bigtimerthing = (~~(millis()/1000));
    goldentype.s = goldentype.bigtimerthing2-goldentype.bigtimerthing;
    if(goldentype.update === true){
        
        goldentype.bigtimerthing2 = goldentype.bigtimerthing+17;
        goldentype.on = true;
        goldentype.update = false;
        
    }
    
    if(goldentype.on === true){
        SPCLICKBONUS = 77;
        //e
        
        if(goldentype.bigtimerthing2 < goldentype.bigtimerthing){
            
            SPCLICKBONUS = 1;
            goldentype.on = false;
            
        }
        
    }
    
    
}

var goldthingupdate = false;

var shorttimerthing = (~~(millis()/1000));

var howlonggoldthingtakes = 307;

draw = function() {
    thefps = max(50,this.__frameRate.toFixed(10));
    cursor("default");
    mousex = mouseX;
    mousey = mouseY;
    background(78, 110, 135);
    if(Wh === 900 && Ht === 700){
    
    // This keeps the game running when tabbed!
    if(activewhentabbed === true){
    if(frameCount%600 === 0){
    sond.audio.volume = 0.001;
    playSound(sond);
    }
    }
    //
    
    {
    shorttimerthing = (~~(millis()/1000));
    if(shorttimerthing%howlonggoldthingtakes === 0 &&
    goldthingupdate === false &&
    frameCount > 1000){
    
    things.push(new golden(-1));
    goldthingupdate = true;
    
    }
    else if(shorttimerthing%howlonggoldthingtakes === howlonggoldthingtakes-1){
        
        goldthingupdate = false;
        
    }
    }//gold thing spawns
    
    //magic found here
    // - multiply squares by 2
    // + divide them by 2
    // d -1 of every helper
    // f +1 of every helper
    // e show every upgrade
    // k sort upgrades by id 
    // l sort upgrades by cost
    if(isclosed === "idk"){
    if(keys[69]){
        
        for(var i = 0; i < upgradeID.length; i++){
            
            putthelistinthelist(i);
            
        }
        keys[69] = false;
    }
    
    if(keys[70]){
        
        for(var i = 0; i < hellpers.length; i++){
            
            hellpers[i][1] += 1;
            
        }
        keys[70] = false;
    }
    if(keys[68]){
        
        for(var i = 0; i < hellpers.length; i++){
            
            hellpers[i][1] -= 1;
            
        }
        keys[68] = false;
    }
    
    if(keys[189]){
        
        square *= 2;
        STAT.total *= 2;
        keys[189] = false;
    }
    if(keys[187]){
        
        square *= 0.5;
        keys[187] = false;
    }
    
    if(keys[75]){
        
    thisisalist.sort(function(a, b) {
    return a[6] - b[6]; // a - b is smallest to largest
    });//credit to 1001programmer1001!!
        
        keys[75] = false;
        
    }
    if(keys[76]){
        
        
    thisisalist.sort(function(a, b) {
    return a[5] - b[5]; // a - b is smallest to largest
    });//credit to 1001programmer1001!!
        
        keys[76] = false;
        
    }
    
    
    }
    
    //update
    updatee();
    goldensquareupdate();
    
    //background
    bg();
    
    //foreground
    Bsquare();
    
    //foregoundleft
    //we be hiding them until the one before and before is avalible
    helpers(80,0);
    helpers(130,1);
    if(STAT.total >= 15){
    helpers(180,2);
    }
    if(STAT.total >= 190){
    helpers(230,3);
    }
    if(STAT.total >= 3500){
    helpers(280,4);
    }
    if(STAT.total >= 57300){
    helpers(330,5);
    }
    
    stats();
    
    //foregroundright
    upgradee();
    
    //foreforeground
    thingshower();
    
    
    //frame thing
    textSize(10);
    fill(255, 255, 255);
    text(this.__frameRate.toFixed(10),450,690);
    
    
    //iconshower(300,300,"duper0");
    
    //text(shorttimerthing%77,300,300);
    
    } else {
        
        textSize(20);
        fill(193, 211, 230);
        text("Use this hight and width\nbecause 600 x 600 just was too\nsmall for me (click for link)",300,300);
        
        if(clicked){
            
            println("https://www.khanacademy.org/computer-programming/idk-try-clicking-v02/6548342283354112?height=700&width=900");
            
        }
        
    }
    
    clicked = false;
    SPS = 0;
    STAT.helpersbought = 0;
    STAT.raw = 0;
    
};