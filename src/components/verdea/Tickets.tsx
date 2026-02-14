import { useState, useCallback } from "react";
import { motion } from "framer-motion";
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
  const sound = useSobreSound(soundOn);

  const rarity = rarities[resultIdx];

  const openSobre = useCallback(() => {
    if (phase !== "idle") return;

    const idx = rollRarity();
    const r = rarities[idx];
    const prize = pickReward(r);
    setResultIdx(idx);
    setReward(prize);

    // Phase 1 – charging (2 s)
    setPhase("charging");
    sound.playWindUp();
    setTimeout(() => sound.playChargeUp(), 300);

    // Phase 2 – exploding (1 s)
    setTimeout(() => setPhase("exploding"), 2000);

    // Phase 3 – revealed
    setTimeout(() => {
      setPhase("revealed");
      sound.playReveal(idx);
      setDiscoveries((prev) => [...prev, { rarity: r, reward: prize, timestamp: Date.now() }]);
    }, 3000);
  }, [phase, sound]);

  const closeOverlay = () => setPhase("idle");

  return (
    <section id="sobres" className="py-28 lg:py-36 bg-muted/30 relative overflow-hidden">
      {/* Opening overlay */}
      <OpeningOverlay phase={phase} rarity={rarity} reward={reward} onClose={closeOverlay} />

      <div ref={ref} className="container mx-auto px-4">
        {/* ─── Header ─── */}
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
            Recibís sobres digitales con recompensas inesperadas. Abrilos y descubrí qué florece.
          </motion.p>
        </div>

        {/* ─── Sobre + Rewards columns ─── */}
        <div className="flex flex-col lg:flex-row items-center gap-20 max-w-5xl mx-auto">
          {/* Sobre */}
          <motion.div
            className="flex-1 flex flex-col items-center"
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Sound toggle */}
            <button
              onClick={() => setSoundOn(!soundOn)}
              className="self-end mb-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
              aria-label={soundOn ? "Silenciar" : "Activar sonido"}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Envelope card */}
            <motion.div
              className="w-64 h-80 sm:w-72 sm:h-96 rounded-3xl border-2 border-border bg-card
                flex flex-col items-center justify-center gap-5 p-8 cursor-pointer
                hover:border-secondary/40 hover:shadow-xl transition-all duration-300"
              animate={{ scale: [1, 1.006, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              onClick={openSobre}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Leaf icon */}
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-secondary">
                  <path d="M12 2C8 6 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z" fill="currentColor" opacity="0.2" />
                  <path d="M12 2C8 6 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M12 22V8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                </svg>
              </div>
              <span className="font-serif text-xl text-foreground font-semibold">
                Sobre de Crecimiento
              </span>
              <span className="text-sm text-muted-foreground font-sans">
                Tocá para descubrir
              </span>
              <div className="w-12 h-0.5 bg-border rounded-full" />
            </motion.div>

            <p className="text-center text-sm text-muted-foreground font-sans mt-8 italic">
              "La suerte también florece."
            </p>
          </motion.div>

          {/* ─── Possible Rewards ─── */}
          <motion.div
            className="flex-1 space-y-4"
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Posibles descubrimientos
            </h3>
            <p className="text-sm text-muted-foreground font-sans mb-6">
              Cada sobre puede contener recompensas de distintas rarezas.
            </p>

            {rarities.map((r, i) => (
              <motion.div
                key={r.name}
                className="group flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/50
                  hover:border-border hover:shadow-sm transition-all duration-300"
                initial={{ opacity: 0, x: 20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
              >
                {/* Tier dot */}
                <div
                  className="w-3 h-3 rounded-full mt-1.5 shrink-0 transition-transform group-hover:scale-125"
                  style={{ background: `hsl(${r.glowHsl})` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-serif font-semibold text-foreground text-sm">
                      {r.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans mt-1 leading-relaxed">
                    {r.rewards.slice(0, 2).join(" · ")}
                  </p>
                </div>
              </motion.div>
            ))}

            <p className="text-[11px] text-muted-foreground/60 font-sans pt-3 italic">
              Probabilidades aproximadas disponibles dentro del sistema.
            </p>
          </motion.div>
        </div>

        {/* ─── Discovery Gallery ─── */}
        <DiscoveryGallery discoveries={discoveries} />
      </div>
    </section>
  );
}
