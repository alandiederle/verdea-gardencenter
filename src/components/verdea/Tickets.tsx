import { useState, useRef, useCallback, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Volume2, VolumeX } from "lucide-react";

/* ─── Rarities ─── */
const rarities = [
  {
    name: "Hoja Común",
    chance: 45,
    label: "45%",
    color: "bg-[hsl(140,20%,88%)]",
    barColor: "bg-[hsl(140,25%,65%)]",
    glowColor: "hsl(140,25%,65%)",
    textColor: "text-[hsl(150,30%,25%)]",
    microcopy: "Cada jardín empieza por algo.",
    tier: 0,
  },
  {
    name: "Follaje Selecto",
    chance: 30,
    label: "30%",
    color: "bg-[hsl(147,30%,82%)]",
    barColor: "bg-[hsl(147,35%,50%)]",
    glowColor: "hsl(147,35%,50%)",
    textColor: "text-[hsl(147,40%,20%)]",
    microcopy: "Buen crecimiento.",
    tier: 1,
  },
  {
    name: "Especie Especial",
    chance: 15,
    label: "15%",
    color: "bg-[hsl(340,35%,88%)]",
    barColor: "bg-[hsl(340,45%,65%)]",
    glowColor: "hsl(340,45%,65%)",
    textColor: "text-[hsl(340,40%,30%)]",
    microcopy: "Esto empieza a ponerse interesante.",
    tier: 2,
  },
  {
    name: "Colección Exótica",
    chance: 8,
    label: "8%",
    color: "bg-[hsl(30,40%,85%)]",
    barColor: "bg-[hsl(30,55%,50%)]",
    glowColor: "hsl(30,55%,50%)",
    textColor: "text-[hsl(30,50%,22%)]",
    microcopy: "Una pieza poco común.",
    tier: 3,
  },
  {
    name: "Pieza Botánica Única",
    chance: 2,
    label: "2%",
    color: "bg-[hsl(43,55%,85%)]",
    barColor: "bg-[hsl(43,65%,50%)]",
    glowColor: "hsl(43,65%,50%)",
    textColor: "text-[hsl(43,50%,20%)]",
    microcopy: "Encontraste algo extraordinario.",
    tier: 4,
  },
];

function getRandomRarity(): number {
  const rand = Math.random() * 100;
  if (rand < 2) return 4;
  if (rand < 10) return 3;
  if (rand < 25) return 2;
  if (rand < 55) return 1;
  return 0;
}

/* ─── Leaf particle icons (SVG paths) ─── */
const leafShapes = [
  // simple leaf
  "M12 2C8 6 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z",
  // rounded leaf
  "M12 2C6.5 6.5 3 11 3 15c0 3.9 4 7 9 7s9-3.1 9-7c0-4-3.5-8.5-9-13z",
];

