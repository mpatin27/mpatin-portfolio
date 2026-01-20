import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import CV from './pages/CV'
import Contact from './pages/Contact'

function App() {
  return (
    <Router>
      {/* GLOBAL THEME : Fond très sombre, texte gris clair, police monospace */}
      <div className="min-h-screen bg-slate-950 text-slate-300 font-mono selection:bg-green-500 selection:text-black">
        <Navbar />
        
        <main className="pb-12"> {/* Padding bottom pour pas coller au footer */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
          <p>echo "© 2024 - Matheo. All rights reserved."</p>
        </footer>
      </div>
    </Router>
  )
}

export default App