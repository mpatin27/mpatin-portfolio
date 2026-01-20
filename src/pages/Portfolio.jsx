import ProjectCard from '../components/ProjectCard'
import { projects } from '../data'

export default function Portfolio() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      
      {/* En-tête style Terminal */}
      <div className="mb-10 border-b border-slate-800 pb-4">
        <p className="text-green-500 mb-2">root@matheo:~/projects # <span className="text-white">ls -la --sort=date</span></p>
        <p className="text-slate-500 text-sm">total {projects.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  )
}