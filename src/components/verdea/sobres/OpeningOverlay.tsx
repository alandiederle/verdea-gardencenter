import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useSobreSound } from "./useSobreSound";
import { X } from "lucide-react";

export default function OpeningOverlay({ phase, setPhase, rarity, reward, addDiscovery }) {
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

  if (phase === "idle") return null;

  const handleDrag = (_: any, info: any) => {
    if (cutTriggered.current) return;
    
    // Si el usuario arrastra con fuerza (velocidad), se considera un corte
    const velocity = Math.abs(info.velocity.x);
    if (velocity > 250) {
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
        <span className="text-xs font-bold uppercase tracking-widest">Esc para volver</span>
        <X size={28} />
      </button>

      <AnimatePresence>
        {phase !== "revealed" && (
          <div className="relative flex flex-col items-center">
            
            {/* GUÍA VISUAL Y ZONA DE CONTACTO ANCHA */}
            {!isCut && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="absolute -top-32 flex flex-col items-center z-50"
              >
                <p className="text-emerald-500 font-serif text-2xl font-bold mb-4 tracking-tighter">
                  desliza para abrir
                </p>
                
                {/* Esta es la línea visual */}
                <div className="w-80 h-2 bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,1)] rounded-full" />
                
                {/* Flecha indicadora */}
                <motion.div 
                  animate={{ y: [0, 8, 0] }} 
                  transition={{ repeat: Infinity, duration: 1 }} 
                  className="text-emerald-500 mt-4"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 16l-6-6h12z"/>
                  </svg>
                </motion.div>
              </motion.div>
            )}

            {/* EL SOBRE Y EL GLOW GIGANTE */}
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
                  animate={{ opacity: 0.9, scale: 4 }}
                  className="absolute inset-0 -z-10 blur-[150px] rounded-full"
                  style={{ backgroundColor: glowColor }}
                />
              )}

              {
