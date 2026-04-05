import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CheckCircle } from 'lucide-react';

export function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [address, setAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    if (items.length === 0 && step !== 3) {
      navigate('/products');
    }
  }, [items, navigate, step]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">Connexion requise</h2>
        <p className="text-gray-500 mb-10 text-sm">Veuillez vous connecter pour finaliser votre commande en toute sécurité.</p>
        <button 
          onClick={() => navigate('/auth', { state: { from: { pathname: '/checkout' } } })}
          className="w-full bg-black text-white py-4 uppercase tracking-[0.15em] text-[11px] font-medium hover:bg-gray-800 transition-colors"
        >
          Se connecter
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        userId: user.uid,
        items,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingAddress: address
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(docRef.id);
      clearCart();
      setStep(3);
    } catch (error) {
      console.error("Error placing order", error);
      alert("Une erreur est survenue lors de la commande. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Progress Steps */}
      <div className="flex justify-center mb-16">
        <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.15em] font-medium">
          <span className={step >= 1 ? 'text-black' : 'text-gray-400'}>Livraison</span>
          <span className="text-gray-300">/</span>
          <span className={step >= 2 ? 'text-black' : 'text-gray-400'}>Paiement</span>
          <span className="text-gray-300">/</span>
          <span className={step >= 3 ? 'text-black' : 'text-gray-400'}>Confirmation</span>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white p-8 md:p-12 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-light text-gray-900 mb-8 uppercase tracking-widest text-center">Informations de livraison</h2>
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
            <div>
              <label className="block text-[11px] text-gray-500 uppercase tracking-[0.1em] mb-2">Nom complet</label>
              <input required type="text" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 uppercase tracking-[0.1em] mb-2">Adresse</label>
              <input required type="text" value={address.address} onChange={e => setAddress({...address, address: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] text-gray-500 uppercase tracking-[0.1em] mb-2">Ville</label>
                <input required type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 uppercase tracking-[0.1em] mb-2">Code postal</label>
                <input required type="text" value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 uppercase tracking-[0.1em] mb-2">Pays</label>
              <input required type="text" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>
            <button type="submit" className="w-full bg-black text-white py-4 uppercase tracking-[0.15em] text-[11px] font-medium hover:bg-gray-800 transition-colors mt-10">
              Continuer vers le paiement
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-8 md:p-12 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-light text-gray-900 mb-8 uppercase tracking-widest text-center">Paiement</h2>
          <div className="bg-gray-50 border border-gray-200 p-8 mb-10 text-center">
            <p className="text-gray-900 font-medium mb-2 text-sm">Ceci est une application de démonstration.</p>
            <p className="text-gray-500 text-xs">Aucun paiement réel n'est requis. Cliquez ci-dessous pour simuler la commande.</p>
          </div>
          
          <div className="border-t border-gray-200 pt-8 mb-10">
            <div className="flex justify-between items-center text-lg text-gray-900 font-medium">
              <span>Total à payer</span>
              <span>{total.toFixed(2)} TND</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="w-1/3 border border-gray-200 text-gray-600 py-4 uppercase tracking-[0.15em] text-[11px] font-medium hover:text-black hover:border-black transition-colors">
              Retour
            </button>
            <button 
              onClick={handlePlaceOrder} 
              disabled={loading}
              className="w-2/3 bg-black text-white py-4 uppercase tracking-[0.15em] text-[11px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Traitement...' : 'Confirmer la commande'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-4 tracking-wide">Commande confirmée</h2>
          <p className="text-gray-600 mb-2 text-sm">Merci pour votre achat, {user.displayName || user.email}.</p>
          <p className="text-gray-500 text-xs mb-12">Votre numéro de commande est : <span className="font-mono text-gray-900 font-medium">{orderId}</span></p>
          
          <button onClick={() => navigate('/products')} className="inline-block bg-black text-white px-10 py-4 uppercase tracking-[0.15em] text-[11px] font-medium hover:bg-gray-800 transition-colors">
            Continuer vos achats
          </button>
        </div>
      )}
    </div>
  );
}
