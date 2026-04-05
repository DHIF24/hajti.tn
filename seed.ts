import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const DEMO_PRODUCTS = [
  {
    name: "Tapis Berbère Beni Ouarain",
    description: "Tapis en laine vierge tissé à la main, motifs géométriques noirs sur fond crème.",
    price: 450.00,
    category: "Décors",
    imageUrl: "https://images.unsplash.com/photo-1534889156217-d643df14f14a?q=80&w=2000&auto=format&fit=crop",
    stock: 2,
    rating: 5.0,
    featured: true
  },
  {
    name: "Chaise en Bois Massif et Corde",
    description: "Chaise de salle à manger au design scandinave, assise en corde tressée.",
    price: 220.00,
    category: "Meubles",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=2000&auto=format&fit=crop",
    stock: 12,
    rating: 4.8,
    featured: true
  },
  {
    name: "Set de Couverts Dorés",
    description: "Ménagère 24 pièces en acier inoxydable finition laiton brossé.",
    price: 110.00,
    category: "Art de table",
    imageUrl: "https://images.unsplash.com/photo-1596647833075-8120c184081c?q=80&w=2000&auto=format&fit=crop",
    stock: 15,
    rating: 4.7,
    featured: false
  },
  {
    name: "Housse de Couette en Gaze de Coton",
    description: "Parure de lit 2 personnes en gaze de coton terracotta, ultra douce.",
    price: 135.00,
    category: "Linge de maison",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2000&auto=format&fit=crop",
    stock: 8,
    rating: 4.9,
    featured: true
  }
];

async function seed() {
  try {
    const batch = writeBatch(db);
    const productsRef = collection(db, 'products');

    DEMO_PRODUCTS.forEach((product) => {
      const newDocRef = doc(productsRef);
      batch.set(newDocRef, product);
    });

    await batch.commit();
    console.log('Successfully seeded demo products!');
    process.exit(0);
  } catch (error) {
    console.error("Error seeding", error);
    process.exit(1);
  }
}

seed();
