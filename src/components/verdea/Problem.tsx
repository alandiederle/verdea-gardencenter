import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { TrendingUp, Users, Eye, Gift } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Comprás y ganás puntos reales",
    desc: "Cada compra hace crecer tu nivel dentro del club.",
  },
  {
    icon: Users,
    title: "Acceso a comunidad y experiencias",
    desc: "Talleres, sorteos y contenido exclusivo.",
  },
  {
    icon: Eye,
    title: "Tu progreso se ve y se siente",
    desc: "Subís niveles y desbloqueás beneficios.",
  },
  {
    icon: Gift,
    title: "Recompensas constantes",
    desc: "Tickets, premios y plantas especiales.",
  },
];

export default function Problem() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-28 lg:py-40 bg-muted/30 relative overflow-hidden">
      <div ref={ref} className="container mx-auto px-4 max-w-5xl">
        {/* Main headline — positive, dominant */}
        <div className="text-center mb-20">
          <h2
            className={`text-3xl sm:text-4xl lg:text-6xl font-serif font-bold text-foreground leading-tight mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Tu jardín evoluciona.
            <br />
            <span className="italic text-secondary">Y vos también.</span>
          </h2>
          <p
            className={`text-lg sm:text-xl font-sans text-muted-foreground max-w-xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            En Verdie, cada planta suma experiencia, recompensas y comunidad.
          </p>
        </div>

        {/* Benefits grid — protagonist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-20">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className={`group p-7 lg:p-8 rounded-3xl bg-card border border-border/60 transition-all duration-500 hover:shadow-lg hover:border-secondary/25 hover:-translate-y-1 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${400 + i * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-5 transition-colors group-hover:bg-secondary/15">
                  <Icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground text-base lg:text-lg mb-2">
                  {b.title}
                </h3>
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Subtle market context — secondary, understated */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <p className="text-sm font-sans text-muted-foreground/60 max-w-md mx-auto leading-relaxed">
            La mayoría de los viveros solo vende plantas.
            <br />
            Verdie construye una experiencia.
          </p>
        </div>

        {/* Transition line */}
        <div className="flex items-center justify-center mb-10">
          <div
            className={`h-[2px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent transition-all duration-1000 ${
              isVisible ? "w-48" : "w-0"
            }`}
            style={{ transitionDelay: "1200ms" }}
          />
        </div>

        {/* Emotional closer */}
        <p
          className={`text-xl sm:text-2xl font-serif text-foreground text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "1400ms" }}
        >
          Acá no solo cultivás plantas.
          <br />
          <span className="italic text-secondary">Cultivás progreso.</span>
        </p>
      </div>
    </section>
  );
}
