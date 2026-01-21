import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage("Erreur : " + error.message);
    } else {
      // Si c'est bon, on redirige vers l'admin
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-slate-900 p-8 rounded border border-slate-700 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-green-500 mb-6 text-center">ACCESS_CONTROL</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-1 text-sm">IDENTIFIER</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white focus:border-green-500 outline-none"
              placeholder="admin@sys.com"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 text-sm">PASSPHRASE</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white focus:border-green-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="w-full bg-green-600/20 border border-green-500 text-green-500 hover:bg-green-600 hover:text-black font-bold py-2 rounded transition-all mt-4">
            INITIATE_SESSION
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-400 text-sm">{message}</p>}
      </div>
    </div>
  );
}