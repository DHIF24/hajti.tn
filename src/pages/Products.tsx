import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Grid3X3, AlignJustify, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

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
    if (viewMode === 'grid-3') return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16';
    return 'flex flex-col gap-y-12';
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="text-[11px] tracking-[0.15em] text-gray-400 mb-12 uppercase font-medium">
        <Link to="/" className="hover:text-gray-900 transition-colors">Accueil</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-gray-900 transition-colors">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Produits</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl text-center tracking-[0.2em] uppercase mb-16 font-light text-gray-900">
        Produits
      </h1>

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
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full max-w-sm bg-white h-full shadow-xl flex flex-col animate-in slide-in-from-right">
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
                    className={`block text-sm text-left w-full ${!categoryFilter ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}`}
                    onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}
                  >
                    Toutes les catégories
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      className={`block text-sm text-left w-full ${categoryFilter?.toLowerCase() === cat.toLowerCase() ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}`}
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
                      className={`block text-sm text-left w-full ${sortBy === option.id ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}`}
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
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="text-sm text-gray-600">En stock uniquement</span>
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
          </div>
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
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} listView={viewMode === 'list'} />
          ))}
        </div>
      )}
    </div>
  );
}
