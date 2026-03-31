function Particles({ tier }: { tier: number }) {
  const isLegendary = tier >= 4;
  const hue = isLegendary ? "45, 90%, 60%" : tier >= 2 ? "330, 45%, 65%" : "140, 30%, 50%";

  return (
    <>
      {/* 1. FLASHBANG BLANCO CIEGO */}
      <motion.div
        className="fixed inset-0 z-50 bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
      />

      {/* 2. ONDA DE CHOQUE (Shockwave Ring) */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[4px]"
        style={{ borderColor: `hsl(${hue})` }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 1500, height: 1500, opacity: 0, borderWidth: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-white"
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 1000, height: 1000, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
      />

      {/* 3. PARTICULAS EXPLOSIVAS DE ALTA VELOCIDAD (Líneas tipo anime) */}
      {Array.from({ length: 25 }).map((_, i) => {
        const angle = (360 / 25) * i;
        const dist = 400 + Math.random() * 400;
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.div
            key={`spark-${i}`}
            className="absolute left-1/2 top-1/2 bg-white"
            style={{
              width: 40, height: 2, marginLeft: -20, marginTop: -1,
              rotate: `${angle}deg`,
              boxShadow: `0 0 10px hsl(${hue})`
            }}
            initial={{ x: 0, y: 0, opacity: 1, scaleX: 0 }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              opacity: 0,
              scaleX: 3,
            }}
            transition={{ duration: 0.6, ease: "circOut" }}
          />
        );
      })}

      {/* Aquí mantienes tus Floating Leaves & Petals que ya tenías... */}
    </>
  );
}
