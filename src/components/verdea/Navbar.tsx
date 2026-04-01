import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Inicio", to: "/" },
  { label: "Abrir Sobre", to: "/abrir" },
  { label: "Mi Jardín", to: "/mi-jardin" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const showTransparent = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showTransparent
          ? "bg-transparent py-5"
          : "bg-card/95 backdrop-blur-md shadow-lg py-3"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Leaf className={`w-10 h-10 transition-colors ${showTransparent ? "text-primary-foreground" : "text-secondary"} group-hover:text-accent`} />
          <div>
            <span
              className={`font-serif text-2xl font-bold tracking-wide transition-colors ${showTransparent ? "text-primary-foreground" : "text-foreground"}`}
              style={showTransparent ? { textShadow: "0 1px 3px rgba(0,0,0,0.3)" } : {}}
            >
              Verdie
            </span>
            <span className={`block text-[9px] tracking-[0.3em] uppercase font-sans -mt-1 transition-colors ${showTransparent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              Garden Center
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-sans transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all hover:after:w-full ${
                  isActive ? "after:w-full" : "after:w-0"
                } ${
                  showTransparent
                    ? "text-primary-foreground/80 hover:text-primary-foreground after:bg-primary-foreground"
                    : "text-muted-foreground hover:text-foreground after:bg-secondary"
                }`}
                style={showTransparent ? { textShadow: "0 1px 2px rgba(0,0,0,0.25)" } : {}}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/abrir"
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-secondary transition-colors"
          >
            🌿 Abrir Sobre
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden p-2 ${showTransparent ? "text-primary-foreground" : "text-foreground"}`}
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
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-sans py-2 border-b border-border/50 ${
                  location.pathname === link.to
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/abrir"
              className="bg-primary text-primary-foreground px-5 py-3 rounded-full text-sm font-medium text-center mt-2"
            >
              🌿 Abrir Sobre
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
