import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ctaBg from "@/assets/cta-final-bg.jpg";

export default function FinalCTA() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="final-cta" className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={ctaBg}
          alt="Jardín al atardecer"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/60 to-primary/30" />
      </div>

      <div ref={ref} className="relative z-10 container mx-auto px-4 text-center py-24">
        <h2
          className={`text-3xl sm:text-4xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6 leading-tight transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Hoy sembrás.
          <br />
          <span className="italic">Mañana florece.</span>
        </h2>

        <p
          className={`text-lg text-primary-foreground/80 font-sans mb-10 max-w-lg mx-auto transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          Tu jardín puede ser más que un espacio. Puede ser tu evolución.
        </p>

        <a
          href="#memberships"
          className={`inline-flex items-center justify-center bg-accent text-accent-foreground px-10 py-4 rounded-full text-lg font-semibold font-sans hover:bg-verdea-gold-light transition-all hover:scale-105 shadow-xl ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          🌿 Unirme a Verdea
        </a>
      </div>
    </section>
  );
}
