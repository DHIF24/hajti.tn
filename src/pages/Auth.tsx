import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginWithEmail, registerWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, or default to home
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      // Format Firebase error messages
      const message = err.message || 'Une erreur est survenue.';
      if (message.includes('auth/invalid-credential')) {
        setError('Email ou mot de passe invalide.');
      } else if (message.includes('auth/email-already-in-use')) {
        setError('Un compte avec cet email existe déjà.');
      } else if (message.includes('auth/weak-password')) {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion avec Google.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-white">
      <div className="w-full max-w-md bg-white p-8 md:p-12 border border-gray-100 shadow-sm">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </h1>
          <p className="text-gray-500 text-sm font-light">
            {isLogin 
              ? 'Connectez-vous pour accéder à votre espace.' 
              : 'Rejoignez-nous pour une expérience personnalisée.'}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-[11px] text-gray-500 uppercase tracking-[0.1em] mb-2">Nom complet</label>
              <div className="relative">
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="Jean Dupont"
                />
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] text-gray-500 uppercase tracking-[0.1em] mb-2">Adresse Email</label>
            <div className="relative">
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="vous@exemple.com"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 uppercase tracking-[0.1em] mb-2">Mot de passe</label>
            <div className="relative">
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="••••••••"
                minLength={6}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-4 uppercase tracking-[0.15em] text-[11px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 mt-8"
          >
            {loading ? 'Traitement...' : (isLogin ? 'Se connecter' : 'Créer mon compte')}
          </button>
        </form>

        <div className="mt-10 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-[0.1em]">
            <span className="px-4 bg-white text-gray-400">Ou continuer avec</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          type="button"
          className="mt-8 w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3.5 hover:border-black transition-colors text-sm font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <div className="mt-10 text-center text-sm text-gray-500">
          {isLogin ? "Vous n'avez pas de compte ? " : "Vous avez déjà un compte ? "}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-black hover:text-gray-600 font-medium transition-colors border-b border-black pb-0.5"
          >
            {isLogin ? 'Créer un compte' : 'Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
}
