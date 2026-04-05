import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard: React.FC<{ product: Product; listView?: boolean; badge?: { text: string; color: string } }> = ({ product, listView, badge }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
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
        <Link to={`/product/${product.id}`} className="group flex flex-col sm:flex-row gap-8 items-center border-b border-gray-100 pb-8">
          <div className="relative w-full sm:w-1/3 aspect-[4/5] overflow-hidden bg-[#f8f8f8] flex-shrink-0">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="object-cover w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            {hasPromotion && (
              <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-[0.15em] z-10">
                -{product.promotionPercentage}%
              </div>
            )}
            {!hasPromotion && badge && (
              <div className={`absolute top-4 right-4 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-[0.15em] z-10 ${badge.color}`}>
                {badge.text}
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute top-4 left-4 bg-[#f0f0f0] text-gray-600 text-[10px] font-medium px-3 py-1.5 uppercase tracking-[0.15em] z-10">
                En Rupture
              </div>
            )}
          </div>
          
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-lg text-gray-900 uppercase tracking-[0.1em] mb-4 font-medium">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-6 font-light leading-relaxed max-w-2xl">
              {product.description}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <span className="text-sm text-gray-900 font-medium tracking-wider">
                {product.price.toFixed(2)} TND
              </span>
              {hasPromotion && (
                <span className="text-xs text-gray-400 line-through">
                  {originalPrice.toFixed(2)} TND
                </span>
              )}
            </div>
            {product.stock > 0 && (
              <button 
                onClick={handleQuickAdd}
                className="mt-6 flex items-center justify-center sm:justify-start gap-2 text-[11px] uppercase tracking-[0.15em] font-medium text-gray-500 hover:text-black transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Ajouter au panier
              </button>
            )}
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
    >
      <Link to={`/product/${product.id}`} className="group relative flex flex-col">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f8f8f8] mb-6">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="object-cover w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
          
          {hasPromotion && (
            <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-[0.15em] z-10">
              -{product.promotionPercentage}%
            </div>
          )}
          {!hasPromotion && badge && (
            <div className={`absolute top-4 right-4 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-[0.15em] z-10 ${badge.color}`}>
              {badge.text}
            </div>
          )}

          {/* Quick Add Overlay */}
          {product.stock > 0 && (
            <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out">
              <button 
                onClick={handleQuickAdd}
                className="w-full bg-white/90 backdrop-blur-sm text-black py-3 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute top-4 left-4 bg-[#f0f0f0] text-gray-600 text-[10px] font-medium px-3 py-1.5 uppercase tracking-[0.15em]">
              En Rupture
            </div>
          )}
        </div>
        
        <div className="text-center px-4">
          <h3 className="text-[13px] text-gray-800 uppercase tracking-[0.1em] mb-2 font-medium">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-3">
            <span className="text-[13px] text-gray-900 font-medium">
              {product.price.toFixed(2)} TND
            </span>
            {hasPromotion && (
              <span className="text-[11px] text-gray-400 line-through">
                {originalPrice.toFixed(2)} TND
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
