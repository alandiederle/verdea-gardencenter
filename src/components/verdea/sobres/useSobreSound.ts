import { useCallback } from "react";

export function useSobreSound(enabled: boolean) {
  
  // Función interna para disparar los archivos de audio
  const playFile = useCallback((fileName: string, volume = 0.5) => {
    if (!enabled) return;
    try {
      const audio = new Audio(`/sounds/${fileName}`);
      audio.volume = volume;
      
      // Intentar reproducir y manejar posibles bloqueos del navegador
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay bloqueado o archivo no encontrado:", fileName, error);
        });
      }
    } catch (err) {
      console.error("Error al cargar el audio:", err);
    }
  }, [enabled]);

  /* ── FASE 1: El usuario hace clic (Primer contacto) ── */
  const playWindUp = useCallback(() => {
    playFile("agarre.mp3", 0.3);
  }, [playFile]);

  /* ── FASE 2: El "TRACCC" (Mientras el sobre vibra y se rompe) ── */
  const playChargeUp = useCallback(() => {
    // Aquí es donde suena el rasgado tipo Pokémon
    playFile("abrir.mp3", 0.7); 
  }, [playFile]);

  /* ── FASE 3: LA REVELACIÓN (El clímax de la explosión) ── */
  const playReveal = useCallback((tier: number) => {
    if (!enabled) return;

    // Lógica para elegir qué final suena según la rareza
    if (tier >= 5) {
      // Rareza Primordial (Legendaria)
      playFile("legendario.mp3", 0.9);
    } else if (tier >= 3) {
      // Rarezas Raíz o Exótica
      playFile("raro.mp3", 0.7);
    } else {
      // Rarezas Silvestre, Brote o Polen
      playFile("comun.mp3", 0.5);
    }
  }, [enabled, playFile]);

  return { playWindUp, playChargeUp, playReveal };
}
