import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Cómo funcionan los puntos?",
    a: "Cada compra te da puntos según tu nivel de membresía. Los puntos se acumulan y podés canjearlos por productos, descuentos o participaciones en sorteos.",
  },
  {
    q: "¿Los tickets vencen?",
    a: "No, tus tickets coleccionables son permanentes. Podés guardarlos o usarlos en cualquier subasta futura.",
  },
  {
    q: "¿Puedo subir de nivel?",
    a: "¡Sí! Podés cambiar tu membresía en cualquier momento. Al subir de nivel, tu multiplicador de puntos aumenta inmediatamente.",
  },
  {
    q: "¿Las subastas son reales?",
    a: "100% reales. Cada subasta tiene un premio físico que se entrega al ganador. Cuantos más tickets aportás, más chances tenés de ganar.",
  },
  {
    q: "¿Cómo canjeo premios?",
    a: "Desde tu perfil podés ver los premios disponibles y canjear con tus puntos acumulados. Los envíos se realizan en 48-72hs.",
  },
];

export default function FAQ() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="faq" className="py-24 lg:py-32 bg-background">
      <div ref={ref} className="container mx-auto px-4 max-w-3xl">
        <h2
          className={`text-3xl sm:text-4xl font-serif font-bold text-foreground text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Preguntas frecuentes
        </h2>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className={`bg-card rounded-xl border border-border px-6 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <AccordionTrigger className="font-serif font-semibold text-foreground text-left hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-sans leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
