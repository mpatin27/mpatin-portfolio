import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AdminModal from '../components/AdminModal';

// --- ICÔNES SVG ---
const IconIdea = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const IconDev = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const IconTest = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
const IconProd = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconPause = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconCancel = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
const IconArchive = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
const IconEdit = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const IconTrash = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconDrag = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" /></svg>;
const IconBack = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const IconFolder = () => <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;

const IconTabProfile = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const IconTabProjects = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const IconTabDisplay = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IconTabCV = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

const STATUS_CONFIG = {
  'prod': { label: 'En Ligne', Icon: IconProd, color: 'text-green-500', border: 'border-green-500/30 hover:border-green-500', bg: 'bg-green-500/5' },
  'dev': { label: 'En Dév', Icon: IconDev, color: 'text-blue-500', border: 'border-blue-500/30 hover:border-blue-500', bg: 'bg-blue-500/5' },
  'idea': { label: 'Idée', Icon: IconIdea, color: 'text-yellow-500', border: 'border-yellow-500/30 hover:border-yellow-500', bg: 'bg-yellow-500/5' },
  'cancelled': { label: 'Annulé', Icon: IconCancel, color: 'text-red-500', border: 'border-red-500/30 hover:border-red-500', bg: 'bg-red-500/5' },
  'test': { label: 'Test / Beta', Icon: IconTest, color: 'text-purple-500', border: 'border-purple-500/30 hover:border-purple-500', bg: 'bg-purple-500/5' },
  'on-hold': { label: 'En Pause', Icon: IconPause, color: 'text-orange-500', border: 'border-orange-500/30 hover:border-orange-500', bg: 'bg-orange-500/5' },
  'archived': { label: 'Archivé', Icon: IconArchive, color: 'text-slate-500', border: 'border-slate-500/30 hover:border-slate-500', bg: 'bg-slate-500/5' },
};

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects'); 
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Modales & Navigation
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCvModal, setShowCvModal] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);

  // Data States
  const [profileData, setProfileData] = useState({ full_name: '', role: '', birth_date: '', location: '', status: '', hard_skills: '', cv_file_url: '', avatar_url: '', phone: '', email: '', driving_license: '', languages: '', certifications: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectData, setProjectData] = useState({ title: '', short_description: '', description: '', tags: '', demo_link: '', repo_link: '', status: 'idea' });
  const [projectFile, setProjectFile] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [cvItems, setCvItems] = useState([]);
  const [cvData, setCvData] = useState({ category: 'experience', title: '', place: '', date_range: '', start_date: '', description: '' });
  const [editingCvId, setEditingCvId] = useState(null);

  const CurrentFolderIcon = currentFolder && STATUS_CONFIG[currentFolder] ? STATUS_CONFIG[currentFolder].Icon : null;

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const { data: profile } = await supabase.from('profile').select('*').single();
    if (profile) setProfileData({...profile, hard_skills: profile.hard_skills?.join(', '), languages: profile.languages?.join(', '), certifications: profile.certifications?.join(', ')});
    const { data: projs } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
    setProjects(projs || []);
    const { data: cvs } = await supabase.from('cv_items').select('*').order('start_date', { ascending: false });
    setCvItems(cvs || []);
  };

  // --- LOGIQUE METIER ---
  const handleProfileSubmit = async (e) => { e.preventDefault(); setIsLoading(true); try { let newAvatarUrl = profileData.avatar_url; if (avatarFile) { const fileName = `avatar-${Date.now()}-${avatarFile.name}`; await supabase.storage.from('project-images').upload(fileName, avatarFile); const { data } = supabase.storage.from('project-images').getPublicUrl(fileName); newAvatarUrl = data.publicUrl; } const formatArray = (str) => str.split(',').map(s => s.trim()).filter(s => s); await supabase.from('profile').update({ ...profileData, hard_skills: formatArray(profileData.hard_skills), languages: formatArray(profileData.languages), certifications: formatArray(profileData.certifications), avatar_url: newAvatarUrl }).eq('id', 1); setMessage('Profil mis à jour.'); setAvatarFile(null); } catch (error) { setMessage('Erreur: ' + error.message); } finally { setIsLoading(false); } };
  const handleProjectSubmit = async (e) => { e.preventDefault(); setIsLoading(true); try { let coverUrl = null; if (projectFile) { const fileName = `${Date.now()}-${projectFile.name}`; await supabase.storage.from('project-images').upload(fileName, projectFile); const { data } = supabase.storage.from('project-images').getPublicUrl(fileName); coverUrl = data.publicUrl; } const tagsArray = projectData.tags.split(',').map(t => t.trim()).filter(t => t); const payload = { ...projectData, tags: tagsArray }; if (coverUrl) payload.cover_url = coverUrl; if (!editingProjectId) { const maxOrder = projects.length > 0 ? Math.max(...projects.map(p => p.sort_order || 0)) : 0; payload.sort_order = maxOrder + 1; await supabase.from('projects').insert([payload]); } else { await supabase.from('projects').update(payload).eq('id', editingProjectId); } fetchAll(); setShowProjectModal(false); setMessage('Projet enregistré.'); } catch (e) { setMessage('Erreur: ' + e.message); } setIsLoading(false); };
  const handleCvSubmit = async (e) => { e.preventDefault(); setIsLoading(true); try { const payload = { ...cvData }; if (!payload.start_date) payload.start_date = new Date().toISOString().split('T')[0]; if (!editingCvId) await supabase.from('cv_items').insert([payload]); else await supabase.from('cv_items').update(payload).eq('id', editingCvId); fetchAll(); setShowCvModal(false); setMessage('Entrée CV enregistrée.'); } catch (e) { setMessage('Erreur: ' + e.message); } setIsLoading(false); };
  const deleteItem = async (table, id) => { if(!window.confirm('Supprimer définitivement ?')) return; await supabase.from(table).delete().eq('id', id); fetchAll(); };
  const onDragEndProjects = async (result) => { if (!result.destination || result.destination.index === result.source.index) return; const filteredProjects = projects.filter(p => p.status === currentFolder); const newFilteredList = Array.from(filteredProjects); const [moved] = newFilteredList.splice(result.source.index, 1); newFilteredList.splice(result.destination.index, 0, moved); const updates = newFilteredList.map((item, index) => supabase.from('projects').update({ sort_order: index }).eq('id', item.id)); const newGlobalList = projects.map(p => { const found = newFilteredList.find(i => i.id === p.id); return found || p; }); setProjects(newGlobalList); await Promise.all(updates); };
  const onDragEndGlobal = async (result) => { if (!result.destination || result.destination.index === result.source.index) return; const newList = Array.from(projects); const [moved] = newList.splice(result.source.index, 1); newList.splice(result.destination.index, 0, moved); setProjects(newList); const updates = newList.map((item, index) => supabase.from('projects').update({ sort_order: index }).eq('id', item.id)); await Promise.all(updates); };
  const openProjectModal = (p = null) => { setEditingProjectId(p?.id || null); setProjectData(p ? { title: p.title, short_description: p.short_description||'', description: p.description, tags: p.tags?.join(', ')||'', demo_link: p.demo_link||'', repo_link: p.repo_link||'', status: p.status||'idea' } : { title: '', short_description: '', description: '', tags: '', demo_link: '', repo_link: '', status: 'idea' }); setProjectFile(null); setShowProjectModal(true); };
  const openCvModal = (i = null) => { setEditingCvId(i?.id || null); setCvData(i ? { ...i, description: i.description || '' } : { category: 'experience', title: '', place: '', date_range: '', start_date: '', description: '' }); setShowCvModal(true); };

  // --- UI COMPONENTS ---
  const NavButton = ({ tab, label, icon }) => {
    let activeClass = 'bg-slate-800 text-white border-slate-600';
    if (tab === 'profile') activeClass = 'text-purple-400 border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20';
    if (tab === 'projects') activeClass = 'text-green-400 border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20';
    if (tab === 'display') activeClass = 'text-yellow-400 border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/20';
    if (tab === 'cv') activeClass = 'text-blue-400 border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20';

    return (
      <button onClick={() => setActiveTab(tab)} className={`flex items-center justify-start gap-3 px-4 py-4 rounded-lg font-bold transition-all font-mono text-sm w-full ${activeTab === tab ? activeClass : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'}`}>
        <span className="text-lg">{icon}</span> {label}
      </button>
    );
  };
  const InputGroup = ({ label, children }) => (<div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">{label}</label>{children}</div>);
  const StyledInput = (props) => <input {...props} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all font-mono text-sm" />;
  const StyledTextArea = (props) => <textarea {...props} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all font-mono text-sm" />;
  const StyledSelect = (props) => <select {...props} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-green-500 outline-none transition-all appearance-none font-mono text-sm" />;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-mono pb-20 selection:bg-green-500/30 selection:text-green-200 flex flex-col md:flex-row">
      
      {/* HEADER MOBILE UNIQUEMENT */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-6 py-4 flex md:hidden justify-between items-center">
        <h1 className="font-bold text-lg tracking-tight flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          ADMIN
        </h1>
        {/* Pas de logout ici car il est dans la Navbar */}
      </div>

      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="hidden md:flex w-64 bg-slate-900/30 border-r border-slate-800 p-6 flex-col gap-2 overflow-y-auto h-screen sticky top-0">
           <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 mt-2">Navigation</div>
           <NavButton tab="profile" label="IDENTITÉ" icon={<IconTabProfile />} />
           <NavButton tab="projects" label="PROJETS" icon={<IconTabProjects />} />
           <NavButton tab="display" label="VITRINE" icon={<IconTabDisplay />} />
           <NavButton tab="cv" label="TIMELINE" icon={<IconTabCV />} />
           
           <div className="mt-auto pt-6 border-t border-slate-800">
              <div className="text-xs text-slate-600">
                 Système: <span className="text-green-500">Online</span><br/>
                 Version: 2.1.0
              </div>
           </div>
      </aside>

      {/* --- NAVIGATION MOBILE (Tabs horizontaux) --- */}
      <div className="md:hidden flex gap-2 overflow-x-auto p-4 border-b border-slate-800 bg-[#0B1120]">
        <NavButton tab="profile" label="ID" icon={<IconTabProfile />} />
        <NavButton tab="projects" label="Projets" icon={<IconTabProjects />} />
        <NavButton tab="display" label="Vitrine" icon={<IconTabDisplay />} />
        <NavButton tab="cv" label="CV" icon={<IconTabCV />} />
      </div>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth">
        <div className="max-w-7xl mx-auto">
          
          {/* FEEDBACK */}
          {message && (
            <div className="mb-8 p-4 rounded border border-green-500/30 bg-green-900/10 flex items-center gap-3 text-green-400 animate-fade-in text-sm">
              <span>&gt; System output:</span>
              <span className="font-bold">{message}</span>
            </div>
          )}

          {/* --- ONGLET PROJETS --- */}
          {activeTab === 'projects' && (
            <div className="animate-fade-in">
              {currentFolder === null ? (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2"><span className="text-green-500">&gt;</span> PROJECT_DASHBOARD</h2>
                      <p className="text-slate-500 text-sm mt-1">Gérez vos projets par statut d'avancement.</p>
                    </div>
                    <button onClick={() => openProjectModal()} className="bg-green-600 hover:bg-green-500 text-black font-bold py-2 px-6 rounded-lg shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
                      <span>+</span> DEPLOY_NEW
                    </button>
                  </div>
                  {/* GRILLE RESPONSIVE 1 COL MOBILE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                      const count = projects.filter(p => p.status === key).length;
                      return (
                        <div 
                          key={key} 
                          onClick={() => setCurrentFolder(key)}
                          className={`group cursor-pointer p-6 rounded-xl border ${config.border} ${config.bg} hover:bg-opacity-20 transition-all active:scale-[0.98] relative overflow-hidden flex flex-col items-center justify-center text-center h-40`}
                        >
                          <div className={`text-4xl mb-4 ${config.text}`}><config.Icon /></div>
                          <div className={`font-bold text-base ${config.text} uppercase tracking-wider`}>{config.label}</div>
                          <div className="text-slate-500 text-xs mt-2 font-mono border border-slate-700/50 bg-black/20 px-2 py-0.5 rounded">[{count}]</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setCurrentFolder(null)} className="p-2 rounded-lg border border-slate-700 bg-slate-900 hover:border-slate-500 text-slate-300 transition-colors">
                        <IconBack />
                      </button>
                      <div>
                         <h2 className={`text-xl font-bold flex items-center gap-3 ${STATUS_CONFIG[currentFolder].text}`}>
                           {CurrentFolderIcon && <CurrentFolderIcon />} 
                           {STATUS_CONFIG[currentFolder].label}
                         </h2>
                         <p className="text-slate-500 text-xs mt-1">Dossier de travail</p>
                      </div>
                    </div>
                    <button onClick={() => openProjectModal()} className="bg-green-600 hover:bg-green-500 text-black font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-green-500/30 text-xs w-full sm:w-auto">
                      + DEPLOY_NEW
                    </button>
                  </div>

                  <DragDropContext onDragEnd={onDragEndProjects}>
                    <Droppable droppableId="list">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                          {projects.filter(p => p.status === currentFolder).map((p, i) => (
                            <Draggable key={p.id} draggableId={p.id.toString()} index={i}>
                              {(prov, snap) => (
                                <div ref={prov.innerRef} {...prov.draggableProps} className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl border bg-slate-900 transition-all ${snap.isDragging ? 'border-green-500 shadow-xl z-50' : 'border-slate-800 hover:border-slate-600'}`}>
                                  <div className="flex items-center gap-4 w-full sm:w-auto">
                                      <div {...prov.dragHandleProps} className="text-slate-600 hover:text-white cursor-grab p-2"><IconDrag /></div>
                                      <div className="w-16 h-16 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
                                        {p.cover_url ? <img src={p.cover_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-slate-700">IMG</div>}
                                      </div>
                                  </div>
                                  <div className="flex-grow min-w-0 w-full">
                                    <h3 className="font-bold text-white truncate text-lg mb-1">{p.title}</h3>
                                    <p className="text-sm text-slate-500 truncate font-mono">{p.short_description || "Pas de description courte..."}</p>
                                    <div className="flex gap-2 mt-3">
                                       {p.tags && p.tags.slice(0, 3).map((tag, idx) => <span key={idx} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">{tag}</span>)}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                                    <button onClick={() => openProjectModal(p)} className="p-3 text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition border border-transparent hover:border-yellow-400/20"><IconEdit /></button>
                                    <button onClick={() => deleteItem('projects', p.id)} className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition border border-transparent hover:border-red-400/20"><IconTrash /></button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {projects.filter(p => p.status === currentFolder).length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl text-slate-600">
                               <div className="text-2xl mb-2">📂</div>
                               <p>Dossier vide</p>
                               <p className="text-xs mt-1">Glissez des projets ici via le statut ou créez-en un nouveau.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </>
              )}
            </div>
          )}

          {/* --- ONGLET VITRINE --- */}
          {activeTab === 'display' && (
            <div className="animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <span className="text-yellow-500">{'>'}</span> PUBLIC_DISPLAY_ORDER
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Ordre d'affichage officiel sur la page Portfolio.</p>
                  </div>
                </div>

                <DragDropContext onDragEnd={onDragEndGlobal}>
                    <Droppable droppableId="global-list">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                          {projects.map((p, i) => (
                            <Draggable key={p.id} draggableId={p.id.toString()} index={i}>
                              {(prov, snap) => (
                                <div ref={prov.innerRef} {...prov.draggableProps} className={`flex items-center gap-4 p-4 rounded-xl border bg-slate-900 transition-all ${snap.isDragging ? 'border-yellow-500 shadow-xl z-50' : 'border-slate-800 hover:border-slate-600'}`}>
                                  <div {...prov.dragHandleProps} className="text-slate-600 hover:text-white cursor-grab p-2"><IconDrag /></div>
                                  
                                  {/* Badge Statut */}
                                  <div className={`hidden sm:block w-1 h-12 rounded-full ${STATUS_CONFIG[p.status]?.bg.replace('/10', '') || 'bg-slate-500'}`}></div>

                                  <div className="flex-grow min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                      <h3 className="font-bold text-white truncate text-base">{p.title}</h3>
                                      <span className={`text-[10px] px-2 py-0.5 rounded border uppercase w-fit ${STATUS_CONFIG[p.status]?.text} ${STATUS_CONFIG[p.status]?.border}`}>
                                          {STATUS_CONFIG[p.status]?.label}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-slate-600 font-mono text-xs">#{i + 1}</div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
            </div>
          )}

          {/* --- ONGLET CV --- */}
          {activeTab === 'cv' && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2"><span className="text-blue-500">&gt;</span> CV_ENTRIES</h2>
                  <p className="text-slate-500 text-sm mt-1">Gérez votre parcours professionnel et académique.</p>
                </div>
                <button onClick={() => openCvModal()} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-blue-900/20 transition-all text-sm w-full sm:w-auto">
                  + ADD_ENTRY
                </button>
              </div>
              <div className="space-y-3">
                {cvItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-600 transition-all">
                    <div className={`hidden sm:block w-1.5 h-12 rounded-full ${item.category === 'experience' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                    <div className="flex-grow w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border w-fit ${item.category === 'experience' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' : 'text-purple-400 border-purple-500/30 bg-purple-500/10'}`}>
                          {item.category === 'experience' ? 'EXP' : 'EDU'}
                        </span>
                        <span className="font-bold text-white text-lg">{item.title}</span>
                      </div>
                      <div className="text-sm text-slate-500 font-mono">{item.place} • {item.date_range}</div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <button onClick={() => openCvModal(item)} className="p-3 text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition border border-transparent hover:border-yellow-400/20"><IconEdit /></button>
                      <button onClick={() => deleteItem('cv_items', item.id)} className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition border border-transparent hover:border-red-400/20"><IconTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- ONGLET PROFIL --- */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto animate-fade-in bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-8 text-purple-400 border-b border-purple-500/20 pb-4 flex items-center gap-3"><span className="text-purple-500">&gt;</span> IDENTITY_CONFIG</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-40 flex-shrink-0 flex flex-col items-center gap-3">
                    <div className="w-32 h-32 rounded-full border-4 border-purple-500/30 overflow-hidden bg-slate-950 shadow-xl">
                      {profileData.avatar_url ? <img src={profileData.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-600 text-4xl">?</div>}
                    </div>
                    <label className="text-xs text-purple-400 cursor-pointer hover:text-purple-300 text-center font-mono border border-purple-500/30 px-3 py-1 rounded bg-purple-500/10 transition-colors w-full md:w-auto">
                      UPLOAD_IMG
                      <input type="file" className="hidden" accept="image/*" onChange={e => setAvatarFile(e.target.files[0])} />
                    </label>
                  </div>
                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                    <InputGroup label="Full Name"><StyledInput value={profileData.full_name} onChange={e => setProfileData({...profileData, full_name: e.target.value})} /></InputGroup>
                    <InputGroup label="Role"><StyledInput value={profileData.role} onChange={e => setProfileData({...profileData, role: e.target.value})} /></InputGroup>
                    <InputGroup label="Birth Date"><StyledInput type="date" value={profileData.birth_date} onChange={e => setProfileData({...profileData, birth_date: e.target.value})} /></InputGroup>
                    <InputGroup label="Location"><StyledInput value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} /></InputGroup>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <InputGroup label="Phone"><StyledInput value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} /></InputGroup>
                  <InputGroup label="Email"><StyledInput value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} /></InputGroup>
                  <InputGroup label="License"><StyledInput value={profileData.driving_license} onChange={e => setProfileData({...profileData, driving_license: e.target.value})} /></InputGroup>
                </div>
                <InputGroup label="Current Status">
                  <StyledSelect value={profileData.status} onChange={e => setProfileData({...profileData, status: e.target.value})}>
                    <option value="Open to work">🟢 Open to work</option>
                    <option value="En poste">🔴 En poste</option>
                    <option value="Freelance">🟣 Freelance</option>
                    <option value="À l'écoute">🟠 À l'écoute</option>
                  </StyledSelect>
                </InputGroup>
                <InputGroup label="Skills (comma separated)"><StyledTextArea rows="2" value={profileData.hard_skills} onChange={e => setProfileData({...profileData, hard_skills: e.target.value})} /></InputGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputGroup label="Languages"><StyledInput value={profileData.languages} onChange={e => setProfileData({...profileData, languages: e.target.value})} /></InputGroup>
                  <InputGroup label="Certifications"><StyledInput value={profileData.certifications} onChange={e => setProfileData({...profileData, certifications: e.target.value})} /></InputGroup>
                </div>
                <div className="pt-6 border-t border-slate-800 flex justify-end">
                  <button disabled={isLoading} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-10 rounded-lg shadow-lg shadow-purple-500/30 transition-all text-sm uppercase tracking-wide w-full sm:w-auto">
                    {isLoading ? 'SAVING...' : 'UPDATE_IDENTITY'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* --- MODALES FORMULAIRES --- */}
      <AdminModal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} title={editingProjectId ? 'EDIT_PROJECT' : 'NEW_PROJECT'}>
        <form onSubmit={handleProjectSubmit} className="space-y-5">
          <InputGroup label="Status">
            <StyledSelect value={projectData.status} onChange={e => setProjectData({...projectData, status: e.target.value})}>
              {Object.entries(STATUS_CONFIG).map(([key, conf]) => <option key={key} value={key}>{conf.label}</option>)}
            </StyledSelect>
          </InputGroup>
          <InputGroup label="Project Title"><StyledInput value={projectData.title} onChange={e => setProjectData({...projectData, title: e.target.value})} required /></InputGroup>
          <InputGroup label="Short Desc"><StyledTextArea rows="2" value={projectData.short_description} onChange={e => setProjectData({...projectData, short_description: e.target.value})} /></InputGroup>
          <InputGroup label="Technical Desc"><StyledTextArea rows="6" value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})} required /></InputGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputGroup label="Tags"><StyledInput value={projectData.tags} onChange={e => setProjectData({...projectData, tags: e.target.value})} /></InputGroup>
            <InputGroup label="Cover"><input type="file" accept="image/*" onChange={e => setProjectFile(e.target.files[0])} className="w-full text-sm text-slate-400 file:bg-slate-800 file:text-white file:border-0 file:mr-2 file:py-1 file:px-2 file:rounded cursor-pointer" /></InputGroup>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputGroup label="Demo URL"><StyledInput value={projectData.demo_link} onChange={e => setProjectData({...projectData, demo_link: e.target.value})} /></InputGroup>
            <InputGroup label="Repo URL"><StyledInput value={projectData.repo_link} onChange={e => setProjectData({...projectData, repo_link: e.target.value})} /></InputGroup>
          </div>
          <button disabled={isLoading} className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded-lg shadow-lg shadow-green-500/30 mt-2 text-xs">
            {isLoading ? '...' : editingProjectId ? 'UPDATE_SYSTEM' : 'DEPLOY_SYSTEM'}
          </button>
        </form>
      </AdminModal>

      <AdminModal isOpen={showCvModal} onClose={() => setShowCvModal(false)} title={editingCvId ? 'EDIT_ENTRY' : 'NEW_ENTRY'}>
        <form onSubmit={handleCvSubmit} className="space-y-5">
          <InputGroup label="Category">
            <StyledSelect value={cvData.category} onChange={e => setCvData({...cvData, category: e.target.value})}>
              <option value="experience">Expérience Pro</option>
              <option value="formation">Formation / Diplôme</option>
            </StyledSelect>
          </InputGroup>
          <InputGroup label="Title / Role"><StyledInput value={cvData.title} onChange={e => setCvData({...cvData, title: e.target.value})} required /></InputGroup>
          <InputGroup label="Location"><StyledInput value={cvData.place} onChange={e => setCvData({...cvData, place: e.target.value})} required /></InputGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputGroup label="Display Date"><StyledInput value={cvData.date_range} onChange={e => setCvData({...cvData, date_range: e.target.value})} required /></InputGroup>
            <InputGroup label="Sort Date"><StyledInput type="date" value={cvData.start_date} onChange={e => setCvData({...cvData, start_date: e.target.value})} required /></InputGroup>
          </div>
          <InputGroup label="Description"><StyledTextArea rows="4" value={cvData.description} onChange={e => setCvData({...cvData, description: e.target.value})} /></InputGroup>
          <button disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/30 mt-2 text-xs">
            {isLoading ? '...' : editingCvId ? 'UPDATE_DATABASE' : 'INSERT_DATA'}
          </button>
        </form>
      </AdminModal>

    </div>
  );
}