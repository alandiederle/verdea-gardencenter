import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShoppingBag, Star, Ticket } from "lucide-react";

const products = [
  { name: "Monstera Deliciosa", price: 4500, points: 450, img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop" },
  { name: "Ficus Lyrata", price: 6200, points: 620, img: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop" },
  { name: "Suculenta Mix (x3)", price: 1800, points: 180, img: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&h=400&fit=crop" },
  { name: "Potus Dorado", price: 2200, points: 220, img: "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=400&h=400&fit=crop" },
  { name: "Sansevieria Moonshine", price: 3500, points: 350, img: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=400&fit=crop" },
  { name: "Kit Herramientas Premium", price: 8900, points: 890, img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop" },
  { name: "Maceta Cerámica Artesanal", price: 3200, points: 320, img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop" },
  { name: "Helecho Boston", price: 2800, points: 280, img: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop&q=80" },
];

export default function Catalog() {
  const { ref, isVisible } = useScrollAnimation();
  const [cart, setCart] = useState<string[]>([]);

  const addToCart = (name: string) => {
    setCart((prev) => [...prev, name]);
  };

  const totalPoints = cart.reduce((sum, name) => {
    const p = products.find((pr) => pr.name === name);
    return sum + (p?.points || 0);
  }, 0);

  return (
    <section id="catalog" className="py-24 lg:py-32 bg-muted/30">
      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-4">
          <p className={`text-sm font-sans text-secondary uppercase tracking-widest mb-3 transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            Cada planta es un paso
          </p>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Evolucioná con cada compra
          </h2>
        </div>

        {/* Cart summary bar */}
        {cart.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-card rounded-xl border border-border flex items-center justify-between animate-fade-up">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-secondary" />
              <span className="text-sm font-sans text-foreground">
                {cart.length} {cart.length === 1 ? "producto" : "productos"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-sans text-accent font-semibold flex items-center gap-1">
                <Star className="w-4 h-4" /> +{totalPoints} puntos
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Ticket className="w-3 h-3" /> ~{Math.floor(totalPoints / 500)} tickets
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {products.map((product, i) => (
            <div
              key={product.name}
              className={`group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif font-semibold text-foreground text-sm mb-1">
                  {product.name}
                </h3>
                <p className="text-lg font-bold font-sans text-foreground">
                  ${product.price.toLocaleString()}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-accent font-sans font-medium">
                    +{product.points} pts
                  </span>
                  <span className="text-[10px] text-muted-foreground font-sans">
                    Canjeable: {(product.points * 5).toLocaleString()} pts
                  </span>
                </div>
                <button
                  onClick={() => addToCart(product.name)}
                  className="w-full mt-3 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold font-sans hover:bg-secondary transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
