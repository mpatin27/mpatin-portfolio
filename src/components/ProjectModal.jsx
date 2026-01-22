import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icônes (tu peux utiliser les tiennes ou des SVG simples)
const IconGithub = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
const IconLink = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
const IconClose = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

export default function ProjectModal({ project, isOpen, onClose }) {
  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        {/* Backdrop (Fond flouté) */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        />

        {/* La Modale */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-lg border border-slate-700 shadow-2xl flex flex-col overflow-hidden font-mono"
        >
          
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-950">
            <h3 className="text-green-500 font-bold flex items-center gap-2">
              <span className="animate-pulse">./</span>{project.title}
            </h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-red-500 transition-colors p-1 hover:bg-slate-800 rounded"
            >
              <IconClose />
            </button>
          </div>

          {/* Contenu Scrollable */}
          <div className="overflow-y-auto p-6 custom-scrollbar">
            
            {/* Image (si elle existe) */}
            {project.image_url && (
              <div className="rounded-lg overflow-hidden border border-slate-700 mb-6 group">
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                />
              </div>
            )}

            {/* Infos rapides */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm">
                {project.date && (
                    <span className="text-blue-400 bg-blue-900/20 px-3 py-1 rounded-full border border-blue-900/30">
                        🗓 {new Date(project.date).toLocaleDateString()}
                    </span>
                )}
                {/* Liste des technos */}
                {project.technologies && project.technologies.map((tech, i) => (
                    <span key={i} className="text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-700 text-xs">
                        {tech}
                    </span>
                ))}
            </div>

            {/* Description Complète */}
            <div className="prose prose-invert max-w-none text-slate-300 mb-8 whitespace-pre-line leading-relaxed">
              {project.description}
            </div>

          </div>

          {/* Footer (Liens) */}
          <div className="p-4 border-t border-slate-700 bg-slate-950 flex gap-4 justify-end">
            {project.github_url && (
              <a 
                href={project.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm font-bold border border-slate-600 transition-all"
              >
                <IconGithub /> GitHub
              </a>
            )}
            {project.demo_url && (
              <a 
                href={project.demo_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-black rounded text-sm font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
              >
                <IconLink /> Live Demo
              </a>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}