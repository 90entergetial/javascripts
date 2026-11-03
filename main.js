// Builds one square card per project
function buildProjectCards() {
    var container = document.getElementById("projects");

    window.PROJECTS.forEach(function (project) {
        var base = "javaprojecttests/" + encodeURIComponent(project.folder) + "/";

        var card = document.createElement("a");
        card.className = "card";
        if (project.entry) {
            card.href = base + encodeURIComponent(project.entry);
        } else {
            // No runnable page: link to the source on GitHub instead.
            card.href = "https://github.com/90entergetial/javascripts/tree/main/" + base;
            card.target = "_blank";
        }

        // Image area. Files live in the images/ folder.
        // `video: "clip.mp4"` plays a looping, muted clip like a GIF; otherwise `image: "pic.png"` shows a picture.
        var image;
        if (project.video) {
            image = document.createElement("video");
            image.src = "images/" + encodeURIComponent(project.video);
            image.autoplay = true;
            image.muted = true;
            image.loop = true;
            image.playsInline = true;
            if (project.image) {
                image.poster = "images/" + encodeURIComponent(project.image); // shown while the video loads
            }
        } else {
            image = document.createElement("div");
            if (project.image) {
                image.style.backgroundImage = "url('images/" + encodeURIComponent(project.image) + "')";
            }
        }
        image.className = "card-image";

        var transition = document.createElement("div");
        transition.className = "card-transition";

        var info = document.createElement("div");
        info.className = "card-info";

        var title = document.createElement("h2");
        title.className = "card-title";
        title.textContent = project.title;

        var desc = document.createElement("p");
        desc.className = "card-desc";
        desc.textContent = project.description;
        desc.title = project.description;

        var tags = document.createElement("div");
        tags.className = "card-tags";
        (project.tags || []).forEach(function (tag) {
            var t = document.createElement("span");
            t.className = "card-tag";
            t.textContent = tag;
            tags.appendChild(t);
        });

        var date = document.createElement("p");
        date.className = "card-date";
        date.textContent = project.date;
        date.title = project.date;
        tags.appendChild(date)


        info.append(title, desc, tags);
        card.append(image, transition, info);
        container.appendChild(card);
    });
}

window.onload = function () {

    buildProjectCards();

    function showbodyDiv(){
        var bodyDiv = document.getElementById("body");
        bodyDiv.style.display = "block";
    }

    var randomtext = ["This is a Title.", "Hey, I'm a Title!","Great day today, huh?","Insert Title Here.","Do Parrots Even Know They're Alive?","Beep Beep Boop Boop Beep.","If you want to make a fraction in LaTeX, do \\frac{x}{y}.","Whoop, Seems This Title is Random.","A Test of Python. Just kidding."];
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