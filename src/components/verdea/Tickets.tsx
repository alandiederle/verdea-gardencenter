import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { rarities, rollRarity, pickReward } from "./sobres/rarities";
import OpeningOverlay from "./sobres/OpeningOverlay";
import DiscoveryGallery, { type Discovery } from "./sobres/DiscoveryGallery";

export default function Tickets() {
  const [phase, setPhase] = useState<"idle" | "charging" | "exploding" | "revealed">("idle");
  const [resultIdx, setResultIdx] = useState(0);
  const [reward, setReward] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);

  const startOpening = useCallback(() => {
    const idx = rollRarity();
    setResultIdx(idx);
    setReward(pickReward(rarities[idx]));
    setPhase("charging");
  }, []);

  return (
    <section id="sobres" className="py-24 bg-muted/30 flex flex-col items-center min-h-screen">
      <OpeningOverlay 
        phase={phase} 
        setPhase={setPhase} 
        rarity={rarities[resultIdx]} 
        reward={reward} 
        soundOn={soundOn}
        addDiscovery={(d) => setDiscoveries(prev => [...prev, d])}
      />
      
      <div className="text-center mb-16 px-4">
        <h2 className="text-5xl font-serif font-bold mb-4">Sobre de Cultivo</h2>
        <p className="text-muted-foreground font-light tracking-wide italic">Toca el sobre para preparar el ritual</p>
      </div>

      <button onClick={() => setSoundOn(!soundOn)} className="mb-8 opacity-40 hover:opacity-100 transition-opacity">
        {soundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startOpening}
        className="relative w-64 aspect-[2/3] cursor-pointer"
      >
        <img 
          src="/images/sobre-verdie.png" 
          className="w-full h-full object-contain drop-shadow-2xl" 
          alt="Sobre" 
          draggable={false} 
        />
      </motion.div>
      
      <div className="mt-20 w-full max-w-4xl px-4">
        <DiscoveryGallery discoveries={discoveries} />
      </div>
    </section>
  );
}
