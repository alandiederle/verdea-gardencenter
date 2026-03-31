import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const sound = useSobreSound(soundOn);

  const rarity = rarities[resultIdx];

  const openSobre = useCallback(() => {
    if (phase !== "idle") return;
    const idx = rollRarity();
    const r = rarities[idx];
    const prize = pickReward(r);
    setResultIdx(idx);
    setReward(prize);

    setPhase("charging");
    sound.playWindUp();
    setTimeout(() => sound.playChargeUp(), 300);
    setTimeout(() => setPhase("exploding"), 2000);
    setTimeout(() => {
      setPhase("revealed");
      sound.playReveal(idx);
      setDiscoveries((prev) => [...prev, { rarity: r, reward: prize, timestamp: Date.now() }]);
    }, 3000);
  }, [phase, sound]);

  const closeOverlay = () => setPhase("idle");

  return (
    <section id="sobres" className="py-28 lg:py-36 bg-muted/30 relative overflow-hidden">
      <OpeningOverlay phase={phase} rarity={rarity} reward={reward} onClose={closeOverlay} />

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
          <p className="text-lg font-sans text-muted-foreground max-w-lg mx-auto">
            Recibís sobres digitales con recompensas inesperadas. Abrilos y descubrí qué florece.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 max-w-5xl mx-auto">
          {/* ──── VISTA PREVIA DEL SOBRE ──── */}
          <motion.div
            className="flex-1 flex flex-col items-center w-full"
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="w-full max-w-[320px] flex flex-col items-center">
              <button
                onClick={() => setSoundOn(!soundOn)}
                className="self-end mb-6 p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              <div
                className="relative cursor-pointer w-full aspect-[2/3]"
                style={{ perspective: "1200px" }}
                onClick={openSobre}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Aura */}
                <motion.div
                  className="absolute -inset-10 rounded-full blur-3xl"
                  style={{ background: "radial-gradient(circle, hsl(var(--secondary) / 0.2), transparent 70%)" }}
                  animate={{ scale: isHovering ? 1.2 : 1, opacity: isHovering ? 0.8 : 0.4 }}
                />

                {/* IMAGEN AL 100% */}
                <motion.div
                  className="w-full h-full"
                  animate={{ rotateY: isHovering ? -10 : 0, rotateX: isHovering ? 5 : 0 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src="/images/sobre-verdie.png" 
                    alt="Sobre Verdie"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </motion.div>
              </div>

              <div className="text-center mt-12">
                <p className="text-secondary font-serif text-2xl font-bold">Sobre de Cultivo</p>
                <p className="text-sm text-muted-foreground mt-2 italic">"La suerte también florece."</p>
              </div>
            </div>
          </motion.div>

          <div className="flex-1 w-full space-y-4">
            <h3 className="font-serif text-xl font-semibold mb-6">Posibles descubrimientos</h3>
            {rarities.map((r, i) => (
              <motion.div
                key={r.name}
                className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-border transition-all"
                whileHover={{ x: 6 }}
              >
                <div className="w-4 h-4 rounded-full mt-1" style={{ background: `hsl(${r.glowHsl})` }} />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-serif font-bold text-sm uppercase">{r.name}</span>
                    <span className="text-[10px] opacity-60">{r.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 italic">{r.rewards.slice(0, 2).join(" · ")}</p>
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
