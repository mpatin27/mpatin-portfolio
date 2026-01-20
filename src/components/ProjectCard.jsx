function ProjectCard({ title, description, cover, tags, links }) {
  return (
    // Container de la carte : blanc, bords arrondis, ombre, effet de levier au survol
    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      
      {/* Image : hauteur fixe (48), largeur 100%, mode "cover" pour ne pas déformer */}
      <div className="h-48 overflow-hidden">
        <img 
          src={cover} 
          alt={`Projet ${title}`} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Contenu textuel */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        
        {/* Tags : flex-wrap pour passer à la ligne si trop de tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray-600 mb-6 flex-grow">{description}</p>

        {/* Boutons : alignés en bas */}
        <div className="flex gap-4 mt-auto">
          {links.demo && (
            <a 
              href={links.demo} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Voir le site
            </a>
          )}
          
          {links.repo && (
            <a 
              href={links.repo} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 text-center border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition-colors"
            >
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard