import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Grid3X3, AlignJustify, X, ArrowRight, Check, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';

type ViewMode = 'grid-3' | 'list';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    heroBannerUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop',
    heroTitle: "NEW COLLECTION SUMMER",
    heroSubtitle: "OVERSIZED T-SHIRT URBAN WEAR"
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid-3');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price-asc', 'price-desc'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Settings
        const settingsRef = doc(db, 'settings', 'general');
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as any);
        }

        // Fetch Products
        const q = query(collection(db, 'products'), orderBy('name'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (categoryFilter && p.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
        if (inStockOnly && p.stock === 0) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            (p.description && p.description.toLowerCase().includes(query))
          );
        }
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
    return 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-16';
  };

  return (
    <div className="w-full min-h-screen">
      
      <div id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Rechercher des produits, catégories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-8 py-5 text-brand-ink placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-accent/5 focus:bg-white focus:border-brand-accent/20 transition-all duration-300 shadow-sm text-lg"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 p-2">
              <Search className="w-6 h-6 text-brand-accent" strokeWidth={2.5} />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-16 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-brand-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {categoryFilter && (
            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-ink text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                Catégorie: {categoryFilter}
                <button onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}>
                  <X className="w-3 h-3 hover:text-brand-accent transition-colors" />
                </button>
              </div>
            </div>
          )}
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
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
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
