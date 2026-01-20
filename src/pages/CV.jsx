export default function CV() {
  // Données temporaires pour le design (tu mettras les tiennes plus tard)
  const experiences = [
    {
      date: "2024 - Présent",
      role: "SysAdmin Junior (Alternance)",
      company: "Orange Cyberdefense",
      desc: "Gestion de l'infrastructure VMWare, Scripts Bash d'automatisation, Monitoring Zabbix."
    },
    {
      date: "2022 - 2024",
      role: "BTS SIO (Option SISR)",
      company: "Lycée Saint-Exupéry",
      desc: "Apprentissage réseaux (Cisco), Linux (Debian/CentOS), Windows Server."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      
      {/* Header */}
      <div className="mb-10">
        <p className="text-green-500">root@matheo:~/cv # <span className="text-white">cat career.log | grep "Experience"</span></p>
      </div>

      {/* Liste style "Logs" */}
      <div className="space-y-8 border-l-2 border-slate-800 pl-8 ml-4 relative">
        
        {experiences.map((exp, index) => (
          <div key={index} className="relative">
            {/* Le point sur la timeline */}
            <div className="absolute -left-[41px] top-0 h-5 w-5 rounded-full border-4 border-slate-950 bg-green-500"></div>
            
            <div className="mb-1 text-sm text-green-400 font-bold">{exp.date}</div>
            <h3 className="text-xl text-white font-bold">{exp.role} <span className="text-slate-500">@ {exp.company}</span></h3>
            <p className="mt-2 text-slate-400">{exp.desc}</p>
          </div>
        ))}

        {/* Fin du log */}
        <div className="pt-8">
          <p className="text-slate-600 animate-pulse">_ End of file</p>
        </div>

      </div>
    </div>
  )
}