import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Semilla",
    emoji: "🌱",
    price: "Gratis",
    multiplier: "x1",
    features: ["Acceso básico", "Participación estándar en sorteos", "Newsletter exclusiva"],
    cta: "Comenzar gratis",
    featured: false,
    badge: null,
    height: "h-[400px]",
  },
  {
    name: "Brote",
    emoji: "🌿",
    price: "$5/mes",
    multiplier: "x1.25",
    features: ["1 ticket bonus mensual", "Acceso anticipado a ofertas", "Descuento en subastas", "+25% puntos"],
    cta: "Elegir Brote",
    featured: false,
    badge: null,
    height: "h-[440px]",
  },
  {
    name: "Flor",
    emoji: "🌸",
    price: "$10/mes",
    multiplier: "x2",
    features: ["3 tickets bonus", "Envío bonificado", "Sorteos exclusivos", "Regalo trimestral sorpresa", "Doble puntos"],
    cta: "Elegir Flor",
    featured: true,
    badge: "Más elegido",
    height: "h-[480px]",
  },
  {
    name: "Árbol",
    emoji: "🌳",
    price: "$25/mes",
    multiplier: "x4",
    features: [
      "10 tickets bonus",
      "Sorteos premium",
      "Regalo mensual",
      "Acceso anticipado 48h",
      "Eventos de comunidad",
      "Doble participación subastas",
      "Cuádruple puntos",
    ],
    cta: "Convertirme en Árbol",
    featured: false,
    badge: "Máxima evolución",
    height: "h-[520px]",
  },
];

export default function Memberships() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="memberships" className="py-24 lg:py-32 bg-background">
      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Elegí cómo querés crecer.
          </h2>
          <p className={`text-lg font-sans text-muted-foreground transition-all duration-700 delay-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            La evolución natural de tu experiencia en Verdie.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-end">
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-700 hover:shadow-xl group ${
                tier.featured
                  ? "bg-primary text-primary-foreground border-primary shadow-xl scale-[1.03]"
                  : "bg-card border-border hover:border-secondary/30"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              {tier.badge && (
                <span
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold font-sans ${
                    tier.featured
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {tier.badge}
                </span>
              )}

              <div className="text-center mb-6">
                <span className="text-4xl mb-3 block">{tier.emoji}</span>
                <h3 className="font-serif text-xl font-bold mb-1">{tier.name}</h3>
                <p className="text-2xl font-bold font-sans">{tier.price}</p>
                <span
                  className={`text-xs font-sans font-medium ${
                    tier.featured ? "text-primary-foreground/70" : "text-accent"
                  }`}
                >
                  {tier.multiplier} puntos
                </span>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-sans">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        tier.featured ? "text-accent" : "text-secondary"
                      }`}
                    />
                    <span className={tier.featured ? "text-primary-foreground/90" : "text-muted-foreground"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-full text-sm font-semibold font-sans transition-all hover:scale-105 ${
                  tier.featured
                    ? "bg-accent text-accent-foreground hover:bg-verdea-gold-light"
                    : "bg-primary text-primary-foreground hover:bg-secondary"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
