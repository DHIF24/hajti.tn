import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';

export function StickyCart() {
  const { itemCount } = useCart();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <Link
            to="/cart"
            className="flex items-center gap-3 bg-brand-accent text-white px-6 py-4 rounded-full shadow-2xl hover:bg-brand-ink transition-all duration-300 group"
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-white text-brand-accent text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            </div>
            <span className="text-[12px] uppercase tracking-[0.2em] font-bold hidden md:block">
              Mon Panier
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
