import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Grid3X3, AlignJustify, X, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';

type ViewMode = 'grid-3' | 'list';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid-3');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price-asc', 'price-desc'
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('name'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (categoryFilter && p.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
        if (inStockOnly && p.stock === 0) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return a.name.localeCompare(b.name);
      });
  }, [products, categoryFilter, inStockOnly, sortBy]);

  const getGridClass = () => {
    if (viewMode === 'grid-3') return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12';
    return 'flex flex-col gap-y-12';
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      {!categoryFilter && (
        <div className="relative h-[80vh] min-h-[600px] w-full bg-white flex items-center justify-center overflow-hidden mb-16">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-20"
            >
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000" 
                alt="Background" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10" />
          </div>

          <div className="relative z-20 text-center px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-12"
            >
              <h1 
                className="text-7xl md:text-9xl font-black text-gray-900 mb-4 leading-none tracking-tighter"
                style={{ direction: 'rtl', fontFamily: "'Noto Sans Arabic', sans-serif" }}
              >
                <motion.span
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 1, type: "spring" }}
                  className="block drop-shadow-2xl"
                >
                  اقضي حاجتك
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 1, type: "spring" }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200"
                >
                  و انت مطمان
                </motion.span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <button 
                onClick={() => {
                  const promoSection = document.querySelector('.promotions-section');
                  if (promoSection) {
                    promoSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group relative inline-flex items-center justify-center px-12 py-5 bg-black text-white text-sm uppercase tracking-[0.3em] font-black overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Découvrir</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </motion.div>
          </div>

          {/* Floating Decorative Elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-10 w-32 h-32 bg-gray-50 rounded-full blur-3xl -z-10"
          />
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-10 w-48 h-48 bg-gray-100 rounded-full blur-3xl -z-10"
          />
        </div>
      )}

      {/* Promotions Section */}
      {!categoryFilter && products.some(p => p.promotionPercentage && p.promotionPercentage > 0) && (
        <div className="w-full bg-gray-50 py-24 mb-24 promotions-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[11px] tracking-[0.3em] uppercase text-red-600 font-black mb-2 block">Offres Spéciales</span>
                <h2 className="text-4xl font-serif tracking-tight text-gray-900">Les Meilleures Promotions</h2>
              </motion.div>
              <Link 
                to="/products?category=offres"
                className="text-[11px] uppercase tracking-[0.15em] font-bold border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-300 transition-all"
              >
                Voir toutes les offres
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {products
                .filter(p => p.promotionPercentage && p.promotionPercentage > 0)
                .slice(0, 4)
                .map((product) => (
                  <ProductCard 
                    key={`promo-${product.id}`} 
                    product={product} 
                    badge={{ text: `-${product.promotionPercentage}%`, color: 'bg-red-600' }}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      <div id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="text-[11px] tracking-[0.15em] text-gray-400 mb-12 uppercase font-medium">
          <Link to="/" className="hover:text-gray-900 transition-colors">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-gray-900 transition-colors">Shop</Link>
          {categoryFilter && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{categoryFilter}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="text-4xl text-center tracking-[0.2em] uppercase mb-16 font-light text-gray-900">
          {categoryFilter ? categoryFilter : 'Tous les Produits'}
        </h2>

        {/* Toolbar */}
        <div className="flex justify-between items-center border-y border-gray-200 py-4 mb-12 text-[11px] tracking-[0.15em] text-gray-500 uppercase font-medium">
          <div className="flex gap-4 border-r border-gray-200 pr-6">
            <Grid3X3 
              className={`w-5 h-5 cursor-pointer transition-colors ${viewMode === 'grid-3' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-600'}`} 
              strokeWidth={1.5} 
              onClick={() => setViewMode('grid-3')}
            />
            <AlignJustify 
              className={`w-5 h-5 cursor-pointer transition-colors ${viewMode === 'list' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-600'}`} 
              strokeWidth={1.5} 
              onClick={() => setViewMode('list')}
            />
          </div>
          
          <div className="flex-grow text-center text-gray-400">
            {loading ? '...' : filteredProducts.length} Produits
          </div>
          
          <div 
            className="border-l border-gray-200 pl-6 cursor-pointer hover:text-gray-900 transition-colors"
            onClick={() => setIsFilterOpen(true)}
          >
            Filtrer
          </div>
        </div>

        {/* Filter Drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium uppercase tracking-widest">Filtres</h2>
                <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex-grow overflow-y-auto space-y-10">
                {/* Categories */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-gray-400 mb-4 font-medium">Catégories</h3>
                  <div className="space-y-3">
                    <button 
                      className={`block text-sm text-left w-full transition-colors ${!categoryFilter ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}`}
                      onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}
                    >
                      Toutes les catégories
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        className={`block text-sm text-left w-full transition-colors ${categoryFilter?.toLowerCase() === cat.toLowerCase() ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}`}
                        onClick={() => { searchParams.set('category', cat.toLowerCase()); setSearchParams(searchParams); }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Sort */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-gray-400 mb-4 font-medium">Trier par</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'name', label: 'Nom (A-Z)' },
                      { id: 'price-asc', label: 'Prix croissant' },
                      { id: 'price-desc', label: 'Prix décroissant' }
                    ].map(option => (
                      <button 
                        key={option.id}
                        className={`block text-sm text-left w-full transition-colors ${sortBy === option.id ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}`}
                        onClick={() => setSortBy(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-gray-400 mb-4 font-medium">Disponibilité</h3>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded-sm checked:bg-black checked:border-black transition-colors cursor-pointer"
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-black transition-colors">En stock uniquement</span>
                  </label>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-black text-white py-4 uppercase tracking-[0.15em] text-[11px] font-medium hover:bg-gray-800 transition-colors"
                >
                  Voir les résultats ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className={getGridClass()}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`animate-pulse bg-gray-100 ${viewMode === 'list' ? 'h-64 w-full' : 'aspect-[4/5]'}`} />
            ))}
          </div>
        ) : (
          <div className={getGridClass()}>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} listView={viewMode === 'list'} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
