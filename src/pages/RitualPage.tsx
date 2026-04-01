import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { rarities, rollRarity, pickReward } from "@/components/verdea/sobres/rarities";
import OpeningOverlay from "@/components/verdea/sobres/OpeningOverlay";
import { useDiscoveries } from "@/context/DiscoveriesContext";
import ProgressBar from "@/components/verdea/ProgressBar"; // Importamos la barra

export default function RitualPage() {
  const [phase, setPhase] = useState<"idle" | "charging" | "exploding" | "revealed">("idle");
  const [resultIdx, setResultIdx] = useState(0);
  const [reward, setReward] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const { addDiscovery, discoveries } = useDiscoveries();

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
    <section className="pt-32 pb-24 bg-[#0a0a0a] flex flex-col items-center min-h-screen relative overflow-hidden">
      {/* Fondo místico sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent pointer-events-none" />

      <OpeningOverlay
        phase={phase}
        setPhase={setPhase}
        rarity={rarities[resultIdx]}
        reward={reward}
        soundOn={soundOn}
        addDiscovery={addDiscovery}
      />

      <div className="container max-w-4xl mx-auto flex flex-col items-center z-10">
        
        {/* LA BARRA DE XP (Variante Inline) */}
        <ProgressBar variant="inline" />

        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-2 text-white">Laboratorio de Cultivo</h2>
          <p className="text-emerald-500/60 italic font-sans text-sm tracking-widest uppercase">
            Sumergite en el ritual de apertura
          </p>
        </div>

        {/* Controles de Audio */}
        <button 
          onClick={() => setSoundOn(!soundOn)} 
          className="mb-12 p-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
        >
          {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* EL SOBRE CON TILT 3D */}
        <motion.div
          whileHover={{ scale: 1.02, rotateY: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={startOpening}
          className="relative w-72 aspect-[2/3] cursor-pointer"
        >
          {/* Sombra proyectada en el "suelo" del laboratorio */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 h-8 bg-emerald-900/20 blur-2xl rounded-full" />
          
          <img 
            src="/images/sobre-verdie.png" 
            className="w-full h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]" 
            alt="Sobre Verdie" 
            draggable={false} 
          />
          
          {/* Indicador visual de "Listo para abrir" */}
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -inset-4 border border-emerald-500/20 rounded-xl pointer-events-none"
          />
        </motion.div>

        {/* Mini Resumen de Inventario (Para no tener que irse a la otra página) */}
        <div className="mt-24 w-full border-t border-white/5 pt-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-8">
            Últimos hallazgos en tu ecosistema
          </p>
          <div className="flex justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
            {discoveries.slice(-4).map((d, i) => (
              <div key={i} className="w-12 h-16 rounded border border-white/10 overflow-hidden bg-card">
                 <img src="/images/sobre-verdie.png" className="w-full h-full object-cover grayscale" />
              </div>
            ))}
            {discoveries.length === 0 && (
              <p className="text-xs italic text-white/20">Tu jardín aún está esperando su primera semilla...</p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
