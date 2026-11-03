window.onload = function () {

    function showbodyDiv(){
        var bodyDiv = document.getElementById("body");
        bodyDiv.style.display = "block";
    }

    var randomtext = ["This is a Title.", "Hey, I'm a Title!","Great day today, huh?","Insert Title Here."];
    var atitle = document.getElementById("title");
    var r = Math.floor(Math.random()*randomtext.length);

    //display title
    setTimeout(() => {

    atitle.innerHTML = randomtext[r];

    var alittledesc = document.getElementById("littledesc");
    alittledesc.innerHTML = "This is Title #" + (r+1) + "!";
    alittledesc.style.color = "rgba(255, 255, 255, 0.05)";

    }, 500);
    function realTitle(){
        atitle.innerHTML = "A Test of Javascripts.";
        showbodyDiv();

        var alittledesc = document.getElementById("littledesc");
        alittledesc.innerHTML = "vvv Scroll Down! vvv";
        alittledesc.style.color = "rgba(255, 255, 255, 0.1)";
    }
    function removeTitle(sliced=1, timelen=150){
        atitle.innerHTML = randomtext[r].substring(sliced);
        if(sliced != randomtext[r].length){
            setTimeout(() => {

                removeTitle(sliced+1, Math.max(timelen*0.95,5));

            }, timelen);
        } else {
            setTimeout(() => {

                realTitle();

            }, 1000);
        }
    }
    //remove title
    setTimeout(() => {

    removeTitle();

    var alittledesc = document.getElementById("littledesc");
    alittledesc.style.color = "rgba(255, 255, 255, 0)";

    }, 3000);

};