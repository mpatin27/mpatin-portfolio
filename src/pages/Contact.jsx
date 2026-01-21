import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';

export default function Contact() {
  const form = useRef();
  
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: '',
    honeypot: '' 
  });
  
  const [status, setStatus] = useState('idle'); 

  // --- LOGIQUE CAPTCHA ---
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, userAns: '' });
  const [isHuman, setIsHuman] = useState(false);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setCaptcha({
      num1: Math.floor(Math.random() * 10),
      num2: Math.floor(Math.random() * 10),
      userAns: ''
    });
    setIsHuman(false);
  };

  const handleCaptchaChange = (e) => {
    const val = e.target.value;
    setCaptcha({ ...captcha, userAns: val });
    if (parseInt(val) === captcha.num1 + captcha.num2) {
      setIsHuman(true);
    } else {
      setIsHuman(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isHuman || formData.honeypot !== "") {
      return; 
    }

    setStatus('sending');

    const SERVICE_ID = 'service_lrwpy1u'; 
    const TEMPLATE_ID = 'template_8rq8eh3';
    const PUBLIC_KEY = 'vgm34lKBOKSGbdyAo';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
          setStatus('success');
          setFormData({ user_name: '', user_email: '', message: '', honeypot: '' });
          generateCaptcha();
          setTimeout(() => setStatus('idle'), 5000);
      }, (error) => {
          console.log(error.text);
          alert("Erreur d'envoi. Vérifiez la console.");
          setStatus('idle');
      });
  };

  return (
    <PageTransition>
      <SEO
        title="Contact - Me Contacter"
        description="Envoyez-moi un message direct via le formulaire de contact sécurisé."
      />
      <div className="max-w-5xl mx-auto px-4 py-12 font-mono">
        
        {/* Header */}
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

        <form ref={form} onSubmit={handleSubmit} className="h-full">
          
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* --- COLONNE GAUCHE (S'adapte en hauteur) --- */}
            <div className="space-y-6 flex flex-col h-full">
                
                {/* HONEYPOT */}
                <input type="text" name="honeypot" value={formData.honeypot} onChange={(e) => setFormData({...formData, honeypot: e.target.value})} style={{display: 'none'}} tabIndex={-1} autoComplete="off" />
                
                {/* Nom */}
                <div className="group">
                  <label className="block text-slate-500 text-xs mb-1">--user-name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-green-600 font-bold">$</span>
                    <input type="text" name="user_name" required value={formData.user_name} onChange={(e) => setFormData({...formData, user_name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 pl-8 text-green-400 focus:outline-none focus:border-green-500 font-mono transition-colors" placeholder="Enter your name" />
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-slate-500 text-xs mb-1">--reply-to</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-green-600 font-bold">$</span>
                    <input type="email" name="user_email" required value={formData.user_email} onChange={(e) => setFormData({...formData, user_email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 pl-8 text-green-400 focus:outline-none focus:border-green-500 font-mono transition-colors" placeholder="name@company.com" />
                  </div>
                </div>

                {/* Message (Prend tout l'espace restant) */}
                <div className="group flex-grow flex flex-col">
                  <label className="block text-slate-500 text-xs mb-1">--payload-content</label>
                  <textarea 
                    name="message" 
                    required 
                    value={formData.message} 
                    onChange={(e) => setFormData({...formData, message: e.target.value})} 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-300 focus:outline-none focus:border-green-500 font-mono transition-colors h-full resize-none" 
                    placeholder="Le contenu de votre message ici"
                  ></textarea>
                </div>

            </div>

            {/* --- COLONNE DROITE (Fixe la hauteur) --- */}
            <div className="space-y-8 flex flex-col justify-between">
              
              {/* Connection Details */}
              <div className="bg-slate-900 p-6 rounded border border-slate-800 font-mono text-sm relative overflow-hidden h-fit">
                <h3 className="text-white font-bold mb-4 border-b border-slate-700 pb-2">CONNECTION_DETAILS</h3>
                <div className="space-y-4 text-slate-400">
                  <p>Envoyez-moi un ping direct pour toute collaboration.</p>
                  <div className="text-xs text-slate-600 mt-4 pt-4 border-t border-slate-800">
                    <p>Port 25 is listening...</p>
                    <p>Encryption: TLS v1.3</p>
                    <p>Status: <span className="text-green-500">ONLINE</span></p>
                  </div>
                </div>
              </div>

              {/* Bloc Sécurité + Bouton */}
              <div className="space-y-8">
                {/* CAPTCHA */}
                <div className="p-4 border border-slate-700 bg-slate-950 rounded relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                     <label className={`text-xs font-bold uppercase tracking-wider ${isHuman ? 'text-green-500' : 'text-red-500'}`}>
                       {isHuman ? '[ ACCESS GRANTED ]' : '[ SUDO SECURITY CHECK ]'}
                     </label>
                     <div className={`w-3 h-3 rounded-full ${isHuman ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse' : 'bg-red-500 animate-pulse'}`}></div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                     <span className="text-slate-400 text-sm">root@firewall:~$</span>
                     <span className="text-white font-bold text-sm">calc {'>>'} {captcha.num1} + {captcha.num2}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                     <span className="text-green-500 font-bold">&gt;</span>
                     <input 
                       type="number" 
                       value={captcha.userAns}
                       onChange={handleCaptchaChange}
                       placeholder="?"
                       className={`bg-transparent border-b-2 outline-none w-20 font-bold text-center transition-colors ${isHuman ? 'border-green-500 text-green-500' : 'border-red-900 text-red-500 focus:border-red-500'}`}
                     />
                  </div>
                </div>

                {/* BOUTON */}
                <button 
                  type="submit" 
                  disabled={!isHuman || status === 'sending'}
                  className={`w-full font-bold py-4 px-4 rounded transition-all flex items-center justify-center gap-2 border duration-300
                    ${isHuman 
                      ? 'bg-green-600/10 border-green-500 text-green-500 hover:bg-green-600 hover:text-black cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                      : 'bg-red-900/10 border-red-900 text-red-700 cursor-not-allowed grayscale-[0.5]'
                    }
                  `}
                >
                  {status === 'sending' ? (
                    <><span className="animate-spin">⟳</span> TRANSMITTING...</>
                  ) : !isHuman ? (
                    <><span>✕</span> PERMISSION DENIED (SOLVE CAPTCHA)</>
                  ) : status === 'success' ? (
                    <><span>✓</span> PACKET SENT</>
                  ) : (
                    <><span>&gt;_</span> EXECUTE SEND</>
                  )}
                </button>
              </div>

            </div>

          </div>
        </form>
        
        {/* Logs */}
        {status === 'success' && (
          <div className="mt-8 p-4 bg-green-900/20 border border-green-900 text-green-400 font-mono text-sm rounded animate-pulse">
            <p>[SUCCESS] 200 OK</p>
            <p>[INFO] Email dispatched successfully via SMTP Relay.</p>
          </div>
        )}

      </div>
    </PageTransition>
  )
}