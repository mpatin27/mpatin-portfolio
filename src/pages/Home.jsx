import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  // Liste des fausses commandes pour le background
  const terminalLogs = [
    "[root@matheo-server ~]# systemctl start portfolio",
    "[ OK ] Started Portfolio Service.",
    "[root@matheo-server ~]# mount /dev/skills /mnt/experience",
    "[ OK ] Mounted Skills Filesystem.",
    "[root@matheo-server ~]# ping -c 1 recruteurs.host",
    "64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.042 ms",
    "--- recruteurs.host ping statistics ---",
    "1 packets transmitted, 1 received, 0% packet loss",
    "[root@matheo-server ~]# loading modules...",
    "> React.js ..... [OK]",
    "> Docker ....... [OK]",
    "> Linux ........ [OK]",
    "> SQL .......... [OK]",
    "[root@matheo-server ~]# cat welcome_message.txt",
    "Initialisation de l'interface graphique...",
    "Done."
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-slate-950 overflow-hidden font-mono text-slate-300">
      
      {/* --- 1. LE BACKGROUND (Logs Terminal) --- */}
      <div className="absolute inset-0 p-6 opacity-20 pointer-events-none select-none overflow-hidden">
        <div className="space-y-2">
          {terminalLogs.map((log, index) => (
            <div key={index} className="text-sm md:text-base text-green-900 font-bold">
              {log}
            </div>
          ))}
          {/* Un curseur qui clignote en bas des logs */}
          <div className="text-green-900 font-bold">
            [root@matheo-server ~]# <span className="cursor-blink">_</span>
          </div>
        </div>
      </div>

      {/* --- 2. LE CONTENU PRINCIPAL (Centré) --- */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
        
        {/* Carte style "Fenêtre Terminal" */}
        <div className="w-full max-w-3xl bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
          
          {/* Barre de titre de la fenêtre */}
          <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-xs text-slate-400">user@matheo:~/portfolio</span>
          </div>

          {/* Corps de la fenêtre */}
          <div className="p-8 md:p-12 text-center">
            
            <h2 className="text-green-500 font-bold text-lg mb-2 tracking-wide">
              &gt; STATUS: ONLINE
            </h2>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
              MATHÉO
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-400 mb-6 font-semibold">
              Étudiant Admin Sys, Réseaux & BDD
            </p>

            <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
              Passionné par l'infrastructure, la virtualisation et le développement. 
              Je construis des ponts entre le système et le web.
            </p>

            {/* Boutons d'action style "Terminal" */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/portfolio" 
                className="group relative px-6 py-3 bg-green-600/10 border border-green-500 text-green-400 rounded hover:bg-green-500 hover:text-slate-900 transition-all duration-300 font-bold"
              >
                <span className="absolute left-0 top-0 h-full w-1 bg-green-500 transition-all group-hover:w-full opacity-20"></span>
                ./voir_projets.sh
              </Link>

              <Link 
                to="/cv" 
                className="px-6 py-3 border border-slate-600 text-slate-300 rounded hover:border-slate-400 hover:bg-slate-800 transition-all duration-300"
              >
                cat cv.pdf
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}