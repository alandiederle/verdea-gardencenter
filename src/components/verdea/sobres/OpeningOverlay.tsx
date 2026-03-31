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
              width: 2, height: 80, marginLeft: -1, marginTop: -80,
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

function Particles({ tier }: { tier: number }) {
  const count = 16 + tier * 10;
  const isLegendary = tier >= 4;
  const hue = isLegendary ? "45, 90%, 60%" : tier >= 2 ? "330, 45%, 65%" : "140, 30%, 50%";

  return (
    <>
      {/* Central Flash Glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ 
          width: 10, height: 10, 
          boxShadow: `0 0 ${isLegendary ? '180px 50px' : '100px 30px'} hsl(${hue} / 0.8)` 
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 25, opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i + Math.random() * 25;
        const dist = 120 + Math.random() * 250;
        const size = 3 + Math.random() * 6;
        const dur = 1.2 + Math.random() * 1.5;
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.div
            key={`p-${i}`}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
              background: `hsl(${hue})`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.3 }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              opacity: 0,
              scale: isLegendary ? 3 : 1.8,
            }}
            transition={{ duration: dur, ease: "easeOut" }}
          />
        );
      })}

      {/* Floating Leaves & Petals */}
      {Array.from({ length: 8 + tier * 4 }).map((_, i) => {
        const x = -150 + Math.random() * 300;
        const y = -200 - Math.random() * 150;
        const rot = Math.random() * 450;
        const leafSize = 14 + Math.random() * 12;
        return (
          <motion.svg
            key={`leaf-${i}`}
            className="absolute left-1/2 top-1/2"
            width={leafSize} height={leafSize} viewBox="0 0 24 24"
            fill={isLegendary ? "hsl(45,70%,60%)" : tier >= 2 ? "hsl(330,50%,65%)" : "hsl(140,35%,50%)"}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 0.9 }}
            animate={{ x, y, rotate: rot, opacity: 0 }}
            transition={{ duration: 2.5 + Math.random() * 1, ease: "easeOut", delay: Math.random() * 0.3 }}
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
      <motion.div className="fixed inset-0 z-[60] flex items-center justify-center">
        <motion.div
          className="absolute inset-0 bg-foreground/80 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={phase === "revealed" ? onClose : undefined}
        />

        <div className="relative z-10 flex flex-col items-center">
          {phase === "charging" && (
            <motion.div
              className="relative w-64 h-80"
              style={{ perspective: "1000px" }}
              animate={{ 
                scale: [1, 0.94, 1.05],
                rotateZ: [0, -1, 1, 0],
                boxShadow: [`0 0 20px ${glowColor}22`, `0 0 80px ${glowColor}66`]
              }}
              transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
            >
              <div className="w-full h-full rounded-[2rem] border-2 border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm flex items-center justify-center">
                 <motion.div
                  className="w-24 h-24 rounded-full"
                  style={{ background: `radial-gradient(circle, ${glowColor}, transparent)` }}
                  animate={{ scale: [0.8, 1.8], opacity: [0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5, repeatType: "reverse" }}
                />
              </div>
            </motion.div>
          )}

          {phase === "exploding" && (
            <div className="relative">
              <Particles tier={rarity.tier} />
              {rarity.tier >= 2 && <Rays color={glowColor} count={rarity.tier >= 4 ? 16 : 10} />}
            </div>
          )}

          {phase === "revealed" && showPrize && (
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className={`px-8 py-3 rounded-full text-lg font-serif font-bold ${rarity.color} ${rarity.textColor} shadow-2xl`}>
                {rarity.name}
              </div>
              <h3 className="font-serif text-4xl font-bold text-white text-center max-w-md">{reward}</h3>
              <button className="mt-8 px-10 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform" onClick={onClose}>
                Guardar en mi jardín
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
