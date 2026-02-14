import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const lines = [
  "No vendemos plantas.",
  "Creamos rituales.",
  "Celebramos progreso.",
  "Recompensamos pasión.",
];

export default function Manifesto() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--accent)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {lines.map((line, i) => (
            <p
              key={i}
              className={`text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mb-6 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${200 + i * 200}ms` }}
            >
              {line}
            </p>
          ))}

          <div
            className={`mt-12 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "1200ms" }}
          >
            <div className="h-px w-24 bg-accent mx-auto mb-8" />
            <p className="text-xl font-serif italic text-primary-foreground/80">
              En Verdie, crecer no es una metáfora.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
