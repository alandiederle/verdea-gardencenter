// ... resto de imports igual
export default function Tickets() {
  // ... estados igual

  return (
    <section id="sobres" className="py-24 bg-muted/30 flex flex-col items-center min-h-screen">
      <OpeningOverlay 
        phase={phase} setPhase={setPhase} rarity={rarities[resultIdx]} 
        reward={reward} addDiscovery={(d) => setDiscoveries(prev => [...prev, d])}
      />
      
      <div className="text-center mb-16">
        <h2 className="text-5xl font-serif font-bold mb-4">Sobre de Cultivo</h2>
        <p className="text-muted-foreground font-light tracking-wide italic">Haz clic para preparar la apertura</p>
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const idx = rollRarity();
          setResultIdx(idx);
          setReward(pickReward(rarities[idx]));
          setPhase("charging");
        }}
        className="relative w-64 aspect-[2/3] cursor-pointer"
      >
        <img 
          src="/images/sobre-verdie.png" 
          className="w-full h-full object-contain drop-shadow-2xl" 
          alt="Sobre" 
          draggable="false" 
        />
      </motion.div>
      
      <div className="mt-20 w-full max-w-4xl px-4">
        <DiscoveryGallery discoveries={discoveries} />
      </div>
    </section>
  );
}
