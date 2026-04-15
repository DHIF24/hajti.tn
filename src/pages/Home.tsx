import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { Product } from '../types';

export default function Home() {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      // New products: latest by createdAt
      const newQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(8));
      const newSnap = await getDocs(newQuery);
      setNewProducts(newSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      // Promo products: promotionPercentage > 0
      const promoQuery = query(collection(db, 'products'), where('promotionPercentage', '>', 0), limit(8));
      const promoSnap = await getDocs(promoQuery);
      setPromoProducts(promoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      // Best sellers: by bestseller flag
      const bestQuery = query(collection(db, 'products'), where('bestseller', '==', true), limit(8));
      const bestSnap = await getDocs(bestQuery);
      setBestSellers(bestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Section */}
      <div className="mb-10 rounded-3xl bg-gradient-to-r from-brand-accent/80 to-brand-ink/80 text-white p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenue sur Hajti.tn</h1>
          <p className="text-lg md:text-2xl font-light mb-6">Découvrez nos nouveautés, promotions et best sellers !</p>
          <Link to="/products" className="inline-block bg-white text-brand-accent font-bold px-8 py-3 rounded-full shadow-lg hover:bg-brand-accent hover:text-white transition">Voir la boutique</Link>
        </div>
        <img src="/logo192.png" alt="Hajti.tn" className="w-32 h-32 md:w-48 md:h-48 rounded-2xl shadow-lg" />
      </div>

      {/* New Products */}
      <section className="mb-12">
  <h2 className="text-2xl font-bold mb-6 text-brand-accent">Nouveautés</h2>
  {loading ? <div>Chargement...</div> : (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
      {newProducts.map((product, idx) => (
        <div className="transition-transform duration-300 hover:scale-105" key={product.id} style={{ animationDelay: `${idx * 80}ms` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )}
</section>

      {/* Promotions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-brand-accent">Promotions</h2>
        {loading ? <div>Chargement...</div> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {promoProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>

      {/* Best Sellers */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-brand-accent">Meilleures ventes</h2>
        {loading ? <div>Chargement...</div> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>
      <div className="flex justify-center mt-8">
        <Link to="/products" className="inline-block bg-brand-accent text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-brand-ink transition">Voir tous les produits</Link>
      </div>
    </div>
  );
}
