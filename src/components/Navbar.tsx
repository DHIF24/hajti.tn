import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User as UserIcon, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, useAnimation } from 'motion/react';

export function Navbar() {
  const { user } = useAuth();
  const { itemCount, lastAdded } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const controls = useAnimation();

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
    <nav className="bg-brand-bg/90 backdrop-blur-md border-b border-brand-ink/5 sticky top-0 z-50 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
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
              <Link to="/products" className="nav-link-underline py-1 hover:text-brand-ink transition-colors">Shop</Link>
              <Link to="/products?category=decors" className="nav-link-underline py-1 hover:text-brand-ink transition-colors">Décors</Link>
              <Link to="/products?category=salle-de-bain" className="nav-link-underline py-1 hover:text-brand-ink transition-colors">Salle de bain</Link>
              <Link to="/products?category=cuisine" className="nav-link-underline py-1 hover:text-brand-ink transition-colors">Cuisine</Link>
              <Link to="/products?category=art" className="nav-link-underline py-1 hover:text-brand-ink transition-colors">Art de table</Link>
              <Link to="/products?category=rangement" className="nav-link-underline py-1 hover:text-brand-ink transition-colors">Rangement</Link>
            </div>
          </div>

          {/* Right Side: Icons & Mobile Menu */}
          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center space-x-6 border-r border-brand-ink/10 pr-6 mr-1">
              <Link to="/auth" className="text-brand-ink/70 hover:text-brand-accent transition-colors">
                <UserIcon className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              <button className="text-brand-ink/70 hover:text-brand-accent transition-colors">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

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

            {/* Mobile Icons (Search & User) */}
            <div className="lg:hidden flex items-center space-x-4">
              <Link to="/auth" className="text-gray-600 hover:text-black transition-colors">
                <UserIcon className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              <button className="text-gray-600 hover:text-black transition-colors">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 ml-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-2 flex flex-col text-[16px] text-gray-600 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Accueil</Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Shop</Link>
            <Link to="/products?category=decors" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Décors</Link>
            <Link to="/products?category=salle-de-bain" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Salle de bain</Link>
            <Link to="/products?category=cuisine" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Cuisine</Link>
            <Link to="/products?category=art" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Art de table</Link>
            <Link to="/products?category=rangement" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Rangement</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
