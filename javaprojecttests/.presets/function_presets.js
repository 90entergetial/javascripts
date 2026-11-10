// Before the main .js in the HTML:
// <script src="function_presets.js"></script>

// Turns a string like "440+sin(x/100)*250" into a function of x (time in ms).
// Math functions/constants can be used without "Math." (sin, cos, abs, PI, ...), and ^ means power.
// Returns null if the string isn't a valid formula.
function parseFrequencyFunction(text) {
    var badName = false;
    var code = text.replace(/\^/g, '**').replace(/[A-Za-z_$][A-Za-z0-9_$]*/g, function(name) {
        if (name === 'x') return name;
        if (name in Math) return 'Math.' + name;
        badName = true; // only x and Math names are allowed
        return name;
    });
    if (badName) return null;
    try {
        var f = new Function('x', '"use strict"; return (' + code + ');');
        if (!isFinite(f(0))) return null;
        return f;
    } catch (e) {
        return null;
    }
}

// frequency can be:
//   a number (e.g. 440) for a normal tone,
//   [min, max] (e.g. [200, 4000]) for noise made of every frequency in that range (drums, hiss, etc.),
//   a string formula of x (e.g. "440+sin(x/100)*250"), where x is milliseconds since the note started.
//     If the formula is invalid, no sound plays.
function playNote(frequency, volume, fade_in_time, sustain_time, fade_out_time) {
    var totalTime = fade_in_time + sustain_time + fade_out_time; // ms

    // Check the formula first so a bad one plays nothing
    var freqCurve = null;
    if (typeof frequency === 'string') {
        var f = parseFrequencyFunction(frequency);
        if (!f) return;
        // Sample the formula once per millisecond (at least 2 points)
        var points = Math.max(2, Math.ceil(totalTime) + 1);
        freqCurve = new Float32Array(points);
        for (var i = 0; i < points; i++) {
            var value;
            try { value = Number(f(i * totalTime / (points - 1))); } catch (e) { return; }
            if (!isFinite(value)) return;
            freqCurve[i] = value;
        }
    }

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
        if (freqCurve) {
            // Frequency follows the formula from x = 0 (start of fade in) to the end of the fade out
            source.frequency.setValueAtTime(freqCurve[0], now);
            if (totalTime > 0) source.frequency.setValueCurveAtTime(freqCurve, now, totalTime / 1000);
        } else {
            source.frequency.value = frequency; // value in hertz
        }
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
function bigaddcommas(num) {
    var neg = num < 0n;
    var abs = neg ? -num : num;
    if (abs <= 10n**12n) return addcommas(num);

    var digits = abs.toString();
    var exp = digits.length - 1;
    // keep 9 significant digits, rounding with the 10th
    var mant = BigInt(digits.slice(0, 9));
    if (digits[9] >= "5") mant += 1n;
    if (mant == 10n**9n) { mant = 10n**8n; exp += 1; } // rounded up to 10.00000000
    var m = mant.toString();
    return (neg ? "-" : "") + m[0] + "." + m.slice(1) + "e" + exp;
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
function tovalue(from, to, duration, onUpdate, ramptype, onDone) {
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1); // 0 → 1
    let eased;
    switch (ramptype) {
      case "ease in out": eased = Math.sin(t * Math.PI / 2) ** 2; break;
      case "ease in":     eased = Math.sin(t * Math.PI / 2 - Math.PI / 2) + 1; break;
      case "ease out":    eased = Math.sin(t * Math.PI / 2); break;
      default:            eased = t;
    }
    onUpdate(from + (to - from) * eased);
    if (t < 1) requestAnimationFrame(step);
    else if (onDone) onDone();
  }
  requestAnimationFrame(step);
  //this is quite an interesting function:
  //from: starting number
  //to: ending number
  //duration: millseconds of time
  //onUpdate: runs every frame
  //ramptype (optional): "linear" (default), "ease in", "ease out", or "ease in out"
  //onDone (optional): runs a function on done

  //For ramping a variable, do this:
  //ramptovalue(0, 1, 500, alpha => { a.style.color = `rgba(11, 12, 35, ${alpha})`;});
  //ramptovalue(0, 10, 2000, v => speed = v, "ease in out");
  //ramptovalue(0, 10, 2000, v => speed = v, undefined, () => console.log("done")); // linear + onDone
}
function inbetween(num, min, max){
    if(num <= max && num >= min) return true;
    return false;
}