import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { rarities, rollRarity, pickReward } from "./sobres/rarities";
import { useSobreSound } from "./sobres/useSobreSound";
import OpeningOverlay from "./sobres/OpeningOverlay";
import DiscoveryGallery, { type Discovery } from "./sobres/DiscoveryGallery";

type Phase = "idle" | "charging" | "exploding" | "revealed";

export default function Tickets() {
  const { ref, isVisible } = useScrollAnimation();
  const [phase, setPhase] = useState<Phase>("idle");
  const [resultIdx, setResultIdx] = useState(0);
  const [reward, setReward] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  
  // Referencia al contenedor del sobre para calcular el corte
  constsobreRef = useRef<HTMLDivElement>(null);

  // Motor de sonido interactivo granular
  const sound = useSobreSound(soundOn);

  // Framer Motion Values para el gesto de corte (arrastre)
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  
  // Transformaciones visuales para que el sobre se incline con el corte
  const rotateX = useTransform(dragY, [-100, 100], [15, -15]);
  const rotateY = useTransform(dragX, [-100, 100], [-15, 15]);

  const rarity = rarities[resultIdx];

  // FUNCIÓN PARA DISPARAR EL SONIDO SEGÚN EL MOVIMIENTO
  const onDrag Sobre = useCallback((event: any, info: any) => {
    if (phase !== "idle") return;

    // Calculamos la magnitud del movimiento (velocidad del corte)
    const velocity = Math.abs(info.velocity.x) + Math.abs(info.velocity.y);
    
    // Si hay movimiento significativo, disparamos un micro-rasgado (un "traccc")
    if (velocity > 5) {
      // El tono del rasgado sube si el corte es más rápido (6000Hz a 10000Hz)
      const pitchFreq = Math.min(6000 + velocity * 10, 10000);
      sound.playMicroCut(pitchFreq);
    }
    
    // LÓGICA DE DETECCION DEL CORTE FINAL
    // Si el usuario hace un swipe rápido y largo (un corte), se abre el sobre.
    // Usamos el offset acumulado para asegurar que sea un gesto intencional
    const offsetMagnitude = Math.abs(info.offset.x) + Math.abs(info.offset.y);

    if (velocity > 180 && offsetMagnitude > 70) {
      const idx = rollRarity();
      const r = rarities[idx];
      const prize = pickReward(r);
      
      setResultIdx(idx);
      setReward(prize);
      setPhase("charging"); // Estado vibrante antes de la explosión
      
      // Resetear valores de arrastre
      dragX.set(0);
      dragY.set(0);

      // Sincronización de la explosión (más rápida al ser interactivo)
      setTimeout(() => setPhase("exploding"), 1100);
      setTimeout(() => {
        setPhase("revealed");
        sound.playReveal(idx);
        setDiscoveries((prev) => [...prev, { rarity: r, reward: prize, timestamp: Date.now() }]);
      }, 2000);
    }
  }, [phase, sound, dragX, dragY]);

  const closeOverlay = () => setPhase("idle");

  return (
    <section id="sobres" className="py-28 lg:py-36 bg-muted/30 relative overflow-hidden">
      <OpeningOverlay phase={phase} rarity={rarity} reward={reward} onClose={closeOverlay} />

      <div ref={ref} className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-5 leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            Cada compra hace crecer algo nuevo.
          </motion.h2>
          <motion.p
            className="text-lg font-sans text-muted-foreground max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Recibís sobres digitales. Hacé un corte con el mouse para descubrir qué florece.
          </motion.p>
        </div>

        {/* Sobre + Rewards columns */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 max-w-5xl mx-auto">

          {/* ──── VISTA PREVIA DEL SOBRE INTERACTIVO (Gesto de Corte) ──── */}
          <motion.div
            className="flex-1 flex flex-col items-center w-full"
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="w-full max-w-[320px] flex flex-col items-center">
              {/* Sound toggle */}
              <button
                onClick={() => setSoundOn(!soundOn)}
                className="self-end mb-6 p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* Contenedor del Sobre para Gestos */}
              <motion.div
                ref={sobreRef}
                className="relative w-full aspect-[2/3] cursor-grab active:cursor-grabbing"
                style={{ 
                  perspective: "1500px",
                  rotateX: phase === "idle" ? rotateX : 0, // Solo rota en idle
                  rotateY: phase === "idle" ? rotateY : 0,
                  transformStyle: "preserve-3d" 
                }}
                
                // GESTOS DE ARRASTRE (Corte)
                drag={phase === "idle"} // Solo arrastrable en idle
                dragConstraints={sobreRef}
                dragElastic={0.06} // Pequeña elasticidad
                onDrag={onDragSobre} // Dispara sonido y detección
                onDragStart={() => sound.playWindUp()}
                onDragEnd={() => { dragX.set(0); dragY.set(0); }} // Resetear posición visual
                
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Aura ambiental */}
                <motion.div
                  className="absolute -inset-10 rounded-full blur-3xl pointer-events-none"
                  style={{ background: "radial-gradient(circle, hsl(var(--secondary) / 0.2), transparent 70%)" }}
                  animate={{ scale: isHovering ? 1.2 : 1, opacity: isHovering ? 0.8 : 0.4 }}
                />

                {/* IMAGEN AL 100% (Vertical) */}
                <img 
                  src="/images/sobre-verdie.png" 
                  alt="Sobre Verdie"
                  className="w-full h-full object-contain drop-shadow-2xl pointer-events-none" // pointer-events-none para que el drag funcione en el div
                />
              </motion.div>
            </div>

            <div className="text-center mt-12 space-y-2">
              <p className="text-secondary font-serif text-2xl font-bold">Sobre de Cultivo</p>
              <p className="text-sm text-muted-foreground italic">"La suerte también florece."</p>
              
              {/* Instrucción dinámica */}
              <motion.p
                className="text-sm text-secondary font-sans font-medium mt-6 uppercase tracking-wider"
                animate={{ opacity: phase === "idle" ? [0.4, 1, 0.4] : 0.2 }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                Deslizá rápido para cortar
              </motion.p>
            </div>
          </motion.div>

          {/* Posibles descubrimientos (Lista a la derecha) */}
          <div className="flex-1 w-full space-y-4">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Posibles descubrimientos
            </h3>
            {rarities.map((r, i) => (
              <motion.div
                key={r.name}
                className="group flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/50
                  hover:border-border hover:shadow-sm transition-all duration-300"
                whileHover={{ x: 6 }}
              >
                <div
                  className="w-4 h-4 rounded-full mt-1 shrink-0 transition-transform group-hover:scale-125"
                  style={{ background: `hsl(${r.glowHsl})` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2 leading-none">
                    <span className="font-serif font-semibold text-foreground text-sm uppercase">{r.name}</span>
                    <span className="text-[10px] font-sans font-medium text-muted-foreground opacity-60 tracking-wider">{r.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans mt-1 leading-relaxed italic">
                    {r.rewards.slice(0, 2).join(" · ")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <DiscoveryGallery discoveries={discoveries} />
      </div>
    </section>
  );
}
