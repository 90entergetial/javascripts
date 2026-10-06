//import * as math from '../node_modules/mathjs';
function highPrecisionProb(B, b, x) {
    

    // 1. Simplify the fraction: nPr(B,b)/nPr(B,B) = 1 / (B-b)!
    // Calculate log_p to avoid overflow/underflow
    const log_p = -math.lgamma(B - (b - 1) + 1); // lgamma(n+1) is ln(n!)
    const p = math.exp(log_p);

    // 2. Use the identity: 1 - (1-p)^x == -expm1(x * log1p(-p))
    const result = -math.expm1(x * math.log1p(-p));

    return result;
}

// Example usage
const arraySize = 21;
const solvedN = 10;
const rolls = 10000000;

console.log(highPrecisionProb(arraySize, solvedN, rolls));


window.onload = function () {
    console.log(highPrecisionProb(arraySize, solvedN, rolls));
    console.log("2a");
}