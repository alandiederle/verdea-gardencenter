import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useSobreSound } from "./useSobreSound";
import { X } from "lucide-react";

export default function OpeningOverlay({ phase, setPhase, rarity, reward, addDiscovery }) {
  const sound = useSobreSound(true);
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

  if (phase === "idle" || !rarity) return null;

  const handleDrag = (_: any, info: any) => {
    if (cutTriggered.current) return;
    
    // Detectamos el tajo rápido
    if (Math.abs(info.velocity.x) > 200) {
      cutTriggered.current = true;
      setIsCut(true);
      sound.playChargeUp(); 
      setPhase("exploding");
      setTimeout(() => {
        setPhase("revealed");
        sound.playReveal(rarity.tier);
        addDiscovery({ rarity, reward, timestamp: Date.now() });
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden">
      <button onClick={() => { setIsCut(false); setPhase("idle"); cutTriggered.current = false; }} 
              className="absolute top-10 right-10 text-white/40 hover:text-white flex items-center gap-2 z-50 transition-all font-sans">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Cerrar Ritual</span>
        <X size={20} />
      </button>

      <AnimatePresence>
        {phase !== "revealed" && (
          <div className="relative flex flex-col items-center">
            
            {/* TEXTO DE GUÍA: Más elegante y minimalista */}
            {!isCut && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                className="absolute -top-28 flex flex-col items-center pointer-events-none"
              >
                <p className="text-white font-serif text-3xl font-light italic tracking-[0.1em] mb-4">
                  Desliza para abrir
                </p>
                <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
                </motion.div>
              </motion.div>
            )}

            <motion.div
              drag="x" dragConstraints={{ left: 0, right: 0 }}
              onDrag={handleDrag}
              style={{ x: dragX }}
              className="relative w-80 aspect-[2/3] cursor-grab active:cursor-grabbing touch-none"
            >
              {/* GLOW GIGANTE */}
              {isCut && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.8, scale: 4 }}
                  className="absolute inset-0 -z-10 blur-[180px] rounded-full"
                  style={{ backgroundColor: `hsl(${rarity.glowHsl})` }}
                />
              )}

              {/* Pieza Superior - draggable="false" es la clave aquí */}
              <motion.div 
                className="absolute inset-0 z-20" 
                style={{ clipPath: "inset(0 0 88% 0)" }}
                animate={isCut ? { y: -800, rotate: 45, opacity: 0 } : { y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <img 
                  src="/images/sobre-verdie.png" 
                  className="w-full h-full object-contain" 
                  alt="" 
                  draggable="false" 
                />
              </motion.div>

              {/* Cuerpo del sobre */}
              <motion.div className="absolute inset-0 z-10" style={{ clipPath: "inset(12% 0 0 0)" }}>
                <img 
                  src="/images/sobre-verdie.png" 
                  className="w-full h-full object-contain" 
                  alt="" 
                  draggable="false" 
                />
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* PANTALLA DE PREMIO */}
        {phase === "revealed" && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <div className={`inline-block px-10 py-2 rounded-full mb-8 text-xs font-black uppercase tracking-[0.4em] ${rarity.color} ${rarity.textColor}`}>
              {rarity.name}
            </div>
            <h2 className="text-7xl font-serif font-bold text-white mb-12 drop-shadow-2xl">{reward}</h2>
            <button 
              onClick={() => { setIsCut(false); setPhase("idle"); cutTriggered.current = false; }} 
              className="px-16 py-5 bg-white text-black font-black rounded-full text-sm tracking-[0.2em] hover:bg-secondary hover:text-white transition-all"
            >
              COSECHAR PREMIO
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
