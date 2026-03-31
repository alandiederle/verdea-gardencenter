import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useSobreSound } from "./useSobreSound";
import type { Rarity } from "./rarities";

interface Props {
  phase: "idle" | "charging" | "exploding" | "revealed";
  setPhase: (p: any) => void;
  rarity: Rarity;
  reward: string;
  soundOn: boolean;
  addDiscovery: (d: any) => void;
}

export default function OpeningOverlay({ phase, setPhase, rarity, reward, soundOn, addDiscovery }: Props) {
  const sound = useSobreSound(soundOn);
  const [isCut, setIsCut] = useState(false);
  const sobreRef = useRef<HTMLDivElement>(null);
  
  // Valores para el gesto de corte interactivo (arrastre)
  const dragX = useMotionValue(0);
  const rotateX = useTransform(dragX, [-150, 150], [10, -10]);
  const rotateY = useTransform(dragX, [-150, 150], [-10, 10]);
  
  // Opacidad de la guía: desaparece cuando empiezas a cortar
  const guideOpacity = useTransform(dragX, [-100, 0, 100], [0, 1, 0]);

  // Manejo de la tecla Escape para volver
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (phase === "charging" || phase === "revealed")) {
        setIsCut(false);
        setPhase("idle");
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [phase, setPhase]);

  if (phase === "idle") return null;

  // FUNCIÓN CLAVE: Gesto de corte (arrastre) con un solo clic
  const handleDrag = useCallback((event: any, info: any) => {
    if (isCut || phase !== "charging") return;

    // Calculamos la magnitud del movimiento (velocidad y offset)
    const velocity = Math.abs(info.velocity.x) + Math.abs(info.velocity.y);
    const offsetMagnitude = Math.abs(info.offset.x) + Math.abs(info.offset.y);

    // LÓGICA DE DETECCION DEL CORTE FINAL (con un solo clic y arrastre)
    if (velocity > 350 && offsetMagnitude > 120) {
      setIsCut(true);
      sound.playChargeUp(); // AQUÍ SUENA TU "ABRIR.MP3" (EL TRACCC)
      
      setPhase("exploding");
      
      setTimeout(() => {
        setPhase("revealed");
        sound.playReveal(rarity.tier);
        addDiscovery({ rarity, reward, timestamp: Date.now() });
      }, 1200);
    }
  }, [isCut, phase, sound, setPhase, rarity]);

  const glowColor = `hsl(${rarity?.glowHsl || '140, 50%, 50%'})`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden">
      <AnimatePresence>
        {(phase === "charging" || phase === "exploding") && (
          <div className="relative w-80 aspect-[2/3]">
            
            {/* 1. GUÍA VISUAL INTENSIVA: Flecha, Guía Verde y Texto */}
            {!isCut && phase === "charging" && (
              <motion.div 
                style={{ opacity: guideOpacity }}
                className="absolute -top-24 inset-x-0 z-50 flex flex-col items-center pointer-events-none"
              >
                {/* Flecha apuntando a la línea verde */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="text-secondary"
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 11l5-5 5 5M12 6v12" />
                  </svg>
                </motion.div>
                
                <p className="text-white font-black text-xs uppercase tracking-[0.25em] bg-black/60 px-5 py-2 rounded-full border border-white/10 shadow-lg">
                  Corta aquí para abrir
                </p>
                
                {/* Línea de termosellado visual VERDE OSCURO BRILLANTE */}
                <motion.div 
                  className="w-72 h-px bg-verde-oscuro mt-14 border-t border-dashed border-verde-oscuro/50 shadow-[0_0_15px_hsl(160,30%,20%)]" 
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>
            )}

            {/* BOTÓN VOLVER (Esquina superior derecha) */}
            {(phase === "charging" || phase === "exploding") && (
              <button 
                onClick={() => { setIsCut(false); setPhase("idle"); }} 
                className="absolute -top-12 -right-12 z-50 flex items-center gap-2 p-3 rounded-full text-white hover:text-secondary hover:bg-white/10 transition-all shadow-xl"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest">TECLA ESCAPE / VOLVER</span>
              </button>
            )}

            {/* 2. EL SOBRE: Dividido en dos piezas con física de corte */}
            <motion.div
              ref={sobreRef}
              className="relative w-full h-full cursor-grab active:cursor-grabbing"
              style={{ perspective: "1500px", rotateX, rotateY, transformStyle: "preserve-3d" }}
              
              // GESTOS DE ARRASTRE (Corte) con un solo clic
              drag={phase === "charging" && !isCut}
              dragConstraints={sobreRef}
              dragElastic={0.06} // Pequeña elasticidad
              onDrag={handleDrag} // Dispara sonido y detección
              onDragStart={() => sound.playWindUp()}
            >
              {/* PIEZA DE ARRIBA (La que sale volando) */}
              <motion.div
                className="absolute inset-0 z-30 pointer-events-none"
                style={{ 
                  clipPath: "inset(0 0 88% 0)", // Solo muestra el 12% superior
                  x: isCut ? 150 : 0
                }}
                animate={isCut ? { 
                  y: -500, 
                  rotate: 55, 
                  opacity: 0 
                } : { y: 0 }}
                transition={{ type: "spring", stiffness: 40 }}
              >
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
              </motion.div>

              {/* PIEZA DE ABAJO (La que se queda) */}
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{ clipPath: "inset(12% 0 0 0)" }} // Muestra el resto del sobre
                animate={isCut ? { y: 25, scale: 0.96, filter: 'blur(2px)' } : { y: 0 }}
              >
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
              </motion.div>

              {/* 3. EFECTO DE LUCES (Según Rareza) Detrás del sobre */}
              {isCut && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 1, 0.4], scale: [1, 2.2, 2.8] }}
                  transition={{ duration: 1.2, delay: 0.1 }}
                  className="absolute inset-0 z-10 blur-[120px] rounded-full pointer-events-none"
                  style={{ backgroundColor: glowColor }}
                />
              )}
            </motion.div>

            {/* Partículas de luz emergiendo del corte */}
            {isCut && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, boxShadow: `0 -10px 100px 30px ${glowColor}` }}
                className="absolute top-[12%] left-1/2 -translate-x-1/2 w-full h-3 shadow-lg z-40 pointer-events-none"
                style={{ color: glowColor }}
              />
            )}
          </div>
        )}

        {/* REVELACIÓN FINAL DEL PREMIO */}
        {phase === "revealed" && (
          <motion.div 
            initial={{ y: 60, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="text-center"
          >
            <div className={`inline-block px-12 py-3 rounded-full mb-10 font-black text-xl shadow-[0_0_60px_rgba(255,255,255,0.15)] ${rarity.color} ${rarity.textColor}`}>
              {rarity.name}
            </div>
            <h2 className="text-7xl font-serif font-bold text-white mb-16 leading-tight drop-shadow-lg">
              {reward}
            </h2>
            <button 
              onClick={() => { setIsCut(false); setPhase("idle"); }} 
              className="px-16 py-6 bg-white text-black font-black rounded-full text-xl hover:scale-110 active:scale-95 transition-all shadow-xl uppercase tracking-tighter"
            >
              CULTIVAR PREMIO
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
