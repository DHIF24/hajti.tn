import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ChevronRight, Minus, Plus } from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[4/5] bg-gray-100"></div>
          <div className="space-y-6 py-8">
            <div className="h-4 bg-gray-100 w-1/4"></div>
            <div className="h-10 bg-gray-100 w-3/4"></div>
            <div className="h-6 bg-gray-100 w-1/4"></div>
            <div className="h-32 bg-gray-100"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl mb-4 font-light">Produit introuvable</h2>
        <Link to="/products" className="text-[11px] uppercase tracking-[0.15em] border-b border-black pb-1 hover:text-gray-600 transition-colors">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-[11px] tracking-[0.15em] text-gray-400 mb-12 uppercase font-medium">
        <Link to="/" className="hover:text-gray-900 transition-colors">Accueil</Link>
        <ChevronRight className="w-3 h-3 mx-2" />
        <Link to="/products" className="hover:text-gray-900 transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3 mx-2" />
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
        {/* Product Image */}
        <div className="bg-[#f8f8f8] aspect-[4/5] relative">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
          {product.stock === 0 && (
            <div className="absolute top-6 left-6 bg-[#f0f0f0] text-gray-600 text-[11px] font-medium px-4 py-2 uppercase tracking-[0.15em]">
              En Rupture
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4 tracking-wide">
            {product.name}
          </h1>
          
          <div className="text-xl text-gray-600 mb-8 font-medium">
            {product.price.toFixed(2)} TND
          </div>

          <div className="prose prose-sm text-gray-500 mb-12 leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-500 hover:text-black transition-colors"
                  disabled={product.stock === 0}
                >
                  <Minus className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-gray-500 hover:text-black transition-colors"
                  disabled={product.stock === 0}
                >
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
              
              <button 
                onClick={() => {
                  for(let i=0; i<quantity; i++) addToCart(product);
                }}
                disabled={product.stock === 0}
                className="flex-1 bg-black text-white px-8 py-3.5 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Épuisé' : 'Ajouter au panier'}
              </button>
            </div>
            
            <button className="w-full border border-black text-black px-8 py-3.5 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-gray-50 transition-colors">
              Acheter maintenant
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-[11px] uppercase tracking-[0.1em] text-gray-500 space-y-3">
            <p><span className="text-gray-900 font-medium mr-2">Catégorie:</span> {product.category}</p>
            <p><span className="text-gray-900 font-medium mr-2">Disponibilité:</span> {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
