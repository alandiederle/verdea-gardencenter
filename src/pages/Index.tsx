import Navbar from "@/components/verdea/Navbar";
import Hero from "@/components/verdea/Hero";
import Problem from "@/components/verdea/Problem";
import Ecosystem from "@/components/verdea/Ecosystem";
import Tickets from "@/components/verdea/Tickets";
import Memberships from "@/components/verdea/Memberships";
import Catalog from "@/components/verdea/Catalog";
import Auctions from "@/components/verdea/Auctions";
import Community from "@/components/verdea/Community";
import Manifesto from "@/components/verdea/Manifesto";
import FAQ from "@/components/verdea/FAQ";
import FinalCTA from "@/components/verdea/FinalCTA";
import Footer from "@/components/verdea/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Problem />
      <Ecosystem />
      <Tickets />
      <Memberships />
      <Catalog />
      <Auctions />
      <Community />
      <Manifesto />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default Index;
