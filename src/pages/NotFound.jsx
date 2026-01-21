import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Compte à rebours
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirection à la fin
    const redirect = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-mono text-red-500 relative overflow-hidden">
      {/* Fond bruité / Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full border border-red-600/50 bg-black/90 p-8 rounded shadow-[0_0_50px_rgba(220,38,38,0.5)]"
      >
        <h1 className="text-6xl font-bold mb-4 animate-pulse">404_ERROR</h1>
        <h2 className="text-2xl mb-8 border-b border-red-800 pb-4">CRITICAL_PROCESS_DIED</h2>

        <div className="space-y-2 text-sm md:text-base text-red-400">
          <p>&gt; System halted due to fatal exception at 0x00000000.</p>
          <p>&gt; The requested resource could not be located in the memory map.</p>
          <p>&gt; Dumping physical memory to disk...</p>
        </div>

        <div className="mt-8 p-4 bg-red-900/20 border border-red-800 rounded">
          <p className="mb-2 uppercase tracking-widest text-xs">Auto-Recovery Sequence</p>
          <div className="w-full bg-red-900/30 h-2 rounded overflow-hidden">
             <motion.div 
               className="h-full bg-red-500"
               initial={{ width: "100%" }}
               animate={{ width: "0%" }}
               transition={{ duration: 10, ease: "linear" }}
             />
          </div>
          <p className="mt-2 text-right text-xs">
            Rebooting system in <span className="font-bold text-white">{countdown}s</span>...
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-black font-bold rounded transition w-full"
          >
            FORCE_REBOOT_NOW()
          </button>
        </div>

      </motion.div>
    </div>
  );
}