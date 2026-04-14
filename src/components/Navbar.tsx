import { useState, useEffect, ChangeEvent } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User as UserIcon, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, useAnimation } from 'motion/react';

export function Navbar() {
  const { user } = useAuth();
  const { itemCount, lastAdded } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const controls = useAnimation();

  const searchQuery = searchParams.get('q') || '';

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      searchParams.set('q', value);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
    if (window.location.pathname !== '/' && window.location.pathname !== '/products') {
      navigate('/products?' + searchParams.toString());
    }
  };

  useEffect(() => {
    if (lastAdded) {
      controls.start({
        scale: [1, 1.3, 1],
        rotate: [0, -10, 10, 0],
        transition: { duration: 0.4, ease: "easeInOut" }
      });
    }
  }, [lastAdded, controls]);

  return (
    <nav className="h-14 md:h-24 bg-white md:bg-white/90 md:backdrop-blur-md border-none md:border-b border-brand-ink/5 sticky top-0 z-50 transition-all duration-300 shadow-none md:shadow-sm">
      <div className="mx-4 md:mx-[120px] h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* Left Side: Logo & Navigation */}
          <div className="flex items-center space-x-12">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <div className="text-4xl font-display tracking-tight text-brand-ink leading-none font-bold">
                  <span>Hajti.tn</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 text-[14px] tracking-widest text-brand-ink/70 font-medium uppercase">
              <Link to="/" className="nav-link-underline py-1 hover:text-brand-ink transition-colors">Accueil</Link>
              <Link to="/admin/login" className="nav-link-underline py-1 hover:text-brand-ink transition-colors">Admin</Link>
            </div>
          </div>

          {/* Search Bar in Middle */}
          <div className="hidden lg:block relative w-96 group mx-8">
            <input 
              type="text" 
              placeholder="Rechercher des produits..." 
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-2.5 text-brand-ink placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-brand-accent/20 focus:ring-4 focus:ring-brand-accent/5 transition-all duration-300 text-sm normal-case tracking-normal"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-accent transition-colors">
              <Search className="w-4 h-4" strokeWidth={2.5} />
            </div>
            {searchQuery && (
              <button 
                onClick={() => { searchParams.delete('q'); setSearchParams(searchParams); }}
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-brand-ink transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Side: Icons & Mobile Menu */}
          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center space-x-6 border-r border-brand-ink/10 pr-6 mr-1">
              <Link to="/auth" className="text-brand-ink/70 hover:text-brand-accent transition-colors">
                <UserIcon className="w-5 h-5" strokeWidth={1.5} />
              </Link>
            </div>

            <div className="hidden lg:block">
              <Link to="/cart" className="relative text-brand-ink/70 hover:text-brand-accent transition-colors">
                <motion.div animate={controls}>
                  <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                </motion.div>
                {itemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={itemCount}
                    className="absolute -top-1 -right-2 bg-brand-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>
            </div>

            {/* Mobile Search Button (Quick access) */}
            <div className="lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-brand-ink/70 hover:text-brand-accent transition-colors p-2"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-4 flex flex-col text-[16px] text-gray-600 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Accueil</Link>
            
            {/* Mobile Search */}
            <div className="px-4 relative">
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-brand-ink placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-brand-accent/20 transition-all text-sm"
              />
              <Search className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
