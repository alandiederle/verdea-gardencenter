import { useCallback, useRef } from "react";

export function useSobreSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  // Generador de Ruido de material (Foil/Plástico)
  const playCrinkle = useCallback((dur: number, vol: number, filterFreq = 6000) => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const bufferSize = ctx.sampleRate * dur;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
      filter.Q.value = 1.2; // Un poco más resonante para el foil

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch { /* noop */ }
  }, [enabled, getCtx]);

  // Generador de Tonos Celitiales por Rareza
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

  /* ── FASE 1: Primer contacto (crujido leve) ── */
  const playWindUp = useCallback(() => {
    playCrinkle(0.12, 0.08, 8000); 
  }, [playCrinkle]);

  /* ── FASE 2: INTERACTIVA - UN MICRO- "TRACCC" ── */
  // Esta función se dispara CADA VEZ que el sobre se mueve en el gesto de corte
  const playMicroCut = useCallback((pitchFreq: number) => {
    // Genera un pulso de ruido de foil de alta frecuencia
    playCrinkle(0.08, 0.15, pitchFreq);
  }, [playCrinkle]);

  /* ── FASE 3: EXPLOSIÓN ÉPICA y revelación celestial ── */
  const playReveal = useCallback(
    (tier: number) => {
      if (!enabled) return;
      
      // IMPACTO PESADO (BOOM)
      playCrinkle(1.8, 0.7, 600); 

      // Sonido celestial según la rareza
      setTimeout(() => {
        if (tier >= 5) { // Legendaria
          [523, 659, 784, 1046].forEach((f, i) => {
            tone(f, 3.5, "sine", 0.18, i * 0.12);
          });
        } else if (tier >= 3) { // Rara
          [440, 554, 659].forEach((f, i) => {
            tone(f, 2.0, "sine", 0.12, i * 0.18);
          });
        } else { // Común
          tone(880, 1.2, "sine", 0.08);
        }
      }, 100);
    },
    [enabled, playCrinkle, tone]
  );

  return { playWindUp, playMicroCut, playReveal };
}
