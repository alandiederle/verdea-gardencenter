import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Users, Heart } from "lucide-react";

const testimonials = [
  { name: "Valentina R.", text: "Verdie cambió mi forma de cuidar plantas. El sistema de puntos es adictivo.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
  { name: "Martín L.", text: "Gané una Monstera XXL en la subasta. El mejor día de mi vida verde.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
  { name: "Sofía P.", text: "La comunidad es increíble. Aprendí más en 2 meses que en 5 años sola.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
];

const stats = [
  { label: "Miembros activos", value: 3247 },
  { label: "Plantas entregadas", value: 12580 },
  { label: "Premios sorteados", value: 890 },
];

function AnimatedCounter({ target, isVisible }: { target: number; isVisible: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target]);
  return <span>{count.toLocaleString()}</span>;
}

export default function Community() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="community" className="py-24 lg:py-32 bg-muted/30">
      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Crecer juntos es mejor.
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <p className="text-3xl sm:text-4xl font-bold font-sans text-secondary">
                +<AnimatedCounter target={stat.value} isVisible={isVisible} />
              </p>
              <p className="text-sm text-muted-foreground font-sans mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${500 + i * 150}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <span className="font-sans font-semibold text-foreground text-sm">{t.name}</span>
                  <span className="block text-xs text-accent">Miembro Verdie</span>
                </div>
                <Heart className="w-4 h-4 text-destructive ml-auto" />
              </div>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed italic">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
