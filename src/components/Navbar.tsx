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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
          <div className="hidden lg:flex items-center space-x-8 text-[11px] tracking-[0.15em] uppercase text-gray-600 font-medium">
            <Link to="/products" className="hover:text-black transition-colors">Tous les produits</Link>
            <Link to="/products?category=decors" className="hover:text-black transition-colors">Décors</Link>
            <Link to="/products?category=linge" className="hover:text-black transition-colors">Linge de maison</Link>
            <Link to="/products?category=cuisine" className="hover:text-black transition-colors">Cuisine</Link>
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
          <div className="hidden lg:flex items-center space-x-8 text-[11px] tracking-[0.15em] uppercase text-gray-600 font-medium">
            <Link to="/products?category=art" className="hover:text-black transition-colors">Art de table</Link>
            <Link to="/products?category=rangement" className="hover:text-black transition-colors">Rangement</Link>
            <Link to="/products?category=meubles" className="hover:text-black transition-colors">Meubles</Link>
            <Link to="/products?category=offres" className="hover:text-black transition-colors">Offres</Link>
            
            <div className="flex items-center space-x-5 ml-8 border-l border-gray-200 pl-8">
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
          <div className="px-4 py-6 space-y-4 flex flex-col text-[11px] tracking-[0.15em] uppercase text-gray-600 font-medium">
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors py-2 border-b border-gray-100">Tous les produits</Link>
            <Link to="/products?category=decors" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors py-2 border-b border-gray-100">Décors</Link>
            <Link to="/products?category=linge" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors py-2 border-b border-gray-100">Linge de maison</Link>
            <Link to="/products?category=cuisine" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors py-2 border-b border-gray-100">Cuisine</Link>
            <Link to="/products?category=art" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors py-2 border-b border-gray-100">Art de table</Link>
            <Link to="/products?category=rangement" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors py-2 border-b border-gray-100">Rangement</Link>
            <Link to="/products?category=meubles" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors py-2 border-b border-gray-100">Meubles</Link>
            <Link to="/products?category=offres" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors py-2">Offres</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
