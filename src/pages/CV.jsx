import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import PDFModal from '../components/PDFModal';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';

export default function CV() {
  const [profile, setProfile] = useState(null);
  const [cvItems, setCvItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');

  // Mets ton URL Vercel finale ici pour le QR Code
  const PORTFOLIO_URL = "https://mpatin-portfolio.vercel.app";

  // Fonction Calcul Âge Précis
  const calculateAge = (birthDateString) => {
    if (!birthDateString) return 0;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  // Fonction Couleur Statut
  const getStatusColor = (status) => {
    if (!status) return 'bg-slate-500';
    const s = status.toLowerCase();
    if (s.includes('open')) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
    if (s.includes('poste')) return 'bg-red-500';
    if (s.includes('freelance')) return 'bg-purple-500';
    if (s.includes('écoute')) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  useEffect(() => {
    const fetchData = async () => {
      // 1. Profil
      const { data: pData } = await supabase.from('profile').select('*').single();
      if(pData) setProfile(pData);
      
      // 2. CV Items
      const { data: cData } = await supabase.from('cv_items').select('*').order('start_date', { ascending: false });
      if(cData) setCvItems(cData);

      // 3. Génération QR Code
      try {
        const url = await QRCode.toDataURL(PORTFOLIO_URL, {
          margin: 1,
          color: {
            dark: '#111827', // Noir (Texte Slate-900)
            light: '#00000000' // Transparent
          }
        });
        setQrCodeData(url);
      } catch (err) {
        console.error("QR Code Error:", err);
      }
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const experiences = cvItems.filter(item => item.category === 'experience');
  const formations = cvItems.filter(item => item.category === 'formation');
  const age = calculateAge(profile?.birth_date);
  
  const IconEye = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 py-12 font-mono">
        <div className="mb-10 border-b border-slate-800 pb-4">
          <p className="text-green-500 mb-2">root@matheo:~/cv # <span className="text-white">./display_profile.sh --full</span></p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* IDENTITÉ */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-700 rounded p-6 shadow-lg sticky top-24">
              <h3 className="text-blue-400 font-bold border-b border-slate-700 pb-2 mb-6">&gt; IDENTITY_CARD</h3>
              
              {loading ? <p className="text-slate-500 animate-pulse">Scanning...</p> : (
                <>
                  {/* PHOTO DE PROFIL WEB */}
                  {profile?.avatar_url && (
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500 blur-md opacity-20 rounded-full"></div>
                        <img 
                          src={profile.avatar_url} 
                          alt="Profile" 
                          className="relative w-50 h-50 object-cover rounded-full border-4 border-slate-800 shadow-2xl"
                        />
                      </div>
                    </div>
                  )}

                  <ul className="space-y-4 text-sm text-slate-300">
                    <li><span className="text-slate-500 block text-xs uppercase mb-1">Name / Role</span><span className="text-white font-bold text-2xl">{profile?.full_name}</span><div className="text-green-400 text-s">{profile?.role}</div></li>
                    <li className="grid grid-cols-2 gap-2">
                       <div><span className="text-slate-500 block text-xs uppercase mb-1">Age</span><span>{age} ans</span></div>
                       <div><span className="text-slate-500 block text-xs uppercase mb-1">Loc</span>{profile?.location}</div>
                    </li>
                    {profile?.email && <li><span className="text-slate-500 block text-xs uppercase mb-1">Email</span>{profile.email}</li>}
                    {profile?.phone && <li><span className="text-slate-500 block text-xs uppercase mb-1">Phone</span>{profile.phone}</li>}
                    {profile?.driving_license && <li><span className="text-slate-500 block text-xs uppercase mb-1">Permis</span>{profile.driving_license}</li>}
                    <li><span className="text-slate-500 block text-xs uppercase mb-1">Status</span><div className="flex items-center gap-2"><span className={`inline-block w-2.5 h-2.5 rounded-full ${getStatusColor(profile?.status)} animate-pulse`}></span><span>{profile?.status}</span></div></li>
                  </ul>
                  
                  {profile?.languages && profile.languages.length > 0 && (<div className="mt-6 pt-4 border-t border-slate-800"><h4 className="text-slate-500 text-xs uppercase mb-2">Langues</h4><div className="flex flex-wrap gap-2">{profile.languages.map((l, i) => <span key={i} className="text-slate-300 text-xs border border-slate-700 px-2 py-1 rounded">{l}</span>)}</div></div>)}
                  
                  {profile?.certifications && profile.certifications.length > 0 && (<div className="mt-4 pt-4 border-t border-slate-800"><h4 className="text-slate-500 text-xs uppercase mb-2">Diplômes / Certifs</h4><ul className="space-y-1">{profile.certifications.map((c, i) => (<li key={i} className="text-slate-300 text-xs flex items-start gap-2"><span className="text-blue-500">✓</span> {c}</li>))}</ul></div>)}
                  
                  <div className="mt-4 pt-4 border-t border-slate-800"><h4 className="text-slate-500 text-xs uppercase mb-3">Hard Skills</h4><div className="flex flex-wrap gap-2">{profile?.hard_skills?.map((skill, i) => (<span key={i} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700 hover:border-green-500 transition-colors cursor-default">{skill}</span>))}</div></div>
                </>
              )}
              
              <div className="mt-6 pt-6 border-t border-slate-800"><h4 className="text-slate-500 text-xs uppercase mb-3">Export Options</h4>{!loading && profile ? (<button onClick={() => setIsModalOpen(true)} className="w-full bg-green-900/10 border border-green-900/30 hover:bg-green-600 hover:text-black hover:border-green-500 text-green-500 font-bold text-xs py-3 rounded transition-all uppercase tracking-widest flex justify-center items-center gap-2 group"><IconEye /><span>PREVIEW & PRINT</span></button>) : <button disabled className="w-full bg-slate-800 text-slate-500 font-bold text-xs py-3 rounded uppercase border border-slate-700">LOADING...</button>}</div>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="md:col-span-2 space-y-12">
            
            {/* EXPÉRIENCES */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><span className="text-blue-500 text-3xl">#</span> WORK_EXPERIENCE</h2>
              <div className="space-y-8 border-l-2 border-slate-800 pl-8 ml-3">
                {experiences.map((exp, index) => (
                  <motion.div 
                    key={exp.id} 
                    className="relative group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-slate-900 border-4 border-slate-700 group-hover:border-blue-500 transition-colors"></div>
                    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2"><h3 className="text-xl font-bold text-white">{exp.title}</h3><span className="text-xs font-bold text-blue-300 bg-blue-900/20 px-3 py-1 rounded-full border border-blue-900/30 whitespace-nowrap">{exp.date_range}</span></div>
                      <div className="flex items-center gap-2 text-blue-400 text-sm mb-4 font-bold"><span>@ {exp.place}</span></div>
                      <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FORMATIONS */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><span className="text-purple-500 text-3xl">#</span> EDUCATION_PATH</h2>
              <div className="space-y-8 border-l-2 border-slate-800 pl-8 ml-3">
                {formations.map((edu, index) => (
                  <motion.div 
                    key={edu.id} 
                    className="relative group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (index * 0.1) }}
                  >
                    <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-slate-900 border-4 border-slate-700 group-hover:border-purple-500 transition-colors"></div>
                    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2"><h3 className="text-xl font-bold text-white">{edu.title}</h3><span className="text-xs font-bold text-purple-300 bg-purple-900/20 px-3 py-1 rounded-full border border-purple-900/30 whitespace-nowrap">{edu.date_range}</span></div>
                      <div className="flex items-center gap-2 text-purple-400 text-sm mb-4 font-bold"><span>@ {edu.place}</span></div>
                      {edu.description && <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-800/50 pt-3 mt-3 whitespace-pre-line">{edu.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* MODAL AVEC PROP QRCODE */}
        <PDFModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            profile={profile} 
            cvItems={cvItems}
            qrCodeUrl={qrCodeData} 
        />
      </div>
    </PageTransition>
  );
}