import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-7 h-7 text-accent" />
            <span className="font-serif font-bold text-xl">Verdie</span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-primary-foreground/60 font-sans ml-1">
              Garden Center
            </span>
          </div>

          <div className="flex gap-8 text-sm font-sans text-primary-foreground/70">
            <a href="#" className="hover:text-primary-foreground transition-colors">Términos</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Privacidad</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Contacto</a>
          </div>

          <p className="text-xs font-sans text-primary-foreground/50">
            © 2026 Verdie. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
