import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CheckCircle, Truck, CreditCard, ShieldCheck, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const SHIPPING_FEE = 7;

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
    // Guest checkout allowed
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        userId: user?.uid || 'guest',
        customerEmail: user?.email || 'guest@hajti.tn',
        items,
        subtotal: total,
        shippingFee: SHIPPING_FEE,
        total: total + SHIPPING_FEE,
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingAddress: address
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(docRef.id);

      // Create admin notification
      await addDoc(collection(db, 'notifications'), {
        message: `Vous avez une nouvelle commande de ${address.fullName}`,
        type: 'new_order',
        read: false,
        createdAt: new Date().toISOString(),
        orderId: docRef.id,
        customerName: address.fullName
      });

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Modern Progress Steps */}
      <div className="flex justify-center mb-12 md:mb-20">
        <div className="flex items-center w-full max-w-2xl">
          <div className="flex flex-col items-center relative flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${step >= 1 ? 'bg-brand-ink text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Truck className="w-5 h-5" />
            </div>
            <span className={`absolute -bottom-8 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${step >= 1 ? 'text-brand-ink' : 'text-gray-400'}`}>Livraison</span>
          </div>
          
          <div className={`flex-1 h-[2px] mx-2 transition-colors duration-500 ${step >= 2 ? 'bg-brand-ink' : 'bg-gray-100'}`}></div>
          
          <div className="flex flex-col items-center relative flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${step >= 2 ? 'bg-brand-ink text-white' : 'bg-gray-100 text-gray-400'}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <span className={`absolute -bottom-8 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${step >= 2 ? 'text-brand-ink' : 'text-gray-400'}`}>Paiement</span>
          </div>
          
          <div className={`flex-1 h-[2px] mx-2 transition-colors duration-500 ${step >= 3 ? 'bg-brand-ink' : 'bg-gray-100'}`}></div>
          
          <div className="flex flex-col items-center relative flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${step >= 3 ? 'bg-brand-ink text-white' : 'bg-gray-100 text-gray-400'}`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className={`absolute -bottom-8 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${step >= 3 ? 'text-brand-ink' : 'text-gray-400'}`}>Confirmation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-16">
        {/* Main Content Area */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 bg-brand-ink text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <h2 className="text-xl font-display font-bold text-brand-ink uppercase tracking-wider">Adresse de livraison</h2>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="group">
                      <label className="block text-[11px] text-gray-400 uppercase tracking-widest mb-2 font-bold group-focus-within:text-brand-accent transition-colors">Nom complet</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Ex: Ahmed Ben Ali"
                        value={address.fullName} 
                        onChange={e => setAddress({...address, fullName: e.target.value})} 
                        className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl text-sm focus:outline-none focus:border-brand-accent focus:bg-white transition-all shadow-sm" 
                      />
                    </div>
                    
                    <div className="group">
                      <label className="block text-[11px] text-gray-400 uppercase tracking-widest mb-2 font-bold group-focus-within:text-brand-accent transition-colors">Adresse exacte</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Rue, Immeuble, Appartement..."
                        value={address.address} 
                        onChange={e => setAddress({...address, address: e.target.value})} 
                        className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl text-sm focus:outline-none focus:border-brand-accent focus:bg-white transition-all shadow-sm" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-[11px] text-gray-400 uppercase tracking-widest mb-2 font-bold group-focus-within:text-brand-accent transition-colors">Ville</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Ex: Tunis"
                          value={address.city} 
                          onChange={e => setAddress({...address, city: e.target.value})} 
                          className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl text-sm focus:outline-none focus:border-brand-accent focus:bg-white transition-all shadow-sm" 
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[11px] text-gray-400 uppercase tracking-widest mb-2 font-bold group-focus-within:text-brand-accent transition-colors">Code postal</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="1000"
                          value={address.zipCode} 
                          onChange={e => setAddress({...address, zipCode: e.target.value})} 
                          className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl text-sm focus:outline-none focus:border-brand-accent focus:bg-white transition-all shadow-sm" 
                        />
                      </div>
                    </div>
                    
                    <div className="group">
                      <label className="block text-[11px] text-gray-400 uppercase tracking-widest mb-2 font-bold group-focus-within:text-brand-accent transition-colors">Pays</label>
                      <select 
                        required 
                        value={address.country} 
                        onChange={e => setAddress({...address, country: e.target.value})} 
                        className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl text-sm focus:outline-none focus:border-brand-accent focus:bg-white transition-all shadow-sm appearance-none"
                      >
                        <option value="">Sélectionner un pays</option>
                        <option value="Tunisie">Tunisie</option>
                      </select>
                    </div>
                  </div>
                  
                  <button type="submit" className="w-full bg-brand-ink text-white py-5 rounded-2xl uppercase tracking-[0.2em] text-[12px] font-bold hover:bg-brand-accent transition-all shadow-xl flex items-center justify-center gap-3 group mt-10">
                    Continuer vers le paiement
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 bg-brand-ink text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <h2 className="text-xl font-display font-bold text-brand-ink uppercase tracking-wider">Mode de paiement</h2>
                </div>

                <div className="bg-brand-ink/5 border border-brand-ink/10 p-6 rounded-2xl mb-10 flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-brand-accent flex-shrink-0" />
                  <div>
                    <p className="text-brand-ink font-bold mb-1 text-sm uppercase tracking-wider">Paiement à la livraison</p>
                    <p className="text-brand-ink/50 text-xs leading-relaxed">Pour votre sécurité, nous acceptons uniquement le paiement à la livraison pour le moment. Payez en espèces lors de la réception de votre colis.</p>
                  </div>
                </div>
                
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-2xl">
              <span className="text-sm font-bold text-brand-ink">Total à payer</span>
              <span className="text-lg font-bold text-brand-accent">{(total + SHIPPING_FEE).toFixed(2)} TND</span>
            </div>
            <button 
                    onClick={handlePlaceOrder} 
                    disabled={loading}
                    className="w-full bg-brand-ink text-white py-5 rounded-2xl uppercase tracking-[0.2em] text-[12px] font-bold hover:bg-brand-accent transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? 'Traitement en cours...' : 'Confirmer ma commande'}
                  </button>
                  <button onClick={() => setStep(1)} className="w-full border border-gray-100 text-gray-400 py-4 rounded-2xl uppercase tracking-[0.2em] text-[11px] font-bold hover:text-brand-ink hover:border-brand-ink transition-all">
                    Retour aux informations de livraison
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 md:py-20 bg-white rounded-[3rem] border border-gray-100 shadow-xl"
              >
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-10">
                  <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-ink mb-6">Merci pour votre confiance !</h2>
                <p className="text-brand-ink/60 mb-2 text-lg font-light">Votre commande a été enregistrée avec succès{user ? `, ${user.displayName || user.email}` : ''}.</p>
                <p className="text-brand-ink/40 text-sm mb-12">Numéro de commande : <span className="font-mono text-brand-accent font-bold">{orderId}</span></p>
                
                <button onClick={() => navigate('/products')} className="inline-block bg-brand-ink text-white px-12 py-5 rounded-2xl uppercase tracking-[0.2em] text-[12px] font-bold hover:bg-brand-accent transition-all shadow-xl">
                  Continuer mes achats
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        {step !== 3 && (
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-32">
              <h3 className="text-lg font-display font-bold text-brand-ink mb-8 uppercase tracking-wider flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-brand-accent" />
                Résumé de la commande
              </h3>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-brand-ink line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-brand-ink/40 uppercase tracking-widest mt-1">Qté: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-brand-ink">
                      {(item.price * item.quantity).toFixed(2)} TND
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex justify-between text-sm text-brand-ink/60">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between text-sm text-brand-ink/60">
                  <span>Livraison</span>
                  <span className="text-brand-ink font-bold">{SHIPPING_FEE.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="text-lg font-display font-bold text-brand-ink">Total</span>
                  <span className="text-2xl font-bold text-brand-accent">{(total + SHIPPING_FEE).toFixed(2)} TND</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                <div className="flex items-center gap-3 text-[10px] text-brand-ink/40 uppercase tracking-widest font-bold">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Paiement 100% Sécurisé
                </div>
                <div className="flex items-center gap-3 text-[10px] text-brand-ink/40 uppercase tracking-widest font-bold">
                  <Truck className="w-4 h-4 text-brand-accent" />
                  Livraison {SHIPPING_FEE.toFixed(2)} TND en Tunisie
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
