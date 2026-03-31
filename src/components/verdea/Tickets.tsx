import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { rarities, rollRarity, pickReward } from "./sobres/rarities";
import OpeningOverlay from "./sobres/OpeningOverlay";
import DiscoveryGallery, { type Discovery } from "./sobres/DiscoveryGallery";

export default function Tickets() {
  const { ref, isVisible } = useScrollAnimation();
  const [phase, setPhase] = useState<"idle" | "charging" | "exploding" | "revealed">("idle");
  const [resultIdx, setResultIdx] = useState(0);
  const [reward, setReward] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);

  const startOpening = () => {
    const idx = rollRarity();
    setResultIdx(idx);
    setReward(pickReward(rarities[idx]));
    setPhase("charging");
  };

  return (
    <section id="sobres" className="py-24 bg-muted/30 overflow-hidden min-h-screen">
      <OpeningOverlay 
        phase={phase} 
        setPhase={setPhase}
        rarity={rarities[resultIdx]} 
        reward={reward} 
        soundOn={soundOn}
        addDiscovery={(d) => setDiscoveries(prev => [...prev, d])}
      />
      
      <div ref={ref} className="container mx-auto px-4 flex flex-col items-center">
        <div className="text-center max-w-2xl mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">Sobre de Recompensas</h2>
          <p className="text-muted-foreground">Haz un clic para empezar el ritual.</p>
        </div>

        <button onClick={() => setSoundOn(!soundOn)} className="mb-8 opacity-50 hover:opacity-100 transition-opacity">
          {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        <motion.div
          className="relative w-64 aspect-[2/3] cursor-pointer mb-20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startOpening}
        >
          <img src="/images/sobre-verdie.png" className="w-full h-full object-contain drop-shadow-2xl" alt="Sobre" />
        </motion.div>
        
        <DiscoveryGallery discoveries={discoveries} />
      </div>
    </section>
  );
}
