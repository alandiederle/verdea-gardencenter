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

  const onDragSobre = useCallback((_: any, info: any) => {
    if (phase !== "idle") return;
    const velocity = Math.abs(info.velocity.x) + Math.abs(info.velocity.y);
    const offset = Math.abs(info.offset.x) + Math.abs(info.offset.y);

    if (velocity > 200 && offset > 80) {
      const idx = rollRarity();
      const r = rarities[idx];
      setResultIdx(idx);
      setReward(pickReward(r));
      setPhase("charging");
      sound.playChargeUp();
      
      dragX.set(0);
      dragY.set(0);

      setTimeout(() => setPhase("exploding"), 1200);
      setTimeout(() => {
        setPhase("revealed");
        sound.playReveal(idx);
        setDiscoveries(prev => [...prev, { rarity: r, reward: pickReward(r), timestamp: Date.now() }]);
      }, 2200);
    }
  }, [phase, sound, dragX, dragY]);

  return (
    <section id="sobres" className="py-24 bg-muted/30 overflow-hidden">
      <OpeningOverlay phase={phase} rarity={rarities[resultIdx]} reward={reward} onClose={() => setPhase("idle")} />
      
      <div ref={ref} className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16 max-w-5xl mx-auto">
          <div className="flex-1 flex flex-col items-center w-full">
            <button onClick={() => setSoundOn(!soundOn)} className="self-end mb-4">
              {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            <motion.div
              ref={sobreRef}
              className="relative w-72 aspect-[2/3] cursor-grab active:cursor-grabbing"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              drag={phase === "idle"}
              dragConstraints={sobreRef}
              dragElastic={0.1}
              onDrag={onDragSobre}
              onDragStart={() => sound.playWindUp()}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img src="/images/sobre-verdie.png" className="w-full h-full object-contain drop-shadow-2xl pointer-events-none" alt="Sobre" />
            </motion.div>
            <p className="mt-8 font-serif text-2xl font-bold text-secondary text-center">Sobre de Cultivo</p>
            <p className="text-sm text-muted-foreground italic mt-2">"Corta el sobre para descubrir"</p>
          </div>

          <div className="flex-1 w-full space-y-4">
            <h3 className="font-serif text-xl font-bold mb-4">Probabilidades</h3>
            {rarities.map((r) => (
              <div key={r.name} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                <div className="w-3 h-3 rounded-full" style={{ background: `hsl(${r.glowHsl})` }} />
                <span className="text-sm font-bold flex-1 uppercase">{r.name}</span>
                <span className="text-xs opacity-60">{r.label}</span>
              </div>
            ))}
          </div>
        </div>
        <DiscoveryGallery discoveries={discoveries} />
      </div>
    </section>
  );
}
