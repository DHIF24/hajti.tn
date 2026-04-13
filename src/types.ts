export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  images?: string[];
  videoUrl?: string;
  stock: number;
  rating: number;
  gender?: 'fille' | 'garcon' | 'mixte';
  featured?: boolean;
  promotionPercentage?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  bannerUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}
