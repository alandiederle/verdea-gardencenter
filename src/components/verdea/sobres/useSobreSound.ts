import { useCallback, useRef } from "react";

export function useSobreSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  // Generador de Osciladores (Tonos)
  const tone = useCallback(
    (freq: number, dur: number, type: OscillatorType = "sine", vol = 0.1, delay = 0) => {
      if (!enabled) return;
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + dur);
      } catch { /* noop */ }
    },
    [enabled, getCtx],
  );

  // Generador de Ruido (Foil, Rasgado, Explosión)
  const playNoise = useCallback((dur: number, vol: number, filterType: BiquadFilterType = "highpass", freq = 5000, delay = 0) => {
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
      filter.type = filterType;
      filter.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(ctx.currentTime + delay);
    } catch { /* noop */ }
  }, [enabled, getCtx]);

  /* ── FASE 1: Agarrar el Sobre (Ruido Foil Metálico) ── */
  const playWindUp = useCallback(() => {
    playNoise(0.3, 0.1, "highpass", 8000); // Rasguño de plástico rápido
  }, [playNoise]);

  /* ── FASE 2: Rasgando el Sobre (Crescendo de Tensión) ── */
  const playChargeUp = useCallback(() => {
    if (!enabled) return;
    playNoise(1.5, 0.2, "highpass", 3000); // Rasgado de papel constante
    const ctx = getCtx();
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 1.5); // Pitch subiendo al clímax
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.2);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {}
  }, [enabled, getCtx, playNoise]);

  /* ── FASE 3: EXPLOSIÓN SEGÚN RAREZA ── */
  const playReveal = useCallback((tier: number) => {
    if (!enabled) return;
    
    // El Impacto (Común a todos, pero varía en potencia)
    const impactVol = 0.4 + (tier * 0.1);
    playNoise(1.2, impactVol, "lowpass", 800); // BOOM sordo

    switch (tier) {
      case 0: // Silvestre (Natural) - Simple y orgánico
        tone(440, 0.8, "sine", 0.1);
        setTimeout(() => tone(660, 0.5, "sine", 0.08), 100);
        break;

      case 1: // Brote (Vital) - Crecimiento ascendente
        tone(220, 1.0, "triangle", 0.1);
        tone(440, 1.0, "sine", 0.1, 0.1);
        tone(880, 1.0, "sine", 0.1, 0.2);
        break;

      case 2: // Polen (Floral) - Shimmer y brillo
        playNoise(1.5, 0.15, "highpass", 10000); // Brillo de hadas
        tone(523.25, 1.2, "sine", 0.12, 0.1);
        tone(783.99, 1.2, "sine", 0.1, 0.2);
        tone(1046.50, 1.5, "sine", 0.08, 0.3);
        break;

      case 3: // Raíz (Ancestral) - Profundidad de tierra y campana
        tone(110, 2.0, "sine", 0.3); // Bajo profundo
        tone(330, 1.5, "triangle", 0.15, 0.1);
        tone(554, 1.5, "sine", 0.1, 0.2);
        break;

      case 4: // Exótica (Mítica) - Cestial y místico
        playNoise(2.0, 0.1, "highpass", 12000, 0.2);
        tone(523, 2.0, "sine", 0.15, 0);
        tone(659, 2.0, "sine", 0.15, 0.15);
        tone(783, 2.0, "sine", 0.15, 0.30);
        tone(1046, 2.5, "sine", 0.1, 0.45);
        break;

      case 5: // Primordial (Legendaria) - EL GRAN EVENTO
        playNoise(3.0, 0.8, "lowpass", 400); // Bass Drop masivo
        playNoise(2.5, 0.2, "highpass", 15000); // Sparkles divinos
        // Acorde Mayor Completo (Celestial)
        [261, 329, 392, 523, 659, 1046].forEach((f, i) => {
          tone(f, 4.0, "sine", 0.15, i * 0.1);
        });
        break;
    }
  }, [enabled, playNoise, tone]);

  return { playWindUp, playChargeUp, playReveal };
}
