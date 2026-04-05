import React, { useState, useEffect } from 'react';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../../firebase';
import { Product } from '../../types';
import { X, Upload, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'decors',
    imageUrl: '',
    stock: 0,
    rating: 5,
    featured: false,
    promotionPercentage: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
        stock: product.stock,
        rating: product.rating,
        featured: product.featured || false,
        promotionPercentage: product.promotionPercentage || 0
      });
      setImagePreview(product.imageUrl);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log("Starting product save process...");
    console.log("Current user:", auth.currentUser?.uid, auth.currentUser?.email);

    if (!auth.currentUser) {
      setError("Vous devez être connecté pour effectuer cette action.");
      setLoading(false);
      return;
    }

    try {
      let finalImageUrl = formData.imageUrl || 'https://picsum.photos/seed/product/800/800';

      if (imageFile) {
        console.log("Uploading image to storage...", imageFile.name);
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        try {
          // Increased timeout to 30 seconds for slow connections
          const uploadPromise = uploadBytes(storageRef, imageFile);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("L'upload de l'image a expiré (timeout de 30s)")), 30000)
          );
          
          const uploadResult = await Promise.race([uploadPromise, timeoutPromise]) as any;
          finalImageUrl = await getDownloadURL(uploadResult.ref);
          console.log("Image uploaded successfully:", finalImageUrl);
        } catch (uploadErr: any) {
          console.error("Image upload failed or timed out:", uploadErr);
          // Fallback to placeholder if upload fails, but don't block the whole process
          // Only show as a warning if we have a fallback
          console.warn("Using fallback image due to upload failure");
          if (!finalImageUrl || finalImageUrl.includes('picsum.photos')) {
             finalImageUrl = 'https://picsum.photos/seed/' + Math.random() + '/800/800';
          }
        }
      }

      const productData = {
        ...formData,
        imageUrl: finalImageUrl || 'https://picsum.photos/seed/product/800/800',
        price: Number(formData.price),
        stock: Number(formData.stock),
        rating: Number(formData.rating),
        promotionPercentage: Number(formData.promotionPercentage),
        updatedAt: new Date().toISOString()
      };

      console.log("Saving product data to Firestore...", productData);
      try {
        const savePromise = product 
          ? setDoc(doc(db, 'products', product.id), productData)
          : addDoc(collection(db, 'products'), productData);
          
        const timeoutSavePromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("L'enregistrement dans la base de données a expiré (timeout de 30s)")), 30000)
        );

        await Promise.race([savePromise, timeoutSavePromise]);
        console.log("Product saved successfully to Firestore");
        
        onSuccess();
        onClose();
      } catch (firestoreErr: any) {
        console.error("Firestore save failed:", firestoreErr);
        throw new Error("Échec de l'enregistrement dans la base de données: " + firestoreErr.message);
      }
    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      setError(err.message || "Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {product ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                >
                  <option value="decors">Décors</option>
                  <option value="salle-de-bain">Salle de bain</option>
                  <option value="cuisine">Cuisine</option>
                  <option value="art">Art de table</option>
                  <option value="rangement">Rangement</option>
                  <option value="offres">Offres</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (TND)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promotion (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.promotionPercentage}
                    onChange={(e) => setFormData({ ...formData, promotionPercentage: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>
              <div 
                className="relative aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group cursor-pointer"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Cliquez pour uploader une image</p>
                  </div>
                )}
                <input 
                  id="image-upload"
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ou URL de l'image</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1 italic">
                  Si vous téléchargez un fichier, l'URL sera ignorée.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">Mettre en avant sur l'accueil</label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                product ? 'Mettre à jour' : 'Créer le produit'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
