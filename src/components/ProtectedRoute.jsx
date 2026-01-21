import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Vérifie si une session existe déjà
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Écoute les changements (connexion/déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-green-500">Scanning credentials...</div>;
  }

  // Si pas de session, on renvoie vers le login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Si connecté, on affiche la page protégée (l'Admin)
  return children;
}