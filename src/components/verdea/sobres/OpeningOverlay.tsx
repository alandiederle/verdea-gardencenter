import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useSobreSound } from "./useSobreSound";
import type { Rarity } from "./rarities";

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
  const dragX = useMotionValue(0);
  
  // Opacidad de la guía: desaparece cuando empiezas a cortar
  const guideOpacity = useTransform(dragX, [-50, 0, 50], [0, 1, 0]);

  if (phase === "idle") return null;

  const handleDrag = (_: any, info: any) => {
    if (isCut) return;

    // Detectamos un tajo rápido en la parte superior
    const velocity = Math.abs(info.velocity.x);
    const offset = Math.abs(info.offset.x);

    if (velocity > 400 || offset > 120) {
      setIsCut(true);
      sound.playChargeUp(); // Tu sonido "traccc"
      
      setPhase("exploding");
      
      setTimeout(() => {
        setPhase("revealed");
        sound.playReveal(rarity.tier);
        addDiscovery({ rarity, reward, timestamp: Date.now() });
      }, 1200);
    }
  };

  const glowColor = `hsl(${rarity?.glowHsl || '140, 50%, 50%'})`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden">
      <AnimatePresence>
        {(phase === "charging" || phase === "exploding") && (
          <div className="relative w-80 aspect-[2/3]">
            
            {/* 1. GUÍA VISUAL: Flecha y Texto */}
            {!isCut && (
              <motion.div 
                style={{ opacity: guideOpacity }}
                className="absolute -top-20 inset-x-0 z-50 flex flex-col items-center pointer-events-none"
              >
                <motion.div 
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="mb-2 text-secondary"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 13l5 5 5-5M12 18V6" />
                  </svg>
                </motion.div>
                <p className="text-white font-black text-xs uppercase tracking-[0.3em] bg-black/50 px-4 py-1 rounded-full border border-white/10">
                  Desliza aquí para abrir
                </p>
                {/* Línea de termosellado visual */}
                <div className="w-64 h-px bg-white/30 mt-12 border-t border-dashed border-white/50" />
              </motion.div>
            )}

            {/* 2. EL SOBRE: Dividido en dos piezas */}
            <div className="relative w-full h-full">
              
              {/* PIEZA DE ARRIBA (La que sale volando) */}
              <motion.div
                className="absolute inset-0 z-30"
                style={{ 
                  clipPath: "inset(0 0 85% 0)", // Solo muestra el 15% superior
                  x: dragX 
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDrag={handleDrag}
                animate={isCut ? { 
                  y: -400, 
                  x: 100, 
                  rotate: 45, 
                  opacity: 0 
                } : { y: 0 }}
                transition={{ type: "spring", stiffness: 50 }}
              >
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
              </motion.div>

              {/* PIEZA DE ABAJO (La que se queda) */}
              <motion.div
                className="absolute inset-0 z-20"
                style={{ clipPath: "inset(15% 0 0 0)" }} // Muestra el resto del sobre
                animate={isCut ? { y: 20, scale: 0.95 } : { y: 0 }}
              >
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
              </motion.div>

              {/* 3. EFECTO DE LUCES (Según Rareza) */}
              {isCut && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], scale: [1, 2, 2.5] }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 z-10 blur-[100px] rounded-full"
                  style={{ backgroundColor: glowColor }}
                />
              )}
            </div>

            {/* Partículas de luz emergiendo del corte */}
            {isCut && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-[15%] left-1/2 -translate-x-1/2 w-full h-2 shadow-[0_-20px_100px_20px] z-40"
                style={{ color: glowColor, boxShadow: `0 -10px 60px ${glowColor}` }}
              />
            )}
          </div>
        )}

        {/* REVELACIÓN FINAL */}
        {phase === "revealed" && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="text-center"
          >
            <div className={`inline-block px-10 py-3 rounded-full mb-8 font-black text-xl shadow-[0_0_50px_rgba(255,255,255,0.1)] ${rarity.color} ${rarity.textColor}`}>
              {rarity.name}
            </div>
            <h2 className="text-7xl font-serif font-bold text-white mb-12 leading-tight">
              {reward}
            </h2>
            <button 
              onClick={() => { setIsCut(false); setPhase("idle"); }} 
              className="px-16 py-6 bg-white text-black font-black rounded-full text-xl hover:scale-105 transition-transform"
            >
              CULTIVAR PREMIO
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
