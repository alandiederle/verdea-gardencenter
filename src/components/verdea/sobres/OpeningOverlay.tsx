import { motion, AnimatePresence } from "framer-motion";
import type { Rarity } from "./rarities";

export default function OpeningOverlay({ phase, rarity, reward, onClose }: { phase: string, rarity: Rarity, reward: string, onClose: () => void }) {
  if (phase === "idle") return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl">
        {phase === "charging" && (
          <motion.img 
            src="/images/sobre-verdie.png" 
            animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 0.2 }}
            className="w-80 object-contain"
          />
        )}
        {phase === "revealed" && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8">
            <div className={`inline-block px-6 py-2 rounded-full mb-6 font-bold ${rarity?.color} ${rarity?.textColor}`}>
              {rarity?.name}
            </div>
            <h2 className="text-5xl font-serif font-bold text-white mb-8">{reward}</h2>
            <button onClick={onClose} className="px-8 py-3 bg-white text-black font-bold rounded-full">Cerrar</button>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
