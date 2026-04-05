import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus } from 'lucide-react';

export function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">Votre panier est vide</h2>
        <p className="text-gray-500 mb-10 text-sm">Découvrez notre collection et trouvez votre bonheur.</p>
        <Link 
          to="/products" 
          className="inline-block bg-black text-white px-10 py-4 uppercase tracking-[0.15em] text-[11px] font-medium hover:bg-gray-800 transition-colors"
        >
          Continuer vos achats
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
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl text-center tracking-[0.2em] uppercase mb-16 font-light text-gray-900">
        Mon Panier
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-200 pb-4 mb-8 text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium">
            <div className="col-span-6">Produit</div>
            <div className="col-span-3 text-center">Quantité</div>
            <div className="col-span-3 text-right">Total</div>
          </div>

          <div className="space-y-8">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-4 border-b border-gray-100 last:border-0">
                <div className="col-span-1 md:col-span-6 flex gap-6 items-center">
                  <div className="w-24 h-32 flex-shrink-0 bg-[#f8f8f8]">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-2">{item.category}</div>
                    <Link to={`/product/${item.id}`} className="text-sm text-gray-900 hover:text-gray-600 transition-colors font-medium">
                      {item.name}
                    </Link>
                    <div className="text-sm text-gray-500 mt-2">{item.price.toFixed(2)} TND</div>
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-[11px] uppercase tracking-[0.15em] text-gray-500">Quantité</span>
                  <div className="flex items-center border border-gray-200">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 text-gray-400 hover:text-black transition-colors"
                    >
                      <Minus className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 text-gray-400 hover:text-black transition-colors"
                    >
                      <Plus className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center">
                  <span className="md:hidden text-[11px] uppercase tracking-[0.15em] text-gray-500">Total</span>
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-medium text-gray-900">{(item.price * item.quantity).toFixed(2)} TND</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-8 sticky top-24">
            <h2 className="text-lg font-medium text-gray-900 mb-8 uppercase tracking-widest text-center">Résumé</h2>
            
            <div className="space-y-4 mb-8 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="text-gray-400 text-xs">Calculée à l'étape suivante</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-center text-lg text-gray-900 font-medium">
                <span>Total</span>
                <span>{total.toFixed(2)} TND</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 uppercase tracking-[0.15em] text-[11px] font-medium hover:bg-gray-800 transition-colors"
            >
              Procéder au paiement <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
            
            {!user && (
              <p className="text-center text-[11px] text-gray-500 mt-6">
                Vous pourrez vous connecter ou créer un compte à l'étape suivante.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
