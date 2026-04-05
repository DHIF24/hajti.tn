import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

export const ProductCard: React.FC<{ product: Product; listView?: boolean }> = ({ product, listView }) => {
  if (listView) {
    return (
      <Link to={`/product/${product.id}`} className="group flex flex-col sm:flex-row gap-8 items-center border-b border-gray-100 pb-8">
        <div className="relative w-full sm:w-1/3 aspect-[4/5] overflow-hidden bg-[#f8f8f8] flex-shrink-0">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="object-cover w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
          {product.stock === 0 && (
            <div className="absolute top-4 left-4 bg-[#f0f0f0] text-gray-600 text-[10px] font-medium px-3 py-1.5 uppercase tracking-[0.15em]">
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
          <span className="text-sm text-gray-900 font-medium tracking-wider">
            {product.price.toFixed(2)} TND
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.id}`} className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f8f8f8] mb-6">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="object-cover w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
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
        <span className="text-[13px] text-gray-500 font-medium">
          {product.price.toFixed(2)} TND
        </span>
      </div>
    </Link>
  );
}
