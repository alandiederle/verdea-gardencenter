import { useEffect, useState, useRef, useCallback } from "react"; // useCallback importado
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useSobreSound } from "./useSobreSound";
import { X } from "lucide-react";
import type { Rarity } from "./rarities";

interface Props {
  phase: string;
  setPhase: (p: any) => void;
  rarity: Rarity | undefined; // Protección si llega undefined
  reward: string;
  addDiscovery: (d: any) => void;
}

export default function OpeningOverlay({ phase, setPhase, rarity, reward, addDiscovery }: Props) {
  const sound = useSobreSound(true);
  const [isCut, setIsCut] = useState(false);
  const dragX = useMotionValue(0);
  const cutTriggered = useRef(false);

  // Cerrar con Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") { 
        setIsCut(false); 
        setPhase("idle"); 
        cutTriggered.current = false; 
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setPhase]);

  // Si no hay fase activa, no renderizar nada para evitar errores
  if (phase === "idle" || !rarity) return null;

  const handleDrag = (_: any, info: any) => {
    if (cutTriggered.current) return;
    
    // Sensibilidad del corte
    const velocity = Math.abs(info.velocity.x);
    if (velocity > 200) {
      cutTriggered.current = true;
      setIsCut(true);
      
      sound.playChargeUp(); // El "traccc"
      
      setPhase("exploding");
      setTimeout(() => {
        setPhase("revealed");
        sound.playReveal(rarity.tier);
        addDiscovery({ rarity, reward, timestamp: Date.now() });
      }, 1000);
    }
  };

  const glowColor = `hsl(${rarity.glowHsl})`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden">
      {/* Botón Volver */}
      <button 
        onClick={() => { setIsCut(false); setPhase("idle"); cutTriggered.current = false; }} 
        className="absolute top-10 right-10 text-white/50 hover:text-white flex items-center gap-2 z-50 transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-widest font-sans">Esc para volver</span>
        <X size={28} />
      </button>

      <AnimatePresence>
        {phase !== "revealed" && (
          <div className="relative flex flex-col items-center">
            
            {/* GUÍA VISUAL: Línea verde ancha y texto */}
            {!isCut && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="absolute -top-36 flex flex-col items-center z-50 pointer-events-none"
              >
                <p className="text-emerald-500 font-serif text-3xl font-bold mb-4 tracking-tighter">
                  Desliza para abrir
                </p>
                
                {/* Línea verde ancha */}
                <div className="w-80 h-3 bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,1)] rounded-full" />
                
                <motion.div 
                  animate={{ y: [0, 10, 0] }} 
                  transition={{ repeat: Infinity, duration: 1 }} 
                  className="text-emerald-500 mt-4"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 16l-6-6h12z"/>
                  </svg>
                </motion.div>
              </motion.div>
            )}

            {/* EL SOBRE */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDrag={handleDrag}
              style={{ x: dragX }}
              className="relative w-80 aspect-[2/3] cursor-grab active:cursor-grabbing touch-none"
            >
              {/* GLOW DE RAREZA GIGANTE */}
              {isCut && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.9, scale: 4.5 }}
                  className="absolute inset-0 -z-10 blur-[180px] rounded-full"
                  style={{ backgroundColor: glowColor }}
                />
              )}

              {/* Pieza Superior */}
              <motion.div 
                className="absolute inset-0 z-20" 
                style={{ clipPath: "inset(0 0 88% 0)" }}
                animate={isCut ? { y: -700, rotate: 45, opacity: 0, scale: 1.2 } : { y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
              </motion.div>

              {/* Cuerpo del sobre */}
              <motion.div 
                className="absolute inset-0 z-10" 
                style={{ clipPath: "inset(12% 0 0 0)" }}
                animate={isCut ? { y: 50, scale: 0.95 } : { y: 0 }}
              >
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* PANTALLA DE PREMIO */}
        {phase === "revealed" && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="text-center relative z-50 flex flex-col items-center"
          >
            {/* Glow de fondo masivo */}
            <div className="absolute inset-0 -z-10 blur-[280px] opacity-40 scale-[4]" style={{ backgroundColor: glowColor }} />
            
            <div className={`inline-block px-12 py-3 rounded-full mb-10 font-black text-2xl shadow-2xl ${rarity.color} ${rarity.textColor}`}>
              {rarity.name}
            </div>
            <h2 className="text-7xl font-serif font-bold text-white mb-16 drop-shadow-2xl leading-tight">
              {reward}
            </h2>
            <button 
              onClick={() => { setIsCut(false); setPhase("idle"); cutTriggered.current = false; }} 
              className="px-20 py-6 bg-white text-black font-black rounded-full text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              COSECHAR
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
