// Boost Math engine: output voltage from duty cycle for an ideal step-up stage, the duty cycle a step-up asks for, and inductor ripple current. Exact integers (hundredths of a V, hundredths of a %, hundredths of a kHz, hundredths of a µH, hundredths of a mA), BigInt for the large cross-products, half-up on display only.
function _p(t, err, intDigits, places, lo, hi) {
  t = typeof t === "string" ? t.trim() : "";
  var m = new RegExp("^([0-9]{1," + intDigits + "})(?:\\.([0-9]{1," + places + "}))?$").exec(t);
  if (!m) throw new Error(err);
  var v = parseInt(m[1], 10) * Math.pow(10, places) + (m[2] ? parseInt(m[2].padEnd(places, "0"), 10) : 0);
  if (v < lo || v > hi) throw new Error(err);
  return v;
}
var _V = "each voltage must be from 0.01 to 100 V with at most two decimal places";
var _D = "the duty cycle must be from 0.01 to 99 % with at most two decimal places";
var _F = "the frequency must be from 0.01 to 10000 kHz with at most two decimal places";
var _L = "the inductor must be from 0.01 to 100000 µH with at most two decimal places";
var _UP = "the output must be above the input for a step-up stage";
function _hu(n, d) { return Math.floor((2 * n + d) / (2 * d)); }
function _huB(n, d) { return Number((2n * n + d) / (2n * d)); }
function _dec(v, places) {
  if (v < 0) return "-" + _dec(-v, places);
  var base = Math.pow(10, places);
  var s = String(Math.floor(v / base)), f = String(v % base).padStart(places, "0").replace(/0+$/, "");
  return f ? s + "." + f : s;
}
function _volt(t) { return _p(t, _V, 3, 2, 1, 10000); }
function _duty(t) { return _p(t, _D, 2, 2, 1, 9900); }
function _freq(t) { return _p(t, _F, 5, 2, 1, 1000000); }
function _ind(t) { return _p(t, _L, 6, 2, 1, 10000000); }

function stepupTruth(vin, duty) {
  var vi = _volt(vin), d = _duty(duty);
  var vo = _hu(vi * 10000, 10000 - d);
  return "A " + _dec(d, 2) + " % duty cycle in a boost stage steps " + _dec(vi, 2) + " V up to " + _dec(vo, 2) + " V.";
}
function dutyTruth(vin, vout) {
  var vi = _volt(vin), vo = _volt(vout);
  if (vo <= vi) throw new Error(_UP);
  var d = _hu((vo - vi) * 10000, vo);
  return "To step " + _dec(vi, 2) + " V up to " + _dec(vo, 2) + " V, the switch needs a " + _dec(d, 2) + " % duty cycle.";
}
function rippleTruth(vin, duty, l, fs) {
  var vi = _volt(vin), d = _duty(duty), ll = _ind(l), f = _freq(fs);
  var di = _huB(BigInt(vi) * BigInt(d) * 1000000n, BigInt(ll) * BigInt(f));
  return "With a " + _dec(ll, 2) + " µH inductor at " + _dec(f, 2) + " kHz, the current swings " + _dec(di, 2) + " mA peak to peak as the switch cycles.";
}
