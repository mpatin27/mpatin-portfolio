import { useEffect, useState } from 'react';
import { Command } from 'cmdk'; // La librairie magique
import { useNavigate } from 'react-router-dom';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Gestion du raccourci clavier (Ctrl + K ou Cmd + K)
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Fonction pour naviguer et fermer la palette
  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-fade-in">
      
      <div className="w-full max-w-lg shadow-2xl rounded-xl overflow-hidden border border-slate-700 bg-[#0B1120]">
        <Command className="w-full" label="Command Menu">
          
          {/* BARRE DE RECHERCHE */}
          <div className="flex items-center border-b border-slate-700 px-4">
            <span className="text-green-500 mr-2 font-mono text-lg">&gt;</span>
            <Command.Input 
              autoFocus
              placeholder="Type a command..."
              className="w-full bg-transparent py-4 text-white placeholder-slate-500 outline-none font-mono text-sm h-14"
            />
            <div className="text-xs text-slate-500 font-mono border border-slate-700 rounded px-2 py-1">ESC</div>
          </div>

          {/* LISTE DES RÉSULTATS */}
          <Command.List className="max-h-[300px] overflow-y-auto p-2 scroll-py-2 custom-scrollbar">
            
            <Command.Empty className="py-6 text-center text-sm text-slate-500 font-mono">
              No results found.
            </Command.Empty>

            {/* GROUPE : NAVIGATION */}
            <Command.Group heading={<span className="text-xs font-bold text-slate-500 uppercase px-2 mb-2 block mt-2">Navigation</span>}>
              
              <Item onSelect={() => runCommand(() => navigate('/'))}>
                <IconHome /> <span>Go to Home</span>
              </Item>
              
              <Item onSelect={() => runCommand(() => navigate('/portfolio'))}>
                <IconCode /> <span>View Projects</span>
              </Item>
              
              <Item onSelect={() => runCommand(() => navigate('/cv'))}>
                <IconFile /> <span>Read Resume (CV)</span>
              </Item>
              
              <Item onSelect={() => runCommand(() => navigate('/contact'))}>
                <IconMail /> <span>Contact Me</span>
              </Item>

            </Command.Group>

            {/* GROUPE : SOCIALS / ACTIONS */}
            <Command.Group heading={<span className="text-xs font-bold text-slate-500 uppercase px-2 mb-2 block mt-2">External Links</span>}>
              
              <Item onSelect={() => runCommand(() => window.open('https://github.com/mpatin27', '_blank'))}>
                <IconGithub /> <span>GitHub Profile</span>
              </Item>
              
              <Item onSelect={() => runCommand(() => window.open('https://www.linkedin.com/in/patin-matheo', '_blank'))}>
                <IconLinkedin /> <span>LinkedIn</span>
              </Item>

            </Command.Group>

             {/* GROUPE : SYSTEM */}
             <Command.Group heading={<span className="text-xs font-bold text-slate-500 uppercase px-2 mb-2 block mt-2">System</span>}>
              <Item onSelect={() => runCommand(() => navigate('/login'))}>
                <IconLock /> <span>Admin Login</span>
              </Item>
            </Command.Group>

          </Command.List>

          {/* FOOTER */}
          <div className="border-t border-slate-800 py-2 px-4 flex justify-between items-center text-[10px] text-slate-500 font-mono bg-slate-900/50">
             <span>Utilisez les flèches pour vous déplacez</span>
             <span>Entrer pour sélectionner</span>
          </div>

        </Command>
      </div>
    </div>
  );
}

// --- PETIT COMPOSANT POUR LES ITEMS DE LISTE ---
function Item({ children, onSelect }) {
  return (
    <Command.Item 
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-3 rounded cursor-pointer text-slate-300 text-sm font-mono hover:bg-green-500/10 hover:text-green-400 hover:border-l-2 border-l-transparent hover:border-green-500 aria-selected:bg-green-500/10 aria-selected:text-green-400 aria-selected:border-l-2 aria-selected:border-green-500 transition-all"
    >
      {children}
    </Command.Item>
  );
}

// --- ICÔNES SVG SIMPLES ---
const IconHome = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const IconCode = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const IconFile = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconMail = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IconGithub = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
const IconLinkedin = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
const IconLock = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;