import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-8">
              <span className="text-2xl tracking-tight text-gray-900" style={{ fontFamily: "'Varela Round', 'Quicksand', sans-serif", fontWeight: 500 }}>Hajti.tn</span>
            </Link>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed font-light">
              L'élégance dans la simplicité. Découvrez notre collection de pièces uniques pour votre intérieur.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Twitter className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Facebook className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-gray-900 mb-8 font-medium">Boutique</h3>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-light">Tous les produits</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-light">Notre Histoire</Link></li>
              <li><Link to="/cart" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-light">Votre Panier</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-gray-900 mb-8 font-medium">Service Client</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-light">Nous contacter</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-light">Livraison & Retours</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-light">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-xs tracking-wider">
            &copy; {new Date().getFullYear()} HAJTI.TN. TOUS DROITS RÉSERVÉS.
          </p>
          <div className="flex space-x-8 text-xs text-gray-400 tracking-wider">
            <a href="#" className="hover:text-gray-900 transition-colors">POLITIQUE DE CONFIDENTIALITÉ</a>
            <a href="#" className="hover:text-gray-900 transition-colors">CONDITIONS GÉNÉRALES</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
