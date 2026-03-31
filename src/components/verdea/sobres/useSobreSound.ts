import { useCallback } from "react";

export function useSobreSound(enabled: boolean) {
  const playFile = useCallback((fileName: string, volume = 0.6) => {
    if (!enabled) return;
    const audio = new Audio(`/sounds/${fileName}`);
    audio.volume = volume;
    audio.play().catch(e => console.warn("Error audio:", e));
  }, [enabled]);

  return {
    playWindUp: () => {}, // Opcional: sonido de toque
    playChargeUp: () => playFile("abrir.mp3", 0.8), // El TRACCC
    playReveal: (tier: number) => {
      if (tier >= 5) playFile("legendario.mp3", 0.9);
      else if (tier >= 3) playFile("raro.mp3", 0.7);
      else playFile("comun.mp3", 0.5);
    }
  };
}
