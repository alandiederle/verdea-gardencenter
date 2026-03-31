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

  const startOpening = useCallback(() => {
    const idx = rollRarity();
    setResultIdx(idx);
    setReward(pickReward(rarities[idx]));
    setPhase("charging"); // Esto abre el Overlay en modo "esperando el corte"
  }, []);

  return (
    <section id="sobres" className="py-24 bg-muted/30 overflow-hidden">
      <OpeningOverlay 
        phase={phase} 
        setPhase={setPhase}
        rarity={rarities[resultIdx]} 
        reward={reward} 
        soundOn={soundOn}
        addDiscovery={(d) => setDiscoveries(prev => [...prev, d])}
      />
      
      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">Tu Jardín de Recompensas</h2>
          <p className="text-muted-foreground italic">Haz clic en el sobre para comenzar el ritual.</p>
        </div>

        <div className="flex flex-col items-center">
          <button onClick={() => setSoundOn(!soundOn)} className="mb-6 opacity-50 hover:opacity-100 transition-opacity">
            {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <motion.div
            className="relative w-64 aspect-[2/3] cursor-pointer"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={startOpening}
          >
            <img src="/images/sobre-verdie.png" className="w-full h-full object-contain drop-shadow-2xl" alt="Sobre" />
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity rounded-2xl" />
          </motion.div>
          
          <p className="mt-8 font-serif text-xl font-bold text-secondary">Toca para abrir</p>
        </div>
        
        <DiscoveryGallery discoveries={discoveries} />
      </div>
    </section>
  );
}
