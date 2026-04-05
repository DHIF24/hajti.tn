import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsSnap = await getDocs(collection(db, 'products'));
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const usersSnap = await getDocs(collection(db, 'users'));

        let totalRevenue = 0;
        ordersSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.status !== 'cancelled') {
            totalRevenue += data.total || 0;
          }
        });

        setStats({
          products: productsSnap.size,
          orders: ordersSnap.size,
          revenue: totalRevenue,
          users: usersSnap.size
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Revenus Totaux', value: `${stats.revenue.toFixed(2)} TND`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { title: 'Commandes', value: stats.orders, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { title: 'Produits', value: stats.products, icon: Package, color: 'bg-purple-50 text-purple-600' },
    { title: 'Utilisateurs', value: stats.users, icon: Users, color: 'bg-orange-50 text-orange-600' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Bienvenue sur votre tableau de bord</h3>
        <p className="text-gray-600">
          Utilisez le menu de gauche pour gérer vos produits, suivre vos commandes et administrer vos utilisateurs.
          Les nouvelles commandes apparaîtront sous forme de notification dans la barre supérieure.
        </p>
      </div>
    </div>
  );
}
