import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShoppingBag, Star, Ticket, TrendingUp, Gift, Users } from "lucide-react";

const steps = [
  { icon: ShoppingBag, label: "Compra", desc: "Elegí tus plantas y productos" },
  { icon: Star, label: "Puntos", desc: "Sumá con cada compra" },
  { icon: Ticket, label: "Tickets", desc: "Coleccioná rarezas" },
  { icon: TrendingUp, label: "Nivel", desc: "Subí de categoría" },
  { icon: Gift, label: "Beneficios", desc: "Canjeá premios" },
  { icon: Users, label: "Comunidad", desc: "Crecé con otros" },
];

export default function Ecosystem() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="ecosystem" className="py-24 lg:py-32 bg-background">
      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            No es solo un Garden Center.
            <br />
            <span className="italic text-secondary">Es un ecosistema.</span>
          </h2>
          <p
            className={`text-lg font-sans text-muted-foreground transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Cuanto más cultivás, más creces.
          </p>
        </div>

        {/* Flow steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.label}
                className={`flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-secondary/30 transition-all duration-500 group ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + i * 120}ms` }}
              >
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-secondary/10 transition-colors">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <span className="font-serif font-semibold text-foreground text-sm mb-1">
                  {step.label}
                </span>
                <span className="text-xs text-muted-foreground font-sans">
                  {step.desc}
                </span>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 text-muted-foreground/30">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
