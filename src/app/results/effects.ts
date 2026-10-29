/**
 * Stage effects for the results reveal: a synthesised drumroll with a cymbal
 * crash (Web Audio, so no sound files to ship) and canvas confetti.
 */

let audio: AudioContext | null = null;
let master: AudioNode | null = null;

/** Browsers only allow audio after a user gesture, so call this from a click. */
function context(): AudioContext {
  if (!audio) {
    audio = new AudioContext();
    // Crash, boom and fanfare land together; the compressor keeps the peak
    // from clipping on the venue speakers.
    const compressor = audio.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.ratio.value = 6;
    compressor.connect(audio.destination);
    master = compressor;
  }
  if (audio.state === "suspended") void audio.resume();
  return audio;
}

/** Where every sound connects to; set up by `context()`. */
function out(ctx: AudioContext): AudioNode {
  return master ?? ctx.destination;
}

function noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const buffer = ctx.createBuffer(
    1,
    Math.ceil(ctx.sampleRate * seconds),
    ctx.sampleRate,
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** One snare hit: a short burst of filtered noise. */
function snare(
  ctx: AudioContext,
  noise: AudioBuffer,
  at: number,
  volume: number,
): void {
  const source = ctx.createBufferSource();
  source.buffer = noise;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1800;
  filter.Q.value = 0.7;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, at);
  gain.gain.exponentialRampToValueAtTime(0.001, at + 0.09);
  source.connect(filter).connect(gain).connect(out(ctx));
  source.start(at, Math.random() * 0.5, 0.1);
}

/** Cymbal crash plus a low boom, for the moment of the reveal. */
function crash(
  ctx: AudioContext,
  noise: AudioBuffer,
  at: number,
  big: boolean,
): void {
  const length = big ? 2.5 : 1.4;

  const source = ctx.createBufferSource();
  source.buffer = noise;
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 5000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(big ? 0.7 : 0.45, at);
  gain.gain.exponentialRampToValueAtTime(0.001, at + length);
  source.connect(filter).connect(gain).connect(out(ctx));
  source.start(at, 0, length);

  const boom = ctx.createOscillator();
  boom.frequency.setValueAtTime(110, at);
  boom.frequency.exponentialRampToValueAtTime(40, at + 0.4);
  const boomGain = ctx.createGain();
  boomGain.gain.setValueAtTime(big ? 0.9 : 0.6, at);
  boomGain.gain.exponentialRampToValueAtTime(0.001, at + 0.6);
  boom.connect(boomGain).connect(out(ctx));
  boom.start(at);
  boom.stop(at + 0.6);
}

/** One brassy note: detuned sawtooths through a lowpass that opens on attack. */
function brass(
  ctx: AudioContext,
  frequency: number,
  at: number,
  length: number,
  volume: number,
): void {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(600, at);
  filter.frequency.linearRampToValueAtTime(3200, at + 0.06);
  filter.frequency.exponentialRampToValueAtTime(1400, at + length);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.03);
  gain.gain.setValueAtTime(volume, at + length * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  filter.connect(gain).connect(out(ctx));

  // A slow vibrato that only kicks in on long notes, like a held trumpet.
  const vibrato = ctx.createOscillator();
  vibrato.frequency.value = 5.5;
  const depth = ctx.createGain();
  depth.gain.setValueAtTime(0, at);
  depth.gain.linearRampToValueAtTime(
    length > 0.5 ? frequency * 0.008 : 0,
    at + 0.4,
  );
  vibrato.connect(depth);
  vibrato.start(at);
  vibrato.stop(at + length);

  for (const detune of [-8, 8]) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = frequency;
    osc.detune.value = detune;
    depth.connect(osc.frequency);
    osc.connect(filter);
    osc.start(at);
    osc.stop(at + length);
  }
}

/** "Tö-dööö": a short pickup into a long major chord. First place gets more. */
function fanfare(ctx: AudioContext, at: number, big: boolean): void {
  const C5 = 523.25,
    E5 = 659.25,
    G5 = 783.99,
    C6 = 1046.5,
    G4 = 392;
  const pickups = big ? [G4, G4, G4] : [G5];
  const step = big ? 0.13 : 0.16;
  pickups.forEach((note, i) =>
    brass(ctx, note, at + i * step, step * 0.9, 0.12),
  );

  const hold = at + pickups.length * step;
  const length = big ? 2.4 : 1.4;
  for (const note of big ? [C5, E5, G5, C6] : [C5, E5, G5]) {
    brass(ctx, note, hold, length, big ? 0.09 : 0.1);
  }
}

/**
 * Plays a crescendo drumroll for `seconds`, then the crash and a fanfare. Resolves when the
 * crash hits, which is when the result should appear.
 */
export function drumroll(seconds: number, big: boolean): Promise<void> {
  try {
    const ctx = context();
    const noise = noiseBuffer(ctx, 3);
    const start = ctx.currentTime + 0.05;
    for (let t = 0; t < seconds; t += 0.045) {
      const progress = t / seconds;
      snare(ctx, noise, start + t, 0.08 + 0.5 * progress * progress);
    }
    crash(ctx, noise, start + seconds, big);
    fanfare(ctx, start + seconds, big);
  } catch {
    // No audio (old browser, blocked): the reveal still works, just silently.
  }
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000 + 50));
}

