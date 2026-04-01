import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DiscoveriesProvider } from "@/context/DiscoveriesContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import RitualPage from "./pages/RitualPage";
import ColeccionPage from "./pages/ColeccionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DiscoveriesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />}>
              <Route index element={<Home />} />
              <Route path="abrir" element={<RitualPage />} />
              <Route path="mi-jardin" element={<ColeccionPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DiscoveriesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
