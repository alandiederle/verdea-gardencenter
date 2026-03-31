import { useState, useCallback, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
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
  
  const sobreRef = useRef<HTMLDivElement>(null);
  const sound = useSobreSound(soundOn);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const rotateX = useTransform(dragY, [-100, 100], [15, -15]);
  const rotateY = useTransform(dragX, [-100, 100], [-15, 15]);

  // CORREGIDO: Gesto de corte con un solo clic y arrastre rápido (Swipe)
  const onDragSobre = useCallback((_: any, info: any) => {
    if (phase !== "idle") return;
    
    // Calculamos la magnitud del movimiento (velocidad y offset acumulado)
    const velocity = Math.abs(info.velocity.x) + Math.abs(info.velocity.y);
    const offsetAccumulated = Math.abs(info.offset.x) + Math.abs(info.offset.y);

    // LÓGICA DE DETECCION DEL SWIPE RÁPIDO Y LARGO (con un solo clic)
    if (velocity > 380 && offsetAccumulated > 100) {
      const idx = rollRarity();
      const r = rarities[idx];
      setResultIdx(idx);
      setReward(pickReward(r));
      setPhase("charging");
      
      // EL SONIDO DEL "TRACCC" INTERACTIVO
      sound.playChargeUp(); 
      
      dragX.set(0);
      dragY.set(0);

      // Sincronización de la explosión
      setTimeout(() => setPhase("exploding"), 1200);
      setTimeout(() => {
        setPhase("revealed");
        sound.playReveal(idx);
        setDiscoveries(prev => [...prev, { rarity: r, reward: pickReward(r), timestamp: Date.now() }]);
      }, 2300);
    }
  }, [phase, sound, dragX, dragY]);

  const closeOverlay = () => setPhase("idle");

  return (
    <section id="sobres" className="py-24 bg-muted/30 relative overflow-hidden">
      <OpeningOverlay phase={phase} setPhase={setPhase} rarity={rarities[resultIdx]} reward={reward} soundOn={soundOn} addDiscovery={(d) => setDiscoveries(prev => [...prev, d])} />
      
      <div ref={ref} className="container mx-auto px-4">
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
            Recibís sobres digitales. Hacé un corte rápido con el mouse para descubrir qué florece.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 max-w-5xl mx-auto">
          {/* ──── VISTA PREVIA DEL SOBRE INTERACTIVO ──── */}
          <motion.div
            className="flex-1 flex flex-col items-center w-full"
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="w-full max-w-[320px] flex flex-col items-center">
              <button onClick={() => setSoundOn(!soundOn)} className="self-end mb-4">
                {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>

              <motion.div
                ref={sobreRef}
                className="relative w-full aspect-[2/3] cursor-grab active:cursor-grabbing"
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                
                // GESTOS DE ARRASTRE (Corte) con un solo clic
                drag={phase === "idle"}
                dragConstraints={sobreRef}
                dragElastic={0.06}
                onDrag={onDragSobre}
                onDragStart={() => sound.playWindUp()}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <img src="/images/sobre-verdie.png" className="w-full h-full object-contain drop-shadow-2xl pointer-events-none" alt="Sobre" />
              </motion.div>
            </div>
            <div className="text-center mt-12 space-y-2">
              <p className="text-secondary font-serif text-2xl font-bold">Sobre de Cultivo</p>
              <p className="text-sm text-muted-foreground italic mt-2">"Desliza rápido para cortar"</p>
            </div>
          </motion.div>

          <div className="flex-1 w-full space-y-4">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
              Probabilidades
            </h3>
            {rarities.map((r) => (
              <div key={r.name} className="flex items-start gap-4 p-4 bg-card rounded-2xl border border-border">
                <div className="w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 transition-transform group-hover:scale-125" style={{ background: `hsl(${r.glowHsl})` }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-serif font-bold text-foreground text-sm uppercase tracking-wider">{r.name}</span>
                    <span className="text-[10px] font-sans font-medium text-muted-foreground opacity-60">{r.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans mt-1 leading-relaxed italic">
                    {r.rewards.slice(0, 2).join(" · ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DiscoveryGallery discoveries={discoveries} />
      </div>
    </section>
  );
}
