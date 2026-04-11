import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ChevronRight, Minus, Plus, Check, Play, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(data);
          setActiveImage(data.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-100 rounded-3xl"></div>
          <div className="space-y-6 py-8">
            <div className="h-4 bg-gray-100 w-1/4"></div>
            <div className="h-10 bg-gray-100 w-3/4"></div>
            <div className="h-6 bg-gray-100 w-1/4"></div>
            <div className="h-32 bg-gray-100 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl mb-4 font-display font-bold">Produit introuvable</h2>
        <Link to="/products" className="text-[12px] uppercase tracking-[0.2em] font-bold text-brand-accent border-b-2 border-brand-accent pb-1 hover:text-brand-ink hover:border-brand-ink transition-all">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const allImages = [product.imageUrl, ...(product.images || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-[10px] tracking-[0.2em] text-brand-ink/40 mb-12 uppercase font-bold">
        <Link to="/" className="hover:text-brand-accent transition-colors">Accueil</Link>
        <ChevronRight className="w-3 h-3 mx-2" />
        <Link to="/products" className="hover:text-brand-accent transition-colors">Boutique</Link>
        <ChevronRight className="w-3 h-3 mx-2" />
        <span className="text-brand-ink">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto max-h-[600px] no-scrollbar">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${activeImage === img ? 'border-brand-accent scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
            {product.videoUrl && (
              <button
                onClick={() => setActiveImage('video')}
                className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 flex items-center justify-center bg-brand-ink ${activeImage === 'video' ? 'border-brand-accent scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <Play className="w-8 h-8 text-white" />
              </button>
            )}
          </div>

          {/* Main View */}
          <div className="flex-grow relative aspect-square bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-brand-ink/5">
            <AnimatePresence mode="wait">
              {activeImage === 'video' ? (
                <motion.div
                  key="video"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <video 
                    src={product.videoUrl} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full cursor-zoom-in relative"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img 
                    src={activeImage} 
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                    style={isZoomed ? {
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                    } : {}}
                    referrerPolicy="no-referrer"
                  />
                  {!isZoomed && (
                    <div className="absolute bottom-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full text-brand-ink shadow-lg pointer-events-none">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {product.stock === 0 && (
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md text-brand-ink text-[12px] font-bold px-6 py-2.5 rounded-full uppercase tracking-widest shadow-xl">
                En Rupture
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 flex flex-col justify-center py-4">
          <div className="mb-8">
            <span className="text-brand-accent text-[12px] uppercase tracking-[0.3em] font-bold mb-4 block">
              {product.category}
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-brand-ink mb-6 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="text-3xl text-brand-ink font-bold">
                {product.price.toFixed(2)} TND
              </div>
              {product.promotionPercentage && (
                <div className="bg-brand-accent text-white text-[12px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  -{product.promotionPercentage}%
                </div>
              )}
            </div>

            <p className="text-brand-ink/60 text-lg font-light leading-relaxed mb-10">
              {product.description}
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center bg-white border border-brand-ink/10 rounded-2xl p-1 shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-brand-ink/40 hover:text-brand-accent transition-colors"
                  disabled={product.stock === 0}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center text-lg font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-brand-ink/40 hover:text-brand-accent transition-colors"
                  disabled={product.stock === 0}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 w-full sm:w-auto px-12 py-5 rounded-2xl text-[12px] uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${isAdded ? 'bg-green-600 text-white' : 'bg-brand-ink text-white hover:bg-brand-accent'}`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" strokeWidth={3} />
                    Ajouté !
                  </>
                ) : (
                  product.stock === 0 ? 'Épuisé' : 'Ajouter au panier'
                )}
              </button>
            </div>
            
            <button className="w-full bg-white border-2 border-brand-ink text-brand-ink px-12 py-5 rounded-2xl text-[12px] uppercase tracking-[0.2em] font-bold hover:bg-brand-ink hover:text-white transition-all duration-300 shadow-sm">
              Acheter maintenant
            </button>
          </div>

          <div className="mt-16 pt-10 border-t border-brand-ink/5 space-y-4">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.1em]">
              <span className="text-brand-ink/40 font-bold">Disponibilité</span>
              <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.1em]">
              <span className="text-brand-ink/40 font-bold">Livraison</span>
              <span className="text-brand-ink font-bold">2-4 jours ouvrables</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
