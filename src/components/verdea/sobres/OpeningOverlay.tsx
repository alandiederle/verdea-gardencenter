import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useSobreSound } from "./useSobreSound";
import { X } from "lucide-react";
import type { Rarity } from "./rarities";

interface Props {
  phase: string;
  setPhase: (p: any) => void;
  rarity: Rarity | undefined;
  reward: string;
  addDiscovery: (d: any) => void;
  soundOn: boolean;
}

export default function OpeningOverlay({ phase, setPhase, rarity, reward, addDiscovery, soundOn }: Props) {
  const sound = useSobreSound(soundOn);
  const [isCut, setIsCut] = useState(false);
  const dragX = useMotionValue(0);
  const cutTriggered = useRef(false);

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

  // Función de corte optimizada
  const handleDrag = useCallback((_: any, info: any) => {
    if (cutTriggered.current || isCut) return;
    
    // Si la velocidad del tajo es suficiente
    if (Math.abs(info.velocity.x) > 250) {
      cutTriggered.current = true;
      setIsCut(true);
      sound.playChargeUp(); 
      
      setPhase("exploding");
      setTimeout(() => {
        setPhase("revealed");
        if (rarity) sound.playReveal(rarity.tier);
        addDiscovery({ rarity, reward, timestamp: Date.now() });
      }, 1000);
    }
  }, [isCut, rarity, reward, sound, setPhase, addDiscovery]);

  if (phase === "idle" || !rarity) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden">
      {/* Botón Volver */}
      <button 
        onClick={() => { setIsCut(false); setPhase("idle"); cutTriggered.current = false; }} 
        className="absolute top-10 right-10 text-white/30 hover:text-white flex items-center gap-3 z-50 transition-all font-sans"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Cerrar Ritual</span>
        <X size={20} />
      </button>

      <AnimatePresence>
        {phase !== "revealed" && (
          <div className="relative flex flex-col items-center">
            
            {/* GUÍA VISUAL: Letra elegante y minimalista */}
            {!isCut && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                className="absolute -top-32 flex flex-col items-center pointer-events-none"
              >
                <p className="text-white font-serif text-4xl font-light italic tracking-wider mb-6">
                  Desliza para abrir
                </p>
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent" 
                />
              </motion.div>
            )}

            <motion.div
              drag="x" 
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => sound.playWindUp()}
              onDrag={handleDrag}
              style={{ x: dragX }}
              className="relative w-80 aspect-[2/3] cursor-grab active:cursor-grabbing touch-none"
            >
              {/* GLOW DE RAREZA GIGANTE */}
              {isCut && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }} 
                  animate={{ opacity: 0.8, scale: 5 }} 
                  className="absolute inset-0 -z-10 blur-[150px] rounded-full"
                  style={{ backgroundColor: `hsl(${rarity.glowHsl})` }}
                />
              )}

              {/* Pieza Superior (Corte) */}
              <motion.div 
                className="absolute inset-0 z-20" 
                style={{ clipPath: "inset(0 0 88% 0)" }}
                animate={isCut ? { y: -800, rotate: 60, opacity: 0 } : { y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <img 
                  src="/images/sobre-verdie.png" 
                  className="w-full h-full object-contain" 
                  alt="" 
                  draggable={false} 
                />
              </motion.div>

              {/* Cuerpo del sobre */}
              <motion.div 
                className="absolute inset-0 z-10" 
                style={{ clipPath: "inset(12% 0 0 0)" }}
                animate={isCut ? { y: 40, scale: 0.95, filter: "blur(4px)" } : { y: 0 }}
              >
                <img 
                  src="/images/sobre-verdie.png" 
                  className="w-full h-full object-contain" 
                  alt="" 
                  draggable={false} 
                />
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* PANTALLA DE PREMIO */}
        {phase === "revealed" && (
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
            <div className={`inline-block px-10 py-2 rounded-full mb-8 text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl ${rarity.color} ${rarity.textColor}`}>
              {rarity.name}
            </div>
            <h2 className="text-7xl font-serif font-bold text-white mb-12 drop-shadow-2xl">
              {reward}
            </h2>
            <button 
              onClick={() => { setIsCut(false); setPhase("idle"); cutTriggered.current = false; }} 
              className="px-16 py-5 bg-white text-black font-black rounded-full text-sm tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all shadow-2xl"
            >
              COSECHAR RECOMPENSA
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
