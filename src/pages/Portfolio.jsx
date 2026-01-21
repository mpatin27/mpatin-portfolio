import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
    if (!error) setProjects(data);
    setLoading(false);
  }

  return (
    <PageTransition>
      <SEO
        title="Portfolio - Mes Projets"
        description="Découvrez mes projets terminés, déployés, en cours et autres expériences."
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12 font-mono">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-green-500">&gt;</span> MY_PROJECTS
          </h1>
          <p className="text-slate-400">Projets terminés, déployés, en cours et autres expériences.</p>
        </div>

        {loading ? (
          <div className="text-green-500 font-mono animate-pulse">&gt; Loading repositories...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all group flex flex-col"
              >
                <div className="h-48 overflow-hidden bg-slate-950 relative">
                  {project.cover_url ? (
                    <img src={project.cover_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700 font-mono text-sm border-b border-slate-800">NO_IMAGE</div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    {project.demo_link && <a href={project.demo_link} target="_blank" className="bg-black/80 text-green-400 text-xs px-2 py-1 rounded backdrop-blur border border-green-900 hover:bg-green-600 hover:text-black transition">LIVE</a>}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2 font-mono">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">{project.description}</p>

                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs text-blue-300 bg-blue-900/20 px-2 py-1 rounded border border-blue-900/30 font-mono">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                    {project.repo_link ? (
                      <a href={project.repo_link} target="_blank" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        GitHub
                      </a>
                    ) : <span></span>}
                    {project.demo_link && (
                      <a href={project.demo_link} target="_blank" className="text-green-500 hover:text-green-400 text-sm font-bold transition">
                        VISIT &rarr;
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}