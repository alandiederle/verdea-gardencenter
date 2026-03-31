import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useSobreSound } from "./useSobreSound";
import type { Rarity } from "./rarities";
import { X } from "lucide-react";

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
  
  // Opacidad de la guía visual: desaparece cuando empiezas a cortar
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

  // FUNCIÓN CLAVE: Gesto de corte (arrastre) con un solo clic
  const handleDrag = useCallback((event: any, info: any) => {
    if (isCut || phase !== "charging") return;

    const velocity = Math.abs(info.velocity.x) + Math.abs(info.velocity.y);
    const offsetMagnitude = Math.abs(info.offset.x) + Math.abs(info.offset.y);

    if (velocity > 350 && offsetMagnitude > 120) {
      setIsCut(true);
      sound.playReveal(rarity.tier);

      setPhase("exploding");
      
      setTimeout(() => {
        setPhase("revealed");
        addDiscovery({ rarity, reward, timestamp: Date.now() });
      }, 1200);
    }
  }, [isCut, phase, sound, setPhase, rarity, reward, addDiscovery]);

  const glowColor = `hsl(${rarity?.glowHsl || '140, 50%, 50%'})`;

  if (phase === "idle") return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden">

      {/* BOTÓN VOLVER / ESCAPE — Esquina superior derecha */}
      <button 
        onClick={() => { setIsCut(false); setPhase("idle"); }} 
        className="fixed top-6 right-6 z-[120] flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
      >
        <X size={18} />
        <span className="text-xs font-bold uppercase tracking-widest">Volver</span>
      </button>

      <AnimatePresence>
        {(phase === "charging" || phase === "exploding") && (
          <div className="relative flex flex-col items-center">

            {/* Encabezado: "RITUAL DE APERTURA" — bien arriba, separado */}
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/70 font-serif text-lg font-bold tracking-[0.3em] uppercase mb-12"
            >
              Ritual de Apertura
            </motion.p>

            {/* Contenedor del sobre */}
            <div className="relative w-80 aspect-[2/3]">

              {/* EL SOBRE: Dividido en dos piezas con física de corte */}
              <motion.div
                ref={sobreRef}
                className="relative w-full h-full cursor-grab active:cursor-grabbing"
                style={{ perspective: "1500px", rotateX, rotateY, transformStyle: "preserve-3d" }}
                drag={phase === "charging" && !isCut}
                dragConstraints={sobreRef}
                dragElastic={0.06}
                onDrag={handleDrag}
                onDragStart={() => sound.playWindUp()}
              >
                {/* PIEZA DE ARRIBA (La que sale volando) */}
                <motion.div
                  className="absolute inset-0 z-30 pointer-events-none"
                  style={{ clipPath: "inset(0 0 88% 0)", x: isCut ? 150 : 0 }}
                  animate={isCut ? { y: -500, rotate: 55, opacity: 0 } : { y: 0 }}
                  transition={{ type: "spring", stiffness: 40 }}
                >
                  <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
                </motion.div>

                {/* PIEZA DE ABAJO (La que se queda) */}
                <motion.div
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{ clipPath: "inset(12% 0 0 0)" }}
                  animate={isCut ? { y: 25, scale: 0.96, filter: 'blur(2px)' } : { y: 0 }}
                >
                  <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="" />
                </motion.div>

                {/* EFECTO DE LUCES (Según Rareza) Detrás del sobre */}
                {isCut && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: [0, 1, 0.4], scale: [1, 2.2, 2.8] }}
                    transition={{ duration: 1.2, delay: 0.1 }}
                    className="absolute inset-0 -z-10 blur-[120px] rounded-full pointer-events-none"
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

            {/* GUÍA VISUAL: Línea de corte + flecha + texto — DEBAJO del sobre */}
            {!isCut && phase === "charging" && (
              <motion.div 
                style={{ opacity: guideOpacity }}
                className="mt-6 flex flex-col items-center pointer-events-none z-50"
              >
                {/* Línea de corte verde grande y visible */}
                <motion.div 
                  className="w-80 h-1 rounded-full bg-secondary shadow-[0_0_20px_hsl(var(--secondary)),0_0_40px_hsl(var(--secondary)/0.4)]" 
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />

                {/* Flecha apuntando ABAJO hacia la línea */}
                <motion.div 
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="text-secondary mt-3"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </motion.div>

                <p className="mt-2 text-secondary font-black text-sm uppercase tracking-[0.2em]">
                  Arrastrá para cortar
                </p>
              </motion.div>
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
            <h2 className="text-7xl font-serif font-bold text-white mb-16 leading-tight drop-shadow-lg leading-tight">
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
