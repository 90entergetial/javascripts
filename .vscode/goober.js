
var t1 = ["post", "is", "gary", "jerry", "mr", "a ", "to "]
var t2 = ["happy", "goes", "time", "to", "for", "can", "yay"]
a = 0
b = 0
setInterval( function(){
    
    a++;
    if(a == 300){
      document.getElementById("pretty_top_replay").click()
    }
    if(a == 1){
      document.getElementById("pretty_top_exit").click()
    }
    if(a == 2){
      document.getElementById("leaveconfirmwindow_okbutton").click()
    }
    if(a == 3){
      document.getElementById("guestOrAccountContainer_guestButton").click()
      document.getElementById("guest_nametext").value = t1[Math.floor(Math.random()*7)] + t2[Math.floor(Math.random()*7)] + Math.floor(Math.random()*999).toString()
      document.getElementById("guestPlayButton").click()
      document.getElementById("roomlistcreatewindowunlistedcheckbox").click()
      document.getElementById("roomlistcreatecreatebutton").click()
    }
    if(a == 4 && document.getElementById("newbonklobby").style['display'] == 'none'){
    a = 3
    }
    if(a == 5){
      document.getElementById("newbonklobby_mapbutton").click()
    }
    if(a == 6){
      document.getElementsByClassName("maploadwindowmapdiv")[Math.floor(Math.random()*document.getElementsByClassName("maploadwindowmapdiv").length)].click()
    }
    if(a == 7){
      document.getElementById("newbonklobby_startbutton").click()
    }

    if(a > 7){
        if(Math.random() > 0.5) {
        fire("keydown", { "keyCode": leftRight[0] }, Gdocument.getElementById("gamerenderer"));
        }
        else {
            fire("keyup", { "keyCode": leftRight[0] }, Gdocument.getElementById("gamerenderer"));
        }
        if(Math.random() > 0.5) {
            fire("keydown", { "keyCode": leftRight[1] }, Gdocument.getElementById("gamerenderer"));
        }
        else {
            fire("keyup", { "keyCode": leftRight[1] }, Gdocument.getElementById("gamerenderer"));
        }
        if(Math.random() > 0.5) {
            fire("keydown", { "keyCode": upDown[0] }, Gdocument.getElementById("gamerenderer"));
        }
        else {
            fire("keyup", { "keyCode": upDown[0] }, Gdocument.getElementById("gamerenderer"));
        }
        if(Math.random() > 0.5) {
            fire("keydown", { "keyCode": upDown[1] }, Gdocument.getElementById("gamerenderer"));
        }
        else {
            fire("keyup", { "keyCode": upDown[1] }, Gdocument.getElementById("gamerenderer"));
        }
        if(Math.random() > 0.5) {
            fire("keydown", { "keyCode": heavy }, Gdocument.getElementById("gamerenderer"));
        }
        else {
            fire("keyup", { "keyCode": heavy }, Gdocument.getElementById("gamerenderer"));
        }
        if(Math.random() > 0.5) {
            fire("keydown", { "keyCode": special }, Gdocument.getElementById("gamerenderer"));
        }
        else {
            fire("keyup", { "keyCode": special }, Gdocument.getElementById("gamerenderer"));
        }
    }


    if(a >= 400) a = 0
    
}, 100);
