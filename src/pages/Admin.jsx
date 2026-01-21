import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function Admin() {
  const navigate = useNavigate();
  
  // --- ÉTATS GLOBAUX ---
  const [activeTab, setActiveTab] = useState('projects'); 
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // --- ÉTATS PROFIL ---
  const [profileData, setProfileData] = useState({
    full_name: '', role: '', birth_date: '', location: '', status: '', 
    hard_skills: '', cv_file_url: '', avatar_url: '', // Ajout avatar_url
    phone: '', email: '', driving_license: '', languages: '', certifications: ''
  });
  // Fichier pour l'upload de l'avatar
  const [avatarFile, setAvatarFile] = useState(null);

  // --- ÉTATS PROJETS & CV ---
  const [projects, setProjects] = useState([]);
  const [projectData, setProjectData] = useState({ title: '', description: '', tags: '', demo_link: '', repo_link: '' });
  const [projectFile, setProjectFile] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [cvItems, setCvItems] = useState([]);
  const [cvData, setCvData] = useState({ category: 'experience', title: '', place: '', date_range: '', start_date: '', description: '' });
  const [editingCvId, setEditingCvId] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchProjects();
    fetchCvItems();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  // --- FETCHING ---
  const fetchProfile = async () => {
    const { data } = await supabase.from('profile').select('*').single();
    if (data) {
      setProfileData({
        ...data,
        hard_skills: data.hard_skills ? data.hard_skills.join(', ') : '',
        languages: data.languages ? data.languages.join(', ') : '',
        certifications: data.certifications ? data.certifications.join(', ') : ''
      });
    }
  };
  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
    setProjects(data || []);
  };
  const fetchCvItems = async () => {
    const { data } = await supabase.from('cv_items').select('*').order('start_date', { ascending: false });
    setCvItems(data || []);
  };

  const onDragEndProjects = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    const newList = Array.from(projects);
    const [moved] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, moved);
    setProjects(newList);
    try {
      const updates = newList.map((item, index) => supabase.from('projects').update({ sort_order: index }).eq('id', item.id));
      await Promise.all(updates);
    } catch (e) { console.error(e); }
  };

  // ==================== GESTION PROFIL ====================
  const handleProfileSubmit = async (e) => {
    e.preventDefault(); setIsLoading(true); setMessage('Updating profile...');
    try {
      // 1. Upload de l'avatar s'il y en a un nouveau
      let newAvatarUrl = profileData.avatar_url;
      if (avatarFile) {
        const fileName = `avatar-${Date.now()}-${avatarFile.name}`;
        // On réutilise le bucket 'project-images' pour simplifier, ou crée un bucket 'avatars'
        const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, avatarFile);
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage.from('project-images').getPublicUrl(fileName);
        newAvatarUrl = urlData.publicUrl;
      }

      const skillsArray = profileData.hard_skills.split(',').map(s => s.trim()).filter(s => s);
      const langsArray = profileData.languages.split(',').map(s => s.trim()).filter(s => s);
      const certsArray = profileData.certifications.split(',').map(s => s.trim()).filter(s => s);
      
      const { error } = await supabase.from('profile').update({
          full_name: profileData.full_name, role: profileData.role, birth_date: profileData.birth_date,
          location: profileData.location, status: profileData.status, 
          hard_skills: skillsArray,
          languages: langsArray,
          certifications: certsArray,
          phone: profileData.phone,
          email: profileData.email,
          driving_license: profileData.driving_license,
          avatar_url: newAvatarUrl // On sauvegarde l'URL
        }).eq('id', 1);

      if (error) throw error; 
      setMessage('SUCCESS: Profile updated.');
      setAvatarFile(null); // Reset file input
    } catch (error) { setMessage('ERROR: ' + error.message); } finally { setIsLoading(false); }
  };

  // ==================== GESTION PROJETS & CV (Identique) ====================
  const handleProjectSubmit = async (e) => {
    e.preventDefault(); setIsLoading(true);
    try {
      let coverUrl = null;
      if (projectFile) {
        const fileName = `${Date.now()}-${projectFile.name}`;
        await supabase.storage.from('project-images').upload(fileName, projectFile);
        const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
        coverUrl = data.publicUrl;
      }
      const tagsArray = projectData.tags.split(',').map(t => t.trim()).filter(t => t);
      const payload = { ...projectData, tags: tagsArray };
      if (coverUrl) payload.cover_url = coverUrl;

      if (!editingProjectId) {
        const maxOrder = projects.length > 0 ? Math.max(...projects.map(p => p.sort_order || 0)) : 0;
        payload.sort_order = maxOrder + 1;
        await supabase.from('projects').insert([payload]);
      } else {
        await supabase.from('projects').update(payload).eq('id', editingProjectId);
      }
      setProjectData({ title: '', description: '', tags: '', demo_link: '', repo_link: '' });
      setProjectFile(null); setEditingProjectId(null); document.getElementById('pFileInput').value = "";
      fetchProjects(); setMessage('SUCCESS: Project saved.');
    } catch (e) { setMessage('ERROR: ' + e.message); } setIsLoading(false);
  };
  const deleteProject = async (id) => { if(!window.confirm('Delete?')) return; await supabase.from('projects').delete().eq('id', id); fetchProjects(); };
  
  const editProject = (p) => {
    setEditingProjectId(p.id);
    setProjectData({ title: p.title, description: p.description, tags: p.tags ? p.tags.join(', ') : '', demo_link: p.demo_link||'', repo_link: p.repo_link||'' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCvSubmit = async (e) => {
    e.preventDefault(); setIsLoading(true);
    try {
      const payload = { ...cvData };
      if (!payload.start_date) payload.start_date = new Date().toISOString().split('T')[0];
      if (!editingCvId) {
        await supabase.from('cv_items').insert([payload]);
      } else {
        await supabase.from('cv_items').update(payload).eq('id', editingCvId);
      }
      setCvData({ category: 'experience', title: '', place: '', date_range: '', start_date: '', description: '' });
      setEditingCvId(null); fetchCvItems(); setMessage('SUCCESS: CV Item saved.');
    } catch (e) { setMessage('ERROR: ' + e.message); } setIsLoading(false);
  };
  const deleteCv = async (id) => { if(!window.confirm('Delete?')) return; await supabase.from('cv_items').delete().eq('id', id); fetchCvItems(); };
  const editCv = (item) => {
    setEditingCvId(item.id);
    setCvData({ category: item.category, title: item.title, place: item.place, date_range: item.date_range, start_date: item.start_date || '', description: item.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- ICÔNES ---
  const IconEdit = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>);
  const IconTrash = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
  const IconDrag = () => (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-mono">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
        <div><h1 className="text-3xl font-bold text-green-500">&gt; ADMIN_PANEL</h1><p className="text-slate-500 text-sm">System Configuration</p></div>
        <button onClick={handleLogout} className="text-red-400 border border-red-900 bg-red-900/10 px-4 py-2 rounded text-xs font-bold hover:bg-red-900 hover:text-white transition">EXIT</button>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('profile')} className={`px-6 py-2 rounded font-bold transition whitespace-nowrap ${activeTab === 'profile' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-purple-500'}`}>~/PROFILE</button>
        <button onClick={() => setActiveTab('projects')} className={`px-6 py-2 rounded font-bold transition whitespace-nowrap ${activeTab === 'projects' ? 'bg-green-600 text-black' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-green-500'}`}>~/PROJECTS</button>
        <button onClick={() => setActiveTab('cv')} className={`px-6 py-2 rounded font-bold transition whitespace-nowrap ${activeTab === 'cv' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-blue-500'}`}>~/RESUME_DATA</button>
      </div>
      {message && <div className={`mb-8 p-3 border rounded text-sm font-mono ${message.includes('ERROR') ? 'bg-red-900/20 border-red-500 text-red-400' : 'bg-green-900/20 border-green-500 text-green-400'}`}>{message}</div>}

      {activeTab === 'profile' && (
        <div className="max-w-4xl mx-auto bg-slate-900 p-8 rounded border border-slate-700 shadow-xl">
          <h2 className="text-purple-500 font-bold mb-6 text-xl">EDIT IDENTITY CARD</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            
            {/* --- NOUVEAU : PHOTO DE PROFIL --- */}
            <div className="border border-slate-700 p-4 rounded bg-slate-950">
               <label className="text-xs text-slate-500 uppercase mb-2 block tracking-wider">Photo Profil (Pour le PDF)</label>
               <div className="flex items-center gap-4">
                 {profileData.avatar_url && (
                   <img src={profileData.avatar_url} alt="Current" className="w-16 h-16 rounded-full object-cover border-2 border-purple-500" />
                 )}
                 <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files[0])} className="w-full text-slate-300 text-sm file:bg-purple-600/10 file:text-purple-500 file:border-0 file:mr-4 file:py-1 file:px-2 file:rounded hover:file:bg-purple-600/20 cursor-pointer" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Full Name</label><input value={profileData.full_name} onChange={e => setProfileData({...profileData, full_name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-purple-500 outline-none" /></div>
              <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Role</label><input value={profileData.role} onChange={e => setProfileData({...profileData, role: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-purple-500 outline-none" /></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Birth Date</label><input type="date" value={profileData.birth_date} onChange={e => setProfileData({...profileData, birth_date: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-purple-500 outline-none" /></div>
              <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Location</label><input value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-purple-500 outline-none" /></div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Phone</label><input value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-purple-500 outline-none" /></div>
              <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Email</label><input value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-purple-500 outline-none" /></div>
              <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Permis</label><input value={profileData.driving_license} onChange={e => setProfileData({...profileData, driving_license: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-purple-500 outline-none" /></div>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Status</label>
              <select value={profileData.status} onChange={e => setProfileData({...profileData, status: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-purple-500 outline-none"><option value="Open to work">🟢 Open to work</option><option value="En poste">🔴 En poste</option><option value="Freelance">🟣 Freelance</option><option value="À l'écoute">🟠 À l'écoute</option></select>
            </div>
            <div className="grid grid-cols-1 gap-6">
               <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Hard Skills</label><textarea rows="2" value={profileData.hard_skills} onChange={e => setProfileData({...profileData, hard_skills: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-purple-500 outline-none" /></div>
               <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Langues</label><input value={profileData.languages} onChange={e => setProfileData({...profileData, languages: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-purple-500 outline-none" /></div>
               <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Certifications</label><input value={profileData.certifications} onChange={e => setProfileData({...profileData, certifications: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-purple-500 outline-none" /></div>
            </div>
            <button disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded transition shadow-lg mt-4">{isLoading ? 'SAVING...' : 'UPDATE IDENTITY'}</button>
          </form>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid lg:grid-cols-2 gap-12">
          {/* ... (Formulaire Projets Identique - Code coupé pour lisibilité mais à garder) ... */}
           {/* Reprends le bloc PROJETS de la version précédente */}
           <div className="bg-slate-900 p-8 rounded border border-slate-700 h-fit shadow-xl">
             <h2 className="text-green-500 font-bold mb-6 flex items-center gap-2 text-xl">{editingProjectId ? '✎ EDIT PROJECT' : '+ NEW PROJECT'}</h2>
             <form onSubmit={handleProjectSubmit} className="space-y-5">
               <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Title</label><input value={projectData.title} onChange={e => setProjectData({...projectData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-green-500 outline-none" required /></div>
               <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Description</label><textarea value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-green-500 outline-none" rows="4" required /></div>
               <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Tags</label><input value={projectData.tags} onChange={e => setProjectData({...projectData, tags: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-green-500 outline-none" /></div>
               <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Cover Image</label><input id="pFileInput" type="file" accept="image/*" onChange={e => setProjectFile(e.target.files[0])} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-slate-300 text-sm file:bg-green-600/10 file:text-green-500 file:border-0 file:mr-4 file:py-1 file:px-2 file:rounded hover:file:bg-green-600/20 cursor-pointer" /></div>
               <div className="grid grid-cols-2 gap-4"><div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Demo URL</label><input value={projectData.demo_link} onChange={e => setProjectData({...projectData, demo_link: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-green-500 outline-none" /></div><div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Repo URL</label><input value={projectData.repo_link} onChange={e => setProjectData({...projectData, repo_link: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-green-500 outline-none" /></div></div>
               <div className="flex gap-4 pt-4">{editingProjectId && <button type="button" onClick={() => {setEditingProjectId(null); setProjectData({title:'',description:'',tags:'',demo_link:'',repo_link:''})}} className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded">CANCEL</button>}<button disabled={isLoading} className="flex-grow bg-green-600 hover:bg-green-500 text-black font-bold py-4 rounded transition shadow-lg">{editingProjectId ? 'UPDATE' : 'DEPLOY'}</button></div>
             </form>
           </div>
           <div>
            <h2 className="text-white font-bold mb-4 flex items-center gap-2"><span className="text-blue-500">ℹ</span> ACTIVE PROJECTS</h2>
            <DragDropContext onDragEnd={onDragEndProjects}><Droppable droppableId="p-list">{(provided) => (<div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">{projects.map((p, i) => (<Draggable key={p.id} draggableId={p.id.toString()} index={i}>{(prov, snap) => (<div ref={prov.innerRef} {...prov.draggableProps} className={`p-4 rounded border flex gap-4 items-center ${snap.isDragging ? 'bg-slate-800 border-green-500 shadow-xl' : 'bg-slate-900 border-slate-700'}`}><div {...prov.dragHandleProps} className="text-slate-600 hover:text-green-500 cursor-grab p-2"><IconDrag /></div><div className="w-16 h-16 bg-slate-950 rounded overflow-hidden flex-shrink-0 border border-slate-800">{p.cover_url && <img src={p.cover_url} className="w-full h-full object-cover" alt="" />}</div><div className="flex-grow"><p className="text-white font-bold">{p.title}</p><p className="text-slate-500 text-xs truncate max-w-[200px]">{p.description}</p></div><div className="flex flex-col gap-2"><button onClick={() => editProject(p)} className="text-slate-400 hover:text-yellow-400 transition-colors p-1"><IconEdit /></button><button onClick={() => deleteProject(p.id)} className="text-slate-600 hover:text-red-500 transition-colors p-1"><IconTrash /></button></div></div>)}</Draggable>))}{provided.placeholder}</div>)}</Droppable></DragDropContext>
           </div>
        </div>
      )}

      {activeTab === 'cv' && (
        <div className="grid lg:grid-cols-2 gap-12">
          {/* ... (Formulaire CV Identique - Code coupé pour lisibilité mais à garder) ... */}
          {/* Reprends le bloc CV de la version précédente */}
           <div className="bg-slate-900 p-8 rounded border border-slate-700 h-fit shadow-xl">
             <h2 className="text-blue-500 font-bold mb-6 flex items-center gap-2 text-xl">{editingCvId ? '✎ EDIT ENTRY' : '+ NEW ENTRY'}</h2>
             <form onSubmit={handleCvSubmit} className="space-y-5">
               <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Category</label><select value={cvData.category} onChange={e => setCvData({...cvData, category: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-blue-500 outline-none"><option value="experience">Expérience Pro</option><option value="formation">Formation</option></select></div>
               <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Title</label><input value={cvData.title} onChange={e => setCvData({...cvData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-blue-500 outline-none" required /></div>
               <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Place</label><input value={cvData.place} onChange={e => setCvData({...cvData, place: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-blue-500 outline-none" required /></div>
               <div className="grid grid-cols-2 gap-4"><div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Display Date</label><input value={cvData.date_range} onChange={e => setCvData({...cvData, date_range: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-blue-500 outline-none" required /></div><div><label className="text-xs text-green-500 uppercase mb-1 block tracking-wider">Sorting Date</label><input type="date" value={cvData.start_date} onChange={e => setCvData({...cvData, start_date: e.target.value})} className="w-full bg-slate-950 border border-green-900/50 p-3 rounded text-white focus:border-green-500 outline-none" required /></div></div>
               <div><label className="text-xs text-slate-500 uppercase mb-1 block tracking-wider">Description</label><textarea value={cvData.description} onChange={e => setCvData({...cvData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-blue-500 outline-none" rows="4" /></div>
               <div className="flex gap-4 pt-4">{editingCvId && <button type="button" onClick={() => {setEditingCvId(null); setCvData({category:'experience',title:'',place:'',date_range:'',start_date:'',description:''})}} className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded">CANCEL</button>}<button disabled={isLoading} className="flex-grow bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded transition shadow-lg">{editingCvId ? 'UPDATE' : 'ADD'}</button></div>
             </form>
           </div>
           <div>
            <h2 className="text-white font-bold mb-4 flex items-center gap-2"><span className="text-blue-500">ℹ</span> RESUME ITEMS</h2>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">{cvItems.map((item) => (<div key={item.id} className={`p-4 rounded border flex gap-4 items-center bg-slate-900 ${item.category === 'formation' ? 'border-purple-900/50' : 'border-blue-900/50'}`}><div className="flex-grow"><div className="flex items-center gap-2 mb-1"><span className={`text-[10px] px-2 rounded uppercase font-bold ${item.category === 'formation' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>{item.category.substring(0, 4)}</span><p className="text-white font-bold text-sm">{item.title}</p></div><p className="text-slate-500 text-xs">{item.place} | {item.date_range}</p></div><div className="flex flex-col gap-2"><button onClick={() => editCv(item)} className="text-slate-400 hover:text-yellow-400 transition-colors p-1"><IconEdit /></button><button onClick={() => deleteCv(item.id)} className="text-slate-600 hover:text-red-500 transition-colors p-1"><IconTrash /></button></div></div>))}{cvItems.length === 0 && <p className="text-slate-600 text-center py-10">No entries yet.</p>}</div>
           </div>
        </div>
      )}
    </div>
  );
}