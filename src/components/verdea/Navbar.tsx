import { useState, useEffect } from "react";
import { Leaf, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Inicio", href: "#hero" },
  { label: "Cómo funciona", href: "#ecosystem" },
  { label: "Tickets", href: "#tickets" },
  { label: "Membresías", href: "#memberships" },
  { label: "Catálogo", href: "#catalog" },
  { label: "Comunidad", href: "#community" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <Leaf className={`w-7 h-7 transition-colors ${scrolled ? "text-secondary" : "text-primary-foreground"} group-hover:text-accent`} />
          <div>
            <span className={`font-serif text-xl font-bold tracking-wide transition-colors ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
              style={!scrolled ? { textShadow: "0 1px 3px rgba(0,0,0,0.3)" } : {}}
            >
              Verdea
            </span>
            <span className={`block text-[9px] tracking-[0.3em] uppercase font-sans -mt-1 transition-colors ${scrolled ? "text-muted-foreground" : "text-primary-foreground/70"}`}>
              Garden Center
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-sans transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:transition-all hover:after:w-full ${
                scrolled
                  ? "text-muted-foreground hover:text-foreground after:bg-secondary"
                  : "text-primary-foreground/80 hover:text-primary-foreground after:bg-primary-foreground"
              }`}
              style={!scrolled ? { textShadow: "0 1px 2px rgba(0,0,0,0.25)" } : {}}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#final-cta"
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-secondary transition-colors"
          >
            🌿 Unirme
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden p-2 ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card/98 backdrop-blur-md border-t border-border animate-fade-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-sans text-muted-foreground hover:text-foreground py-2 border-b border-border/50"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#final-cta"
              onClick={() => setMobileOpen(false)}
              className="bg-primary text-primary-foreground px-5 py-3 rounded-full text-sm font-medium text-center mt-2"
            >
              🌿 Unirme a Verdea
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
