import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser'; // Import de la librairie

export default function Contact() {
  const form = useRef(); // Référence au formulaire
  
  const [formData, setFormData] = useState({
    user_name: '', // J'ai renommé pour matcher les standards EmailJS
    user_email: '',
    message: ''
  });
  
  const [status, setStatus] = useState('idle'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    // --- CONFIGURATION EMAILJS ---
    // Remplace ces valeurs par les tiennes !
    const SERVICE_ID = 'service_lrwpy1u'; 
    const TEMPLATE_ID = 'template_8rq8eh3';
    const PUBLIC_KEY = 'vgm34lKBOKSGbdyAo';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
          setStatus('success');
          setFormData({ user_name: '', user_email: '', message: '' });
          setTimeout(() => setStatus('idle'), 5000);
      }, (error) => {
          console.log(error.text);
          alert("Erreur d'envoi du paquet (Voir console F12)");
          setStatus('idle');
      });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      {/* Header inchangé... */}
      <div className="mb-10 border-b border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <p className="text-green-500 font-bold mb-1">
            root@matheo:~/contact # <span className="text-white">./send_packet.sh</span>
          </p>
          <p className="text-slate-500 text-sm">
            Opening port 25 (SMTP)... <span className="text-green-500">[ OK ]</span>
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        
        <div>
          {/* IMPORTANT : On ajoute ref={form} ici */}
          <form ref={form} onSubmit={handleSubmit} className="space-y-6">
            
            <div className="group">
              <label className="block text-slate-500 text-xs mb-1">--user-name</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-green-600 font-bold">$</span>
                <input 
                  type="text"
                  name="user_name" // Important pour EmailJS : l'attribut name doit matcher tes variables template
                  required
                  value={formData.user_name}
                  onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 pl-8 text-green-400 focus:outline-none focus:border-green-500 font-mono"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-slate-500 text-xs mb-1">--reply-to</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-green-600 font-bold">$</span>
                <input 
                  type="email"
                  name="user_email" // Important
                  required
                  value={formData.user_email}
                  onChange={(e) => setFormData({...formData, user_email: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 pl-8 text-green-400 focus:outline-none focus:border-green-500 font-mono"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-slate-500 text-xs mb-1">--payload-content</label>
              <textarea 
                name="message" // Important
                required
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-300 focus:outline-none focus:border-green-500 font-mono"
                placeholder="Write your message data here..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status === 'sending'}
              className="w-full bg-green-600/10 border border-green-500 text-green-500 font-bold py-3 px-4 rounded hover:bg-green-600 hover:text-black transition-all flex items-center justify-center gap-2"
            >
              {status === 'sending' ? (
                <><span className="animate-spin">⟳</span> TRANSMITTING...</>
              ) : status === 'success' ? (
                <><span>✓</span> PACKET SENT</>
              ) : (
                <><span>&gt;_</span> EXECUTE SEND</>
              )}
            </button>

          </form>
        </div>

        {/* Partie Droite (Infos) inchangée... */}
        <div className="bg-slate-900 p-6 rounded border border-slate-800 font-mono text-sm relative overflow-hidden">
          <h3 className="text-white font-bold mb-4 border-b border-slate-700 pb-2">CONNECTION_DETAILS</h3>
          <div className="space-y-4 text-slate-400">
             <p>Envoyez-moi un ping direct.</p>
             <p className="text-xs text-slate-600">Port 25 is listening...</p>
          </div>
        </div>

      </div>
      
      {/* Logs de sortie */}
      {status === 'success' && (
        <div className="mt-8 p-4 bg-green-900/20 border border-green-900 text-green-400 font-mono text-sm rounded animate-pulse">
          <p>[SUCCESS] 200 OK</p>
          <p>[INFO] Email dispatched successfully via SMTP Relay.</p>
        </div>
      )}

    </div>
  )
}