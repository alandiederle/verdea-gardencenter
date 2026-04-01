import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Leaf, TreePine, Flower2 } from "lucide-react";

const plans = [
  {
    name: "Semilla",
    icon: <Leaf className="w-6 h-6" />,
    price: "Gratis",
    multiplier: "x1",
    features: ["Acceso básico al club", "Sorteos estándar", "Newsletter"],
    color: "bg-slate-100",
    textColor: "text-slate-900",
    border: "border-slate-200",
    button: "bg-slate-900 text-white"
  },
  {
    name: "Brote",
    icon: <Zap className="w-6 h-6" />,
    price: "$5",
    multiplier: "x1.25",
    features: ["1 ticket bonus mensual", "Acceso anticipado a ofertas", "Descuento en subastas"],
    color: "bg-emerald-50",
    textColor: "text-emerald-900",
    border: "border-emerald-200",
    button: "bg-emerald-600 text-white"
  },
  {
    name: "Flor",
    icon: <Flower2 className="w-6 h-6" />,
    price: "$10",
    multiplier: "x2",
    features: ["3 tickets bonus", "Envío bonificado", "Regalo trimestral", "Sorteos exclusivos"],
    color: "bg-fuchsia-50",
    textColor: "text-fuchsia-900",
    border: "border-fuchsia-200",
    button: "bg-fuchsia-600 text-white",
    popular: true
  },
  {
    name: "Árbol",
    icon: <TreePine className="w-6 h-6" />,
    price: "$25",
    multiplier: "x4",
    features: ["10 tickets bonus", "Acceso anticipado 48h", "Regalo mensual premium", "Doble participación subastas"],
    color: "bg-[#1a1c1a]", // Verde bosque muy oscuro
    textColor: "text-white",
    border: "border-amber-500/50",
    button: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
    premium: true
  }
];

export default function Memberships() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Elegí cómo querés crecer</h2>
          <p className="text-muted-foreground font-sans max-w-xl mx-auto italic">
            La evolución natural de tu experiencia en Verdie. Cada nivel desbloquea nuevas capas de tu ecosistema.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className={`relative p-8 rounded-[2rem] border-2 ${plan.border} ${plan.color} ${plan.textColor} flex flex-col h-full shadow-xl`}
            >
              {/* Badge de "Más Elegido" o "Máxima Evolución" */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-fuchsia-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Más Elegido
                </div>
              )}
              {plan.premium && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles size={10} /> Máxima Evolución
                </div>
              )}

              {/* Header del Plan */}
              <div className="mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${plan.premium ? 'bg-amber-500/10 text-amber-500' : 'bg-current opacity-10 text-inherit'}`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.price !== "Gratis" && <span className="text-xs opacity-60">/mes</span>}
                </div>
              </div>

              {/* Multiplicador de XP (Factor de Gamificación) */}
              <div className={`mb-8 p-3 rounded-xl border border-current/10 flex items-center justify-between`}>
                <span className="text-[10px] font-black uppercase tracking-widest">Multiplicador XP</span>
                <span className={`text-lg font-black ${plan.premium ? 'text-amber-500' : ''}`}>{plan.multiplier}</span>
              </div>

              {/* Características */}
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-tight">
                    <Check className="w-4 h-4 shrink-0 mt-0.5 opacity-60" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Botón de Acción */}
              <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-lg ${plan.button}`}>
                {plan.price === "Gratis" ? "Empezar ahora" : `Elegir ${plan.name}`}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-center mt-12 text-xs text-muted-foreground">
          * Podés cancelar o cambiar de plan en cualquier momento desde tu Ecosistema.
        </p>
      </div>
    </section>
  );
}
