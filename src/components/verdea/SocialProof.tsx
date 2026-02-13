import { useState, useEffect } from "react";
import { Leaf } from "lucide-react";

const notifications = [
  { name: "Valentina R.", action: "abrió un Follaje Selecto" },
  { name: "Martín L.", action: "sumó 450 puntos" },
  { name: "Sofía P.", action: "subió al nivel Flor" },
  { name: "Carlos R.", action: "ganó una subasta" },
  { name: "Ana M.", action: "abrió una Pieza Botánica Única" },
  { name: "Pedro G.", action: "canjeó un regalo sorpresa" },
  { name: "Lucía S.", action: "abrió una Especie Especial" },
  { name: "Diego F.", action: "se unió al Club Semilla" },
];

export default function SocialProof() {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Initial delay
    const initialDelay = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    }, 8000);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    }, 15000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  const notification = notifications[currentIndex];

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 max-w-[300px] transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0 translate-x-0"
          : "opacity-0 translate-y-4 -translate-x-4"
      }`}
    >
      <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl p-4 shadow-lg flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
          <Leaf className="w-4 h-4 text-secondary" />
        </div>
        <div>
          <p className="text-sm font-sans text-foreground leading-tight">
            <span className="font-semibold">{notification.name}</span>{" "}
            <span className="text-muted-foreground">{notification.action}</span>
          </p>
          <p className="text-[10px] text-muted-foreground font-sans mt-0.5">Hace un momento</p>
        </div>
      </div>
    </div>
  );
}
