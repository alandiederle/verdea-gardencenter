import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useSobreSound } from "./useSobreSound";
import type { Rarity } from "./rarities";
import { X } from "lucide-react";

interface Props {
  phase: string;
  setPhase: (p: any) => void;
  rarity: Rarity;
  reward: string;
  soundOn: boolean;
  addDiscovery: (d: any) => void;
}

export default function OpeningOverlay({ phase, setPhase, rarity, reward, soundOn, addDiscovery }: Props) {
  const sound = useSobreSound(soundOn);
  const [isCut, setIsCut] = useState(false);
  const cutTriggered = useRef(false); // Evita que el sonido se multiplique
  
  const dragX = useMotionValue(0);
  const rotateZ = useTransform(dragX, [-200, 200], [-10, 10]);

  // Tecla Escape para salir
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCut(false);
        cutTriggered.current = false;
        setPhase("idle");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setPhase]);

  if (phase === "idle") return null;

  const handleDragEnd = (_: any, info: any) => {
    if (cutTriggered.current) return;

    const velocity = Math.abs(info.velocity.x);
    const offset = Math.abs(info.offset.x);

    if (velocity > 300 || offset > 100) {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      {/* Botón Volver / Esc */}
      <button 
        onClick={() => { setIsCut(false); cutTriggered.current = false; setPhase("idle"); }}
        className="absolute top-10 right-10 text-white/50 hover:text-white flex items-center gap-2"
      >
        <span className="text-xs font-bold uppercase tracking-widest">Esc para Volver</span>
        <X size={24} />
      </button>

      <AnimatePresence>
        {phase !== "revealed" && (
          <div className="relative flex flex-col items-center">
            {/* Guía Visual */}
            {!isCut && (
              <motion.div className="absolute -top-32 text-center pointer-events-none">
                <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-4">Ritual de Apertura</p>
                <div className="relative flex flex-col items-center">
                   <div className="w-64 h-[2px] bg-emerald-900 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                   <motion.div 
                     animate={{ y: [0, -10, 0] }}
                     transition={{ repeat: Infinity, duration: 1.5 }}
                     className="text-emerald-500 mt-2"
                   >
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                     </svg>
                   </motion.div>
                   <p className="text-emerald-500 font-bold text-sm mt-2">DESLIZA AQUÍ</p>
                </div>
              </motion.div>
            )}

            {/* El Sobre */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{ x: dragX, rotateZ }}
              className="relative w-80 aspect-[2/3] cursor-grab active:cursor-grabbing"
            >
              {/* Parte de arriba (Corte) */}
              <motion.div 
                className="absolute inset-0 z-10" 
                style={{ clipPath: "inset(0 0 85% 0)" }}
                animate={isCut ? { y: -500, rotate: 45, opacity: 0 } : { y: 0 }}
              >
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
              </motion.div>

              {/* Cuerpo del sobre */}
              <motion.div className="absolute inset-0" style={{ clipPath: "inset(15% 0 0 0)" }}>
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
              </motion.div>

              {/* Luces de Rareza */}
              {isCut && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ backgroundColor: `hsl(${rarity.glowHsl})` }}
                  className="absolute inset-0 -z-10 blur-[100px] opacity-50"
                />
              )}
            </motion.div>
          </div>
        )}

        {/* Premio */}
        {phase === "revealed" && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <div className={`inline-block px-8 py-3 rounded-full mb-8 font-bold ${rarity.color} ${rarity.textColor}`}>
              {rarity.name}
            </div>
            <h2 className="text-6xl font-serif font-bold text-white mb-12">{reward}</h2>
            <button 
              onClick={() => { setIsCut(false); cutTriggered.current = false; setPhase("idle"); }} 
              className="px-12 py-5 bg-white text-black font-bold rounded-full"
            >
              Cosechar Premio
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
