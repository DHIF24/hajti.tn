import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User as UserIcon, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Navbar() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <Link to="/products?category=linge" className="px-2 py-1 hover:text-black hover:bg-gray-50 rounded-md transition-colors">Linge de maison</Link>
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
            <Link to="/products?category=meubles" className="px-2 py-1 hover:text-black hover:bg-gray-50 rounded-md transition-colors">Meubles</Link>
            <Link to="/products?category=offres" className="px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors">Offres</Link>
            
            <div className="flex items-center space-x-5 ml-6 border-l border-gray-200 pl-6">
              <Link to="/auth" className="text-gray-600 hover:text-black transition-colors">
                <UserIcon className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              <button className="text-gray-600 hover:text-black transition-colors">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <Link to="/cart" className="relative text-gray-600 hover:text-black transition-colors">
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
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
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
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
            <Link to="/products?category=linge" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Linge de maison</Link>
            <Link to="/products?category=cuisine" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Cuisine</Link>
            <Link to="/products?category=art" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Art de table</Link>
            <Link to="/products?category=rangement" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Rangement</Link>
            <Link to="/products?category=meubles" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-50 hover:text-black transition-colors px-4 py-3 rounded-lg">Meubles</Link>
            <Link to="/products?category=offres" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors px-4 py-3 rounded-lg">Offres</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
