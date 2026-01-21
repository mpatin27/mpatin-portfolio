import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import CV from './pages/CV'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      {/* 2. On ajoute 'flex flex-col' pour activer le mode colonne flexible */}

      <div className="scanlines"></div>

      <div className="min-h-screen bg-slate-950 text-slate-300 font-mono selection:bg-green-500 selection:text-black flex flex-col">
        
        <Navbar />
        
        {/* 3. On ajoute 'flex-grow' : ça dit au Main de grandir pour pousser le footer en bas */}
        <main className="flex-grow pb-12"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/contact" element={<Contact />} />

            //Route protégée autour de l'Admin
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* 4. On utilise notre nouveau composant */}
        <Footer />
        
      </div>
    </Router>
  )
}

export default App