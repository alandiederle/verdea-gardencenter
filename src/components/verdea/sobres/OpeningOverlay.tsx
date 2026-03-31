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
  const isLegendary = tier >= 4;
  const hue = isLegendary ? "45, 90%, 60%" : tier >= 2 ? "330, 45%, 65%" : "140, 30%, 50%";

  return (
    <>
      {/* 1. FLASHBANG BLANCO CIEGO */}
      <motion.div
        className="fixed inset-0 z-50 bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
      />

      {/* 2. ONDA DE CHOQUE (Shockwave Ring) */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[4px]"
        style={{ borderColor: `hsl(${hue})` }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 1500, height: 1500, opacity: 0, borderWidth: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-white"
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 1000, height: 1000, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
      />

      {/* 3. PARTICULAS EXPLOSIVAS DE ALTA VELOCIDAD */}
      {Array.from({ length: 25 }).map((_, i) => {
        const angle = (360 / 25) * i;
        const dist = 400 + Math.random() * 400;
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.div
            key={`spark-${i}`}
            className="absolute left-1/2 top-1/2 bg-white"
            style={{
              width: 40, height: 2, marginLeft: -20, marginTop: -1,
              rotate: `${angle}deg`,
              boxShadow: `0 0 10px hsl(${hue})`
            }}
            initial={{ x: 0, y: 0, opacity: 1, scaleX: 0 }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              opacity: 0,
              scaleX: 3,
            }}
            transition={{ duration: 0.6, ease: "circOut" }}
          />
        );
      })}

      {/* 4. HOJAS Y PÉTALOS FLOTANTES */}
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
              className="relative w-64 h-96 flex flex-col items-center justify-center cursor-pointer"
              style={{ perspective: "1500px" }}
              animate={{ 
                scale: [1, 0.9, 1.05],
                rotateZ: [0, -3, 3, -1, 0],
                rotateY: [-15, 15, -15],
                filter: ["brightness(1)", "brightness(1.5)", "brightness(2)"]
              }}
              transition={{ duration: 0.15, repeat: Infinity, repeatType: "reverse" }}
            >
              <div className="absolute -bottom-10 w-48 h-10 bg-black/60 blur-2xl rounded-full" />

              <div className="w-full h-full relative rounded-xl border border-white/40 shadow-2xl overflow-hidden bg-gradient-to-b from-zinc-800 via-zinc-900 to-black">
                
                <div className="absolute top-0 w-full h-6 bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-600 opacity-80" 
                     style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.4) 4px, rgba(0,0,0,0.4) 8px)' }} />
                     
                <motion.div 
                  className="absolute inset-0 opacity-40 mix-blend-overlay"
                  style={{ background: `linear-gradient(125deg, transparent 0%, ${glowColor} 40%, white 50%, ${glowColor} 60%, transparent 100%)`, backgroundSize: '300% 300%' }}
                  animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-32 h-32 rounded-full blur-2xl"
                    style={{ background: glowColor }}
                    animate={{ scale: [1, 2], opacity: [0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 0.4, repeatType: "reverse" }}
                  />
                  <div className="z-10 font-serif text-3xl font-bold text-white tracking-widest drop-shadow-lg border-y border-white/30 py-4 w-full text-center bg-black/20 backdrop-blur-md">
                    VERDIE
                  </div>
                </div>

                <div className="absolute bottom-0 w-full h-6 bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-600 opacity-80" 
                     style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.4) 4px, rgba(0,0,0,0.4) 8px)' }} />
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
