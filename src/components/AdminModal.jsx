import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function AdminModal({ isOpen, onClose, title, children }) {
  // Empêche le scroll de la page principale quand la modale est ouverte
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          
          {/* Fond sombre flouté */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* La Fenêtre */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-[#0B1120] w-full max-w-2xl max-h-[85vh] md:max-h-[90vh] rounded-xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden"
          >
            
            {/* En-tête */}
            <div className="flex justify-between items-center px-4 py-3 md:px-6 md:py-4 border-b border-slate-700 bg-slate-900/50">
              <h2 className="text-green-500 font-mono font-bold text-base md:text-lg flex items-center gap-2 truncate pr-4">
                <span className="animate-pulse">_</span> <span className="truncate">{title}</span>
              </h2>
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-red-500 transition-colors p-1 hover:bg-white/5 rounded-full flex-shrink-0"
              >
                <IconClose />
              </button>
            </div>

            {/* Contenu Scrollable */}
            <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar bg-slate-900/30">
              {children}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}