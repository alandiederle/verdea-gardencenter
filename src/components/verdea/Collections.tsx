import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const collections = [
  { name: "Philodendron", emoji: "🌿", desc: "Variedades exóticas y raras" },
  { name: "Monstera", emoji: "🍃", desc: "Clásicos que nunca fallan" },
  { name: "Alocasia", emoji: "🌱", desc: "Hojas de otro mundo" },
  { name: "Anthurium", emoji: "🌺", desc: "Color y elegancia tropical" },
  { name: "Syngonium", emoji: "🪴", desc: "Perfectas para empezar" },
  { name: "Principiantes", emoji: "💚", desc: "Fáciles y resistentes" },
  { name: "Pet Friendly", emoji: "🐾", desc: "Seguras para mascotas" },
];

export default function Collections() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div ref={ref} className="container mx-auto px-4">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-3">
            Explorá por colecciones
          </h2>
          <p className="text-muted-foreground font-sans text-lg max-w-md mx-auto">
            Encontrá la planta perfecta para tu espacio.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {collections.map((c, i) => (
            <motion.button
              key={c.name}
              className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border
                hover:border-secondary/40 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl">{c.emoji}</span>
              <div className="text-left">
                <span className="block font-serif font-semibold text-foreground text-sm">
                  {c.name}
                </span>
                <span className="block text-xs text-muted-foreground font-sans">
                  {c.desc}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
