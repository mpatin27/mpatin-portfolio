import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Fonction pour fermer le menu quand on clique sur un lien
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <Link to="/" onClick={closeMenu} className="text-xl font-bold text-green-500 font-mono z-50">
            &lt;Matheo PATIN /&gt;
          </Link>

          {/* --- MENU DESKTOP (Caché sur mobile) --- */}
          <div className="hidden md:flex items-center space-x-8 font-mono text-sm">
            <Link to="/" className="text-slate-300 hover:text-green-400 transition">~/Accueil</Link>
            <Link to="/portfolio" className="text-slate-300 hover:text-green-400 transition">~/Projets</Link>
            <Link to="/cv" className="text-slate-300 hover:text-green-400 transition">~/CV</Link>
            <Link to="/contact" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition border border-green-500 font-bold">
              Contact
            </Link>
          </div>

          {/* --- BOUTON BURGER (Visible uniquement sur mobile) --- */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-green-500 focus:outline-none z-50"
          >
            {/* Icône changeante : Croix (X) si ouvert, Burger (☰) si fermé */}
            {isOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* --- MENU MOBILE (Overlay) --- */}
      {/* On utilise une transition pour que ce soit fluide */}
      <div className={`
        fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-center items-center space-y-8
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <Link to="/" onClick={closeMenu} className="text-2xl font-mono text-slate-300 hover:text-green-400">~/Accueil</Link>
        <Link to="/portfolio" onClick={closeMenu} className="text-2xl font-mono text-slate-300 hover:text-green-400">~/Projets</Link>
        <Link to="/cv" onClick={closeMenu} className="text-2xl font-mono text-slate-300 hover:text-green-400">~/CV</Link>
        <Link to="/contact" onClick={closeMenu} className="text-2xl font-mono text-green-500 border border-green-500 px-6 py-2 rounded">Contact</Link>
      </div>
    </nav>
  )
}