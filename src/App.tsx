import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StickyCart } from './components/StickyCart';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { About } from './pages/About';
import { AdminSeed } from './pages/AdminSeed';
import { Auth } from './pages/Auth';

import { ShoppingBag, Home, Search, User, Heart } from 'lucide-react';
import { useCart } from './context/CartContext';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSettings } from './pages/admin/AdminSettings';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    };

    // Try immediate
    scrollToTop();
    
    // Try after a frame
    const frameId = requestAnimationFrame(scrollToTop);
    
    // Try after a small timeout as a fallback
    const timerId = setTimeout(scrollToTop, 10);
    
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
    };
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { itemCount } = useCart();

  return (
    <div className="flex flex-col min-h-screen text-brand-ink font-sans selection:bg-brand-accent/20 bg-white">
      {!isAdminRoute && <Navbar />}
      <main className={`flex-grow ${!isAdminRoute ? 'max-w-full md:mx-[120px] md:bg-white md:shadow-sm md:my-8 md:rounded-xl overflow-hidden' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Products />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          
          {/* Admin Routes */}
          <Route path="/admin/seed" element={<AdminSeed />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      
      {/* Mobile Bottom Navigation */}
      {!isAdminRoute && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-3 z-50 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' || location.pathname === '/products' ? 'text-brand-accent' : 'text-gray-400'}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Accueil</span>
          </Link>
          <Link to="/products" className={`flex flex-col items-center gap-1 ${location.pathname === '/products' ? 'text-brand-accent' : 'text-gray-400'}`}>
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Boutique</span>
          </Link>
          <Link to="/cart" className={`flex flex-col items-center gap-1 relative ${location.pathname === '/cart' ? 'text-brand-accent' : 'text-gray-400'}`}>
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-tighter">Panier</span>
          </Link>
          <Link to="/auth" className={`flex flex-col items-center gap-1 ${location.pathname === '/auth' ? 'text-brand-accent' : 'text-gray-400'}`}>
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Compte</span>
          </Link>
        </div>
      )}

      {/* Floating Elements */}
      {!isAdminRoute && (
        <div className="hidden md:block">
          <StickyCart />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
