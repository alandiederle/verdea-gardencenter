import { useCallback, useRef } from "react";

export function useSobreSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  // Generador de Ruido para efectos de material (Foil/Plástico)
  const playCrinkle = useCallback((dur: number, vol: number, freq = 6000) => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const bufferSize = ctx.sampleRate * dur;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Ruido blanco base
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Filtro Pasa-Altos (Para que suene metálico/plástico)
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(freq, ctx.currentTime);
      filter.Q.value = 1;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch { /* noop */ }
  }, [enabled, getCtx]);

  /* ── FASE 1: Agarrar el Sobre (Pequeño crujido de plástico) ── */
  const playWindUp = useCallback(() => {
    playCrinkle(0.15, 0.1, 7000); 
    setTimeout(() => playCrinkle(0.1, 0.05, 8000), 50);
  }, [playCrinkle]);

  /* ── FASE 2: EL "TRACCC" (El rasgado tipo Pokémon) ── */
  const playChargeUp = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    
    // El "traccc" no es un solo sonido, son varios micro-rasgados
    for (let i = 0; i < 15; i++) {
      const delay = i * 0.08; // Espaciado entre dientes del sobre
      const pitch = 4000 + (i * 200); // El tono sube mientras se rasga
      
      setTimeout(() => {
        playCrinkle(0.12, 0.15, pitch);
      }, i * 80);
    }

    // Un zumbido de tensión de fondo que sube
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 1.2);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.5);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch {}
  }, [enabled, getCtx, playCrinkle]);

  /* ── FASE 3: REVELACIÓN (Explosión y música de rareza) ── */
  const playReveal = useCallback((tier: number) => {
    if (!enabled) return;
    const ctx = getCtx();

    // Impacto sordo (BOOM)
    playCrinkle(1.5, 0.5, 500); 

    // Función auxiliar para notas musicales
    const tone = (f: number, d: number, v: number, del: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, ctx.currentTime + del);
      g.gain.setValueAtTime(0, ctx.currentTime + del);
      g.gain.linearRampToValueAtTime(v, ctx.currentTime + del + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + del + d);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(ctx.currentTime + del);
      osc.stop(ctx.currentTime + del + d);
    };

    // Melodía por Rareza
    if (tier === 5) { // Primordial (Legendaria)
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 3, 0.2, i * 0.15));
    } else if (tier >= 3) { // Raíz / Exótica
      [440, 554, 659].forEach((f, i) => tone(f, 2, 0.15, i * 0.2));
    } else { // Comunes
      tone(880, 1, 0.1, 0);
    }
  }, [enabled, getCtx, playCrinkle]);

  return { playWindUp, playChargeUp, playReveal };
}
