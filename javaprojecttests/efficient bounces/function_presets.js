// Before the main .js in the HTML:
// <script src="function_presets.js"></script>

// frequency: a number (e.g. 440) for a normal tone,
// or [min, max] (e.g. [200, 4000]) for noise made of every frequency in that range (drums, hiss, etc.)
function playNote(frequency, volume, fade_in_time, sustain_time, fade_out_time) {
    var gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);

    // Schedule everything on the audio clock (in seconds) instead of setTimeout
    var now = audioCtx.currentTime;
    var fadeInEnd = now + fade_in_time / 1000;
    var sustainEnd = fadeInEnd + sustain_time / 1000;
    var fadeOutEnd = sustainEnd + fade_out_time / 1000;

    var source;
    if (Array.isArray(frequency)) {
        // Noise: fill a buffer with random samples (white noise = all frequencies at once),
        // then filter out everything below min and above max.
        var minFreq = Math.min(frequency[0], frequency[1]);
        var maxFreq = Math.max(frequency[0], frequency[1]);
        var length = Math.max(1, Math.ceil((fadeOutEnd - now) * audioCtx.sampleRate));
        var buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        source = audioCtx.createBufferSource();
        source.buffer = buffer;

        var highpass = audioCtx.createBiquadFilter(); // removes frequencies below min
        highpass.type = 'highpass';
        highpass.frequency.value = minFreq;

        var lowpass = audioCtx.createBiquadFilter(); // removes frequencies above max
        lowpass.type = 'lowpass';
        lowpass.frequency.value = Math.min(maxFreq, audioCtx.sampleRate / 2);

        source.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(gainNode);
    } else {
        source = audioCtx.createOscillator();
        source.type = 'sine';
        source.frequency.value = frequency; // value in hertz
        source.connect(gainNode);
    }

    gainNode.gain.setValueAtTime(0, now);                       // start silent
    gainNode.gain.linearRampToValueAtTime(volume, fadeInEnd);   // fade in
    gainNode.gain.setValueAtTime(volume, sustainEnd);           // hold until fade out starts
    gainNode.gain.linearRampToValueAtTime(0, fadeOutEnd);       // fade out

    source.start(now);
    source.stop(fadeOutEnd);
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
function sign(num) {
    if(num < 0) return -1;
    if(num == 0) return 0;
    return 1;
}