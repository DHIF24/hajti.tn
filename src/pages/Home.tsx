import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface AppSettings {
  heroBannerUrl: string;
  heroTitle: string;
  heroSubtitle: string;
}

export function Home() {
  const [settings, setSettings] = useState<AppSettings>({
    heroBannerUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop',
    heroTitle: "NEW COLLECTION SUMMER",
    heroSubtitle: "OVERSIZED T-SHIRT URBAN WEAR"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as AppSettings);
        }
      } catch (error) {
        console.error("Error fetching settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img 
          src={settings.heroBannerUrl} 
          alt="Hero Banner" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      </motion.div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* Top Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-8 px-8 py-2 border border-white/20 rounded-full backdrop-blur-md bg-white/5"
          >
            <span className="text-white/80 text-[11px] uppercase tracking-[0.5em] font-bold">
              VOIR PLUS
            </span>
          </motion.div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-9xl text-white font-display font-black mb-4 tracking-tight drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-none">
            {settings.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-sm md:text-lg font-bold mb-12 tracking-[0.2em] uppercase drop-shadow-lg">
            {settings.heroSubtitle}
          </p>

          {/* Main Button */}
          <Link 
            to="/products" 
            className="group relative inline-flex items-center gap-3 bg-[#C5A059] hover:bg-[#B48F48] text-white px-12 py-4 rounded-full text-[12px] uppercase tracking-[0.3em] font-black transition-all duration-300 shadow-[0_20px_50px_rgba(197,160,89,0.3)] hover:scale-105 active:scale-95"
          >
            VOIR PLUS
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
        <button className="w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto group">
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button className="w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto group">
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-500 ${i === 1 ? 'w-12 bg-[#D4AF37]' : 'w-8 bg-white/30'}`}
          />
        ))}
      </div>

      {/* Bottom Gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </div>
  );
}
