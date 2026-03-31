import { useCallback } from "react";

export function useSobreSound(enabled: boolean) {
  const playFile = useCallback((fileName: string, volume = 0.5) => {
    if (!enabled) return;
    try {
      const audio = new Audio(`/sounds/${fileName}`);
      audio.volume = volume;
      audio.play().catch(() => {}); // Ignora errores si el archivo no existe aún
    } catch (err) {
      console.error(err);
    }
  }, [enabled]);

  return {
    playWindUp: () => playFile("agarre.mp3", 0.2),
    playMicroCut: () => {}, // Reservado para feedback táctico
    playChargeUp: () => playFile("abrir.mp3", 0.7), // EL TRACCC
    playReveal: (tier: number) => {
      if (tier >= 5) playFile("legendario.mp3", 0.8);
      else if (tier >= 3) playFile("raro.mp3", 0.6);
      else playFile("comun.mp3", 0.4);
    }
  };
}
