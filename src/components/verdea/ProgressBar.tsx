import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";

const levels = [
  { name: "Semilla", min: 0, max: 500 },
  { name: "Brote", min: 500, max: 2000 },
  { name: "Flor", min: 2000, max: 5000 },
  { name: "Árbol", min: 5000, max: 15000 },
];

export default function ProgressBar() {
  const [visible, setVisible] = useState(false);
  const currentPoints = 1240;
  const currentLevel = levels.find((l) => currentPoints >= l.min && currentPoints < l.max) || levels[0];
  const progress = ((currentPoints - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;
  const pointsToNext = currentLevel.max - currentPoints;

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border py-2.5 px-4 transition-all duration-300 animate-fade-in">
      <div className="container mx-auto flex items-center gap-4 max-w-4xl">
        <div className="flex items-center gap-2 shrink-0">
          <TrendingUp className="w-4 h-4 text-secondary" />
          <span className="text-xs font-sans font-semibold text-foreground hidden sm:inline">
            Nivel {currentLevel.name}
          </span>
        </div>

        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[11px] font-sans text-muted-foreground shrink-0 whitespace-nowrap">
          <span className="font-semibold text-foreground">{currentPoints.toLocaleString()}</span> pts
          <span className="hidden sm:inline"> · Faltan {pointsToNext.toLocaleString()} para subir</span>
        </span>
      </div>
    </div>
  );
}
