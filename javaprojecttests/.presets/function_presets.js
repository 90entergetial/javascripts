// Before the main .js in the HTML:
// <script src="function_presets.js"></script>

function playNote(frequency, duration) {
    // create Oscillator node
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.02); // Fade in to 0.1 volume over 10ms
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency; // value in hertz

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    setTimeout(() => {
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration / 1000);
    }, 20);
    
    setTimeout(
        function() {
        oscillator.stop();
        }, duration*1.5);
}
function cst(num, min, max) {
    if(num < min) return min;
    if(num > max) return max;
    return num;
}
function addcommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function pointonbox(x, y, boxx, boxy, boxw, boxh) {
    return x > boxx && x < boxx+boxw && y > boxy && y < boxy+boxh;
}
function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
}
function timeelapsed(difference) {
    var days = Math.floor((difference) / (60 * 1000 * 60 * 24));
    var hours = Math.floor((difference % (60 * 1000 * 60 * 24)) / (60 * 1000 * 60));
    var minutes = Math.floor((difference % (60 * 1000 * 60)) / (60 * 1000));
    var seconds = Math.floor((difference % (60 * 1000)) / 1000);
    var milliseconds = difference % 1000;

    if(days > 0){
    return days + "d " + hours + "h " + minutes + "m " + seconds + "s " + milliseconds + "ms";
    } else if(hours > 0){
        return hours + "h " + minutes + "m " + seconds + "s " + milliseconds + "ms";
    } else if(minutes > 0){
        return minutes + "m " + seconds + "s " + milliseconds + "ms";
    } else if(seconds > 0){
        return seconds + "s " + milliseconds + "ms";
    } else {
        return milliseconds + "ms";
    }

}