import { useCallback } from "react";

export function useSobreSound(enabled: boolean) {
  const playFile = useCallback((fileName: string, volume = 0.6) => {
    if (!enabled) return;
    try {
      const audio = new Audio(`/sounds/${fileName}`);
      audio.volume = volume;
      audio.play().catch(e => console.warn("Audio bloqueado o no encontrado:", fileName));
    } catch (err) {
      console.error("Error de audio:", err);
    }
  }, [enabled]);

  return {
    // Agarre es .wav, el resto .mp3
    playWindUp: () => playFile("agarre.wav", 0.4), 
    playChargeUp: () => playFile("abrir.mp3", 0.8),
    playReveal: (tier: number) => {
      if (tier >= 4) playFile("legendario.mp3", 0.9);
      else if (tier >= 2) playFile("raro.mp3", 0.7);
      else playFile("comun.mp3", 0.5);
    }
  };
}
