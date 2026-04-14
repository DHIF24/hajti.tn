import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-ink text-white pt-16 md:pt-24 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
          <div className="col-span-1 md:col-span-2 text-center md:text-left">
            <Link to="/" className="inline-block mb-6 md:mb-8">
              <span className="text-3xl font-display font-bold tracking-tight text-white">Hajti.tn</span>
            </Link>
            <p className="text-white/60 max-w-sm mx-auto md:mx-0 mb-8 leading-relaxed font-light text-sm md:text-base">
              L'élégance dans la simplicité. Découvrez notre collection exclusive de pièces artisanales et modernes pour sublimer votre intérieur en Tunisie.
            </p>
            <div className="flex justify-center md:justify-start space-x-6">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-accent hover:border-brand-accent transition-all duration-300">
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-accent hover:border-brand-accent transition-all duration-300">
                <Twitter className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-accent hover:border-brand-accent transition-all duration-300">
                <Facebook className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-[12px] uppercase tracking-[0.3em] text-white mb-8 font-bold">Boutique</h3>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-white/50 hover:text-brand-accent transition-colors text-sm font-light">Tous les produits</Link></li>
              <li><Link to="/about" className="text-white/50 hover:text-brand-accent transition-colors text-sm font-light">Notre Histoire</Link></li>
              <li><Link to="/cart" className="text-white/50 hover:text-brand-accent transition-colors text-sm font-light">Votre Panier</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[12px] uppercase tracking-[0.3em] text-white mb-8 font-bold">Service Client</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/50 hover:text-brand-accent transition-colors text-sm font-light">Nous contacter</a></li>
              <li><a href="#" className="text-white/50 hover:text-brand-accent transition-colors text-sm font-light">Livraison & Retours</a></li>
              <li><a href="#" className="text-white/50 hover:text-brand-accent transition-colors text-sm font-light">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-medium">
            &copy; {new Date().getFullYear()} HAJTI.TN. TOUS DROITS RÉSERVÉS.
          </p>
            <div className="flex space-x-8 text-[10px] text-white/30 tracking-[0.2em] uppercase font-medium">
              <a href="#" className="hover:text-white transition-colors">CONFIDENTIALITÉ</a>
              <a href="#" className="hover:text-white transition-colors">CONDITIONS</a>
              <Link to="/admin/login" className="hover:text-white transition-colors">ADMIN</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
