import { useState, useEffect, useMemo } from "react";
import { TrendingUp, Sparkles, ChevronRight } from "lucide-react";
import { useDiscoveries } from "@/context/DiscoveriesContext";
import { motion, AnimatePresence } from "framer-motion";

// Definimos los beneficios por nivel para incentivar la compra
const levels = [
  { name: "Semilla", min: 0, max: 500, benefit: "Acceso básico" },
  { name: "Brote", min: 500, max: 2000, benefit: "1 Ticket Bonus / mes" },
  { name: "Flor", min: 2000, max: 5000, benefit: "5% OFF en Rarezas" },
  { name: "Árbol", min: 5000, max: 15000, benefit: "Envío Gratis Permanente" },
];

export default function ProgressBar({ variant = "fixed" }: { variant?: "fixed" | "inline" }) {
  const [isVisible, setIsVisible] = useState(variant === "inline");
  const { discoveries } = useDiscoveries();

  // CALCULAMOS PUNTOS REALES: Cada descubrimiento suma 100 puntos (esto es escalable)
  // En el futuro, aquí sumarás los puntos de las compras reales.
  const currentPoints = useMemo(() => 1240 + (discoveries.length * 150), [discoveries]);

  const currentLevel = useMemo(() => 
    levels.find((l) => currentPoints >= l.min && currentPoints < l.max) || levels[0], 
  [currentPoints]);

  const nextLevel = levels[levels.indexOf(currentLevel) + 1] || currentLevel;
  const progress = ((currentPoints - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;
  const pointsToNext = currentLevel.max - currentPoints;

  useEffect(() => {
    if (variant === "inline") return;
    const onScroll = () => setIsVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className={`${
            variant === "fixed" 
              ? "fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-t border-emerald-500/20 py-3 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]" 
              : "w-full max-w-2xl bg-secondary/5 p-6 rounded-3xl border border-white/10 mb-8"
          }`}
        >
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              
              {/* Info del Nivel */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Nivel Actual</h4>
                  <p className="text-sm font-serif font-bold text-foreground leading-none">{currentLevel.name}</p>
                </div>
              </div>

              {/* Barra de Progreso Mística */}
              <div className="flex-1 w-full">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase">
                    {currentPoints.toLocaleString()} <span className="opacity-50">/ {currentLevel.max} XP</span>
                  </span>
                  <span className="text-[10px] font-sans font-bold text-emerald-500 flex items-center gap-1">
                    <Sparkles size={10} /> PROXIMO: {nextLevel.benefit}
                  </span>
                </div>
                <div className="h-2.5 bg-black/20 rounded-full overflow-hidden p-[1px] border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-amber-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  />
                </div>
              </div>

              {/* Llamado a la Acción (Vendedor) */}
              <div className="shrink-0 flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <p className="text-[11px] text-muted-foreground leading-tight">Faltan <b>{pointsToNext} pts</b></p>
                  <p className="text-[9px] text-emerald-400 uppercase font-black tracking-tighter">para subir de nivel</p>
                </div>
                <button className="bg-foreground text-background px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition-all group">
                  Evolucionar <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
