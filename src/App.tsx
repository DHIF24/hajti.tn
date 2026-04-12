import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

  return (
    <div className="flex flex-col min-h-screen text-brand-ink font-sans selection:bg-brand-accent/20">
      {!isAdminRoute && <Navbar />}
      <main className={`flex-grow ${!isAdminRoute ? 'max-w-7xl mx-4 sm:mx-6 lg:mx-auto w-auto lg:w-full bg-white shadow-sm my-8 rounded-xl overflow-hidden' : ''}`}>
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
      
      {/* Floating Elements */}
      {!isAdminRoute && (
        <>
          <StickyCart />
        </>
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
