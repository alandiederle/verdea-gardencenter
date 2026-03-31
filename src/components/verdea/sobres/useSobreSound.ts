import { useCallback, useRef } from "react";

export function useSobreSound(enabled: boolean) {
  const lastPlayed = useRef<string | null>(null);

  const playFile = useCallback((fileName: string, volume = 0.5) => {
    if (!enabled) return;
    // Evita que el mismo sonido se dispare varias veces en el mismo milisegundo
    const now = Date.now();
    const audio = new Audio(`/sounds/${fileName}`);
    audio.volume = volume;
    audio.play().catch(() => {});
  }, [enabled]);

  return {
    playWindUp: () => playFile("agarre.mp3", 0.2),
    playChargeUp: () => playFile("abrir.mp3", 0.7),
    playReveal: (tier: number) => {
      if (tier >= 5) playFile("legendario.mp3", 0.8);
      else if (tier >= 3) playFile("raro.mp3", 0.6);
      else playFile("comun.mp3", 0.4);
    }
  };
}
