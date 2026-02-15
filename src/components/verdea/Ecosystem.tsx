import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShoppingBag, Star, Ticket, TrendingUp, Gift, Users, ChevronRight } from "lucide-react";

const steps = [
  { icon: ShoppingBag, label: "Compra", desc: "Elegí tus plantas y productos", detail: "Cada compra suma puntos automáticamente. Cuanto más comprás, más rápido evolucionás." },
  { icon: Star, label: "Puntos", desc: "Sumá con cada compra", detail: "Los puntos se multiplican según tu nivel de membresía: hasta x4 en el nivel Árbol." },
  { icon: Ticket, label: "Sobres", desc: "Descubrí recompensas", detail: "Recibís sobres digitales con recompensas de 6 rarezas botánicas, desde Natural hasta Legendaria." },
  { icon: TrendingUp, label: "Nivel", desc: "Subí de categoría", detail: "Tu nivel sube automáticamente al acumular puntos. Cada nivel desbloquea beneficios exclusivos." },
  { icon: Gift, label: "Beneficios", desc: "Canjeá premios", detail: "Usá tus puntos para canjear productos, regalos sorpresa y acceso a eventos." },
  { icon: Users, label: "Comunidad", desc: "Crecé con otros", detail: "Participá de talleres, consultá expertos y compartí tu jardín con miles de miembros." },
];

export default function Ecosystem() {
  const { ref, isVisible } = useScrollAnimation();
  const [activeStep, setActiveStep] = useState<number | null>(null);

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep === i;
            return (
              <div key={step.label} className="relative">
                <div
                  className={`flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-500 cursor-pointer group ${
                    isActive
                      ? "bg-secondary/10 border-secondary/40 shadow-md"
                      : "bg-card border-border hover:shadow-lg hover:border-secondary/30"
                  } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${300 + i * 120}ms` }}
                  onMouseEnter={() => setActiveStep(i)}
                  onMouseLeave={() => setActiveStep(null)}
                  onClick={() => setActiveStep(isActive ? null : i)}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${
                    isActive ? "bg-secondary/20" : "bg-muted group-hover:bg-secondary/10"
                  }`}>
                    <Icon className={`w-6 h-6 transition-colors ${isActive ? "text-secondary" : "text-secondary"}`} />
                  </div>
                  <span className="font-serif font-semibold text-foreground text-sm mb-1">
                    {step.label}
                  </span>
                  <span className="text-xs text-muted-foreground font-sans">
                    {step.desc}
                  </span>
                </div>

                {/* Arrow connector (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-4 h-4 text-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="max-w-2xl mx-auto mt-6 min-h-[64px]">
          {activeStep !== null && (
            <div className="bg-card border border-secondary/20 rounded-xl p-5 text-center animate-fade-in">
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                {steps[activeStep].detail}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
