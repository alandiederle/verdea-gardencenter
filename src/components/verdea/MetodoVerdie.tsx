import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Leaf, BookOpen, Sparkles, Gift } from "lucide-react";

const steps = [
  {
    icon: Leaf,
    title: "Elegís tu planta",
    desc: "Explorá colecciones curadas de interior, exterior y rarezas botánicas.",
  },
  {
    icon: BookOpen,
    title: "Aprendés a cuidarla",
    desc: "Guías, talleres y consejos de expertos en cada paso.",
  },
  {
    icon: Sparkles,
    title: "Tu espacio evoluciona",
    desc: "Cada planta transforma tu ambiente y tu experiencia.",
  },
  {
    icon: Gift,
    title: "Recibís recompensas",
    desc: "Sobres, puntos y beneficios que crecen con vos.",
  },
];

export default function MetodoVerdie() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 lg:py-32 bg-muted/20">
      <div ref={ref} className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Cómo funciona Verdie
          </h2>
          <p className="text-lg font-sans text-muted-foreground">
            Cuatro pasos hacia tu jardín ideal.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                className="relative flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 24 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
              >
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-5
                  group-hover:bg-secondary/20 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-secondary" />
                </div>
                <span className="text-xs font-sans text-muted-foreground/60 mb-2 tracking-widest uppercase">
                  Paso {i + 1}
                </span>
                <h3 className="font-serif font-bold text-foreground text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed max-w-[220px]">
                  {step.desc}
                </p>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8 h-px bg-border" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
