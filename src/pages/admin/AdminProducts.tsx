import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Product } from '../../types';
import { Plus, Trash2, Edit, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductForm } from './ProductForm';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [quickAddLoading, setQuickAddLoading] = useState(false);

  const handleQuickAdd = async () => {
    setQuickAddLoading(true);
    try {
      const dummyProduct = {
        name: "Produit Test " + Math.floor(Math.random() * 1000),
        description: "Description de test générée automatiquement",
        price: 99.99,
        category: "decors",
        imageUrl: "https://picsum.photos/seed/test/800/800",
        stock: 10,
        rating: 5,
        featured: false,
        promotionPercentage: 0,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'products'), dummyProduct);
      alert("Produit test ajouté avec succès !");
      fetchProducts();
    } catch (err: any) {
      console.error("Quick add failed:", err);
      alert("Erreur Quick Add: " + err.message);
    } finally {
      setQuickAddLoading(false);
    }
  };

  const fetchProducts = async () => {
    console.log("Fetching products, current user:", auth.currentUser?.uid);
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting product", error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1">
          <div className="relative flex-1 sm:max-w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un produit..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
            />
          </div>
          <button
            onClick={handleQuickAdd}
            disabled={quickAddLoading}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors justify-center disabled:opacity-50"
          >
            {quickAddLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Test Ajout Rapide
          </button>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Ajouter un produit
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="p-4 min-w-[200px]">Produit</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Prix</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-300" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">Aucun produit trouvé.</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={product.id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 flex items-center gap-4">
                      <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" referrerPolicy="no-referrer" />
                      <div>
                        <span className="font-medium text-gray-900 block">{product.name}</span>
                        {product.promotionPercentage && product.promotionPercentage > 0 && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">-{product.promotionPercentage}%</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 capitalize">{product.category}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{product.price.toFixed(2)} TND</div>
                      {product.promotionPercentage && product.promotionPercentage > 0 && (
                        <div className="text-xs text-gray-400 line-through">{(product.price / (1 - product.promotionPercentage/100)).toFixed(2)} TND</div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
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

      <AnimatePresence>
        {isFormOpen && (
          <ProductForm 
            product={editingProduct} 
            onClose={() => setIsFormOpen(false)} 
            onSuccess={fetchProducts}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
