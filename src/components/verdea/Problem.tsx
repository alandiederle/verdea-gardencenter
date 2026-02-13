import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShoppingBag, Users, Gift, TrendingUp } from "lucide-react";

const painPoints = [
  { text: "Comprás plantas, pero no hay beneficios.", icon: ShoppingBag },
  { text: "No hay comunidad.", icon: Users },
  { text: "No hay recompensa.", icon: Gift },
  { text: "No hay evolución.", icon: TrendingUp },
];

export default function Problem() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 lg:py-32 bg-muted/50 relative overflow-hidden">
      <div ref={ref} className="container mx-auto px-4 max-w-4xl text-center">
        <h2
          className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Tu jardín crece.
          <br />
          <span className="text-muted-foreground italic">Pero tu experiencia no.</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto mb-14">
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-4 p-5 rounded-2xl bg-card border border-border text-left transition-all duration-500 hover:shadow-md hover:border-secondary/20 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${300 + i * 150}ms` }}
              >
                <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm sm:text-base font-sans text-muted-foreground leading-snug">
                  {point.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Transition line → stem */}
        <div className="flex items-center justify-center mb-8">
          <div
            className={`h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent transition-all duration-1000 ${
              isVisible ? "w-64" : "w-0"
            }`}
            style={{ transitionDelay: "900ms" }}
          />
        </div>

        <p
          className={`text-xl sm:text-2xl font-serif text-foreground transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "1100ms" }}
        >
          En Verdea, cada compra es un paso adelante.
        </p>
      </div>
    </section>
  );
}
