import { useCallback, useRef } from "react";

export function useSobreSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (freq: number, dur: number, type: OscillatorType = "sine", vol = 0.08, detune = 0) => {
      if (!enabled) return;
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        osc.detune.value = detune;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + dur);
      } catch { /* noop */ }
    },
    [enabled, getCtx],
  );

  /* Phase 1 – wind / leaves rustle */
  const playWindUp = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const len = ctx.sampleRate * 0.6;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.4)) * 0.03;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 1800;
      f.Q.value = 0.4;
      src.connect(f);
      f.connect(ctx.destination);
      src.start();
    } catch { /* noop */ }
  }, [enabled, getCtx]);

  /* Phase 2 – rising energy hum */
  const playChargeUp = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 1.8);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.3);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2);
    } catch { /* noop */ }
  }, [enabled, getCtx]);

  /* Phase 3 – reveal per tier */
  const playReveal = useCallback(
    (tier: number) => {
      if (!enabled) return;
      if (tier <= 1) {
        tone(800, 0.6, "sine", 0.05);
        setTimeout(() => tone(1000, 0.4, "sine", 0.03), 150);
      } else if (tier === 2) {
        tone(523, 0.8, "sine", 0.06);
        setTimeout(() => tone(659, 0.6, "sine", 0.05), 200);
        setTimeout(() => tone(784, 0.5, "sine", 0.04), 400);
      } else if (tier === 3) {
        tone(261, 1.0, "triangle", 0.07);
        setTimeout(() => tone(392, 0.8, "sine", 0.05), 300);
        setTimeout(() => tone(523, 0.6, "sine", 0.04), 600);
      } else if (tier === 4) {
        // Mítica – resonancia brillante
        tone(523, 1.2, "sine", 0.06);
        setTimeout(() => tone(659, 1.0, "sine", 0.06), 200);
        setTimeout(() => tone(784, 0.8, "sine", 0.07), 400);
        setTimeout(() => tone(1046, 0.6, "sine", 0.05), 600);
      } else {
        // Legendaria – impacto luminoso + eco
        tone(261, 1.5, "sine", 0.06);
        setTimeout(() => tone(329, 1.2, "sine", 0.06), 200);
        setTimeout(() => tone(392, 1.0, "sine", 0.07), 400);
        setTimeout(() => tone(523, 0.8, "sine", 0.08), 600);
        setTimeout(() => {
          tone(1046, 1.5, "sine", 0.04);
          tone(1568, 1.2, "sine", 0.02, 5);
        }, 800);
      }
    },
    [enabled, tone],
  );

  return { playWindUp, playChargeUp, playReveal };
}
