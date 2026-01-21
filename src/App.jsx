import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- PAGES ---
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import CV from './pages/CV';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CommandPalette from './components/CommandPalette';

// Composant interne pour gérer les animations de routes
// (Nécessaire car useLocation() ne fonctionne qu'à l'intérieur du Router)
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* La clé (key) force React à recharger le composant pour jouer l'animation de sortie */}
      <Routes location={location} key={location.pathname}>
        
        {/* Routes Publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        
        {/* Route Admin Protégée */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />

        {/* Route 404 (Catch-all) */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0B1120] text-slate-300 selection:bg-green-500/30 selection:text-green-200 font-mono flex flex-col">
        
        <Navbar />
        
        {/* La Command Palette est chargée partout mais cachée par défaut (Ctrl+K) */}
        <CommandPalette />

        <div className="flex-grow">
          <AnimatedRoutes />
        </div>

        <Footer />
        
      </div>
    </Router>
  );
}

export default App;