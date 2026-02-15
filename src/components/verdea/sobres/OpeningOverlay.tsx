import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Rarity } from "./rarities";

interface Props {
  phase: "idle" | "charging" | "exploding" | "revealed";
  rarity: Rarity;
  reward: string;
  onClose: () => void;
}

const LEAF = "M12 2C8 6 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z";

/* ── Ray burst lines ── */
function Rays({ color, count = 8 }: { color: string; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i;
        return (
          <motion.div
            key={`ray-${i}`}
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{
              width: 2,
              height: 80,
              marginLeft: -1,
              marginTop: -80,
              rotate: `${angle}deg`,
              background: `linear-gradient(to top, ${color}, transparent)`,
            }}
            initial={{ scaleY: 0, opacity: 0.6 }}
            animate={{ scaleY: [0, 1, 0], opacity: [0.6, 0.3, 0] }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 + i * 0.03 }}
          />
        );
      })}
    </>
  );
}

/* ── Particle system ── */
function Particles({ tier }: { tier: number }) {
  const count = 14 + tier * 8;
  const hue = tier >= 4 ? "43,55%,65%" : tier >= 3 ? "43,50%,60%" : tier >= 2 ? "340,40%,70%" : "147,35%,55%";
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i + Math.random() * 25;
        const dist = 100 + Math.random() * 220;
        const size = 2.5 + Math.random() * 5;
        const dur = 1 + Math.random() * 1.2;
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.div
            key={`p-${i}`}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              background: `hsl(${hue})`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.3 }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              opacity: 0,
              scale: tier >= 4 ? 2.5 : 1.5,
            }}
            transition={{ duration: dur, ease: "easeOut" }}
          />
        );
      })}

      {/* Floating leaves */}
      {Array.from({ length: 5 + tier * 3 }).map((_, i) => {
        const x = -120 + Math.random() * 240;
        const y = -180 - Math.random() * 120;
        const rot = Math.random() * 400;
        const leafSize = 12 + Math.random() * 10;
        return (
          <motion.svg
            key={`leaf-${i}`}
            className="absolute left-1/2 top-1/2"
            width={leafSize}
            height={leafSize}
            viewBox="0 0 24 24"
            fill={tier >= 4 ? "hsl(43,50%,55%)" : tier >= 2 ? "hsl(340,35%,60%)" : "hsl(147,35%,50%)"}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 0.9 }}
            animate={{ x, y, rotate: rot, opacity: 0 }}
            transition={{ duration: 2.2 + Math.random() * 0.8, ease: "easeOut", delay: 0.05 + Math.random() * 0.2 }}
          >
            <path d={LEAF} />
          </motion.svg>
        );
      })}

      {/* Halo ring for tier 3+ */}
      {tier >= 3 && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            width: 60,
            height: 60,
            borderColor: `hsl(${hue} / 0.6)`,
          }}
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 6, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      )}
    </>
  );
}

export default function OpeningOverlay({ phase, rarity, reward, onClose }: Props) {
  const [showPrize, setShowPrize] = useState(false);

  useEffect(() => {
    if (phase === "revealed") {
      const t = setTimeout(() => setShowPrize(true), 400);
      return () => clearTimeout(t);
    }
    setShowPrize(false);
  }, [phase]);

  if (phase === "idle") return null;

  const glowColor = `hsl(${rarity.glowHsl})`;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-foreground/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          onClick={phase === "revealed" ? onClose : undefined}
        />

        {/* Center container */}
        <div className="relative z-10 flex flex-col items-center">

          {/* ── CHARGING ── 3D Sobre vibrating & glowing */}
          {phase === "charging" && (
            <motion.div
              className="relative w-56 h-72 sm:w-64 sm:h-80"
              style={{ perspective: "600px" }}
            >
              <motion.div
                className="w-full h-full rounded-[1.4rem] border-2 border-border/60 flex items-center justify-center overflow-hidden"
                style={{
                  background: `linear-gradient(170deg, hsl(var(--card)), hsl(var(--muted) / 0.6))`,
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  x: [0, -3, 3, -2, 2, 0],
                  rotateZ: [0, -0.5, 0.5, -0.3, 0.3, 0],
                  boxShadow: [
                    `0 0 20px hsl(${rarity.glowHsl} / 0.05)`,
                    `0 0 50px hsl(${rarity.glowHsl} / 0.35)`,
                    `0 0 100px hsl(${rarity.glowHsl} / 0.6)`,
                  ],
                }}
                transition={{
                  x: { repeat: Infinity, duration: 0.12, ease: "easeInOut" },
                  rotateZ: { repeat: Infinity, duration: 0.14, ease: "easeInOut" },
                  boxShadow: { duration: 1.8, ease: "easeIn" },
                }}
              >
                {/* Holographic sweep during charge */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(115deg, transparent 20%, hsl(${rarity.glowHsl} / 0.15) 45%, transparent 80%)`,
                    backgroundSize: "200% 100%",
                  }}
                  animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner energy orb */}
                <motion.div
                  className="w-20 h-20 rounded-full"
                  style={{ background: `radial-gradient(circle, ${glowColor}, transparent)` }}
                  animate={{ scale: [0.6, 1.6, 0.6], opacity: [0.2, 0.9, 0.2] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          )}

          {/* ── EXPLODING ── */}
          {phase === "exploding" && (
            <div className="relative">
              {/* Central flash */}
              <motion.div
                className="w-40 h-40 rounded-full"
                style={{ background: `radial-gradient(circle, ${glowColor}, hsl(${rarity.glowHsl} / 0.3) 50%, transparent)` }}
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              />
              {/* Rays for tier 2+ */}
              {rarity.tier >= 2 && <Rays color={glowColor} count={rarity.tier >= 4 ? 12 : 8} />}
              <Particles tier={rarity.tier} />
            </div>
          )}

          {/* ── REVEALED ── */}
          {phase === "revealed" && showPrize && (
            <motion.div
              className="flex flex-col items-center gap-6 px-6"
              initial={{ scale: 0.7, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Glow ring */}
              <motion.div
                className="absolute w-72 h-72 rounded-full -z-10"
                style={{ background: `radial-gradient(circle, hsl(${rarity.glowHsl} / 0.2) 0%, transparent 70%)` }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />

              {/* Tier badge */}
              <motion.div
                className={`px-6 py-2.5 rounded-full text-sm font-sans font-semibold ${rarity.color} ${rarity.textColor} shadow-lg`}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: [0, -5, 0], opacity: 1 }}
                transition={{ y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }, opacity: { duration: 0.4 } }}
              >
                {rarity.name}
              </motion.div>

              {/* Probability */}
              <span className="text-primary-foreground/40 font-sans text-xs tracking-wide">
                Rareza {rarity.label}
              </span>

              {/* "Te tocó:" */}
              <p className="text-primary-foreground/70 font-sans text-sm tracking-wide uppercase">
                Te tocó
              </p>

              {/* Reward */}
              <motion.h3
                className="font-serif text-2xl sm:text-3xl font-bold text-primary-foreground text-center max-w-xs leading-tight"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.3 }}
              >
                {reward}
              </motion.h3>

              {/* CTA */}
              <motion.button
                className="mt-4 px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-sans font-semibold text-sm
                  hover:bg-secondary/90 transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
              >
                Guardar en mi jardín
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
