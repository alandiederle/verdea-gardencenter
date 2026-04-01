import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { rarities, rollRarity, pickReward } from "@/components/verdea/sobres/rarities";
import OpeningOverlay from "@/components/verdea/sobres/OpeningOverlay";
import { useDiscoveries } from "@/context/DiscoveriesContext";

export default function RitualPage() {
  const [phase, setPhase] = useState<"idle" | "charging" | "exploding" | "revealed">("idle");
  const [resultIdx, setResultIdx] = useState(0);
  const [reward, setReward] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const { addDiscovery } = useDiscoveries();

  useEffect(() => {
    const img = new Image();
    img.src = "/images/sobre-verdie.png";
  }, []);

  const startOpening = useCallback(() => {
    if (phase !== "idle") return;
    const idx = rollRarity();
    setResultIdx(idx);
    setReward(pickReward(rarities[idx]));
    setPhase("charging");
  }, [phase]);

  return (
    <section className="pt-24 pb-24 bg-muted/30 flex flex-col items-center min-h-screen relative">
      <img src="/images/sobre-verdie.png" className="hidden" aria-hidden="true" />

      <OpeningOverlay
        phase={phase}
        setPhase={setPhase}
        rarity={rarities[resultIdx]}
        reward={reward}
        soundOn={soundOn}
        addDiscovery={addDiscovery}
      />

      <div className="text-center mb-16 px-4">
        <h2 className="text-5xl font-serif font-bold mb-4 text-foreground">Sobre de Cultivo</h2>
        <p className="text-muted-foreground italic font-sans">Toca el sobre para preparar el ritual</p>
      </div>

      <button onClick={() => setSoundOn(!soundOn)} className="mb-8 opacity-40 hover:opacity-100 transition-opacity text-foreground">
        {soundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startOpening}
        className="relative w-64 aspect-[2/3] cursor-pointer drop-shadow-2xl"
      >
        <img src="/images/sobre-verdie.png" className="w-full h-full object-contain" alt="Sobre" draggable={false} />
      </motion.div>
    </section>
  );
}
