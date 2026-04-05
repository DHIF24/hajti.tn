export function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2054&auto=format&fit=crop" 
            alt="About Us"
            className="w-full h-full object-cover opacity-20 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-white/60" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl tracking-[0.2em] uppercase font-light text-gray-900 mb-6">
            Notre Histoire
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed font-light">
            Créer des espaces qui inspirent, avec des pièces authentiques et intemporelles.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-24">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-8">La Philosophie</h2>
            <p className="text-gray-600 leading-loose text-lg font-light">
              Fondée avec la passion du design d'intérieur, notre boutique est née d'une conviction simple : le véritable luxe réside dans la simplicité, la qualité des matériaux et l'artisanat. Nous parcourons le monde pour dénicher des pièces uniques qui racontent une histoire et apportent une âme à votre intérieur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-16 border-t border-gray-100">
            <div className="text-center md:text-left">
              <h3 className="text-sm uppercase tracking-[0.2em] text-gray-900 mb-6">Artisanat Authentique</h3>
              <p className="text-gray-500 leading-relaxed font-light">
                Chaque article de notre collection est sélectionné pour sa qualité de fabrication. Nous privilégions les matériaux naturels et le savoir-faire artisanal pour vous offrir des pièces durables.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-sm uppercase tracking-[0.2em] text-gray-900 mb-6">Service Sur-Mesure</h3>
              <p className="text-gray-500 leading-relaxed font-light">
                Notre relation avec nos clients va bien au-delà de l'achat. De nos conseils en décoration à notre service client dédié, nous vous accompagnons pour créer l'intérieur de vos rêves.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
