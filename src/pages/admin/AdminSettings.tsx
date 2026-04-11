import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { Save, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface AppSettings {
  heroBannerUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  updatedAt: string;
}

export function AdminSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    heroBannerUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop',
    heroTitle: "L'Art de Vivre à la Tunisienne",
    heroSubtitle: "Découvrez une sélection exclusive de pièces artisanales et modernes pour sublimer votre intérieur.",
    updatedAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as AppSettings;
          setSettings(data);
          setImagePreview(data.heroBannerUrl);
        } else {
          setImagePreview(settings.heroBannerUrl);
        }
      } catch (error) {
        console.error("Error fetching settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setSettings({ ...settings, heroBannerUrl: '' }); // Clear URL field when file is chosen
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let finalImageUrl = settings.heroBannerUrl;

      if (imageFile) {
        const storageRef = ref(storage, `settings/hero_banner_${Date.now()}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(uploadResult.ref);
      }

      const newSettings = {
        ...settings,
        heroBannerUrl: finalImageUrl,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'settings', 'general'), newSettings);
      setSettings(newSettings);
      setMessage({ type: 'success', text: 'Paramètres enregistrés avec succès !' });
    } catch (error: any) {
      console.error("Error saving settings", error);
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement : ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres du Site</h1>
        <p className="text-gray-500">Gérez l'apparence de votre page d'accueil.</p>
      </div>

      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl mb-6 text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
          {/* Hero Banner Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-brand-accent">
              <ImageIcon className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-wider text-sm">Bannière d'accueil</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image de fond (URL)</label>
                  <input
                    type="text"
                    placeholder="https://exemple.com/image.jpg"
                    value={settings.heroBannerUrl}
                    onChange={(e) => {
                      setSettings({ ...settings, heroBannerUrl: e.target.value });
                      setImagePreview(e.target.value);
                      setImageFile(null); // Clear file if URL is edited
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ou uploader un fichier</label>
                  <div 
                    className="relative aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group cursor-pointer"
                    onClick={() => document.getElementById('banner-upload')?.click()}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Banner Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Cliquez pour uploader</p>
                      </div>
                    )}
                    <input 
                      id="banner-upload"
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 italic">
                  Format recommandé : 1920x1080px.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre de la bannière</label>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
                  <textarea
                    rows={3}
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="pt-8 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-black/10"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
