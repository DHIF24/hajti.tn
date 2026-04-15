import { useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const DEMO_PRODUCTS = [
  {
    name: "Panier de Rangement en Jacinthe d'Eau",
    description: "Ensemble de paniers tressés à la main, parfaits pour le rangement élégant.",
    price: 85.00,
    category: "Rangement",
    imageUrl: "https://images.unsplash.com/photo-1611077544813-5921e0c47bce?q=80&w=2070&auto=format&fit=crop",
    stock: 0,
    rating: 4.9,
    featured: true
  },
  {
    name: "Applique Murale en Rotin",
    description: "Applique murale avec abat-jour en cannage rotin et structure en métal noir.",
    price: 120.00,
    category: "Décors",
    imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2070&auto=format&fit=crop",
    stock: 0,
    rating: 4.8,
    featured: true
  },
  {
    name: "Suspension Boule en Rotin",
    description: "Suspension tressée en forme de globe, idéale pour une ambiance chaleureuse.",
    price: 145.00,
    category: "Décors",
    imageUrl: "https://images.unsplash.com/photo-1528384483218-b42e616212dc?q=80&w=2076&auto=format&fit=crop",
    stock: 0,
    rating: 4.7,
    featured: true
  },
  {
    name: "Lampe Cylindre en Cannage",
    description: "Lampe à poser cylindrique en cannage naturel.",
    price: 95.00,
    category: "Décors",
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2070&auto=format&fit=crop",
    stock: 0,
    rating: 4.9,
    featured: true
  }
];

export function AdminSeed() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    if (profile?.role !== 'admin') {
      setMessage('Error: You must be an admin to seed the database.');
      return;
    }

    setLoading(true);
    setMessage('Seeding database...');
    
    try {
      const batch = writeBatch(db);
      const productsRef = collection(db, 'products');

      DEMO_PRODUCTS.forEach((product) => {
        const newDocRef = doc(productsRef);
        batch.set(newDocRef, product);
      });

      await batch.commit();
      setMessage('Successfully seeded demo products!');
    } catch (error) {
      console.error("Error seeding", error);
      setMessage('Error seeding database. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl mb-6 uppercase tracking-widest">Admin Setup</h1>
      <p className="text-gray-500 mb-8">
        Populate the Firestore database with the new home decor demo products.
      </p>
      
      <button 
        onClick={handleSeed}
        disabled={loading}
        className="bg-black text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Seed Database'}
      </button>

      {message && (
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 text-gray-700 text-sm">
          {message}
        </div>
      )}
    </div>
  );
}
