import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Grid3X3, AlignJustify, X, ArrowRight, Check } from 'lucide-react';
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
    if (viewMode === 'list') return 'flex flex-col gap-y-12';
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16';
  };

  return (
    <div className="w-full bg-brand-bg min-h-screen">
      
      {/* Hero Banner */}
      {!categoryFilter && (
        <div className="relative h-[80vh] w-full overflow-hidden mb-24">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            alt="Premium Interior" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-ink/30 flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-white/80 text-[12px] uppercase tracking-[0.3em] font-medium mb-6 block">Collection 2026</span>
              <h1 className="text-5xl md:text-7xl text-white font-display font-bold mb-8 tracking-tight max-w-4xl">
                L'Art de Vivre <br /> à la Tunisienne
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                Découvrez une sélection exclusive de pièces artisanales et modernes pour sublimer votre intérieur.
              </p>
              <a 
                href="#shop-section" 
                className="inline-block bg-white text-brand-ink px-10 py-4 rounded-full text-[12px] uppercase tracking-[0.2em] font-bold hover:bg-brand-accent hover:text-white transition-all duration-300 shadow-xl"
              >
                Découvrir la collection
              </a>
            </motion.div>
          </div>
        </div>
      )}

      {/* Promotions Section */}
      {!categoryFilter && products.some(p => p.promotionPercentage && p.promotionPercentage > 0) && (
        <div className="w-full pb-24 mb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-ink mb-4">Les Meilleures Promotions</h2>
                <p className="text-brand-accent font-medium tracking-[0.1em] uppercase text-sm">Offres limitées — jusqu'à -69%</p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {products
                .filter(p => p.promotionPercentage && p.promotionPercentage > 0)
                .slice(0, 4)
                .map((product) => (
                  <ProductCard 
                    key={`promo-${product.id}`} 
                    product={product} 
                  />
                ))}
            </div>

            <div className="mt-16 text-center">
              <Link 
                to="/products?promo=true" 
                className="inline-flex items-center gap-2 text-brand-ink font-bold text-[12px] uppercase tracking-[0.2em] hover:text-brand-accent transition-colors group"
              >
                Voir toutes les offres
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-ink mb-4">
            {categoryFilter ? categoryFilter : 'Tous les Produits'}
          </h2>
          <div className="w-12 h-1 bg-brand-accent rounded-full"></div>
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center border-y border-brand-ink/10 py-6 mb-16 text-[11px] tracking-[0.2em] text-brand-ink/50 uppercase font-bold">
          <div className="flex gap-6 border-r border-brand-ink/10 pr-8">
            <Grid3X3 
              className={`w-5 h-5 cursor-pointer transition-all duration-300 ${viewMode === 'grid-3' ? 'text-brand-accent scale-110' : 'text-brand-ink/20 hover:text-brand-ink'}`} 
              strokeWidth={2} 
              onClick={() => setViewMode('grid-3')}
            />
            <AlignJustify 
              className={`w-5 h-5 cursor-pointer transition-all duration-300 ${viewMode === 'list' ? 'text-brand-accent scale-110' : 'text-brand-ink/20 hover:text-brand-ink'}`} 
              strokeWidth={2} 
              onClick={() => setViewMode('list')}
            />
          </div>
          
          <div className="flex-grow text-center text-brand-ink/30 font-medium">
            {loading ? '...' : filteredProducts.length} Produits trouvés
          </div>
          
          <div 
            className="border-l border-brand-ink/10 pl-8 cursor-pointer hover:text-brand-accent transition-colors flex items-center gap-2"
            onClick={() => setIsFilterOpen(true)}
          >
            <span className="hidden sm:inline">Filtrer & Trier</span>
            <span className="sm:hidden">Filtres</span>
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
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-brand-bg h-full shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-8 border-b border-brand-ink/5">
                <h2 className="text-xl font-display font-bold uppercase tracking-widest text-brand-ink">Filtres</h2>
                <button onClick={() => setIsFilterOpen(false)} className="w-10 h-10 rounded-full bg-brand-ink/5 flex items-center justify-center text-brand-ink hover:bg-brand-accent hover:text-white transition-all duration-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 flex-grow overflow-y-auto space-y-12">
                {/* Categories */}
                <div>
                  <h3 className="text-[12px] uppercase tracking-[0.2em] text-brand-accent mb-6 font-bold">Catégories</h3>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-300 border ${!categoryFilter ? 'bg-brand-ink text-white border-brand-ink' : 'bg-white text-brand-ink/60 border-brand-ink/10 hover:border-brand-accent hover:text-brand-accent'}`}
                      onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}
                    >
                      TOUT
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-300 border ${categoryFilter?.toLowerCase() === cat.toLowerCase() ? 'bg-brand-ink text-white border-brand-ink' : 'bg-white text-brand-ink/60 border-brand-ink/10 hover:border-brand-accent hover:text-brand-accent'}`}
                        onClick={() => { searchParams.set('category', cat.toLowerCase()); setSearchParams(searchParams); }}
                      >
                        {cat.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Sort */}
                <div>
                  <h3 className="text-[12px] uppercase tracking-[0.2em] text-brand-accent mb-6 font-bold">Trier par</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'name', label: 'Nom (A-Z)' },
                      { id: 'price-asc', label: 'Prix croissant' },
                      { id: 'price-desc', label: 'Prix décroissant' }
                    ].map(option => (
                      <button 
                        key={option.id}
                        className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-300 ${sortBy === option.id ? 'bg-white border-brand-accent text-brand-accent shadow-sm' : 'bg-white border-brand-ink/5 text-brand-ink/60 hover:border-brand-accent'}`}
                        onClick={() => setSortBy(option.id)}
                      >
                        <span className="text-sm font-bold tracking-wide">{option.label}</span>
                        {sortBy === option.id && <div className="w-2 h-2 rounded-full bg-brand-accent" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-[12px] uppercase tracking-[0.2em] text-brand-accent mb-6 font-bold">Disponibilité</h3>
                  <label className="flex items-center justify-between p-4 rounded-2xl bg-white border border-brand-ink/5 cursor-pointer group hover:border-brand-accent transition-all duration-300">
                    <span className="text-sm font-bold tracking-wide text-brand-ink/60 group-hover:text-brand-ink">En stock uniquement</span>
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="peer appearance-none w-6 h-6 border-2 border-brand-ink/10 rounded-lg checked:bg-brand-accent checked:border-brand-accent transition-all duration-300 cursor-pointer"
                      />
                      <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-300" strokeWidth={3} />
                    </div>
                  </label>
                </div>
              </div>
              <div className="p-8 border-t border-brand-ink/5 bg-white">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-brand-ink text-white py-5 rounded-2xl uppercase tracking-[0.2em] text-[12px] font-bold hover:bg-brand-accent transition-all duration-300 shadow-xl"
                >
                  Appliquer les filtres
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
