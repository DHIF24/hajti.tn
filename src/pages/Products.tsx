import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { 
  Grid3X3, 
  AlignJustify, 
  X, 
  ArrowRight, 
  Check, 
  Search, 
  Tag, 
  LayoutGrid, 
  ChevronRight, 
  Sparkles, 
  Truck,
  Home,
  Coffee,
  Bath,
  Box,
  Palette,
  Utensils,
  Watch
} from 'lucide-react';
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
  const searchQuery = searchParams.get('q') || '';
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price-asc', 'price-desc'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showOffers, setShowOffers] = useState(false);

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
    return ['Accessoires', 'Rangement'];
  }, []);

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
  }, [products, categoryFilter, inStockOnly, sortBy, searchQuery]);

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('décors') || n.includes('decor')) return <Palette className="w-4 h-4" />;
    if (n.includes('cuisine')) return <Utensils className="w-4 h-4" />;
    if (n.includes('bain')) return <Bath className="w-4 h-4" />;
    if (n.includes('rangement')) return <Box className="w-4 h-4" />;
    if (n.includes('accessoires')) return <Watch className="w-4 h-4" />;
    if (n.includes('art')) return <Coffee className="w-4 h-4" />;
    return <Tag className="w-4 h-4" />;
  };

  const getGridClass = () => {
    if (viewMode === 'list') return 'flex flex-col gap-y-12';
    return 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-16';
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/30">
      {/* Mobile Category Scroll */}
      <div className="lg:hidden bg-white border-b border-gray-100 sticky top-14 z-40 overflow-x-auto no-scrollbar pt-0 pb-4 px-4 m-0">
        <div className="flex gap-3 min-w-max">
          <button 
            onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${!categoryFilter ? 'bg-brand-ink text-white shadow-lg' : 'bg-gray-100 text-brand-ink/60'}`}
          >
            Tous
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => { searchParams.set('category', cat.toLowerCase()); setSearchParams(searchParams); }}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${categoryFilter?.toLowerCase() === cat.toLowerCase() ? 'bg-brand-ink text-white shadow-lg' : 'bg-gray-100 text-brand-ink/60'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div id="shop-section" className="max-w-full mx-auto px-4 sm:px-4 lg:px-6 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0 space-y-10">
            {/* Categories Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/30 border border-gray-50 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-brand-ink text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-ink/20">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-brand-ink uppercase tracking-wider">Nos Catégories</h3>
                </div>

                <div className="space-y-1.5">
                  <button 
                    onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group/item ${!categoryFilter ? 'bg-brand-ink text-white shadow-xl shadow-brand-ink/20' : 'hover:bg-gray-50 text-brand-ink/60 hover:text-brand-ink'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-colors ${!categoryFilter ? 'bg-white/10' : 'bg-gray-100 group-hover/item:bg-white'}`}>
                        <Home className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold tracking-wide">Tous les produits</span>
                    </div>
                  </button>
                  
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => { searchParams.set('category', cat.toLowerCase()); setSearchParams(searchParams); }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group/item ${categoryFilter?.toLowerCase() === cat.toLowerCase() ? 'bg-brand-ink text-white shadow-xl shadow-brand-ink/20' : 'hover:bg-gray-50 text-brand-ink/60 hover:text-brand-ink'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl transition-colors ${categoryFilter?.toLowerCase() === cat.toLowerCase() ? 'bg-white/10' : 'bg-gray-100 group-hover/item:bg-white'}`}>
                          {getCategoryIcon(cat)}
                        </div>
                        <span className="text-sm font-bold tracking-wide capitalize">{cat}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {categoryFilter?.toLowerCase() === cat.toLowerCase() ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                        ) : (
                          <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Offers Section */}
            <div className="bg-brand-ink rounded-[2.5rem] p-8 shadow-2xl shadow-brand-ink/30 relative overflow-hidden group mt-8">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-accent/20 rounded-full -mr-20 -mt-20 blur-2xl group-hover:bg-brand-accent/30 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-xl" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-brand-accent text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-accent/20">
                    <Tag className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">Nos Offres</h3>
                </div>

                {showOffers && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-center mb-6"
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-6 h-6 text-brand-accent/40" />
                    </div>
                    <p className="text-white/60 text-xs font-medium">Aucune offre pour le moment</p>
                  </motion.div>
                )}

                <button 
                  onClick={() => setShowOffers(!showOffers)}
                  className="w-full py-4 bg-white text-brand-ink rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all duration-500 shadow-xl"
                >
                  {showOffers ? 'Masquer les offres' : 'Voir toutes les offres'}
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-[2rem] px-4 sm:px-8 py-5 mb-8 md:mb-12 shadow-xl shadow-gray-200/20 border border-gray-50 text-[11px] tracking-[0.2em] text-brand-ink/50 uppercase font-bold gap-4 sm:gap-0">
              <div className="hidden sm:flex gap-6 border-r border-brand-ink/10 pr-8 w-auto justify-start">
                <Grid3X3 
                  className={`w-5 h-5 cursor-pointer transition-all duration-500 ${viewMode === 'grid-3' ? 'text-brand-accent scale-125' : 'text-brand-ink/20 hover:text-brand-ink'}`} 
                  strokeWidth={2.5} 
                  onClick={() => setViewMode('grid-3')}
                />
                <AlignJustify 
                  className={`w-5 h-5 cursor-pointer transition-all duration-500 ${viewMode === 'list' ? 'text-brand-accent scale-125' : 'text-brand-ink/20 hover:text-brand-ink'}`} 
                  strokeWidth={2.5} 
                  onClick={() => setViewMode('list')}
                />
              </div>
              
              <div className="hidden md:block flex-grow text-center text-brand-ink/30 font-bold">
                {loading ? '...' : filteredProducts.length} Produits trouvés
              </div>
              
              <div 
                className="sm:border-l border-brand-ink/10 sm:pl-8 cursor-pointer hover:text-brand-accent transition-all duration-300 flex items-center gap-3 group w-full sm:w-auto justify-center sm:justify-end"
                onClick={() => setIsFilterOpen(true)}
              >
                <span className="group-hover:translate-x-[-4px] transition-transform">Filtrer & Trier</span>
                <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className={getGridClass()}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className={`animate-pulse bg-white rounded-[2.5rem] ${viewMode === 'list' ? 'h-64 w-full' : 'aspect-[4/5]'}`} />
                ))}
              </div>
            ) : (
              <div className={getGridClass()}>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} listView={viewMode === 'list'} />
                ))}
              </div>
            )}
            
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-display font-bold text-brand-ink mb-2">Aucun produit trouvé</h3>
                <p className="text-brand-ink/40 text-sm">Essayez de modifier vos filtres ou votre recherche.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
