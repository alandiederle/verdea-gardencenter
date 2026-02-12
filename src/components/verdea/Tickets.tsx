import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Sparkles } from "lucide-react";

const rarities = [
  { name: "Semilla", emoji: "🌱", color: "from-green-200 to-green-400", chance: "45%", textColor: "text-green-800" },
  { name: "Brote", emoji: "🌿", color: "from-emerald-200 to-emerald-500", chance: "30%", textColor: "text-emerald-800" },
  { name: "Flor", emoji: "🌸", color: "from-pink-200 to-pink-400", chance: "15%", textColor: "text-pink-800" },
  { name: "Árbol", emoji: "🌳", color: "from-amber-200 to-amber-500", chance: "8%", textColor: "text-amber-800" },
  { name: "Legendaria", emoji: "🌺", color: "from-verdea-gold-light to-verdea-gold", chance: "2%", textColor: "text-amber-900" },
];

function getRandomRarity() {
  const rand = Math.random() * 100;
  if (rand < 2) return 4;
  if (rand < 10) return 3;
  if (rand < 25) return 2;
  if (rand < 55) return 1;
  return 0;
}

export default function Tickets() {
  const { ref, isVisible } = useScrollAnimation();
  const [revealed, setRevealed] = useState(false);
  const [resultIndex, setResultIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const openEnvelope = () => {
    const idx = getRandomRarity();
    setResultIndex(idx);
    setRevealed(true);
    if (idx >= 2) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  };

  const reset = () => {
    setRevealed(false);
    setShowConfetti(false);
  };

  const result = rarities[resultIndex];

  return (
    <section id="tickets" className="py-24 lg:py-32 bg-muted/30 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              className="absolute text-lg animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {["🍃", "🌿", "🍂", "🌱"][Math.floor(Math.random() * 4)]}
            </span>
          ))}
        </div>
      )}

      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            La magia del crecimiento
          </h2>
          <p className={`text-lg font-sans text-muted-foreground transition-all duration-700 delay-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            Cada compra te da sobres digitales. Abrilos y descubrí qué rareza te toca.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 max-w-5xl mx-auto">
          {/* Envelope mockup */}
          <div className={`flex-1 flex flex-col items-center transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div
              className={`relative w-72 h-96 rounded-3xl border-2 transition-all duration-700 cursor-pointer group ${
                revealed
                  ? `bg-gradient-to-br ${result.color} border-transparent shadow-2xl`
                  : "bg-card border-border hover:border-secondary/50 hover:shadow-xl"
              }`}
              onClick={!revealed ? openEnvelope : reset}
            >
              {!revealed ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                  <div className="text-6xl mb-2">🎋</div>
                  <span className="font-serif text-xl text-foreground font-semibold">Sobre Digital</span>
                  <span className="text-sm text-muted-foreground font-sans">Tocá para abrir</span>
                  <div className="mt-4 w-16 h-1 bg-secondary/30 rounded-full group-hover:bg-secondary/60 transition-colors" />
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 animate-fade-up">
                  <Sparkles className="w-6 h-6 text-accent mb-2" />
                  <span className="text-6xl mb-2">{result.emoji}</span>
                  <span className={`font-serif text-2xl font-bold ${result.textColor}`}>
                    {result.name}
                  </span>
                  <span className="text-sm text-foreground/70 font-sans">
                    ¡Ticket {result.name.toLowerCase()} revelado!
                  </span>
                  <span className="text-xs text-muted-foreground mt-4 font-sans">
                    Tocá para abrir otro
                  </span>
                </div>
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground font-sans mt-6 italic">
              "La suerte también florece."
            </p>
          </div>

          {/* Rarities list */}
          <div className={`flex-1 space-y-4 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
              Niveles de rareza
            </h3>
            {rarities.map((r, i) => (
              <div
                key={r.name}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-secondary/20 transition-colors"
              >
                <span className="text-3xl">{r.emoji}</span>
                <div className="flex-1">
                  <span className="font-serif font-semibold text-foreground text-sm">{r.name}</span>
                  <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${r.color} rounded-full transition-all duration-1000`}
                      style={{
                        width: isVisible ? r.chance : "0%",
                        transitionDelay: `${800 + i * 150}ms`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-sans font-medium">{r.chance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
