import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { ShoppingBag, Check, Star, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard: React.FC<{ product: Product; listView?: boolean; badge?: { text: string; color: string } }> = ({ product, listView, badge }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const hasPromotion = product.promotionPercentage && product.promotionPercentage > 0;
  const originalPrice = hasPromotion ? product.price / (1 - product.promotionPercentage! / 100) : product.price;

  if (listView) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Link to={`/product/${product.id}`} className="group flex flex-col sm:flex-row gap-8 items-center bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="relative w-full sm:w-1/3 aspect-square overflow-hidden bg-[#f8f8f8] rounded-2xl flex-shrink-0">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="object-cover w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
            {hasPromotion && (
              <div className="absolute top-4 right-4 bg-brand-accent text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest z-10 shadow-sm">
                -{product.promotionPercentage}%
              </div>
            )}
            {!hasPromotion && badge && (
              <div className={`absolute top-4 right-4 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest z-10 shadow-sm ${badge.color}`}>
                {badge.text}
              </div>
            )}
          </div>
          
          <div className="flex-grow text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-brand-accent text-brand-accent" />
              ))}
              <span className="text-[10px] text-brand-ink/40 ml-1">(4.9)</span>
            </div>
            <h3 className="text-xl text-brand-ink font-display font-semibold mb-3">
              {product.name}
            </h3>
            <p className="text-sm text-brand-ink/60 mb-6 font-light leading-relaxed max-w-2xl line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4 mb-6">
              <span className="text-lg text-brand-accent font-bold">
                {product.price.toFixed(2)} TND
              </span>
              {hasPromotion && (
                <span className="text-sm text-brand-ink/30 line-through">
                  {originalPrice.toFixed(2)} TND
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              {product.stock > 0 && (
                <button 
                  onClick={handleQuickAdd}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${isAdded ? 'bg-green-600 text-white' : 'bg-brand-ink text-white hover:bg-brand-accent'}`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Ajouté !
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Ajouter au panier
                    </>
                  )}
                </button>
              )}
              <div className="flex items-center gap-1.5 text-[10px] text-brand-ink/50 uppercase tracking-widest font-medium">
                <Truck className="w-3.5 h-3.5" />
                Livraison en Tunisie
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Link to={`/product/${product.id}`} className="group relative flex flex-col h-full bg-white rounded-2xl md:rounded-[2rem] p-2 md:p-4 shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-ink/5">
        <div className="relative aspect-square overflow-hidden bg-[#f8f8f8] rounded-xl md:rounded-[1.5rem] mb-3 md:mb-6">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="object-cover w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          
          {hasPromotion && (
            <div className="absolute top-4 right-4 bg-brand-accent text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest z-10 shadow-lg">
              -{product.promotionPercentage}%
            </div>
          )}
          {!hasPromotion && badge && (
            <div className={`absolute top-4 right-4 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest z-10 shadow-lg ${badge.color}`}>
              {badge.text}
            </div>
          )}

          {/* Quick Add Overlay - Hidden on small mobile to save space */}
          {product.stock > 0 && (
            <div className="absolute inset-x-0 bottom-0 p-2 md:p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out hidden md:block">
              <button 
                onClick={handleQuickAdd}
                className={`w-full py-4 rounded-2xl text-[11px] uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-xl ${isAdded ? 'bg-green-600 text-white' : 'bg-white text-brand-ink hover:bg-brand-accent hover:text-white'}`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    Ajouté !
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Ajouter
                  </>
                )}
              </button>
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-brand-ink/60 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
              En Rupture
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-grow px-2 pb-2">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-brand-accent text-brand-accent" />
            ))}
          </div>
          <h3 className="text-[13px] md:text-[15px] text-brand-ink font-display font-semibold mb-1 md:mb-3 line-clamp-1">
            {product.name}
          </h3>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[14px] md:text-[16px] text-brand-accent font-bold">
                {product.price.toFixed(2)} TND
              </span>
              {hasPromotion && (
                <span className="text-[10px] md:text-[12px] text-brand-ink/30 line-through font-light">
                  {originalPrice.toFixed(2)} TND
                </span>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[9px] text-brand-ink/40 uppercase tracking-tighter font-bold">
              <Truck className="w-3 h-3" />
              Tunisie
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
