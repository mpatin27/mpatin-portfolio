import ProjectCard from './components/ProjectCard'
import { projects } from './data'

function App() {
  return (
    // Fond gris très clair pour faire ressortir les cartes blanches
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* Header simple */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Mon Portfolio</h1>
          <nav>
            <a href="#projets" className="text-gray-600 hover:text-blue-600 font-medium">Projets</a>
            {/* On pourra ajouter "Contact" plus tard */}
          </nav>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <section id="projets">
          <h2 className="text-3xl font-bold mb-8 text-center">Mes Réalisations</h2>
          
          {/* GRILLE RESPONSIVE MAGIC : 1 col par défaut, 2 cols si écran moyen (md), 3 cols si grand (lg) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id}
                title={project.title}
                description={project.description}
                tags={project.tags}
                cover={project.cover}
                links={project.links}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t mt-12 py-8 text-center text-gray-500">
        <p>© 2026 - Fait avec React & Tailwind</p>
      </footer>
    </div>
  )
}

export default App