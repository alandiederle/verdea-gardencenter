import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const painPoints = [
  "Comprás plantas, pero no hay beneficios.",
  "No hay comunidad.",
  "No hay recompensa.",
  "No hay evolución.",
];

export default function Problem() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 lg:py-32 bg-muted/50 relative overflow-hidden">
      <div ref={ref} className="container mx-auto px-4 max-w-3xl text-center">
        <h2
          className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Tu jardín crece.
          <br />
          <span className="text-muted-foreground italic">Pero tu experiencia no.</span>
        </h2>

        <div className="space-y-5 mb-14">
          {painPoints.map((point, i) => (
            <p
              key={i}
              className={`text-lg font-sans text-muted-foreground transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              {point}
            </p>
          ))}
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
