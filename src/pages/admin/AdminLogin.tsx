import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (username === 'admin26' && password === 'admin26') {
      try {
        const adminEmail = 'admin26@hajti.com';
        const adminPass = 'admin26admin26';
        
        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPass);
        } catch (authErr: any) {
          if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
            // Create admin user if it doesn't exist
            userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
          } else {
            throw authErr;
          }
        }

        const user = userCredential.user;
        console.log("Admin logged in successfully:", user.uid, user.email);
        
        // Ensure user document exists with admin role
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: adminEmail,
            role: 'admin',
            name: 'Admin'
          });
        }

        localStorage.setItem('isAdminLoggedIn', 'true');
        navigate('/admin');
      } catch (err: any) {
        console.error("Admin login error", err);
        setError('Erreur de connexion au serveur: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Identifiants incorrects');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Administration</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
              placeholder="admin26"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
              placeholder="•••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
