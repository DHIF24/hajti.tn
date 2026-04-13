import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Bell, Loader2, Settings } from 'lucide-react';
import { doc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
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
    const unsubscribeOrders = onSnapshot(q, (snapshot) => {
      setNewOrdersCount(snapshot.docs.length);
    }, (error) => {
      console.error("Orders snapshot error:", error);
    });

    // Listen for notifications
    const qNotif = query(collection(db, 'notifications'), where('read', '==', false));
    const unsubscribeNotif = onSnapshot(qNotif, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
    }, (error) => {
      console.error("Notifications snapshot error:", error);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeNotif();
    };
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
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50"
              >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 z-50">
                  <div className="px-6 pb-4 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {notifications.length > 0 && (
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              const promises = notifications.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true }));
                              await Promise.all(promises);
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="text-[9px] text-brand-accent hover:text-brand-ink font-bold uppercase tracking-widest"
                        >
                          Tout lire
                        </button>
                      )}
                      <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {notifications.length}
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="px-6 py-10 text-center">
                        <Bell className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">Aucune nouvelle notification</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className="px-6 py-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors cursor-pointer"
                          onClick={async () => {
                            try {
                              await updateDoc(doc(db, 'notifications', notif.id), { read: true });
                              navigate('/admin/orders');
                              setShowNotifications(false);
                            } catch (error) {
                              console.error("Error marking notification as read", error);
                            }
                          }}
                        >
                          <p className="text-sm text-gray-800 font-medium mb-1">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-6 pt-4 border-t border-gray-50">
                      <button 
                        onClick={() => navigate('/admin/orders')}
                        className="w-full py-2 text-xs font-bold text-brand-accent hover:text-brand-ink transition-colors uppercase tracking-widest"
                      >
                        Voir toutes les commandes
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
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
