// ==UserScript==
// @name         Tampertamper
// @namespace    http://tampermonkey.net/
// @version      v0
// @description  .zyx's test
// @author       .ZYX
// @match        https://bonk.io/*
// @match        https://bonkisback.io/*
// @match        https://multiplayer.gg/physics/*
// @icon         https://cdn.discordapp.com/attachments/1092002308105179196/1551020612091387965/image.png?ex=6ab07402&is=6aaf2282&hm=c51d4546dd80ab9dcaf6f30e0b1f67d0bb18a2c5fcaa7faebcccfc99e119f559&
// @grant        none
// ==/UserScript==

function Tampertamper(f) {
    if (window.location == window.parent.location) {
        if (document.readyState == "complete") { f(); }
        else { document.addEventListener('readystatechange', function () { setTimeout(f, 1500); }); }
    }
}

Tampertamper(function() {
    var scope = window;
    scope.scope = scope;

    var iframe = document.getElementById("maingameframe");
    var Cprime = [206, 56, 122];
    var Csecond = [206, 56, 122];
    var showHUD = false;

    function whenIframeReady(cb) {
        // If the iframe document is already loaded and has a body, just go
        function tryInit() {
            var Gwin, Gdoc;
            try {
                Gwin = iframe.contentWindow;
                Gdoc = iframe.contentDocument;
            } catch (e) {
                // cross-origin - shouldn't happen for same-site gameframe, but just in case
                return false;
            }
            if (Gdoc && Gdoc.readyState !== "loading" && Gdoc.body) {
                cb(Gwin, Gdoc);
                return true;
            }
            return false;
        }

        if (tryInit()) return;

        // Otherwise wait for the iframe's load event
        iframe.addEventListener("load", function onLoad() {
            iframe.removeEventListener("load", onLoad);
            tryInit();
        });

        // Fallback poll in case load already fired before we attached, or
        // in case contentDocument swaps (some games replace it)
        var pollId = setInterval(function () {
            if (tryInit()) clearInterval(pollId);
        }, 250);
    }

    function waitForPageContainer(Gwin, Gdoc, cb) {
        var existing = Gdoc.getElementById("pagecontainer");
        if (existing) { cb(existing); return; }

        var observer = new MutationObserver(function () {
            var el = Gdoc.getElementById("pagecontainer");
            if (el) {
                observer.disconnect();
                cb(el);
            }
        });

        observer.observe(Gdoc.documentElement || Gdoc.body, {
            childList: true,
            subtree: true
        });

        // Safety-net poll, in case MutationObserver misses something
        // (e.g. the target gets replaced wholesale)
        var pollId = setInterval(function () {
            var el = Gdoc.getElementById("pagecontainer");
            if (el) {
                clearInterval(pollId);
                observer.disconnect();
                cb(el);
            }
        }, 250);
    }

    function waitForBonkContainer(Gwin, Gdoc, cb) {
        var existing = Gdoc.getElementById("bonkiocontainer");
        if (existing) { cb(existing); return; }

        var observer = new MutationObserver(function () {
            var el = Gdoc.getElementById("bonkiocontainer");
            if (el) {
                observer.disconnect();
                cb(el);
            }
        });

        observer.observe(Gdoc.documentElement || Gdoc.body, {
            childList: true,
            subtree: true
        });

        // Safety-net poll, in case MutationObserver misses something
        // (e.g. the target gets replaced wholesale)
        var pollId = setInterval(function () {
            var el = Gdoc.getElementById("bonkiocontainer");
            if (el) {
                clearInterval(pollId);
                observer.disconnect();
                cb(el);
            }
        }, 250);
    }

    function waitForMapContainer(Gwin, Gdoc, cb) {
        var existing = Gdoc.getElementById("mapeditorcontainer");
        if (existing) { cb(existing); return; }

        var observer = new MutationObserver(function () {
            var el = Gdoc.getElementById("mapeditorcontainer");
            if (el) {
                observer.disconnect();
                cb(el);
            }
        });

        observer.observe(Gdoc.documentElement || Gdoc.body, {
            childList: true,
            subtree: true
        });

        // Safety-net poll, in case MutationObserver misses something
        // (e.g. the target gets replaced wholesale)
        var pollId = setInterval(function () {
            var el = Gdoc.getElementById("mapeditorcontainer");
            if (el) {
                clearInterval(pollId);
                observer.disconnect();
                cb(el);
            }
        }, 250);
    }

    function waitForBGRContainer(Gwin, Gdoc, cb) {
        var existing = Gdoc.getElementById("bgreplay");
        if (existing) { cb(existing); return; }

        var observer = new MutationObserver(function () {
            var el = Gdoc.getElementById("bgreplay");
            if (el) {
                observer.disconnect();
                cb(el);
            }
        });

        observer.observe(Gdoc.documentElement || Gdoc.body, {
            childList: true,
            subtree: true
        });

        // Safety-net poll, in case MutationObserver misses something
        // (e.g. the target gets replaced wholesale)
        var pollId = setInterval(function () {
            var el = Gdoc.getElementById("bgreplay");
            if (el) {
                clearInterval(pollId);
                observer.disconnect();
                cb(el);
            }
        }, 250);
    }

    function waitForTopBar(Gwin, Gdoc, cb) {
        var existing = Gdoc.getElementById("pretty_top_bar");
        if (existing) { cb(existing); return; }

        var observer = new MutationObserver(function () {
            var el = Gdoc.getElementById("pretty_top_bar");
            if (el) {
                observer.disconnect();
                cb(el);
            }
        });

        observer.observe(Gdoc.documentElement || Gdoc.body, {
            childList: true,
            subtree: true
        });

        // Safety-net poll, in case MutationObserver misses something
        // (e.g. the target gets replaced wholesale)
        var pollId = setInterval(function () {
            var el = Gdoc.getElementById("pretty_top_bar");
            if (el) {
                clearInterval(pollId);
                observer.disconnect();
                cb(el);
            }
        }, 250);
    }

    // Keeps Gwin.Howler's master volume pinned to Gwin.T_masterVolume no matter
    // what bonk.io's own code does to it. We can't just override Howler.volume()
    // once and call it a day: Howler.unload() (called internally by bonk when it
    // tears down a game/lobby's sounds) recreates the AudioContext + masterGain
    // from scratch with a hardcoded gain of 1 (or 0 if muted), which completely
    // bypasses .volume(). So on top of overriding .volume()/.mute(), we also wrap
    // .unload() to reapply right after it runs, AND run a continuous watchdog that
    // corrects any drift we haven't specifically accounted for (e.g. bonk touching
    // masterGain.gain directly, or swapping in a fresh Howler object).
    function waitForHowler(Gwin, cb) {
        var calledBack = false;

        function lockHowler(Howler) {
            var savedVolume = 1;
            try {
                var stored = Gwin.localStorage.getItem("T_masterVolume");
                if (stored !== null) savedVolume = parseFloat(stored);
            } catch (e) {}
            if (isNaN(savedVolume)) savedVolume = 1;
            Gwin.T_masterVolume = savedVolume;

            var originalVolumeFn = Howler.volume.bind(Howler);
            Howler.__T_originalVolumeFn = originalVolumeFn;

            // Force every .volume(x) call - bonk's own code included - to use our
            // stored target instead of whatever value was actually requested.
            Howler.volume = function (v) {
                if (v === undefined) return originalVolumeFn(); // plain getter
                return originalVolumeFn(Gwin.T_masterVolume);
            };

            if (typeof Howler.unload === "function") {
                var originalUnloadFn = Howler.unload.bind(Howler);
                Howler.unload = function () {
                    var result = originalUnloadFn();
                    console.log("Tampertamper: Howler.unload() detected, reapplying locked volume");
                    originalVolumeFn(Gwin.T_masterVolume);
                    return result;
                };
            }

            if (typeof Howler.mute === "function") {
                var originalMuteFn = Howler.mute.bind(Howler);
                Howler.mute = function (m) {
                    var result = originalMuteFn(m);
                    if (!m) originalVolumeFn(Gwin.T_masterVolume);
                    return result;
                };
            }

            originalVolumeFn(savedVolume);
            Howler.__T_locked = true;
            console.log("Tampertamper: Howler volume locked to " + Math.round(savedVolume * 100) + "%");
        }

        setInterval(function () {
            var Howler = Gwin.Howler;
            if (!Howler || typeof Howler.volume !== "function") return; // not loaded yet

            if (!Howler.__T_locked) {
                lockHowler(Howler);
                if (!calledBack) {
                    calledBack = true;
                    cb(Howler);
                }
                return;
            }

            // Watchdog: catches drift from any reset path we haven't specifically
            // patched (direct masterGain access, a brand new Howler object, etc.)
            var current = Howler.__T_originalVolumeFn();
            var target = Gwin.T_masterVolume;
            if (typeof current === "number" && Math.abs(current - target) > 0.01) {
                console.log("Tampertamper: detected volume drift (" + current.toFixed(2) + " -> " + target.toFixed(2) + "), correcting");
                Howler.__T_originalVolumeFn(target);
            }
        }, 300);
    }

    // Watches Gwin.playerids for newly-added player entries (someone joining
    // the lobby) and, if that new player has "commands": true, calls Gwin.notify.
    // playerids is a plain object bonk.io mutates in place (keyed by player id),
    // with no change event to hook into, so we poll and diff against the last
    // known set of ids - this also means removals (someone leaving) and the
    // whole thing being 0/empty (not in a lobby) just fall out of the diff
    // naturally rather than needing special-case handling.
    function watchPlayerCommands(win) {
        var knownIds = Object.keys(win.playerids || {});

        setInterval(function () {
            var current = win.playerids;
            var currentIds = current ? Object.keys(current) : []; // 0 is falsy, so "not in a lobby" -> []
            var hasids = [];
            if (currentIds.length > 1) {
                for (var i = 0; i < currentIds.length; i++) {
                    var id = currentIds[i];
                    if (knownIds.indexOf(id) === -1) {
                        // This id wasn't there last poll - a player just joined.
                        var player = current[id];
                        if (player && player.commands === true && window.notifyofcommands) {
                            hasids.push(player.userName);
                        }
                    }
                }
            }
            if (hasids.length > 0) {
                displayInChat("[!] Players with commands: " + hasids.join(", "),"#DA8080","1EBCC1");
            }

            knownIds = currentIds;
        }, 500);
    }

    function injectCustomCSS(Gdoc) {
        if (Gdoc.getElementById("T_customcss")) return; // avoid double-injecting

        const css = `
/* ===== classinactive.css ===== */
.classicTopBar{
	background-color: #7b549b !important;
	box-shadow: none !important;
}

.windowTopBar_classic{
	background-image: linear-gradient(#7b549b,#8e579f) !important;
	border-bottom: none !important;
}

.brownButton_classic{
	background-color: #70555d;
	border-top: none;
	border-bottom: none;
}

.brownButton_classic:hover{
	background-color: #826977 !important;
}

.brownButton_disabled_classic{
	pointer-events: none !important;
	cursor: default !important;
	background-color: #777777 !important;
}

.roomlist_classic{
	outline: 3000px solid rgb(0 0 0 / 0.4) !important;
	background-color: #d2dbde !important;
}

#roomlisttable tr:nth-child(odd) {
	background-color: #c1cdd2;
}

.newbonklobby_boxtop_classic{
	background-image: linear-gradient(#7b549b,#8e579f) !important;
}

.dropdown_classic{
	background-color: #70555d;
}

.dropdown_classic:hover{
	background-color: #7f5d51 !important;
}

.compactSlider_classic::-moz-range-thumb {
	background-color: #795548 !important;
}

.compactSlider_classic::-ms-thumb {
	background-color: #795548 !important;
}

#classic_mid{
	width:178px;
	height:380px;
	top:0;
	bottom:0;
	left:0;
	right:0;
	margin:auto;
	display:flex;
	flex-direction: column;
	justify-content: space-between;
	position: absolute;
	pointer-events: auto;
	visibility: hidden;
}

.classic_mid_buttons{
	width: 100%;
	height: 42px;
	line-height: 42px;
	color:#ffffff;
	font-family: futurept_book_fixed;
	text-shadow: 1px 1px 2px #00000047;
	text-align: center;
	font-size: 18px;
	box-shadow: 2px 2px 3px #00000040, 0px 0px 7px #00000045;
	border-top: 1px solid rgb(255 255 255 / 6%) !important;
	border-bottom: 1px solid #00000038 !important;
	cursor:pointer;
	margin-left: auto;
	margin-right: auto;
}
.classic_mid_buttons:hover{
	background-color: #7f5d51 !important;
}

/* ===== mapeditor.css ===== */
.mapeditor_rightbox_table_leftcell{
	color: #310031;
}
.mapeditor_rightbox_table_rightcell{
	color: purple;
}

/* ===== maploadwindow.css ===== */
#maploadwindowtopbar{
	height: 30px;
	line-height: 30px;
	font-size: 20px;
}

#maploadwindowgreybar{
	height: 70px;
	top: 29px;
}
#maploadwindowmapscontainer{
	width: calc(100% - 10px);
}

/* ===== newbonklobby.css ===== */
#newbonklobby_mappreviewcontainer{
	border: 2px solid #d7c5e3;
}
#newbonklobby_maptext{
	color: #4c054c;
	font-weight: bold;
}
#newbonklobby_mapauthortext{
	font-style:italic;
}

/* ===== pagelayout.css ===== */
/*
body{
	background-image: linear-gradient(rgb(68 74 90),rgb(70 62 97));
}
*/
#pagecontainer{
	z-index:1;
}
#bonkioheader{
	background-color: rgb(63 69 86);
}
#bonkiocontainer{
	position: absolute;
	border: 8px solid #0e0e0e8f;
	background-color: rgb(71 74 133);
    top: 100px;
}

@keyframes colorChange {
  0% { background-color: #7042dc; }
  50% { background-color: #4544ea; }
  100% { background-color: #7042dc; }
}
#newbonkgamecontainer{
	animation: colorChange 5s infinite;
}
#xpbarfill{
	background-image: linear-gradient(90deg,#dfa7fa,#a447d2);
}

@keyframes creditChange {
  0% { color: #7042dc; }
  50% { color: #4544ea; }
  100% { color: #7042dc; }
}
#ingamemapcredit_name{
	animation: creditChange 0.7s infinite;
	font-weight:bold;
	color:#9a7cd7;
}
#ingamemapcredit_by{
	color:rgba(255, 255, 255, 0.5);
}
#ingamemapcredit_author{
	font-style:italic;
}
    `;

        const styleTag = Gdoc.createElement("style");
        styleTag.id = "T_customcss";
        styleTag.textContent = css;
        Gdoc.head.appendChild(styleTag);

        console.log("Custom CSS injected into iframe document");
    }

    whenIframeReady(function (Gwin, Gdoc) {
        window.Gwindow = Gwin;
        window.Gdocument = Gdoc;
        if(window.warnpmuse == undefined) window.warnpmuse = true;
        if(window.kickpmuse == undefined) window.kickpmuse = true;
        if(window.hidefrompmuser == undefined) window.hidefrompmuser = true;
        if(window.notifyofcommands == undefined) window.notifyofcommands = true;
        watchPlayerCommands(window);
        waitForHowler(Gwin, function (Howler) {
            console.log("Tampertamper: Howler ready and locked");
        });

        injectCustomCSS(Gdoc);

        waitForPageContainer(Gwin, Gdoc, function (pagecontainer) {
            if (Gdoc.getElementById("T_roomlist") == null) {
                let T_roomlist = Gdoc.createElement("div");
                T_roomlist.id = "T_roomlist";
                T_roomlist.style["background-color"] = "rgba(" + Cprime[0] + "," + Cprime[1] + "," + Cprime[2] + ")";
                T_roomlist.textContent = "T_roomlist";
                T_roomlist.style["position"] = "fixed";
                T_roomlist.style["bottom"] = "400";
                console.log("pagecontainer found, inserting T_roomlist");
                pagecontainer.after(T_roomlist);
            }
        });
        waitForBonkContainer(Gwin, Gdoc, function (bonkcontainer) {
            if (Gdoc.getElementById("T_title") == null) {
                let T_title = Gdoc.createElement("div");
                T_title.id = "T_title";
                T_title.style["color"] = "rgba(" + Cprime[0] + "," + Cprime[1] + "," + Cprime[2] + ", 0.2)";
                T_title.style["left"] = "180px";
                T_title.style["top"] = "25px";
                T_title.style["font-size"] = "70px";
                T_title.style["font-weight"] = "bold";
                T_title.style["font-style"] = "italic";
                T_title.style["font-family"] = "futurept_book";
                T_title.style["text-align"] = "left";
                T_title.style["position"] = "relative";
                T_title.textContent = "TAMPERTAMPER";
                console.log("pagecontainer found, inserting T_title");
                bonkcontainer.after(T_title);
            }
        });
        waitForMapContainer(Gwin, Gdoc, function (mapeditorcontainer) {
            Gdoc.addEventListener("keydown", function(event) {
                if (Gdoc.getElementById("mapeditorcontainer").style.display === 'block'){
                    const key = event.key; // consider event.key.toLowerCase() if you want case-insensitive

                    if (key === "I") {
                        Gdoc.getElementById("mapeditor_rightbox_shapeaddmenu_rectangle").click();
                    }
                    if (key === "P") {
                        Gdoc.getElementById("mapeditor_rightbox_shapeaddmenu_polygon").click();
                    }
                    if (key === "O") {
                        Gdoc.getElementById("mapeditor_rightbox_shapeaddmenu_circle").click();
                    }
                    if (key === "N") {
                        Gdoc.getElementById("mapeditor_leftbox_createmenu_platform_np").click();
                    }
                    if (key === "M") {
                        Gdoc.getElementById("mapeditor_leftbox_createmenu_platform_d").click();
                    }
                    if (key === "B") {
                        Gdoc.getElementById("mapeditor_leftbox_createmenu_platform_s").click();
                    }
                    if (key === "S") {
                        Gdoc.getElementById("mapeditor_leftbox_createmenu_spawn").click();
                    }
                    if (key === "`") {
                        Gdoc.getElementById("mapeditor_midbox_cancel_drawing").click();
                    }
                    if (key === "H") {
                        const nameField = Gdoc.getElementById("mapeditor_rightbox_namefield");
                        if (nameField.style.visibility === 'hidden'){
                            nameField.style.visibility = 'inherit';
                        } else {
                            nameField.style.visibility = 'hidden';
                        }
                    }
                }
            });

            Gdoc.getElementById("mapeditor_leftbox_createmenu_platform_np").innerHTML = "No-physics (N)";
            Gdoc.getElementById("mapeditor_leftbox_createmenu_platform_d").innerHTML = "Moving (M)";
            Gdoc.getElementById("mapeditor_leftbox_createmenu_platform_s").innerHTML = "Stationary (B)";
        });
        waitForBGRContainer(Gwin, Gdoc, function (bgreplay) {
            //bgreplay.style["visibility"] = "hidden";
        });
        waitForTopBar(Gwin, Gdoc, function (topBar) {
            if (Gdoc.getElementById("T_HUD") == null) {
                let T_HUD = Gdoc.createElement("div");
                T_HUD.id = "T_HUD";
                T_HUD.textContent = "TMP";
                T_HUD.className = "pretty_top_button niceborderleft";
                T_HUD.style["position"] = "absolute";
                T_HUD.style["width"] = "58px";
                T_HUD.style["height"] = "34px";
                T_HUD.style["right"] = "348px";
                T_HUD.style["top"] = "0px";
                T_HUD.style["border-bottom"] = "2px solid transparent";
                T_HUD.style["line-height"] = "34px";
                T_HUD.style["text-align"] = "center";
                T_HUD.style["font-family"] = "futurept_b1";
                T_HUD.style["color"] = "rgb(255, 255, 255)";
                T_HUD.style["cursor"] = "pointer";
                T_HUD.addEventListener("click", function() {
                    console.log("T_HUD clicked");
                    showHUD = !showHUD;
                    const T_MAINHUD = Gdoc.getElementById("T_MAINHUD");
                    if (T_MAINHUD) {
                        T_MAINHUD.style["visibility"] = showHUD ? "inherit" : "hidden";
                    }
                });
                console.log("pagecontainer found, inserting T_HUD");
                topBar.appendChild(T_HUD);
            }
            if (Gdoc.getElementById("T_MAINHUD") == null) {
                // Create a HUD window, which is in the center of the bonkcontainer.
                let prettymenu = Gdoc.getElementById("prettymenu");

                let T_MAINHUD = Gdoc.createElement("div");
                T_MAINHUD.id = "T_MAINHUD";
                T_MAINHUD.style["visibility"] = showHUD ? "inherit" : "hidden";
                T_MAINHUD.style["position"] = "absolute";
                T_MAINHUD.style["top"] = "50%";
                T_MAINHUD.style["left"] = "50%";
                T_MAINHUD.style["transform"] = "translate(-50%, -50%)";
                T_MAINHUD.style["background"] = "rgba(0, 0, 0, 0.8)";
                T_MAINHUD.style["width"] = "90%";
                T_MAINHUD.style["height"] = "90%";
                T_MAINHUD.style["border-radius"] = "10px";
                T_MAINHUD.style["color"] = "rgb(" + Cprime[0] + "," + Cprime[1] + "," + Cprime[2] + ")";
                T_MAINHUD.style["font-family"] = "futurept_book";
                prettymenu.appendChild(T_MAINHUD);


                let MAINHUD_TITLE = Gdoc.createElement("div");
                MAINHUD_TITLE.textContent = "TAMPERTAMPER";
                MAINHUD_TITLE.style["background"] = "rgba(0, 0, 0, 0.3)";
                MAINHUD_TITLE.style["color"] = "rgb(" + Cprime[0] + "," + Cprime[1] + "," + Cprime[2] + ")";
                MAINHUD_TITLE.style["font-size"] = "24px";
                MAINHUD_TITLE.style["font-weight"] = "bold";
                MAINHUD_TITLE.style["margin-bottom"] = "20px";
                MAINHUD_TITLE.style["border-radius"] = "10px";
                MAINHUD_TITLE.style["padding"] = "6px";
                MAINHUD_TITLE.style["text-align"] = "center";
                MAINHUD_TITLE.style["z-index"] = "9992";
                MAINHUD_TITLE.style["pointer-events"] = "auto";
                T_MAINHUD.appendChild(MAINHUD_TITLE);


                let MAINHUD_CONTENT = Gdoc.createElement("div");
                MAINHUD_CONTENT.style["padding"] = "10px";
                MAINHUD_CONTENT.style["text-align"] = "left";
                MAINHUD_CONTENT.style["z-index"] = "9991";
                MAINHUD_CONTENT.style["pointer-events"] = "auto";
                MAINHUD_CONTENT.textContent = "Hide Background Replay";

                // Make a checkbox which when clicked will toggle the background replay visibility.
                let MAINHUD_BGRP_CHECKBOX = Gdoc.createElement("input");
                MAINHUD_BGRP_CHECKBOX.type = "checkbox";
                MAINHUD_BGRP_CHECKBOX.addEventListener("click", function() {
                    let backgroundReplay = Gdoc.getElementById("bgreplay");
                    if (backgroundReplay) {
                        let speedamount = Gdoc.getElementById("bgreplay_timescrub");
                        if(this.checked){
                            speedamount.min = '0';
                            speedamount.value = '0';
                        } else {
                            speedamount.min = '0';
                            speedamount.value = '1';
                        }
                        backgroundReplay.style["visibility"] = this.checked ? "hidden" : "inherit";
                    }
                });
                MAINHUD_CONTENT.appendChild(MAINHUD_BGRP_CHECKBOX);



                    // Volume slider - reads/writes Gwin.T_masterVolume, which
                    // waitForHowler() keeps Howler's actual output pinned to.
                    let initialVolume = (typeof Gwin.T_masterVolume === "number") ? Gwin.T_masterVolume : 1;

                    let VOLUME_LABEL = Gdoc.createElement("div");
                    VOLUME_LABEL.textContent = "Volume Slider";
                    VOLUME_LABEL.style["margin-top"] = "12px";
                    VOLUME_LABEL.style["font-weight"] = "bold";
                    MAINHUD_CONTENT.appendChild(VOLUME_LABEL);

                    let VOLUME_ROW = Gdoc.createElement("div");
                    VOLUME_ROW.style["display"] = "flex";
                    VOLUME_ROW.style["align-items"] = "center";
                    VOLUME_ROW.style["gap"] = "8px";
                    VOLUME_ROW.style["margin-top"] = "4px";

                    let VOLUME_SLIDER = Gdoc.createElement("input");
                    VOLUME_SLIDER.type = "range";
                    VOLUME_SLIDER.min = "0";
                    VOLUME_SLIDER.max = "100";
                    VOLUME_SLIDER.value = String(Math.round(initialVolume * 100));
                    VOLUME_SLIDER.style["flex"] = "0.2";
                    VOLUME_SLIDER.style["accent-color"] = "rgb(" + Cprime[0] + "," + Cprime[1] + "," + Cprime[2] + ")";

                    let VOLUME_VALUE = Gdoc.createElement("span");
                    VOLUME_VALUE.textContent = VOLUME_SLIDER.value + "%";
                    VOLUME_VALUE.style["min-width"] = "36px";
                    VOLUME_VALUE.style["text-align"] = "right";

                    VOLUME_SLIDER.addEventListener("input", function () {
                        const v = parseInt(this.value, 10) / 100;
                        VOLUME_VALUE.textContent = this.value + "%";
                        Gwin.T_masterVolume = v;
                        try { Gwin.localStorage.setItem("T_masterVolume", v); } catch (e) {}
                        if (Gwin.Howler && typeof Gwin.Howler.volume === "function") {
                            Gwin.Howler.volume(v); // forced to Gwin.T_masterVolume by the lock
                        }
                    });

                    VOLUME_ROW.appendChild(VOLUME_SLIDER);
                    VOLUME_ROW.appendChild(VOLUME_VALUE);
                    MAINHUD_CONTENT.appendChild(VOLUME_ROW);
                    
                    //{

                    let WARNPMUSE_LABEL = Gdoc.createElement("div");
                    WARNPMUSE_LABEL.textContent = "Warn PMUSER Use";
                    WARNPMUSE_LABEL.style["margin-top"] = "12px";
                    WARNPMUSE_LABEL.style["font-weight"] = "bold";
                
                    // Make a checkbox which when clicked will toggle window.warnpmuse
                    let MAINHUD_WARNPMUSE_CHECKBOX = Gdoc.createElement("input");
                    MAINHUD_WARNPMUSE_CHECKBOX.type = "checkbox";
                    MAINHUD_WARNPMUSE_CHECKBOX.checked = window.warnpmuse;
                    MAINHUD_WARNPMUSE_CHECKBOX.style["margin-left"] = "10px";

                    MAINHUD_WARNPMUSE_CHECKBOX.addEventListener("click", function() {
                        if (window.warnpmuse) {
                            window.warnpmuse = false;
                        } else {
                            window.warnpmuse = true;
                        }
                    });
                    WARNPMUSE_LABEL.appendChild(MAINHUD_WARNPMUSE_CHECKBOX);
                    MAINHUD_CONTENT.appendChild(WARNPMUSE_LABEL);
                    //}

                    //{

                    let KICKPMUSE_LABEL = Gdoc.createElement("div");
                    KICKPMUSE_LABEL.textContent = "Kick PMUSER Use";
                    KICKPMUSE_LABEL.style["margin-top"] = "12px";
                    KICKPMUSE_LABEL.style["font-weight"] = "bold";
                
                    // Make a checkbox which when clicked will toggle window.kickpmuse
                    let MAINHUD_KICKPMUSE_CHECKBOX = Gdoc.createElement("input");
                    MAINHUD_KICKPMUSE_CHECKBOX.type = "checkbox";
                    MAINHUD_KICKPMUSE_CHECKBOX.checked = window.kickpmuse;
                    MAINHUD_KICKPMUSE_CHECKBOX.style["margin-left"] = "10px";
                    
                    MAINHUD_KICKPMUSE_CHECKBOX.addEventListener("click", function() {
                        if (window.kickpmuse) {
                            window.kickpmuse = false;
                        } else {
                            window.kickpmuse = true;
                        }
                    });
                    KICKPMUSE_LABEL.appendChild(MAINHUD_KICKPMUSE_CHECKBOX);
                    MAINHUD_CONTENT.appendChild(KICKPMUSE_LABEL);
                    //}

                    //{

                    let HIDEFROMPMUSER_LABEL = Gdoc.createElement("div");
                    HIDEFROMPMUSER_LABEL.textContent = "Hide from PMUSER Use";
                    HIDEFROMPMUSER_LABEL.style["margin-top"] = "12px";
                    HIDEFROMPMUSER_LABEL.style["font-weight"] = "bold";
                
                    // Make a checkbox which when clicked will toggle window.kickpmuse
                    let MAINHUD_HIDEFROMPMUSER_CHECKBOX = Gdoc.createElement("input");
                    MAINHUD_HIDEFROMPMUSER_CHECKBOX.type = "checkbox";
                    MAINHUD_HIDEFROMPMUSER_CHECKBOX.checked = window.hidefrompmuser;
                    MAINHUD_HIDEFROMPMUSER_CHECKBOX.style["margin-left"] = "10px";
                    
                    MAINHUD_HIDEFROMPMUSER_CHECKBOX.addEventListener("click", function() {
                        if (window.hidefrompmuser) {
                            window.hidefrompmuser = false;
                        } else {
                            window.hidefrompmuser = true;
                        }
                    });
                    HIDEFROMPMUSER_LABEL.appendChild(MAINHUD_HIDEFROMPMUSER_CHECKBOX);
                    MAINHUD_CONTENT.appendChild(HIDEFROMPMUSER_LABEL);
                    //}

                    //{

                    let COMMANDS_LABEL = Gdoc.createElement("div");
                    COMMANDS_LABEL.textContent = "Notify of Bonk Commands";
                    COMMANDS_LABEL.style["margin-top"] = "12px";
                    COMMANDS_LABEL.style["font-weight"] = "bold";

                    // Make a checkbox which when clicked will toggle window.notifyofcommands
                    let MAINHUD_COMMANDS_CHECKBOX = Gdoc.createElement("input");
                    MAINHUD_COMMANDS_CHECKBOX.type = "checkbox";
                    MAINHUD_COMMANDS_CHECKBOX.checked = window.notifyofcommands;
                    MAINHUD_COMMANDS_CHECKBOX.style["margin-left"] = "10px";

                    MAINHUD_COMMANDS_CHECKBOX.addEventListener("click", function() {
                        if (window.notifyofcommands) {
                            window.notifyofcommands = false;
                        } else {
                            window.notifyofcommands = true;
                        }
                    });
                    COMMANDS_LABEL.appendChild(MAINHUD_COMMANDS_CHECKBOX);
                    MAINHUD_CONTENT.appendChild(COMMANDS_LABEL);
                    //}

                T_MAINHUD.appendChild(MAINHUD_CONTENT);

            }
        });

    });

    if(document.getElementById("bonkioheader")){
        bonkioheader.style["visibility"] = "hidden";
        //console.log("hellooo?")
    };

});

console.log("Tampertamper loaded");