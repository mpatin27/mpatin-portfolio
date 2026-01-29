import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IconGithub = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
const IconLink = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
const IconClose = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

export default function ProjectModal({ project, isOpen, onClose }) {
  if (!isOpen || !project) return null;

  const getStatusLabel = (status) => {
    switch (status) {
      case 'dev': return 'EN DÉVELOPPEMENT';
      case 'test': return 'PHASE DE BETA / TEST';
      case 'archived': return 'ARCHIVÉ';
      case 'idea': return 'IDÉE';
      case 'cancelled': return 'ANNULÉ';
      case 'on-hold': return 'EN PAUSE';
      default: return 'TERMINÉ';
    }
  };


  const getStatusColorClass = (status) => {
    switch (status) {
      case 'dev': return 'text-yellow-400 border-yellow-700 bg-yellow-900/20';
      case 'test': return 'text-blue-400 border-blue-700 bg-blue-900/20';
      case 'archived': return 'text-slate-400 border-slate-600 bg-slate-800';
      case 'idea': return 'text-purple-400 border-purple-700 bg-purple-900/20';
      case 'cancelled': return 'text-red-400 border-red-700 bg-red-900/20';
      case 'on-hold': return 'text-orange-400 border-orange-700 bg-orange-900/20';
      default: return 'text-green-400 border-green-700 bg-green-900/20';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-lg border border-slate-700 shadow-2xl flex flex-col overflow-hidden font-mono"
        >
          
          <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-950">
            <h3 className="text-green-500 font-bold flex items-center gap-2">
              <span className="animate-pulse">./</span>{project.title}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1 hover:bg-slate-800 rounded">
              <IconClose />
            </button>
          </div>

          <div className="overflow-y-auto p-6 custom-scrollbar">
            {project.image_url && (
              <div className="rounded-lg overflow-hidden border border-slate-700 mb-6 group">
                <img src={project.image_url} alt={project.title} className="w-full h-auto object-cover opacity-90" />
              </div>
            )}

            <div className="flex flex-wrap gap-4 mb-6 text-sm items-center">
                {/* STATUS BADGE - Bien intégré dans le flux */}
                {project.status && (
                    <span className={`px-3 py-1 rounded border text-xs font-bold ${getStatusColorClass(project.status)}`}>
                        {getStatusLabel(project.status)}
                    </span>
                )}

                {project.date && (
                    <span className="text-blue-400 bg-blue-900/20 px-3 py-1 rounded-full border border-blue-900/30">
                        🗓 {new Date(project.date).toLocaleDateString()}
                    </span>
                )}
                
                {project.technologies && project.technologies.map((tech, i) => (
                    <span key={i} className="text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-700 text-xs">
                        {tech}
                    </span>
                ))}
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 mb-8 whitespace-pre-line leading-relaxed">
              {project.description}
            </div>
          </div>

          <div className="p-4 border-t border-slate-700 bg-slate-950 flex gap-4 justify-end">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm font-bold border border-slate-600 transition-all">
                <IconGithub /> GitHub
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-black rounded text-sm font-bold transition-all shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50">
                <IconLink /> Live Demo
              </a>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}