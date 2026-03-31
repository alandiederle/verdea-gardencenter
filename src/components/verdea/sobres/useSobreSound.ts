import { useCallback, useRef } from "react";

export function useSobreSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const cutTriggered = useRef(false); // Evita que el sonido se multiplique durante la ráfaga granular

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  // Generador de Ruido granular para feedback táctico (Foil/Plástico)
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
      filter.Q.value = 1.2; // Resonancia para el foil

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch { /* noop */ }
  }, [enabled, getCtx]);

  // Generador de Tonos Celitiales por Rareza (usando archivos MP3 externos)
  const playFile = useCallback((fileName: string, volume = 0.5) => {
    if (!enabled) return;
    try {
      const audio = new Audio(`/sounds/${fileName}`);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch (err) {
      console.error(err);
    }
  }, [enabled]);

  /* ── FASE 1: Primer contacto (crujido leve) ── */
  const playWindUp = useCallback(() => {
    playCrinkle(0.12, 0.08, 8000); 
  }, [playCrinkle]);

  /* ── FASE 2: INTERACTIVA - EL "TRACCC" GRANULAR ── */
  // Esta función se dispara en un bucle rápido durante el gesto de arrastre
  const playChargeUp = useCallback((pitchFreq: number) => {
    if (cutTriggered.current || !enabled) return;
    cutTriggered.current = true; // Bloquea reproducciones simultáneas en la ráfaga
    playCrinkle(0.08, 0.15, pitchFreq);
    setTimeout(() => { cutTriggered.current = false; }, 20); // Tiempo de bloqueo corto
  }, [enabled, playCrinkle]);

  /* ── FASE 3: EXPLOSIÓN ÉPICA y revelación celestial ── */
  const playReveal = useCallback(
    (tier: number) => {
      if (!enabled) return;
      // IMPACTO PESADO (BOOM)
      playCrinkle(1.8, 0.7, 600); 

      // Sonido celestial según la rareza (usando archivos MP3 externos)
      if (tier >= 5) playFile("legendario.mp3", 0.8);
      else if (tier >= 3) playFile("raro.mp3", 0.6);
      else playFile("comun.mp3", 0.4);
    },
    [enabled, playCrinkle, playFile]
  );

  return { playWindUp, playChargeUp, playReveal };
}
