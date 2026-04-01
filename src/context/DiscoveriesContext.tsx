import { createContext, useContext, useState, type ReactNode } from "react";
import type { Discovery } from "@/components/verdea/sobres/DiscoveryGallery";

interface DiscoveriesContextType {
  discoveries: Discovery[];
  addDiscovery: (d: Discovery) => void;
}

const DiscoveriesContext = createContext<DiscoveriesContextType | null>(null);

export function DiscoveriesProvider({ children }: { children: ReactNode }) {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const addDiscovery = (d: Discovery) => setDiscoveries(prev => [...prev, d]);

  return (
    <DiscoveriesContext.Provider value={{ discoveries, addDiscovery }}>
      {children}
    </DiscoveriesContext.Provider>
  );
}

export function useDiscoveries() {
  const ctx = useContext(DiscoveriesContext);
  if (!ctx) throw new Error("useDiscoveries must be used within DiscoveriesProvider");
  return ctx;
}
