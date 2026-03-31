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

function Particles({ tier }: { tier: number }) {
  const isLegendary = tier >= 4;
  const hue = isLegendary ? "45, 90%, 60%" : tier >= 2 ? "330, 45%, 65%" : "140, 30%, 50%";

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[4px]"
        style={{ borderColor: `hsl(${hue})` }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 1500, height: 1500, opacity: 0, borderWidth: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (360 / 30) * i;
        const dist = 500 + Math.random() * 300;
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.div
            key={`spark-${i}`}
            className="absolute left-1/2 top-1/2 bg-white"
            style={{
              width: 45, height: 2, marginLeft: -22, marginTop: -1,
              rotate: `${angle}deg`,
              boxShadow: `0 0 12px hsl(${hue})`
            }}
            initial={{ x: 0, y: 0, opacity: 1, scaleX: 0 }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              opacity: 0,
              scaleX: 4,
            }}
            transition={{ duration: 0.7, ease: "circOut" }}
          />
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
          className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={phase === "revealed" ? onClose : undefined}
        />

        <div className="relative z-10 flex flex-col items-center">
          {phase === "charging" && (
            <motion.div
              className="relative w-80 h-[500px] flex items-center justify-center"
              style={{ perspective: "1800px" }}
            >
              <motion.div
                className="relative w-full h-full flex items-center justify-center"
                animate={{
                  y: [0, -15, 0],
                  rotateY: [-10, 10, -10],
                  scale: [1, 0.95, 1.05],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute -bottom-10 w-56 h-10 bg-black/40 blur-3xl rounded-full -z-10" />
                
                <img 
                  src="/images/sobre-verdie.png" 
                  alt="Sobre Verdie"
                  className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                />

                <motion.div
                  className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]"
                  style={{
                    background: `linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.4) 50%, transparent 65%)`,
                    backgroundSize: "200% 100%",
                    mixBlendMode: "overlay"
                  }}
                  animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  className="absolute inset-0 -z-20 blur-[90px] opacity-40"
                  style={{ backgroundColor: glowColor }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.2, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          )}

          {phase === "exploding" && (
            <div className="relative">
              <Particles tier={rarity.tier} />
            </div>
          )}

          {phase === "revealed" && showPrize && (
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ scale: 0.5, opacity: 0, y: 80 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
            >
              <div className={`px-10 py-3 rounded-full text-xl font-serif font-bold ${rarity.color} ${rarity.textColor} shadow-xl`}>
                {rarity.name}
              </div>
              
              <div className="flex flex-col items-center">
                <p className="text-white/40 font-sans text-xs uppercase tracking-widest mb-2">Has obtenido</p>
                <h3 className="font-serif text-5xl font-bold text-white text-center max-w-xl leading-tight drop-shadow-2xl">
                  {reward}
                </h3>
              </div>

              <button 
                className="mt-10 px-12 py-5 rounded-full bg-white text-black font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl" 
                onClick={onClose}
              >
                Guardar en mi colección
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
