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
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left Navigation */}
          <div className="hidden lg:flex items-center space-x-6 text-[15px] tracking-wide text-gray-600 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <Link to="/products" className="px-2 py-1 hover:text-black hover:bg-gray-50 rounded-md transition-colors">Tous les produits</Link>
            <Link to="/products?category=decors" className="px-2 py-1 hover:text-black hover:bg-gray-50 rounded-md transition-colors">Décors</Link>
            <Link to="/products?category=salle-de-bain" className="px-2 py-1 hover:text-black hover:bg-gray-50 rounded-md transition-colors">Salle de bain</Link>
            <Link to="/products?category=cuisine" className="px-2 py-1 hover:text-black hover:bg-gray-50 rounded-md transition-colors">Cuisine</Link>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <Link to="/" className="flex flex-col items-center">
              <div className="text-4xl font-sans tracking-tight text-gray-900 leading-none flex items-center" style={{ fontFamily: "'Varela Round', 'Quicksand', sans-serif", fontWeight: 500 }}>
                <span>Hajti.tn</span>
              </div>
            </Link>
          </div>

          {/* Right Navigation & Icons */}
          <div className="hidden lg:flex items-center space-x-6 text-[15px] tracking-wide text-gray-600 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <Link to="/products?category=art" className="px-2 py-1 hover:text-black hover:bg-gray-50 rounded-md transition-colors">Art de table</Link>
            <Link to="/products?category=rangement" className="px-2 py-1 hover:text-black hover:bg-gray-50 rounded-md transition-colors">Rangement</Link>
            
            <div className="flex items-center space-x-5 ml-6 border-l border-gray-200 pl-6">
              <Link to="/auth" className="text-gray-600 hover:text-black transition-colors">
                <UserIcon className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              <button className="text-gray-600 hover:text-black transition-colors">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <Link to="/cart" className="relative text-gray-600 hover:text-black transition-colors">
                <motion.div animate={controls}>
                  <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                </motion.div>
                {itemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={itemCount}
                    className="absolute -top-1 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link to="/auth" className="text-gray-600 hover:text-black transition-colors">
              <UserIcon className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <Search className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            <Link to="/cart" className="relative text-gray-600 hover:text-black transition-colors">
              <motion.div animate={controls}>
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              </motion.div>
              {itemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={itemCount}
                  className="absolute -top-1 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-2 flex flex-col text-[16px] text-gray-600 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Tous les produits</Link>
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
