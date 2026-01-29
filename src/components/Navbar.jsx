import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fermer le menu automatiquement quand on change de page
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Surveiller l'état de connexion
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    // Z-index très haut (100) pour rester au dessus de tout
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <Link to="/" className="text-xl font-bold text-green-500 font-mono z-[102] flex items-center gap-2">
            <span>&gt;_</span> Matheo PATIN
          </Link>

          {/* --- MENU DESKTOP (Visible uniquement sur LG) --- */}
          <div className="hidden lg:flex items-center space-x-6 font-mono text-sm">
            <Link to="/" className="text-slate-300 hover:text-green-400 transition">~/Accueil</Link>
            <Link to="/portfolio" className="text-slate-300 hover:text-green-400 transition">~/Projets</Link>
            <Link to="/cv" className="text-slate-300 hover:text-green-400 transition">~/CV</Link>
            
            {session ? (
              <>
                <Link to="/admin" className="text-purple-400 hover:text-purple-300 transition font-bold border border-purple-500/30 px-3 py-1 rounded bg-purple-500/10">
                  ADMIN_PANEL
                </Link>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition font-bold border border-red-500/30 px-3 py-1 rounded bg-red-500/10">
                  EXIT
                </button>
              </>
            ) : (
              <Link to="/contact" className="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-500 transition font-bold shadow-lg shadow-green-900/20">
                Contact
              </Link>
            )}
          </div>

          {/* --- BOUTON BURGER MOBILE --- */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-green-500 focus:outline-none z-[102] p-2">
            {isOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* --- MENU MOBILE (SOLID & CLEAN) --- */}
      {/* top-16 pour commencer SOUS la barre de navigation */}
      <div className={`
        fixed inset-0 top-16 bg-slate-950 z-[101] transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col items-center justify-start pt-10 space-y-6 border-t border-slate-800
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <Link to="/" className="text-xl font-mono text-slate-300 hover:text-green-400 w-full text-center py-2">~/Accueil</Link>
        <Link to="/portfolio" className="text-xl font-mono text-slate-300 hover:text-green-400 w-full text-center py-2">~/Projets</Link>
        <Link to="/cv" className="text-xl font-mono text-slate-300 hover:text-green-400 w-full text-center py-2">~/CV</Link>
        
        {session ? (
          <div className="flex flex-col gap-4 w-full px-8 items-center pt-8 border-t border-slate-800/50 mt-4">
            <Link to="/admin" className="text-xl font-mono text-purple-400 border border-purple-500 px-8 py-3 rounded bg-purple-500/10 w-full text-center">
              ADMIN_PANEL
            </Link>
            <button onClick={handleLogout} className="text-xl font-mono text-red-500 border border-red-500 px-8 py-3 rounded bg-red-500/10 w-full text-center">
              DECONNEXION
            </button>
          </div>
        ) : (
          <div className="pt-8 w-full px-8">
            <Link to="/contact" className="text-xl font-mono text-black bg-green-500 px-8 py-3 rounded font-bold w-full text-center block">
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}