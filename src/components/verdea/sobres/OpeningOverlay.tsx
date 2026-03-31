import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useSobreSound } from "./useSobreSound";
import type { Rarity } from "./rarities";

interface Props {
  phase: string;
  setPhase: (p: any) => void;
  rarity: Rarity;
  reward: string;
  soundOn: boolean;
  addDiscovery: (d: any) => void;
}

export default function OpeningOverlay({ phase, setPhase, rarity, reward, soundOn, addDiscovery }: Props) {
  const sound = useSobreSound(soundOn);
  const sobreRef = useRef<HTMLDivElement>(null);
  
  // Valores para el gesto de corte
  const dragX = useMotionValue(0);
  const rotateZ = useTransform(dragX, [-200, 200], [-10, 10]);

  if (phase === "idle") return null;

  const handleDragEnd = (_: any, info: any) => {
    // Si el movimiento fue rápido y largo, "cortamos" el sobre
    const velocity = Math.abs(info.velocity.x);
    const offset = Math.abs(info.offset.x);

    if (velocity > 300 || offset > 100) {
      sound.playChargeUp(); // AQUÍ SUENA TU "ABRIR.MP3" (EL TRACCC)
      
      setPhase("exploding");
      setTimeout(() => {
        setPhase("revealed");
        sound.playReveal(rarity.tier);
        addDiscovery({ rarity, reward, timestamp: Date.now() });
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl overflow-hidden">
      <AnimatePresence>
        {/* INSTRUCCIONES AL ESTAR EN MODO CARGA */}
        {phase === "charging" && (
          <div className="relative flex flex-col items-center">
            <motion.div 
              initial={{ y: -20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="absolute -top-32 text-center w-full"
            >
              <p className="text-white font-serif text-2xl font-bold tracking-widest uppercase mb-2">
                Ritual de Apertura
              </p>
              <motion.p 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-secondary font-sans text-sm font-bold"
              >
                ← DESLIZA RÁPIDO PARA CORTAR →
              </motion.p>
            </motion.div>

            <motion.div
              ref={sobreRef}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              onDragStart={() => sound.playWindUp()}
              style={{ x: dragX, rotateZ }}
              className="relative w-80 aspect-[2/3] cursor-grab active:cursor-grabbing"
            >
              <img 
                src="/images/sobre-verdie.png" 
                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.2)] pointer-events-none" 
                alt="Sobre Grande" 
              />
              {/* Brillo de guía */}
              <div className="absolute inset-x-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm pointer-events-none" />
            </motion.div>
          </div>
        )}

        {/* REVELACIÓN DEL PREMIO */}
        {phase === "revealed" && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="text-center p-8 max-w-lg"
          >
            <div className={`inline-block px-8 py-3 rounded-full mb-8 font-bold text-lg shadow-2xl ${rarity.color} ${rarity.textColor}`}>
              {rarity.name}
            </div>
            <h2 className="text-6xl font-serif font-bold text-white mb-12 drop-shadow-lg leading-tight">
              {reward}
            </h2>
            <button 
              onClick={() => setPhase("idle")} 
              className="px-12 py-5 bg-white text-black font-black rounded-full hover:scale-105 transition-transform uppercase tracking-tighter"
            >
              Cerrar y Guardar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
