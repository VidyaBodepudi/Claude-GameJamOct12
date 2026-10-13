"""Generates the WAV sound effects for Realm Racer. Run: python3 make_sounds.py"""
import math
import os
import random
import struct
import wave

RATE = 11025
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sounds')


def write(name, samples):
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, name + '.wav'), 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(RATE)
        f.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, s)) * 32000)) for s in samples))


def wave_at(kind, phase):
    p = phase % 1.0
    if kind == 'square':
        return 1.0 if p < 0.5 else -1.0
    if kind == 'saw':
        return 2 * p - 1
    if kind == 'tri':
        return 4 * abs(p - 0.5) - 1
    return math.sin(2 * math.pi * p)


def tone(kind, f0, f1, dur, vol=0.5, attack=0.005):
    n = int(dur * RATE)
    out, phase = [], 0.0
    for i in range(n):
        t = i / n
        freq = f0 * (f1 / f0) ** t
        phase += freq / RATE
        env = min(1.0, i / (attack * RATE + 1)) * (1 - t) ** 2
        out.append(wave_at(kind, phase) * env * vol)
    return out


def noise(dur, vol=0.5, smooth=0.0, decay=True):
    n = int(dur * RATE)
    out, prev = [], 0.0
    for i in range(n):
        prev = prev * smooth + random.uniform(-1, 1) * (1 - smooth)
        env = (1 - i / n) ** 2 if decay else 1.0
        out.append(prev * env * vol)
    return out


def mix(*tracks):
    n = max(len(t) for t in tracks)
    return [sum(t[i] for t in tracks if i < len(t)) for i in range(n)]


def concat(*parts):
    return [s for p in parts for s in p]


def engine():
    # 0.5 s with whole cycles of every partial so the loop is seamless.
    out = []
    for i in range(RATE // 2):
        t = i / RATE
        base = 0.6 * wave_at('saw', 80 * t) + 0.3 * math.sin(2 * math.pi * 160 * t) + 0.15 * wave_at('square', 40 * t)
        out.append(base * (0.75 + 0.25 * math.sin(2 * math.pi * 40 * t)) * 0.35)
    return out


def boost():
    n = RATE // 2
    raw = noise(0.5, 0.5, smooth=0.6, decay=False)
    fade = int(0.05 * RATE)
    # Crossfade the tail into the head so the loop has no click.
    for i in range(fade):
        a = i / fade
        raw[i] = raw[i] * a + raw[n - fade + i] * (1 - a)
    return [s * (0.8 + 0.2 * math.sin(2 * math.pi * 6 * i / RATE)) for i, s in enumerate(raw[: n - fade])]


random.seed(7)
write('engine', engine())
write('boost', boost())
write('tick', tone('square', 440, 440, 0.15, 0.35))
write('go', tone('square', 880, 880, 0.45, 0.35))
write('pickup', mix(tone('tri', 600, 1400, 0.18, 0.5), tone('sine', 1200, 2400, 0.18, 0.2)))
write('bump', mix(tone('square', 140, 60, 0.22, 0.45), noise(0.12, 0.4, smooth=0.5)))
write('spin', mix(tone('saw', 500, 80, 0.6, 0.35), noise(0.6, 0.15, smooth=0.8)))
write('lap', concat(tone('tri', 700, 700, 0.1, 0.5), tone('tri', 1000, 1000, 0.18, 0.5)))
write('lose', concat(tone('saw', 300, 200, 0.3, 0.35), tone('saw', 200, 90, 0.5, 0.35)))
write('win', concat(*[tone('tri', f, f, 0.16 if f != 1047 else 0.45, 0.5) for f in (523, 659, 784, 1047)]))
write('splash', noise(0.35, 0.5, smooth=0.85))
write('zap', mix(tone('saw', 1800, 200, 0.25, 0.3), noise(0.25, 0.3, smooth=0.2)))
print('Wrote sounds to', os.path.normpath(OUT))
