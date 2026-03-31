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

  const playNoise = useCallback((dur: number, vol: number, isHighPitch: boolean = false) => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const bufferSize = ctx.sampleRate * dur;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; 
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = isHighPitch ? "highpass" : "lowpass";
      filter.frequency.value = isHighPitch ? 5000 : 1000;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch { /* noop */ }
  }, [enabled, getCtx]);

  const playWindUp = useCallback(() => {
    playNoise(0.4, 0.15, true); 
  }, [playNoise]);

  const playChargeUp = useCallback(() => {
    if (!enabled) return;
    playNoise(1.2, 0.3, true); 
    const ctx = getCtx();
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch { /* noop */ }
  }, [enabled, getCtx, playNoise]);

  const playReveal = useCallback(
    (tier: number) => {
      if (!enabled) return;
      
      playNoise(1.5, 0.8, false); 
      const ctx = getCtx();
      try {
         const osc = ctx.createOscillator();
         const gain = ctx.createGain();
         osc.type = "sine";
         osc.frequency.setValueAtTime(150, ctx.currentTime);
         osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 1); 
         gain.gain.setValueAtTime(1, ctx.currentTime);
         gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
         osc.connect(gain);
         gain.connect(ctx.destination);
         osc.start();
         osc.stop(ctx.currentTime + 1.5);
      } catch {}

      setTimeout(() => {
        if (tier >= 4) {
          tone(523, 1.5, "sine", 0.2); 
          setTimeout(() => tone(659, 1.5, "sine", 0.2), 150);
          setTimeout(() => tone(1046, 3.0, "sine", 0.3), 300); 
        } else if (tier >= 2) {
          tone(523, 0.8, "triangle", 0.15);
          setTimeout(() => tone(784, 1.2, "sine", 0.2), 200);
        } else {
          tone(800, 0.8, "sine", 0.1);
        }
      }, 100);
    },
    [enabled, getCtx, playNoise, tone]
  );

  return { playWindUp, playChargeUp, playReveal };
}
