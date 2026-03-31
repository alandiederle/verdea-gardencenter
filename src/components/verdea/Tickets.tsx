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

  // Físicas del mouse (Tilt 3D)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section className="py-24 bg-muted/30 flex flex-col items-center min-h-screen">
      <OpeningOverlay 
        phase={phase} setPhase={setPhase} rarity={rarities[resultIdx]} 
        reward={reward} addDiscovery={(d) => setDiscoveries(prev => [...prev, d])}
      />
      
      <div className="text-center mb-16">
        <h2 className="text-5xl font-serif font-bold mb-4">Sobre de Cultivo</h2>
        <p className="text-muted-foreground italic">Haz clic para abrir el ritual</p>
      </div>

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        onClick={() => {
          const idx = rollRarity();
          setResultIdx(idx);
          setReward(pickReward(rarities[idx]));
          setPhase("charging");
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-64 aspect-[2/3] cursor-pointer"
      >
        <img src="/images/sobre-verdie.png" className="w-full h-full object-contain drop-shadow-2xl" alt="Sobre" />
      </motion.div>
      
      <div className="mt-20 w-full max-w-4xl px-4">
        <DiscoveryGallery discoveries={discoveries} />
      </div>
    </section>
  );
}