/* ─── Particles Component ─── */
function NatureParticles({ tier, active }: { tier: number; active: boolean }) {
  if (!active) return null;

  const count = tier >= 4 ? 24 : tier >= 3 ? 18 : tier >= 2 ? 14 : 8;
  const isLegendary = tier >= 4;
  const isExotic = tier >= 3;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Golden dust particles */}
      {Array.from({ length: count }).map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const duration = 2.5 + Math.random() * 2;
        const size = isLegendary ? 4 + Math.random() * 6 : 2 + Math.random() * 4;
        const opacity = isLegendary ? 0.7 + Math.random() * 0.3 : 0.4 + Math.random() * 0.4;

        return (
          <div
            key={`dust-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${30 + Math.random() * 40}%`,
              width: size,
              height: size,
              background: isLegendary
                ? `radial-gradient(circle, hsl(43,65%,70%), hsl(43,55%,50%))`
                : isExotic
                ? `radial-gradient(circle, hsl(30,50%,65%), hsl(30,40%,45%))`
                : `radial-gradient(circle, hsl(140,30%,65%), hsl(140,25%,50%))`,
              opacity: 0,
              animation: `particleFloat ${duration}s ease-out ${delay}s forwards`,
            }}
          />
        );
      })}

      {/* Floating leaves */}
      {Array.from({ length: Math.min(tier >= 2 ? 8 : 4, 10) }).map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 1;
        const duration = 3 + Math.random() * 2;
        const rotation = Math.random() * 360;
        const leafSize = 12 + Math.random() * 10;

        return (
          <svg
            key={`leaf-${i}`}
            className="absolute"
            width={leafSize}
            height={leafSize}
            viewBox="0 0 24 24"
            fill={isLegendary ? "hsl(43,50%,55%)" : "hsl(147,35%,50%)"}
            style={{
              left: `${x}%`,
              top: `${40 + Math.random() * 30}%`,
              opacity: 0,
              transform: `rotate(${rotation}deg)`,
              animation: `leafDrift ${duration}s ease-out ${delay}s forwards`,
            }}
          >
            <path d={leafShapes[i % leafShapes.length]} />
          </svg>
        );
      })}

      {/* Legendary: warm glow */}
      {isLegendary && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 400,
            height: 400,
            background: "radial-gradient(circle, hsl(43,55%,65%,0.25) 0%, transparent 70%)",
            animation: "glowPulse 2.5s ease-out forwards",
          }}
        />
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export default function Tickets() {
  const { ref, isVisible } = useScrollAnimation();
  const [phase, setPhase] = useState<"idle" | "shaking" | "opening" | "revealed">("idle");
  const [resultIndex, setResultIndex] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const result = rarities[resultIndex];

  /* ─── Sound synthesis ─── */
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.08, detune = 0) => {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = frequency;
        osc.detune.value = detune;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Audio not available
      }
    },
    [soundEnabled, getAudioCtx]
  );

  const playOpenSound = useCallback(() => {
    // Rustling paper/leaves
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3)) * 0.04;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 2000;
      filter.Q.value = 0.5;
      source.connect(filter);
      filter.connect(ctx.destination);
      source.start();
    } catch {
      // Audio not available
    }
  }, [soundEnabled, getAudioCtx]);

  const playRevealSound = useCallback(
    (tier: number) => {
      if (!soundEnabled) return;
      if (tier <= 1) {
        // Gentle leaves
        playTone(800, 0.6, "sine", 0.05);
        setTimeout(() => playTone(1000, 0.4, "sine", 0.03), 150);
      } else if (tier === 2) {
        // Bloom
        playTone(523, 0.8, "sine", 0.06);
        setTimeout(() => playTone(659, 0.6, "sine", 0.05), 200);
        setTimeout(() => playTone(784, 0.5, "sine", 0.04), 400);
      } else if (tier === 3) {
        // Deep wood
        playTone(261, 1.0, "triangle", 0.07);
        setTimeout(() => playTone(392, 0.8, "sine", 0.05), 300);
        setTimeout(() => playTone(523, 0.6, "sine", 0.04), 600);
      } else {
        // Legendary crescendo + bell
        playTone(261, 1.5, "sine", 0.06);
        setTimeout(() => playTone(329, 1.2, "sine", 0.06), 200);
        setTimeout(() => playTone(392, 1.0, "sine", 0.07), 400);
        setTimeout(() => playTone(523, 0.8, "sine", 0.08), 600);
        // Bell-like harmonic
        setTimeout(() => {
          playTone(1046, 1.5, "sine", 0.04);
          playTone(1568, 1.2, "sine", 0.02, 5);
        }, 800);
      }
    },
    [soundEnabled, playTone]
  );

  /* ─── Unboxing sequence ─── */
  const openEnvelope = useCallback(() => {
    if (phase !== "idle") return;

    // Step 1: Determine result first
    const idx = getRandomRarity();
    setResultIndex(idx);

    // Step 2: Shake
    setPhase("shaking");
    playOpenSound();

    // Step 3: Open
    setTimeout(() => {
      setPhase("opening");
    }, 500);

    // Step 4: Reveal
    setTimeout(() => {
      setPhase("revealed");
      playRevealSound(idx);

      if (idx >= 1) {
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), idx >= 4 ? 4000 : 3000);
      }
    }, 1200);
  }, [phase, playOpenSound, playRevealSound]);

  const reset = () => {
    setPhase("idle");
    setShowParticles(false);
  };

  /* ─── Envelope animation classes ─── */
  const envelopeClasses = (() => {
    switch (phase) {
      case "shaking":
        return "animate-[envelopeShake_0.4s_ease-in-out]";
      case "opening":
        return "animate-[envelopeOpen_0.7s_ease-out_forwards]";
      case "revealed":
        return "scale-0 opacity-0";
      default:
        return "";
    }
  })();

  const cardVisible = phase === "revealed";

  return (
    <section id="tickets" className="py-24 lg:py-32 bg-muted/30 relative overflow-hidden">
      {/* Particles */}
      <NatureParticles tier={result.tier} active={showParticles} />

      {/* CSS Animations */}
      <style>{`
        @keyframes envelopeShake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          15% { transform: translateX(-3px) rotate(-0.5deg); }
          30% { transform: translateX(3px) rotate(0.5deg); }
          45% { transform: translateX(-2px) rotate(-0.3deg); }
          60% { transform: translateX(2px) rotate(0.3deg); }
          75% { transform: translateX(-1px) rotate(-0.1deg); }
        }
        @keyframes envelopeOpen {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scaleX(0) scaleY(1.1); opacity: 0; }
        }
        @keyframes cardReveal {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.008); }
        }
        @keyframes particleFloat {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-120px) translateX(${Math.random() > 0.5 ? '' : '-'}30px) scale(1.2); }
        }
        @keyframes leafDrift {
          0% { opacity: 0; transform: translateY(0) rotate(0deg); }
          15% { opacity: 0.7; }
          100% { opacity: 0; transform: translateY(-100px) translateX(40px) rotate(180deg); }
        }
        @keyframes glowPulse {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        @keyframes warmGlow {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.5); }
        }
      `}</style>

      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            La magia del crecimiento
          </h2>
          <p
            className={`text-lg font-sans text-muted-foreground transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Cada compra te da sobres digitales. Abrilos y descubrí qué tesoro botánico te espera.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 max-w-5xl mx-auto">
          {/* ─── Envelope / Card area ─── */}
          <div
            className={`flex-1 flex flex-col items-center transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Sound toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="self-end mb-3 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
              aria-label={soundEnabled ? "Silenciar" : "Activar sonido"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <div className="relative w-72 h-96 flex items-center justify-center">
              {/* Envelope */}
              {phase !== "revealed" && (
                <div
                  className={`absolute inset-0 rounded-3xl border-2 border-border bg-card cursor-pointer
                    hover:border-secondary/30 hover:shadow-lg transition-all duration-300
                    ${phase === "idle" ? "animate-[breathe_4s_ease-in-out_infinite]" : ""}
                    ${envelopeClasses}`}
                  onClick={phase === "idle" ? openEnvelope : undefined}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                    {/* Botanical envelope illustration */}
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-2">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-secondary">
                        <path
                          d="M12 2C8 6 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z"
                          fill="currentColor"
                          opacity="0.2"
                        />
                        <path
                          d="M12 2C8 6 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        <path d="M12 22V8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                      </svg>
                    </div>
                    <span className="font-serif text-xl text-foreground font-semibold">
                      Sobre Digital
                    </span>
                    <span className="text-sm text-muted-foreground font-sans">
                      Tocá para descubrir
                    </span>
                    <div className="mt-3 w-12 h-0.5 bg-border rounded-full" />
                  </div>
                </div>
              )}

              {/* Revealed card */}
              {cardVisible && (
                <div
                  className={`absolute inset-0 rounded-3xl border border-border/50 ${result.color} shadow-xl cursor-pointer
                    flex flex-col items-center justify-center gap-3 p-8`}
                  style={{
                    animation: "cardReveal 0.6s ease-out forwards",
                  }}
                  onClick={reset}
                >
                  {/* Warm center glow for tier 3+ */}
                  {result.tier >= 3 && (
                    <div
                      className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
                    >
                      <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${result.glowColor}40 0%, transparent 70%)`,
                          animation: "warmGlow 3s ease-out forwards",
                        }}
                      />
                    </div>
                  )}

                  {/* Legendary halo */}
                  {result.tier >= 4 && (
                    <div className="absolute -inset-2 rounded-[2rem] pointer-events-none"
                      style={{
                        background: `conic-gradient(from 0deg, transparent, hsl(43,55%,65%,0.15), transparent, hsl(43,55%,65%,0.1), transparent)`,
                        animation: "spin 8s linear infinite",
                      }}
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center gap-3">
                    {/* Decorative botanical line */}
                    <svg width="40" height="2" className="mb-2 opacity-40">
                      <line x1="0" y1="1" x2="40" y2="1" stroke="currentColor" strokeWidth="1" />
                    </svg>

                    <span className={`font-serif text-2xl font-bold ${result.textColor} text-center leading-tight`}>
                      {result.name}
                    </span>

                    <div className="w-8 h-px bg-current opacity-20 my-1" />

                    <p className={`text-sm font-sans ${result.textColor} opacity-70 text-center italic`}>
                      {result.microcopy}
                    </p>

                    <span className="text-xs text-muted-foreground mt-6 font-sans">
                      Tocá para abrir otro
                    </span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground font-sans mt-6 italic">
              "La suerte también florece."
            </p>
          </div>

          {/* ─── Rarities list ─── */}
          <div
            className={`flex-1 space-y-3 transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
              Categorías de rareza
            </h3>
            {rarities.map((r, i) => (
              <div
                key={r.name}
                className="flex items-center gap-4 p-3.5 rounded-xl bg-card border border-border/60 hover:border-border transition-colors"
              >
                {/* Colored dot instead of emoji */}
                <div
                  className={`w-3 h-3 rounded-full ${r.barColor} shrink-0`}
                />
                <div className="flex-1 min-w-0">
                  <span className="font-serif font-semibold text-foreground text-sm">
                    {r.name}
                  </span>
                  <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${r.barColor} rounded-full transition-all duration-1000`}
                      style={{
                        width: isVisible ? r.label : "0%",
                        transitionDelay: `${800 + i * 150}ms`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-sans font-medium tabular-nums">
                  {r.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
