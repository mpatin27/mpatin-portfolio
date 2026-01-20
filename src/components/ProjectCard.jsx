function ProjectCard({ title, description, cover, tags, links }) {
  return (
    // Style : Bordure fine, fond sombre, effet hover vert fluo
    <article className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden hover:border-green-500 transition-colors duration-300 flex flex-col h-full group">
      
      {/* Image avec filtre léger qui s'enlève au survol */}
      <div className="h-48 overflow-hidden relative border-b border-slate-700">
        <div className="absolute inset-0 bg-green-900/20 group-hover:bg-transparent transition-colors z-10" />
        <img 
          src={cover} 
          alt={`Projet ${title}`} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-green-400 mb-2 group-hover:text-green-300">
          <span className="text-slate-500 mr-2">./</span>{title}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs font-bold text-slate-400 border border-slate-600 px-2 py-1 rounded bg-slate-800">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
          {description}
        </p>

        <div className="flex gap-3 mt-auto">
          {links.demo && (
            <a href={links.demo} target="_blank" rel="noreferrer" className="flex-1 text-center bg-green-700/20 border border-green-600 text-green-400 hover:bg-green-600 hover:text-black py-2 rounded transition-all text-sm font-bold">
              LIVE DEMO
            </a>
          )}
          
          {links.repo && (
            <a href={links.repo} target="_blank" rel="noreferrer" className="flex-1 text-center border border-slate-600 text-slate-400 hover:border-slate-400 hover:text-white py-2 rounded transition-all text-sm">
              GITHUB
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard