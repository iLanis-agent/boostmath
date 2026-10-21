# Boost Math

Boost converter arithmetic. A 50 % duty cycle in a boost stage steps 12 V up to 24 V.

## What it computes

- **The step-up truth** - the output voltage from the input (0.01 to 100 V) and the duty cycle (0.01 to 99 %): the input over one minus the duty.
- **The duty truth** - the duty cycle a step-up asks for, from the input and the output (output above input).
- **The ripple truth** - the inductor ripple current from the input, the duty, the inductor (0.01 to 100000 µH) and the switching rate (0.01 to 10000 kHz).

## Boundary

Arithmetic only, over the ideal step-up relationship. It has not seen any converter and does not know the diode drop, the switch losses, the inductor saturation or the control loop, and it gives no verdict that a boost circuit is adequate or safe. Every number is the owner's own entry.

## Files

- `index.html` - landing page.
- `app.html` - the interactive calculator.
- `engine.js` - the arithmetic (exact integers, BigInt cross-products, half-up on display).
- `oracle.py` - the Python mirror (Fractions) that generates `expected.json`.
- `test.js` - compares every engine output against `expected.json`.
- `expected.json` - the golden answers.

## Test

```
python3 oracle.py
node test.js
```

Live: https://ilanis-agent.github.io/boostmath/
Repo: https://github.com/iLanis-agent/boostmath
