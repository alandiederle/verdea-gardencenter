import { useState, useRef, useEffect } from "react";
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
      if (e.key === "Escape") { setIsCut(false); setPhase("idle"); cutTriggered.current = false; }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setPhase]);

  if (phase === "idle") return null;

  const handleDragEnd = (_: any, info: any) => {
    if (cutTriggered.current) return;
    
    // Si el movimiento es rápido, disparamos todo
    if (Math.abs(info.velocity.x) > 300) {
      cutTriggered.current = true;
      setIsCut(true);
      
      // DISPARO DE SONIDOS
      sound.playChargeUp(); // El Traccc inmediato
      
      setPhase("exploding");
      setTimeout(() => {
        setPhase("revealed");
        sound.playReveal(rarity.tier); // Sonido de premio
        addDiscovery({ rarity, reward, timestamp: Date.now() });
      }, 1100);
    }
  };

  const glowColor = `hsl(${rarity.glowHsl})`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden">
      <button onClick={() => { setIsCut(false); setPhase("idle"); cutTriggered.current = false; }} 
              className="absolute top-10 right-10 text-white/50 hover:text-white flex items-center gap-2 z-50">
        <span className="text-xs font-bold uppercase">Escape para volver</span>
        <X size={24} />
      </button>

      <AnimatePresence>
        {phase !== "revealed" && (
          <div className="relative flex flex-col items-center">
            
            {/* GUÍA VISUAL VERDE (Límite superior) */}
            {!isCut && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-28 flex flex-col items-center">
                <p className="text-emerald-500 font-serif text-2xl font-bold mb-4 tracking-tighter">desliza para abrir</p>
                <div className="w-80 h-[4px] bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,1)]" />
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="text-emerald-500 mt-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-6-6h12z"/></svg>
                </motion.div>
              </motion.div>
            )}

            {/* EL SOBRE Y EL GLOW GIGANTE */}
            <motion.div
              drag="x" dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              style={{ x: dragX }}
              className="relative w-80 aspect-[2/3] cursor-grab active:cursor-grabbing"
            >
              {/* RESPLANDOR MASIVO (Aparece al cortar) */}
              {isCut && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.8, scale: 3 }}
                  className="absolute inset-0 -z-10 blur-[180px] rounded-full"
                  style={{ backgroundColor: glowColor }}
                />
              )}

              {/* Pieza Superior */}
              <motion.div 
                className="absolute inset-0 z-20" 
                style={{ clipPath: "inset(0 0 88% 0)" }}
                animate={isCut ? { y: -600, rotate: 45, opacity: 0 } : { y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
              </motion.div>

              {/* Cuerpo del sobre */}
              <motion.div className="absolute inset-0" style={{ clipPath: "inset(12% 0 0 0)" }}>
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* PANTALLA DE PREMIO */}
        {phase === "revealed" && (
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center relative">
            {/* Glow de fondo para el premio */}
            <div className="absolute inset-0 -z-10 blur-[200px] opacity-30 scale-150" style={{ backgroundColor: glowColor }} />
            
            <div className={`inline-block px-10 py-3 rounded-full mb-8 font-black text-xl ${rarity.color} ${rarity.textColor}`}>
              {rarity.name}
            </div>
            <h2 className="text-7xl font-serif font-bold text-white mb-12 drop-shadow-2xl">{reward}</h2>
            <button 
              onClick={() => { setIsCut(false); setPhase("idle"); cutTriggered.current = false; }} 
              className="px-16 py-6 bg-white text-black font-black rounded-full text-xl hover:scale-105 transition-transform"
            >
              COSECHAR
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
