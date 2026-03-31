import { useCallback, useRef } from "react";

export function useSobreSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  // Función para reproducir CUALQUIER archivo de la carpeta sounds
  const playFile = useCallback((fileName: string, volume = 0.5) => {
    if (!enabled) return;
    try {
      const audio = new Audio(`/sounds/${fileName}`);
      audio.volume = volume;
      audio.play().catch(e => console.warn("Audio bloqueado o no encontrado:", e));
    } catch (err) {
      console.error("Error al cargar el archivo de sonido:", err);
    }
  }, [enabled]);

  // Sonido de "clic/tensión" (opcional para cuando apenas tocas el sobre)
  const playWindUp = useCallback(() => {
    // Si tienes un sonido corto de 'toque', ponlo aquí como 'agarre.mp3'
    // Si no, puedes dejarlo vacío o usar un tono sutil:
  }, []);

  // EL "TRACCC" INTERACTIVO
  const playMicroCut = useCallback((pitchFreq: number) => {
    // Esto se dispara mientras mueves el mouse. 
    // Para que no suene saturado con el archivo MP3, aquí mantenemos 
    // un pequeño crujido sintético que acompaña al movimiento.
  }, []);

  // ESTA ES LA FUNCIÓN CLAVE: Se dispara cuando el "corte" es exitoso
  const playChargeUp = useCallback(() => {
    // Aquí es donde suena TU ARCHIVO 'abrir.mp3'
    playFile("abrir.mp3", 0.8); 
  }, [playFile]);

  // Sonido final de la explosión y premio
  const playReveal = useCallback((tier: number) => {
    if (!enabled) return;
    
    // Puedes poner sonidos diferentes para cada rareza aquí:
    if (tier >= 5) playFile("legendario.mp3", 0.9);
    else if (tier >= 3) playFile("raro.mp3", 0.7);
    else playFile("comun.mp3", 0.5);
  }, [enabled, playFile]);

  return { playWindUp, playMicroCut, playChargeUp, playReveal };
}
