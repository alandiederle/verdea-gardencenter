import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Rarity } from "./rarities";

interface Props {
  phase: "idle" | "charging" | "exploding" | "revealed";
  rarity: Rarity;
  reward: string;
  onClose: () => void;
}

function Particles({ tier }: { tier: number }) {
  const isLegendary = tier >= 4;
  const hue = isLegendary ? "45, 90%, 60%" : tier >= 2 ? "330, 45%, 65%" : "140, 30%, 50%";

  return (
    <>
      <motion.div className="fixed inset-0 z-50 bg-white" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }} />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[4px]"
        style={{ borderColor: `hsl(${hue})` }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 1500, height: 1500, opacity: 0 }}
        transition={{ duration: 1.2 }}
      />
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
        <motion.div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

        <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
          {phase === "charging" && (
            <motion.div
              className="relative w-full aspect-[2/3] flex items-center justify-center"
              animate={{ y: [0, -20, 0], rotateY: [-10, 10, -10], scale: [1, 0.95, 1.05] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <img 
                src="/images/sobre-verdie.png" 
                alt="Sobre Verdie"
                className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)]"
              />
              <motion.div
                className="absolute inset-0 -z-10 blur-[100px] opacity-40"
                style={{ backgroundColor: glowColor }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          )}

          {phase === "exploding" && <Particles tier={rarity.tier} />}

          {phase === "revealed" && showPrize && (
            <motion.div
              className="flex flex-col items-center gap-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className={`px-10 py-3 rounded-full text-xl font-bold ${rarity.color} ${rarity.textColor}`}>
                {rarity.name}
              </div>
              <h3 className="font-serif text-5xl font-bold text-white text-center">{reward}</h3>
              <button className="px-12 py-5 rounded-full bg-white text-black font-bold text-lg" onClick={onClose}>
                Guardar en mi colección
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
