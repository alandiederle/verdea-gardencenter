import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { rarities, rollRarity, pickReward } from "./sobres/rarities";
import { useSobreSound } from "./sobres/useSobreSound";
import OpeningOverlay from "./sobres/OpeningOverlay";
import DiscoveryGallery, { type Discovery } from "./sobres/DiscoveryGallery";

type Phase = "idle" | "charging" | "exploding" | "revealed";

/* Leaf SVG inline */
const LeafIcon = ({ size = 44, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2C8 6 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z" fill="currentColor" opacity="0.12" />
    <path d="M12 2C8 6 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 22V8" stroke="currentColor" strokeWidth="1" opacity="0.35" />
    <path d="M8 16c2-2 4-4 4-8" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
    <path d="M16 16c-2-2-4-4-4-8" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
  </svg>
);

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
            Recibís sobres digitales con recompensas inesperadas. Abrilos y descubrí qué florece.
          </motion.p>
        </div>

        {/* Sobre + Rewards columns */}
        <div className="flex flex-col lg:flex-row items-center gap-20 max-w-5xl mx-auto">

          {/* ──── 3D COLLECTIBLE SOBRE ──── */}
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

            {/* 3D Pack container */}
            <div
              className="relative cursor-pointer group"
              style={{ perspective: "900px" }}
              onClick={openSobre}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Ambient glow */}
              <motion.div
                className="absolute -inset-6 rounded-[2rem] pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center, hsl(var(--secondary) / 0.12), transparent 70%)",
                }}
                animate={{
                  scale: isHovering ? 1.15 : 1,
                  opacity: isHovering ? 1 : 0.5,
                }}
                transition={{ duration: 0.6 }}
              />

              {/* Main 3D card */}
              <motion.div
                className="relative w-60 h-[22rem] sm:w-72 sm:h-[26rem] overflow-hidden"
                animate={{
                  rotateY: isHovering ? -5 : [0, 1.5, -1.5, 0],
                  rotateX: isHovering ? 3 : [0, -1, 1, 0],
                }}
                transition={
                  isHovering
                    ? { duration: 0.4, ease: "easeOut" }
                    : { repeat: Infinity, duration: 7, ease: "easeInOut" }
                }
                style={{ transformStyle: "preserve-3d" }}
                whileTap={{ scale: 0.97 }}
              >
                {/* ── Back face shadow ── */}
                <div
                  className="absolute inset-0 rounded-[1.4rem] pointer-events-none"
                  style={{
                    transform: "translateZ(-4px)",
                    background: "hsl(var(--foreground) / 0.08)",
                    filter: "blur(8px)",
                  }}
                />

                {/* ── Card body ── */}
                <div
                  className="relative w-full h-full rounded-[1.4rem] flex flex-col items-center justify-center gap-5 p-8"
                  style={{
                    background: `
                      linear-gradient(170deg,
                        hsl(var(--card)) 0%,
                        hsl(var(--card)) 40%,
                        hsl(var(--muted) / 0.6) 100%)
                    `,
                    border: "1.5px solid hsl(var(--border))",
                    boxShadow: `
                      0 20px 50px -12px hsl(var(--foreground) / 0.1),
                      0 4px 16px -4px hsl(var(--foreground) / 0.06),
                      inset 0 1px 0 hsl(0 0% 100% / 0.06)
                    `,
                    transform: "translateZ(0)",
                  }}
                >
                  {/* Foil / holographic sheen */}
                  <motion.div
                    className="absolute inset-0 rounded-[1.4rem] pointer-events-none"
                    style={{
                      background: `linear-gradient(
                        115deg,
                        transparent 30%,
                        hsl(var(--secondary) / 0.06) 45%,
                        hsl(var(--accent) / 0.08) 50%,
                        hsl(var(--secondary) / 0.06) 55%,
                        transparent 70%
                      )`,
                      backgroundSize: "200% 200%",
                    }}
                    animate={{
                      backgroundPosition: isHovering
                        ? ["0% 0%", "100% 100%"]
                        : "0% 0%",
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />

                  {/* Botanical texture */}
                  <div
                    className="absolute inset-0 rounded-[1.4rem] opacity-[0.025] pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 8C28 20 16 32 16 44c0 13.2 10.8 24 24 24s24-10.8 24-24C64 32 52 20 40 8z' fill='%23000' fill-opacity='0.5'/%3E%3C/svg%3E")`,
                      backgroundSize: "50px 50px",
                    }}
                  />

                  {/* Top edge accent */}
                  <div className="absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

                  {/* ── Emblem ── */}
                  <div className="relative">
                    <motion.div
                      className="w-28 h-28 rounded-full flex items-center justify-center"
                      style={{
                        background: `radial-gradient(circle at 40% 35%, hsl(var(--secondary) / 0.15), hsl(var(--secondary) / 0.04) 70%)`,
                        border: "1px solid hsl(var(--secondary) / 0.12)",
                      }}
                      animate={{ scale: isHovering ? 1.06 : 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <LeafIcon size={48} className="text-secondary" />
                    </motion.div>

                    {/* Floating sparkles */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent"
                      animate={{ opacity: [0, 1, 0], scale: [0.4, 1.1, 0.4], y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute -bottom-0.5 -left-2 w-1.5 h-1.5 rounded-full bg-secondary/60"
                      animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 1 }}
                    />
                  </div>

                  {/* Label */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="font-serif text-xl sm:text-2xl text-foreground font-bold tracking-tight">
                      Sobre de Crecimiento
                    </span>
                    <span className="text-[10px] text-muted-foreground/50 font-sans uppercase tracking-[0.2em]">
                      Verdie · Edición botánica
                    </span>
                  </div>

                  {/* CTA */}
                  <AnimatePresence>
                    {isHovering && (
                      <motion.span
                        className="text-sm text-secondary font-sans font-medium"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.25 }}
                      >
                        Tocá para descubrir
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!isHovering && (
                    <span className="text-sm text-muted-foreground font-sans">
                      Tocá para descubrir
                    </span>
                  )}

                  {/* Bottom ornament */}
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

                  {/* Bottom edge accent */}
                  <div className="absolute bottom-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
              </motion.div>
            </div>

            <p className="text-center text-sm text-muted-foreground font-sans mt-10 italic">
              "La suerte también florece."
            </p>
          </motion.div>

          {/* ──── Possible Rewards ──── */}
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
                whileHover={{ x: 4 }}
              >
                <div
                  className="w-3 h-3 rounded-full mt-1.5 shrink-0 transition-transform group-hover:scale-125"
                  style={{ background: `hsl(${r.glowHsl})` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-serif font-semibold text-foreground text-sm">{r.name}</span>
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

        {/* Discovery Gallery */}
        <DiscoveryGallery discoveries={discoveries} />
      </div>
    </section>
  );
}
