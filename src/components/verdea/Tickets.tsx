import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { rarities, rollRarity, pickReward } from "./sobres/rarities";
import OpeningOverlay from "./sobres/OpeningOverlay";
import DiscoveryGallery, { type Discovery } from "./sobres/DiscoveryGallery";

export default function Tickets() {
  const [phase, setPhase] = useState<"idle" | "charging" | "exploding" | "revealed">("idle");
  const [resultIdx, setResultIdx] = useState(0);
  const [reward, setReward] = useState("");
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);

  // --- LÓGICA DE MOVIMIENTO 3D (TILT) ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const startOpening = () => {
    const idx = rollRarity();
    setResultIdx(idx);
    setReward(pickReward(rarities[idx]));
    setPhase("charging");
  };

  return (
    <section className="py-24 bg-muted/30 flex flex-col items-center overflow-hidden min-h-screen">
      <OpeningOverlay 
        phase={phase} setPhase={setPhase} rarity={rarities[resultIdx]} 
        reward={reward} addDiscovery={(d) => setDiscoveries(prev => [...prev, d])}
      />
      
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-bold mb-2">Sobre de Cultivo</h2>
        <p className="text-muted-foreground italic">Haz clic para inspeccionar y abrir</p>
      </div>

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={startOpening}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-64 aspect-[2/3] cursor-pointer group"
      >
        {/* EFECTO FOIL (Brillo metálico) */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl">
          <motion.div 
            className="absolute inset-[-100%] bg-gradient-to-tr from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"], y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            style={{ mixBlendMode: "overlay" }}
          />
        </div>

        <img src="/images/sobre-verdie.png" className="w-full h-full object-contain drop-shadow-2xl" alt="Sobre" />
      </motion.div>
      
      <div className="mt-20 w-full max-w-4xl px-4">
        <DiscoveryGallery discoveries={discoveries} />
      </div>
    </section>
  );
}
