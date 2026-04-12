import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm"
        >
          <ShoppingBag className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
        </motion.div>
        <h2 className="text-3xl font-medium text-gray-900 mb-4 tracking-tight">Votre panier est vide</h2>
        <p className="text-gray-500 mb-10 text-base">Découvrez notre collection et trouvez votre bonheur.</p>
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          Continuer vos achats <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h1 className="text-4xl text-center tracking-tight mb-16 font-medium text-gray-900" style={{ fontFamily: "'Varela Round', 'Quicksand', sans-serif" }}>
        Mon Panier
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-100 pb-4 mb-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">
            <div className="col-span-6">Produit</div>
            <div className="col-span-3 text-center">Quantité</div>
            <div className="col-span-3 text-right">Total</div>
          </div>

          <div className="space-y-6">
            {items.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="col-span-1 md:col-span-6 flex gap-6 items-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-[#f8f8f8] rounded-xl overflow-hidden">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-medium">{item.category}</div>
                    <Link to={`/product/${item.id}`} className="text-base text-gray-900 hover:text-gray-600 transition-colors font-medium line-clamp-2">
                      {item.name}
                    </Link>
                    <div className="text-sm text-gray-500 mt-2 font-medium">{item.price.toFixed(2)} TND</div>
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-xs uppercase tracking-wider text-gray-400 font-semibold">Quantité</span>
                  <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-white rounded-full transition-all shadow-sm"
                    >
                      <Minus className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-white rounded-full transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center">
                  <span className="md:hidden text-xs uppercase tracking-wider text-gray-400 font-semibold">Total</span>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-base font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)} TND</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 sticky top-32 border border-gray-100 shadow-xl shadow-gray-200/40">
            <h2 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Résumé de la commande</h2>
            
            <div className="space-y-5 mb-8 text-base text-gray-600">
              <div className="flex justify-between items-center">
                <span className="font-medium">Sous-total</span>
                <span className="font-medium text-gray-900">{total.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Livraison</span>
                <span className="font-medium text-gray-900">7.00 TND</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-lg font-medium text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900 block">{(total + 7).toFixed(2)} TND</span>
                  <span className="text-xs text-gray-400">Taxes incluses</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 rounded-full text-sm font-bold hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Procéder au paiement <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </button>
            
            {!user && (
              <p className="text-center text-xs text-gray-500 mt-6 font-medium">
                Vous pourrez vous connecter ou créer un compte à l'étape suivante.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
