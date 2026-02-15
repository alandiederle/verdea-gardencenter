import { useEffect, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";

export default function Hero() {
  const [vineWidth, setVineWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setVineWidth(100), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Interior luminoso con plantas verdes"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 lg:py-0">
        <div className="max-w-2xl">
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-primary-foreground leading-tight mb-2"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15)" }}
          >
            Tu jardín evoluciona.
            <br />
            <span className="italic">Vos también.</span>
          </h1>

          {/* Vine animation */}
          <div className="h-[3px] bg-accent/70 rounded-full my-6 transition-all duration-[1500ms] ease-out"
            style={{ width: `${vineWidth}%`, maxWidth: "320px" }}
          />

          <p
            className="text-lg sm:text-xl text-primary-foreground/85 font-sans leading-relaxed mb-10 max-w-lg"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
          >
            No es solo un vivero. Es un lugar para quienes quieren aprender a cuidar y crecer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#memberships"
              className="inline-flex items-center justify-center bg-accent text-accent-foreground px-8 py-4 rounded-full text-base font-semibold hover:bg-verdea-gold-light transition-all hover:scale-105 shadow-lg"
            >
              🌿 Empezar a evolucionar
            </a>
            <a
              href="#ecosystem"
              className="inline-flex items-center justify-center border-2 border-primary-foreground/40 text-primary-foreground px-8 py-4 rounded-full text-base font-medium hover:bg-primary-foreground/10 transition-all"
            >
              Descubrir cómo funciona
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <span className="text-primary-foreground/60 text-xs font-sans tracking-widest uppercase">Explorá</span>
        <div className="w-px h-8 bg-primary-foreground/40" />
      </div>
    </section>
  );
}
