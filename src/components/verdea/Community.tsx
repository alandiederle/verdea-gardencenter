import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Heart, Sprout, Compass, Flower2, TreePine } from "lucide-react";

const testimonials = [
  { name: "Valentina R.", text: "Nunca pensé que iba a tener plantas así en casa. Verdie cambió todo.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
  { name: "Martín L.", text: "Gané una Monstera XXL en la subasta. El mejor día de mi vida verde.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
  { name: "Sofía P.", text: "La comunidad es increíble. Aprendí más en 2 meses que en 5 años sola.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
];

const levels = [
  { icon: Sprout, name: "Brote", desc: "Empezás tu camino verde" },
  { icon: Compass, name: "Explorador", desc: "Descubrís nuevas especies" },
  { icon: Flower2, name: "Cultivador", desc: "Tu jardín florece" },
  { icon: TreePine, name: "Coleccionista", desc: "Dominás el arte verde" },
];

const stats = [
  { label: "Miembros activos", value: 3247 },
  { label: "Plantas entregadas", value: 12580 },
  { label: "Premios sorteados", value: 890 },
];

function AnimatedCounter({ target, isVisible }: { target: number; isVisible: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target]);
  return <span>{count.toLocaleString()}</span>;
}

export default function Community() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="community" className="py-24 lg:py-32 bg-muted/30">
      <div ref={ref} className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Crecer en Verdie
          </h2>
          <p className="text-lg font-sans text-muted-foreground">
            No sos solo un cliente. Sos parte de algo que crece.
          </p>
        </motion.div>

        {/* Levels */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
          {levels.map((level, i) => {
            const Icon = level.icon;
            return (
              <motion.div
                key={level.name}
                className="flex flex-col items-center text-center p-5 rounded-2xl bg-card border border-border
                  hover:border-secondary/30 hover:shadow-md transition-all duration-300 group"
                initial={{ opacity: 0, y: 16 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3
                  group-hover:bg-secondary/20 transition-colors">
                  <Icon className="w-5 h-5 text-secondary" />
                </div>
                <span className="font-serif font-semibold text-foreground text-sm">{level.name}</span>
                <span className="text-xs text-muted-foreground font-sans mt-1">{level.desc}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
            >
              <p className="text-3xl sm:text-4xl font-bold font-sans text-secondary">
                +<AnimatedCounter target={stat.value} isVisible={isVisible} />
              </p>
              <p className="text-sm text-muted-foreground font-sans mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <span className="font-sans font-semibold text-foreground text-sm">{t.name}</span>
                  <span className="block text-xs text-accent">Miembro Verdie</span>
                </div>
                <Heart className="w-4 h-4 text-destructive ml-auto" />
              </div>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed italic">
                "{t.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
