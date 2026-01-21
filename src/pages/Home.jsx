import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';

// --- 1. ARRIÈRE-PLAN : VRAI TERMINAL SIMULÉ ---
const TerminalBackground = () => {
  // État pour stocker les lignes affichées
  const [history, setHistory] = useState([]);
  const [currentLine, setCurrentLine] = useState(""); // Ligne en cours d'écriture
  const [isTyping, setIsTyping] = useState(false); // Est-on en train de taper une commande ?

  // Le scénario exact de ton image
  const script = [
    { type: 'input', content: 'systemctl start portfolio' },
    { type: 'output', content: '[ OK ] Started Portfolio Service.' },
    { type: 'input', content: 'mount /dev/skills /mnt/experience' },
    { type: 'output', content: '[ OK ] Mounted Skills Filesystem.' },
    { type: 'input', content: 'ping -c 1 recruteurs.host' },
    { type: 'output', content: 'PING recruteurs.host (192.168.1.1) 56(84) bytes of data.' },
    { type: 'output', content: '64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.042 ms' },
    { type: 'output', content: '' }, // Ligne vide pour aérer
    { type: 'output', content: '--- recruteurs.host ping statistics ---' },
    { type: 'output', content: '1 packets transmitted, 1 received, 0% packet loss' },
    { type: 'input', content: 'loading modules...' },
    { type: 'output', content: '> React.js ..... [OK]' },
    { type: 'output', content: '> Docker ....... [OK]' },
    { type: 'output', content: '> Linux ........ [OK]' },
    { type: 'output', content: '> SQL .......... [OK]' },
    { type: 'input', content: 'cat welcome_message.txt' },
    { type: 'output', content: 'Initialisation de l\'interface graphique...' },
    { type: 'output', content: 'Done.' },
    { type: 'input', content: './launch_gui.sh' }, // Dernière commande qui reste en suspens ou lance l'interface
  ];

  useEffect(() => {
    let step = 0;
    let charIndex = 0;
    let timeoutId;

    const processStep = () => {
      if (step >= script.length) return; // Fin du script

      const action = script[step];

      if (action.type === 'input') {
        // --- MODE COMMANDE (Frappe clavier) ---
        setIsTyping(true);

        if (charIndex < action.content.length) {
          // On ajoute un caractère
          setCurrentLine(action.content.substring(0, charIndex + 1));
          charIndex++;
          // Vitesse de frappe variable pour faire réaliste
          timeoutId = setTimeout(processStep, 50 + Math.random() * 80);
        } else {
          // Commande finie
          setIsTyping(false);
          // On valide la ligne (on l'ajoute à l'historique)
          setHistory(prev => [...prev, { type: 'input', content: action.content }]);
          setCurrentLine(""); // On reset la ligne courante
          charIndex = 0;
          step++;
          // Pause avant la réponse du système
          timeoutId = setTimeout(processStep, 100);
        }

      } else {
        // --- MODE OUTPUT (Affichage instantané) ---
        setHistory(prev => [...prev, { type: 'output', content: action.content }]);
        step++;
        // Très courte pause entre les lignes de sortie (comme un vrai scroll)
        timeoutId = setTimeout(processStep, 30);
      }
    };

    // Démarrage initial
    timeoutId = setTimeout(processStep, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="absolute inset-0 z-0 p-6 md:p-10 overflow-hidden bg-[#0a0a0a] font-mono text-xs md:text-sm leading-relaxed pointer-events-none select-none opacity-30">
      <div className="max-w-4xl">

        {/* Historique des lignes passées */}
        {history.map((line, i) => (
          <div key={i} className={`${line.type === 'input' ? 'mt-4' : ''}`}>
            {line.type === 'input' ? (
              // Affichage d'une commande passée
              <div className="flex flex-wrap">
                <span className="text-slate-500 mr-2">[root@matheo-server ~]#</span>
                <span className="text-slate-300">{line.content}</span>
              </div>
            ) : (
              // Affichage d'un output système (plus sombre)
              <div className="text-slate-500/80 pl-0">
                {line.content}
              </div>
            )}
          </div>
        ))}

        {/* Ligne active (celle qu'on est en train de taper) */}
        <div className="flex flex-wrap mt-4">
          <span className="text-slate-500 mr-2">[root@matheo-server ~]#</span>
          <span className="text-green-500">{currentLine}</span>
          {/* Curseur clignotant */}
          <span className="inline-block w-2 h-4 bg-green-500 ml-1 animate-pulse"></span>
        </div>

      </div>
    </div>
  );
};

// --- 2. SOUS-TITRE (Même logique, simple et efficace) ---
const TypingSubtitle = () => {
  const text = "Admin Sys, Réseaux & BDD";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, index + 1));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-blue-400 font-mono font-bold text-lg md:text-xl">
      &gt; {displayedText}<span className="animate-pulse">_</span>
    </span>
  );
};

// --- 3. COMPOSANT PAGE PRINCIPALE ---
export default function Home() {
  return (
    <PageTransition>

      <SEO
        title="Accueil"
        description="Bienvenue sur mon terminal. Tapez une commande ou explorez mon portfolio SysAdmin & Dev."
      />

      <div className="relative min-h-[85vh] flex items-center justify-center p-4">

        {/* LE FOND TERMINAL (Z-Index 0) */}
        <TerminalBackground />

        {/* LA FENÊTRE APP (Z-Index 10) */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="z-10 w-full max-w-3xl bg-[#0B1120]/90 border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm"
        >
          {/* Barre de titre Mac */}
          <div className="bg-slate-900/50 px-4 py-3 flex items-center border-b border-slate-700/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-grow text-center">
              <span className="text-xs font-mono text-slate-500">user@matheo:~/portfolio</span>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Contenu principal */}
          <div className="p-10 md:p-16 text-center space-y-8">

            {/* Status */}
            <div>
              <span className="text-green-500 font-mono font-bold text-sm tracking-widest uppercase">
                &gt; STATUS: ONLINE
              </span>
            </div>

            {/* Titres */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Mathéo <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">PATIN</span>
              </h1>
              <div>
                <TypingSubtitle />
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-mono">
              Passionné par l'infrastructure, la virtualisation et le développement. Je construis des ponts entre le système et le web.
            </p>

            {/* Boutons Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 font-mono text-sm">
              <Link
                to="/portfolio"
                className="group px-8 py-4 rounded border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_25px_rgba(34,197,94,0.2)]"
              >
                ./voir_projets.sh
              </Link>

              <Link
                to="/cv"
                className="group px-8 py-4 rounded border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                cat cv.pdf
              </Link>
            </div>

          </div>
        </motion.div>

      </div>
    </PageTransition>
  );
}