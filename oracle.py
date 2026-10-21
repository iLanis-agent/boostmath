import json, random
from fractions import Fraction

def hu(num, den):
    return Fraction((2*num + den) - ((2*num + den) % (2*den)), 2*den)

def dec(v, places=2):
    if v < 0: return "-" + dec(-v, places)
    base = 10**places
    n = v.numerator // v.denominator
    s = str(n // base); f = str(n % base).zfill(places).rstrip("0")
    return s + "." + f if f else s

def s100(n):
    w, f = divmod(n, 100)
    return f"{w}.{f:02d}".rstrip("0").rstrip(".")

def stepup(vi, d):
    vo = hu(vi*10000, 10000-d)
    return (f"A {dec(Fraction(d))} % duty cycle in a boost stage steps {dec(Fraction(vi))} V up to "
            f"{dec(vo)} V.")
def duty(vi, vo):
    d = hu((vo-vi)*10000, vo)
    return (f"To step {dec(Fraction(vi))} V up to {dec(Fraction(vo))} V, the switch needs a "
            f"{dec(d)} % duty cycle.")
def ripple(vi, d, ll, f):
    di = hu(vi*d*10**6, ll*f)
    return (f"With a {dec(Fraction(ll))} µH inductor at {dec(Fraction(f))} kHz, the current swings {dec(di)} mA "
            f"peak to peak as the switch cycles.")

random.seed(737)
cases = [
  dict(fn="stepup", args=["12","50"], expect=stepup(1200,5000)),
  dict(fn="duty", args=["12","24"], expect=duty(1200,2400)),
  dict(fn="ripple", args=["12","50","100","100"], expect=ripple(1200,5000,10000,10000)),
]
for _ in range(30):
    vi = random.randint(1,10000); d = random.randint(1,9900)
    cases.append(dict(fn="stepup", args=[s100(vi),s100(d)], expect=stepup(vi,d)))
for _ in range(30):
    vi = random.randint(1,9999); vo = random.randint(vi+1,10000)
    cases.append(dict(fn="duty", args=[s100(vi),s100(vo)], expect=duty(vi,vo)))
for _ in range(30):
    vi = random.randint(1,10000); d = random.randint(1,9900)
    ll = random.randint(1,10000000); f = random.randint(1,1000000)
    cases.append(dict(fn="ripple", args=[s100(vi),s100(d),s100(ll),s100(f)], expect=ripple(vi,d,ll,f)))
errcases = [
  ["stepup", ["0","50"]], ["stepup", ["12","0"]], ["stepup", ["12","99.005"]],
  ["stepup", ["abc","50"]], ["stepup", ["12","100"]],
  ["duty", ["12","12"]], ["duty", ["24","12"]], ["duty", ["12","100.01"]],
  ["ripple", ["12","50","0","100"]], ["ripple", ["12","50","100","0"]],
  ["ripple", ["12","50","100000.01","100"]], ["ripple", ["12","50","100","10000.01"]],
]
json.dump(dict(cases=cases, errors=errcases), open("expected.json","w"), indent=1)
print(len(cases), "cases,", len(errcases), "errcases")
