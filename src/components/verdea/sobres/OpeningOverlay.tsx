import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Rarity } from "./rarities";

interface Props {
  phase: "idle" | "charging" | "exploding" | "revealed";
  rarity: Rarity;
  reward: string;
  onClose: () => void;
}

/* Leaf SVG path */
const LEAF = "M12 2C8 6 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z";

function Particles({ tier }: { tier: number }) {
  const count = 12 + tier * 6;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i + Math.random() * 20;
        const dist = 120 + Math.random() * 180;
        const size = 3 + Math.random() * 5;
        const dur = 1.2 + Math.random() * 1;
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.div
            key={`p-${i}`}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.5, background: `hsl(${tier >= 4 ? "43,55%,65%" : tier >= 2 ? "340,40%,70%" : "147,35%,55%"})` }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              opacity: 0,
              scale: 1.5,
            }}
            transition={{ duration: dur, ease: "easeOut" }}
          />
        );
      })}
      {/* Floating leaves */}
      {Array.from({ length: 4 + tier * 2 }).map((_, i) => {
        const x = -100 + Math.random() * 200;
        const y = -150 - Math.random() * 100;
        const rot = Math.random() * 360;
        return (
          <motion.svg
            key={`leaf-${i}`}
            className="absolute left-1/2 top-1/2"
            width={14 + Math.random() * 8}
            height={14 + Math.random() * 8}
            viewBox="0 0 24 24"
            fill={tier >= 4 ? "hsl(43,50%,55%)" : "hsl(147,35%,50%)"}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 0.8 }}
            animate={{ x, y, rotate: rot, opacity: 0 }}
            transition={{ duration: 2 + Math.random(), ease: "easeOut", delay: 0.1 + Math.random() * 0.3 }}
          >
            <path d={LEAF} />
          </motion.svg>
        );
      })}
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
          className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          onClick={phase === "revealed" ? onClose : undefined}
        />

        {/* Center container */}
        <div className="relative z-10 flex flex-col items-center">

          {/* Charging phase – glowing envelope */}
          {phase === "charging" && (
            <motion.div
              className="w-56 h-72 sm:w-64 sm:h-80 rounded-3xl border-2 border-border/50 bg-card flex items-center justify-center"
              animate={{
                x: [0, -2, 2, -1, 1, 0],
                boxShadow: [
                  `0 0 20px hsl(${rarity.glowHsl} / 0.1)`,
                  `0 0 60px hsl(${rarity.glowHsl} / 0.5)`,
                  `0 0 90px hsl(${rarity.glowHsl} / 0.7)`,
                ],
              }}
              transition={{
                x: { repeat: Infinity, duration: 0.15, ease: "easeInOut" },
                boxShadow: { duration: 1.8, ease: "easeIn" },
              }}
            >
              <motion.div
                className="w-16 h-16 rounded-full"
                style={{ background: `radial-gradient(circle, ${glowColor}, transparent)` }}
                animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
              />
            </motion.div>
          )}

          {/* Exploding phase – particles */}
          {phase === "exploding" && (
            <div className="relative">
              {/* Central flash */}
              <motion.div
                className="w-40 h-40 rounded-full"
                style={{ background: `radial-gradient(circle, ${glowColor}, transparent)` }}
                initial={{ scale: 0.3, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <Particles tier={rarity.tier} />
            </div>
          )}

          {/* Revealed phase – prize */}
          {phase === "revealed" && showPrize && (
            <motion.div
              className="flex flex-col items-center gap-6 px-6"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Glow ring */}
              <motion.div
                className="absolute w-64 h-64 rounded-full -z-10"
                style={{ background: `radial-gradient(circle, hsl(${rarity.glowHsl} / 0.25) 0%, transparent 70%)` }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />

              {/* Tier badge */}
              <motion.div
                className={`px-5 py-2 rounded-full text-sm font-sans font-semibold ${rarity.color} ${rarity.textColor}`}
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              >
                {rarity.name}
              </motion.div>

              {/* "Te tocó:" */}
              <p className="text-primary-foreground/70 font-sans text-sm tracking-wide uppercase">
                Te tocó
              </p>

              {/* Reward */}
              <motion.h3
                className="font-serif text-2xl sm:text-3xl font-bold text-primary-foreground text-center max-w-xs leading-tight"
                animate={{ y: [0, -3, 0] }}
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
