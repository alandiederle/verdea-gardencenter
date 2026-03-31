import { useCallback } from "react";

export function useSobreSound(enabled: boolean) {
  const playFile = useCallback((fileName: string, volume = 0.6) => {
    if (!enabled) return;
    try {
      const audio = new Audio(`/sounds/${fileName}`);
      audio.volume = volume;
      audio.play().catch(e => console.warn("Error cargando sonido:", fileName, e));
    } catch (err) {
      console.error("Error de audio:", err);
    }
  }, [enabled]);

  return {
    // Configuramos .wav para el agarre y .mp3 para el resto
    playWindUp: () => playFile("agarre.wav", 0.4), 
    playChargeUp: () => playFile("abrir.mp3", 0.8), // El "traccc"
    playReveal: (tier: number) => {
      // Lógica de rareza vinculada a tus archivos
      if (tier >= 4) {
        playFile("legendario.mp3", 0.9); // Exótica y Primordial
      } else if (tier >= 2) {
        playFile("raro.mp3", 0.7);       // Polen y Raíz
      } else {
        playFile("comun.mp3", 0.5);      // Silvestre y Brote
      }
    }
  };
}
