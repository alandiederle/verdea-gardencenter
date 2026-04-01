import { useDiscoveries } from "@/context/DiscoveriesContext";
import DiscoveryGallery from "@/components/verdea/sobres/DiscoveryGallery";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function ColeccionPage() {
  const { discoveries } = useDiscoveries();

  return (
    <section className="pt-24 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            🌱 Mi Jardín
          </h1>
          <p className="text-muted-foreground font-sans text-lg max-w-md mx-auto">
            Tu colección personal de descubrimientos botánicos.
          </p>
        </div>

        {discoveries.length === 0 ? (
          <div className="text-center py-20">
            <Leaf className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <p className="text-muted-foreground font-sans text-lg mb-6">
              Aún no tenés descubrimientos. ¡Abrí tu primer sobre!
            </p>
            <Link
              to="/abrir"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-secondary transition-colors"
            >
              🌿 Abrir un sobre
            </Link>
          </div>
        ) : (
          <DiscoveryGallery discoveries={discoveries} />
        )}
      </div>
    </section>
  );
}
