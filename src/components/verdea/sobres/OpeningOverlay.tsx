import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useSobreSound } from "./useSobreSound";
import { X } from "lucide-react";
import type { Rarity } from "./rarities";

// --- SUB-COMPONENTE DE PARTÍCULAS MÁGICAS ---
const Particles = ({ color }: { color: string }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ x: "50%", y: "50%", opacity: 1 }}
        animate={{ 
          x: `${Math.random() * 100}%`, 
          y: `${Math.random() * 100}%`, 
          opacity: 0,
          scale: [0, 1.5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
      />
    ))}
  </div>
);

export default function OpeningOverlay({ phase, setPhase, rarity, reward, addDiscovery, soundOn }: any) {
  const sound = useSobreSound(soundOn);
  const [isCut, setIsCut] = useState(false);
  const dragX = useMotionValue(0);
  const cutTriggered = useRef(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") { 
        setIsCut(false); setPhase("idle"); cutTriggered.current = false; 
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setPhase]);

  const handleDrag = useCallback((_: any, info: any) => {
    if (cutTriggered.current || isCut) return;
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

  const glowColor = `hsl(${rarity.glowHsl})`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden">
      {/* Botón Volver */}
      <button onClick={() => { setIsCut(false); setPhase("idle"); cutTriggered.current = false; }} 
              className="absolute top-10 right-10 text-white/30 hover:text-white flex items-center gap-3 z-50 transition-all font-sans">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Cerrar Ritual</span>
        <X size={20} />
      </button>

      <AnimatePresence>
        {phase !== "revealed" && (
          <div className="relative flex flex-col items-center">
            
            {/* GUÍA VISUAL */}
            {!isCut && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-32 flex flex-col items-center pointer-events-none">
                <p className="text-white font-serif text-4xl font-light italic tracking-wider mb-6">Desliza para abrir</p>
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
              </motion.div>
            )}

            <motion.div
              drag="x" dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => sound.playWindUp()}
              onDrag={handleDrag}
              style={{ x: dragX }}
              className="relative w-80 aspect-[2/3] cursor-grab active:cursor-grabbing touch-none"
            >
              {/* --- EFECTOS ESPECIALES DE RAREZA --- */}
              {isCut && (
                <>
                  {/* 1. Rayos de Luz Giratorios */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.6, scale: 4, rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 -z-10 blur-2xl opacity-40"
                    style={{ 
                      background: `conic-gradient(from 0deg, transparent, ${glowColor}, transparent, ${glowColor}, transparent)` 
                    }}
                  />
                  {/* 2. Onda de Choque (Shockwave) */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 1, border: `2px solid ${glowColor}` }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 -z-10 rounded-full"
                  />
                  {/* 3. Partículas */}
                  <Particles color={glowColor} />
                </>
              )}

              {/* Pieza Superior */}
              <motion.div 
                className="absolute inset-0 z-20" 
                style={{ clipPath: "inset(0 0 88% 0)" }}
                animate={isCut ? { y: -800, rotate: 60, opacity: 0 } : { y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" draggable={false} />
              </motion.div>

              {/* Cuerpo del sobre */}
              <motion.div 
                className="absolute inset-0 z-10" 
                style={{ clipPath: "inset(12% 0 0 0)" }}
                animate={isCut ? { y: 40, scale: 0.95, filter: "blur(4px)" } : { y: 0 }}
              >
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" draggable={false} />
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* PANTALLA DE PREMIO */}
        {phase === "revealed" && (
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center relative">
            {/* Resplandor pulsante de fondo */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 -z-10 blur-[180px] rounded-full scale-[3]"
              style={{ backgroundColor: glowColor }}
            />
            
            <div className={`inline-block px-10 py-2 rounded-full mb-8 text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl ${rarity.color} ${rarity.textColor}`}>
              {rarity.name}
            </div>
            <h2 className="text-7xl font-serif font-bold text-white mb-12 drop-shadow-2xl">{reward}</h2>
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
