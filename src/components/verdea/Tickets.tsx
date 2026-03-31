import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { rarities, rollRarity, pickReward } from "./sobres/rarities";
import OpeningOverlay from "./sobres/OpeningOverlay";
import DiscoveryGallery, { type Discovery } from "./sobres/DiscoveryGallery";

type Phase = "idle" | "charging" | "exploding" | "revealed";

export default function Tickets() {
  const { ref, isVisible } = useScrollAnimation();
  const [phase, setPhase] = useState<Phase>("idle");
  const [resultIdx, setResultIdx] = useState(0);
  const [reward, setReward] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);

  const startOpening = useCallback(() => {
    if (phase !== "idle") return;
    const idx = rollRarity();
    const r = rarities[idx];
    setResultIdx(idx);
    setReward(pickReward(r));
    setPhase("charging"); // Abre el Overlay en modo "esperando el corte"
  }, [phase]);

  const closeOverlay = () => setPhase("idle");

  return (
    <section id="sobres" className="py-24 bg-muted/30 relative overflow-hidden min-h-screen">
      {/* Overlay de apertura interactiva con el termosellado */}
      <OpeningOverlay 
        phase={phase} 
        setPhase={setPhase}
        rarity={rarities[resultIdx]} 
        reward={reward} 
        soundOn={soundOn}
        addDiscovery={(d) => setDiscoveries(prev => [...prev, d])}
      />
      
      <div ref={ref} className="container mx-auto px-4 flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-5 leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            Tu Jardín de Recompensas
          </motion.h2>
          <motion.p
            className="text-lg font-sans text-muted-foreground max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Toca el sobre para comenzar el Ritual de Apertura.
          </motion.p>
        </div>

        {/* Sound toggle */}
        <button onClick={() => setSoundOn(!soundOn)} className="mb-8 opacity-50 hover:opacity-100 transition-opacity">
          {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* VISTA PREVIA DEL SOBRE FLOTANTE EN LA PRINCIPAL */}
        <motion.div
          className="relative w-64 aspect-[2/3] cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startOpening}
        >
          <img src="/images/sobre-verdie.png" className="w-full h-full object-contain drop-shadow-2xl" alt="Sobre" />
          
          {/* Brillo foil dinámico que se activa al hover */}
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity rounded-2xl" />
        </motion.div>
        
        <p className="mt-8 font-serif text-xl font-bold text-secondary">Toca para abrir</p>
        
        {/* Galería de descubrimientos previos */}
        <DiscoveryGallery discoveries={discoveries} />
      </div>
    </section>
  );
}
