import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    // Changement ici : bg-slate-900 et text-white
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Terminal style */}
          <Link to="/" className="text-xl font-bold text-green-500 font-mono">
            &lt;Matheo PATIN /&gt;
          </Link>

          <div className="flex space-x-8 font-mono text-sm">
            <Link to="/" className="text-slate-300 hover:text-green-400 transition">~/Accueil</Link>
            <Link to="/portfolio" className="text-slate-300 hover:text-green-400 transition">~/Projets</Link>
            <Link to="/cv" className="text-slate-300 hover:text-green-400 transition">~/CV</Link>
            <Link to="/contact" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition border border-green-500">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}