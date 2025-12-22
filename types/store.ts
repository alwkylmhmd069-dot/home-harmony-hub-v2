// Data Models for Family Home Store

export type Language = 'ar' | 'en';

export interface LocalizedString {
  ar: string;
  en: string;
}

export interface Category {
  id: string;
  name: LocalizedString;
  icon: string;
  color: string;
  borderColor: string;
  image?: string;
  count?: number;
}

export interface Product {
  id: string;
  name: LocalizedString;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  brand?: string;
  colors?: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  description: LocalizedString;
  modelUrl?: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'customer' | 'vendor';
  isAffiliate: boolean;
  referralCode?: string;
  walletBalance?: number;
}

export interface Promotion {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: LocalizedString;
  comment: LocalizedString;
  rating: number;
  avatar: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface CMSPage {
  slug: string;
  title: LocalizedString;
  content: LocalizedString;
  lastUpdated: string;
}

export interface AffiliateStats {
  totalEarnings: number;
  totalReferrals: number;
  clicks: number;
  recentTransactions: { date: string; amount: number; source: string }[];
}
