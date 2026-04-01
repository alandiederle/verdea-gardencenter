import Navbar from "@/components/verdea/Navbar";
import ProgressBar from "@/components/verdea/ProgressBar";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  return (
    <main className="min-h-screen bg-background pb-12">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <ProgressBar />
    </main>
  );
};

export default Index;
