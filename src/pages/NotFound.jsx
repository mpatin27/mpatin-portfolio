import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 font-mono">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl text-slate-300 mb-8">
        <span className="text-red-400">Error:</span> Command not found or directory does not exist.
      </p>
      
      <div className="bg-slate-900 p-6 rounded border border-slate-700 max-w-md w-full text-left mb-8 shadow-lg">
        <p className="text-slate-500 mb-2"># System Diagnostic:</p>
        <p className="text-green-400">$ whoami</p>
        <p className="text-slate-300 mb-2">visitor</p>
        <p className="text-green-400">$ whereis page</p>
        <p className="text-red-400 mb-2">page: not found in /var/www/portfolio</p>
      </div>

      <Link 
        to="/" 
        className="px-6 py-3 bg-green-600 text-black font-bold rounded hover:bg-green-500 transition-colors"
      >
        cd ~/home
      </Link>
    </div>
  )
}