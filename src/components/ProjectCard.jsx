// Un composant réutilisable pour afficher tes projets
function ProjectCard({ title, description }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default ProjectCard