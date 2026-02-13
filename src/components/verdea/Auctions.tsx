import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Trophy, Ticket } from "lucide-react";

export default function Auctions() {
  const { ref, isVisible } = useScrollAnimation();
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 47, s: 12 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  const participants = [
    { name: "María G.", tickets: 42 },
    { name: "Carlos R.", tickets: 38 },
    { name: "Ana L.", tickets: 27 },
    { name: "Pedro M.", tickets: 19 },
    { name: "Lucía S.", tickets: 14 },
  ];

  return (
    <section id="auctions" className="py-24 lg:py-32 bg-background">
      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Cuanto más participás,
            <br />
            <span className="italic text-secondary">más chances tenés.</span>
          </h2>
          <p className={`text-muted-foreground font-sans transition-all duration-700 delay-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            No es solo suerte. Es compromiso.
          </p>
        </div>

        <div className={`max-w-4xl mx-auto bg-card rounded-3xl border border-border overflow-hidden shadow-lg transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid lg:grid-cols-2">
            {/* Plant image */}
            <div className="aspect-square lg:aspect-auto bg-muted">
              <img
                src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&h=500&fit=crop"
                alt="Planta premium de subasta"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Auction details */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-accent uppercase tracking-wider mb-3">
                  <Trophy className="w-3.5 h-3.5" /> Subasta activa
                </span>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Ficus Lyrata XL Premium
                </h3>
                <p className="text-sm text-muted-foreground font-sans mb-6">
                  Ejemplar único de 1.5m, maceta artesanal incluida.
                </p>

                {/* Countdown - prominent */}
                <div className="mb-8">
                  <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider mb-3">Finaliza en</p>
                  <div className="flex gap-3">
                    {[
                      { val: pad(timeLeft.h), label: "Horas" },
                      { val: pad(timeLeft.m), label: "Min" },
                      { val: pad(timeLeft.s), label: "Seg" },
                    ].map(({ val, label }) => (
                      <div key={label} className="bg-muted rounded-xl px-4 py-3 text-center min-w-[72px]">
                        <span className="text-3xl font-bold font-sans text-foreground tabular-nums block leading-none mb-1">{val}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ranking */}
              <div>
                <h4 className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5" /> Ranking de tickets
                </h4>
                <div className="space-y-2">
                  {participants.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="text-xs font-sans font-bold text-foreground w-5">{i + 1}</span>
                      <span className="flex-1 text-sm font-sans text-foreground">{p.name}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-1000"
                          style={{
                            width: isVisible ? `${(p.tickets / 42) * 100}%` : "0%",
                            transitionDelay: `${600 + i * 100}ms`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-sans w-8 text-right">{p.tickets}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
