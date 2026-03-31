import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useSobreSound } from "./useSobreSound";
import { X } from "lucide-react";

export default function OpeningOverlay({ phase, setPhase, rarity, reward, addDiscovery }) {
  const sound = useSobreSound(true);
  const [isCut, setIsCut] = useState(false);
  const dragX = useMotionValue(0);
  const cutTriggered = useRef(false);

  // Tecla Escape para volver
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
    const velocity = Math.abs(info.velocity.x);
    if (velocity > 300) {
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      {/* Botón Esc */}
      <button onClick={() => { setIsCut(false); setPhase("idle"); }} className="absolute top-10 right-10 text-white/50 hover:text-white flex items-center gap-2">
        <span className="text-xs font-bold uppercase">Esc para volver</span>
        <X size={24} />
      </button>

      <AnimatePresence>
        {phase !== "revealed" && (
          <div className="relative flex flex-col items-center">
            
            {/* GUÍA VISUAL ARRIBA DEL SOBRE */}
            {!isCut && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="absolute -top-24 flex flex-col items-center w-full"
              >
                <p className="text-emerald-400 font-serif text-xl font-bold mb-4 tracking-widest">
                  desliza para abrir
                </p>
                {/* LÍNEA VERDE EN EL LÍMITE SUPERIOR */}
                <div className="relative w-72 h-[3px] bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]">
                  <motion.div 
                    animate={{ x: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-emerald-500"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-6-6h12z"/></svg>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* EL SOBRE CON EFECTO FOIL */}
            <motion.div
              drag="x" dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              style={{ x: dragX }}
              className="relative w-80 aspect-[2/3] cursor-grab active:cursor-grabbing"
            >
              {/* Pieza de arriba (Corte) */}
              <motion.div 
                className="absolute inset-0 z-20 overflow-hidden" 
                style={{ clipPath: "inset(0 0 88% 0)" }}
                animate={isCut ? { y: -400, rotate: 30, opacity: 0 } : { y: 0 }}
              >
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 mix-blend-overlay" />
              </motion.div>

              {/* Cuerpo del sobre con Foil */}
              <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(12% 0 0 0)" }}>
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
                {/* Capa de Brillo Foil */}
                <motion.div 
                  className="absolute inset-[-100%] bg-gradient-to-tr from-transparent via-white/40 to-transparent"
                  animate={{ x: ["-50%", "50%"] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  style={{ mixBlendMode: "overlay" }}
                />
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* REVELACIÓN DEL PREMIO */}
        {phase === "revealed" && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <h2 className="text-6xl font-serif font-bold text-white mb-12">{reward}</h2>
            <button onClick={() => { setIsCut(false); setPhase("idle"); cutTriggered.current = false; }} className="px-12 py-5 bg-white text-black font-bold rounded-full">
              Continuar Cultivando
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