const COLORS = [
  "#e4ff3a",
  "#ffffff",
  "#7cf0ff",
  "#ff5fa2",
  "#ffb627",
  "#9b7bff",
];

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  spin: number;
  angle: number;
  /** A paper strip in this colour, or an emoji when `emoji` is set. */
  color: string;
  /** Emojis float up like Zoom reactions instead of falling. */
  emoji?: string;
  /** Frames since spawn; drives the emoji's wobble and pop-in. */
  age?: number;
  /** Horizontal centre the emoji wobbles around. */
  x0?: number;
};

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * A full-screen canvas over the page that animates pieces until `until`
 * returns false and every piece has left the screen. `spawn` is called once
 * per frame so effects can keep adding pieces while they run.
 */
function animate(
  spawn: (pieces: Piece[], width: number, elapsed: number) => void,
  until: (elapsed: number) => boolean,
): void {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas.remove();

  const ratio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.scale(ratio, ratio);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let pieces: Piece[] = [];
  const started = performance.now();

  function frame(now: number) {
    const elapsed = now - started;
    if (until(elapsed)) spawn(pieces, width, elapsed);

    ctx!.clearRect(0, 0, width, height);
    for (const p of pieces) {
      if (p.emoji) {
        // Zoom-style reaction: rise at a steady pace, sway side to side, pop
        // in at the bottom and fade out towards the top.
        const age = (p.age = (p.age ?? 0) + 1);
        p.y += p.vy;
        p.x = (p.x0 ?? p.x) + Math.sin(age * 0.06 + p.spin * 50) * 30;
        p.angle = Math.sin(age * 0.06 + p.spin * 50) * 0.25;
      } else {
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.35;
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
      }
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.angle);
      if (p.emoji) {
        const pop = Math.min(1, (p.age ?? 0) / 12);
        ctx!.globalAlpha = Math.min(pop, Math.max(0, p.y / (height * 0.4)));
        ctx!.font = `${p.size * (0.5 + 0.5 * pop)}px sans-serif`;
        ctx!.fillText(p.emoji, 0, 0);
      } else {
        ctx!.fillStyle = p.color;
        // Squashing the width by cos(angle) fakes the flutter of a paper strip.
        ctx!.fillRect(
          -p.size / 2,
          -p.size / 4,
          p.size * Math.cos(p.angle * 2),
          p.size / 2,
        );
      }
      ctx!.restore();
    }
    pieces = pieces.filter((p) => p.y < height + 100 && p.y > -100);

    if (until(elapsed) || pieces.length > 0) requestAnimationFrame(frame);
    else canvas.remove();
  }
  requestAnimationFrame(frame);
}

function color(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

/**
 * Drum emojis floating up from the bottom during the drumroll, like Zoom
 * reactions, getting denser as the roll builds.
 */
export function drumRain(seconds: number): void {
  if (reducedMotion()) return;
  const duration = seconds * 1000;
  animate(
    (pieces, width, elapsed) => {
      // Chance per frame (~60/s) of a new drum.
      const rate = 0.08 + 0.3 * (elapsed / duration);
      if (Math.random() > rate) return;
      const x = 40 + Math.random() * (width - 80);
      pieces.push({
        x,
        x0: x,
        y: window.innerHeight + 40,
        vx: 0,
        vy: -(3 + Math.random() * 3),
        size: 44 + Math.random() * 36,
        // Doubles as a random phase for the sway.
        spin: Math.random(),
        angle: 0,
        color: "",
        emoji: "🥁",
      });
    },
    (elapsed) => elapsed < duration,
  );
}

/** Confetti cannons from both bottom corners plus a shower from the top. */
export function confetti(big: boolean): void {
  if (reducedMotion()) return;
  const cannon = big ? 500 : 250;
  const showerMs = big ? 4000 : 1800;
  let fired = false;

  animate(
    (pieces, width, elapsed) => {
      if (!fired) {
        fired = true;
        const height = window.innerHeight;
        for (const side of [0, 1]) {
          for (let i = 0; i < cannon; i++) {
            const angle =
              (side ? -1 : 1) * (0.2 + Math.random() * 0.6) - Math.PI / 2;
            const speed = (big ? 16 : 12) + Math.random() * (big ? 16 : 12);
            pieces.push({
              x: side ? width : 0,
              y: height,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 7 + Math.random() * 9,
              spin: (Math.random() - 0.5) * 0.4,
              angle: Math.random() * Math.PI,
              color: color(),
            });
          }
        }
      }
      // The shower thins out towards the end.
      const count = Math.round((big ? 14 : 8) * (1 - elapsed / showerMs));
      for (let i = 0; i < count; i++) {
        pieces.push({
          x: Math.random() * width,
          y: -20,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 3,
          size: 7 + Math.random() * 9,
          spin: (Math.random() - 0.5) * 0.4,
          angle: Math.random() * Math.PI,
          color: color(),
        });
      }
    },
    (elapsed) => elapsed < showerMs,
  );
}
