import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Bell, Loader2, Settings } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("AdminLayout Auth State Change:", user?.uid, user?.email);
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
      if (!user && isLoggedIn) {
        // If localStorage says logged in but Firebase says no, we might need to redirect or wait
        // For now, if no user and no localStorage, definitely redirect
      }
      if (!isLoggedIn) {
        navigate('/admin/login');
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!isAuthReady) return;
    // Listen for new orders
    const q = query(collection(db, 'orders'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNewOrdersCount(snapshot.docs.length);
    }, (error) => {
      console.error("Orders snapshot error:", error);
    });
    return () => unsubscribe();
  }, [isAuthReady]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('isAdminLoggedIn');
      navigate('/admin/login');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/admin/products', icon: Package, label: 'Produits' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Commandes' },
    { path: '/admin/users', icon: Users, label: 'Utilisateurs' },
    { path: '/admin/settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Varela Round', 'Quicksand', sans-serif" }}>
            Hajti Admin
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {navItems.find(item => item.path === location.pathname || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.label || 'Administration'}
          </h2>
          <div className="flex items-center gap-6">
            <Link to="/admin/orders" className="relative p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50">
              <Bell className="w-6 h-6" />
              {newOrdersCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {newOrdersCount}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                A
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-900">Admin</p>
                <p className="text-gray-500">admin26</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1">
          {!isAuthReady ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
}
