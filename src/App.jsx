import './App.css'
import ProjectCard from './components/ProjectCard'

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <header>
        <h1>Mon Portfolio</h1>
      </header>
      
      <main>
        <h2>Mes Projets</h2>
        <ProjectCard title="Site E-commerce" description="Une boutique en ligne faite avec React." />
        <ProjectCard title="To-Do List" description="Application de gestion de tâches." />
      </main>
    </div>
  )
}

export default App