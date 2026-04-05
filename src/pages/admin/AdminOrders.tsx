import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Order } from '../../types';
import { Search, Eye, CheckCircle, Clock, XCircle, Truck, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    console.log("Fetching orders, current user:", auth.currentUser?.uid);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      try {
        await deleteDoc(doc(db, 'orders', id));
        setOrders(orders.filter(o => o.id !== id));
      } catch (error) {
        console.error("Error deleting order", error);
      }
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium"><Clock className="w-3 h-3" /> En attente</span>;
      case 'processing':
        return <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"><Truck className="w-3 h-3" /> En cours</span>;
      case 'shipped':
        return <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"><Truck className="w-3 h-3" /> Expédiée</span>;
      case 'delivered':
        return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3" /> Livrée</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"><XCircle className="w-3 h-3" /> Annulée</span>;
      default:
        return null;
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.shippingAddress?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher une commande (ID, Client)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="p-4">ID Commande</th>
                <th className="p-4">Client</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Chargement...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Aucune commande trouvée.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={order.id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-mono text-sm text-gray-600">#{order.id.slice(0, 8)}</td>
                    <td className="p-4 font-medium text-gray-900">{order.shippingAddress?.fullName || 'Client'}</td>
                    <td className="p-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="p-4 font-medium text-gray-900">{order.total.toFixed(2)} TND</td>
                    <td className="p-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                          className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-black"
                        >
                          <option value="pending">En attente</option>
                          <option value="processing">En cours</option>
                          <option value="shipped">Expédiée</option>
                          <option value="delivered">Livrée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                        <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(order.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
