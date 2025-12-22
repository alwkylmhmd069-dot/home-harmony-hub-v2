import { Category, Product, Promotion, Testimonial } from '@/types/store';

export const CATEGORIES: Category[] = [
  { 
    id: 'cookware', 
    name: { ar: 'أدوات الطهي والخبز', en: 'Cookware & Bakeware' }, 
    icon: 'ChefHat', 
    color: 'text-orange-400', 
    borderColor: 'border-orange-500',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    count: 156
  },
  { 
    id: 'appliances', 
    name: { ar: 'الأجهزة الكهربائية', en: 'Home Appliances' }, 
    icon: 'Zap', 
    color: 'text-yellow-400', 
    borderColor: 'border-yellow-500',
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop',
    count: 89
  },
  { 
    id: 'cleaning', 
    name: { ar: 'لوازم التنظيف الذكي', en: 'Smart Cleaning' }, 
    icon: 'Sparkles', 
    color: 'text-blue-400', 
    borderColor: 'border-blue-500',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop',
    count: 67
  },
  { 
    id: 'dining', 
    name: { ar: 'مائدة الطعام والضيافة', en: 'Dining & Serving' }, 
    icon: 'Utensils', 
    color: 'text-pink-400', 
    borderColor: 'border-pink-500',
    image: 'https://images.unsplash.com/photo-1530377383091-7a1dc8e5c0e5?w=400&h=400&fit=crop',
    count: 98
  },
  { 
    id: 'furniture', 
    name: { ar: 'الأثاث والديكور', en: 'Furniture & Decor' }, 
    icon: 'Armchair', 
    color: 'text-purple-400', 
    borderColor: 'border-purple-500',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    count: 124
  },
  { 
    id: 'organization', 
    name: { ar: 'التنظيم والحمام', en: 'Organization & Bath' }, 
    icon: 'LayoutGrid', 
    color: 'text-emerald-400', 
    borderColor: 'border-emerald-500',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=400&fit=crop',
    count: 78
  },
  { 
    id: 'textiles', 
    name: { ar: 'المفروشات والسجاد', en: 'Home Textiles' }, 
    icon: 'Bed', 
    color: 'text-indigo-400', 
    borderColor: 'border-indigo-500',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop',
    count: 145
  },
  { 
    id: 'smart-home', 
    name: { ar: 'المنزل الذكي والأمان', en: 'Smart Home' }, 
    icon: 'Monitor', 
    color: 'text-cyan-400', 
    borderColor: 'border-cyan-500',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    count: 45
  },
];

export const PRODUCTS: Product[] = [
  // منتجات الموب والباركيه من Excel
  {
    id: 'FH-700',
    name: { ar: 'باركيه FH-700', en: 'Parquet Mop FH-700' },
    price: 1050,
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=800&fit=crop',
    category: 'cleaning',
    brand: 'Family Home',
    rating: 4.8,
    reviews: 85,
    isNew: true,
    description: {
      ar: 'ممسحة باركيه عالية الجودة FH-700 - مثالية لتنظيف الأرضيات الخشبية والباركيه',
      en: 'High quality parquet mop FH-700 - Perfect for cleaning wooden and parquet floors'
    },
    colors: ['#2D3436', '#636E72', '#00B894'],
    stock: 15
  },
  {
    id: 'FH-701',
    name: { ar: 'باركيه FH-701', en: 'Parquet Mop FH-701' },
    price: 1000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
    category: 'cleaning',
    brand: 'Family Home',
    rating: 4.7,
    reviews: 62,
    description: {
      ar: 'ممسحة باركيه FH-701 - تصميم مريح وفعال للتنظيف اليومي',
      en: 'Parquet mop FH-701 - Comfortable and efficient design for daily cleaning'
    },
    colors: ['#2D3436', '#74B9FF'],
    stock: 12
  },
  {
    id: 'FH-702',
    name: { ar: 'موب FH-702', en: 'Premium Mop FH-702' },
    price: 2025,
    oldPrice: 2300,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
    category: 'cleaning',
    brand: 'Family Home',
    rating: 4.9,
    reviews: 128,
    isNew: true,
    description: {
      ar: 'موب FH-702 فاخر - أداء احترافي لتنظيف عميق وفعال',
      en: 'Premium Mop FH-702 - Professional performance for deep and effective cleaning'
    },
    colors: ['#2D3436', '#6C5CE7', '#00CEC9'],
    stock: 4
  },
  {
    id: 'FH-704',
    name: { ar: 'موب FH-704', en: 'Standard Mop FH-704' },
    price: 1000,
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&h=800&fit=crop',
    category: 'cleaning',
    brand: 'Family Home',
    rating: 4.6,
    reviews: 95,
    description: {
      ar: 'موب FH-704 قياسي - خيار اقتصادي بجودة ممتازة',
      en: 'Standard Mop FH-704 - Economical choice with excellent quality'
    },
    colors: ['#2D3436', '#FDCB6E'],
    stock: 16
  },
  {
    id: 'FH-705',
    name: { ar: 'موب FH-705', en: 'Deluxe Mop FH-705' },
    price: 1350,
    oldPrice: 1500,
    image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&h=800&fit=crop',
    category: 'cleaning',
    brand: 'Family Home',
    rating: 4.8,
    reviews: 73,
    isNew: true,
    description: {
      ar: 'موب FH-705 ديلوكس - تقنية متقدمة لتنظيف أسهل',
      en: 'Deluxe Mop FH-705 - Advanced technology for easier cleaning'
    },
    colors: ['#2D3436', '#E17055', '#00B894'],
    stock: 6
  },
  {
    id: 'FH-706',
    name: { ar: 'باركيه FH-706', en: 'Parquet Mop FH-706' },
    price: 1000,
    image: 'https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?w=800&h=800&fit=crop',
    category: 'cleaning',
    brand: 'Family Home',
    rating: 4.5,
    reviews: 48,
    description: {
      ar: 'ممسحة باركيه FH-706 - تصميم عصري وعملي',
      en: 'Parquet mop FH-706 - Modern and practical design'
    },
    colors: ['#2D3436', '#A29BFE'],
    stock: 12
  },
  {
    id: 'FH-612',
    name: { ar: 'موب FH-612', en: 'Pro Mop FH-612' },
    price: 1750,
    oldPrice: 2000,
    image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=800&fit=crop',
    category: 'cleaning',
    brand: 'Family Home',
    rating: 4.9,
    reviews: 156,
    isNew: true,
    description: {
      ar: 'موب FH-612 برو - الاختيار المثالي للمحترفين',
      en: 'Pro Mop FH-612 - The perfect choice for professionals'
    },
    colors: ['#2D3436', '#0984E3', '#00CEC9'],
    stock: 12
  },
  // المنتجات الأصلية
  {
    id: '1',
    name: { ar: 'أطقم حلل جرانيت 13 قطعة', en: 'Granite Cookware Set 13Pcs' },
    price: 4500,
    oldPrice: 5200,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop',
    category: 'cookware',
    brand: 'Zahran',
    rating: 4.8,
    reviews: 120,
    isNew: true,
    description: {
      ar: 'طقم حلل جرانيت كامل يشمل مقاسات مختلفة مع قلاية وجريل، أسطح غير لاصقة.',
      en: 'Full granite cookware set including various sizes with frying pan and grill, non-stick surfaces.'
    },
    colors: ['#2D3436', '#636E72', '#B2BEC3'],
    stock: 15
  },
  {
    id: '2',
    name: { ar: 'قلاية هوائية فيليبس XXL', en: 'Philips Air Fryer XXL' },
    price: 8500,
    oldPrice: 9500,
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&h=800&fit=crop',
    category: 'appliances',
    brand: 'Philips',
    rating: 4.9,
    reviews: 350,
    isNew: true,
    description: {
      ar: 'طهي صحي بدون زيت مع تقنية الهواء السريع، سعة كبيرة جداً.',
      en: 'Healthy cooking without oil with rapid air technology, extra large capacity.'
    },
    colors: ['#2D3436', '#FFFFFF'],
    stock: 10
  },
  {
    id: '3',
    name: { ar: 'طقم سرير قطن مصري فاخر', en: 'Luxury Egyptian Cotton Bedding Set' },
    price: 2899,
    oldPrice: 3499,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop',
    category: 'textiles',
    brand: 'Home Collection',
    rating: 4.7,
    reviews: 89,
    description: {
      ar: 'طقم سرير فاخر من القطن المصري 100%، نعومة استثنائية وراحة لا مثيل لها.',
      en: '100% Egyptian cotton luxury bedding set, exceptional softness and unmatched comfort.'
    },
    colors: ['#FFFFFF', '#DFE6E9', '#74B9FF'],
    stock: 25
  },
  {
    id: '4',
    name: { ar: 'مصباح طاولة LED ذكي', en: 'Smart LED Table Lamp' },
    price: 649,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop',
    category: 'smart-home',
    brand: 'Xiaomi',
    rating: 4.5,
    reviews: 156,
    isNew: true,
    description: {
      ar: 'مصباح ذكي مع تحكم عن بعد وتغيير ألوان، متوافق مع جميع المساعدات الذكية.',
      en: 'Smart lamp with remote control and color changing, compatible with all smart assistants.'
    },
    colors: ['#FDCB6E', '#2D3436', '#6C5CE7'],
    stock: 50
  },
  {
    id: '5',
    name: { ar: 'منظم مطبخ متعدد الاستخدام', en: 'Multi-Purpose Kitchen Organizer' },
    price: 399,
    oldPrice: 549,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop',
    category: 'organization',
    brand: 'IKEA',
    rating: 4.6,
    reviews: 203,
    description: {
      ar: 'منظم مطبخ ذكي لتخزين التوابل والأدوات، تصميم عصري وعملي.',
      en: 'Smart kitchen organizer for storing spices and tools, modern and practical design.'
    },
    colors: ['#FFFFFF', '#00B894', '#E17055'],
    stock: 75
  },
  {
    id: '6',
    name: { ar: 'طقم مزهريات سيراميك', en: 'Ceramic Vase Set' },
    price: 799,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&h=800&fit=crop',
    category: 'furniture',
    brand: 'Artisan Home',
    rating: 4.8,
    reviews: 67,
    isNew: true,
    description: {
      ar: 'طقم مزهريات سيراميك مصنوع يدوياً، تصميم أنيق لديكور منزلك.',
      en: 'Handmade ceramic vase set, elegant design for your home decor.'
    },
    colors: ['#FFEAA7', '#81ECEC', '#FD79A8'],
    stock: 30
  },
  {
    id: '7',
    name: { ar: 'طقم مناشف قطن فندقي', en: 'Hotel Quality Cotton Towel Set' },
    price: 549,
    image: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&h=800&fit=crop',
    category: 'organization',
    brand: 'Premium Home',
    rating: 4.7,
    reviews: 124,
    description: {
      ar: 'طقم مناشف فندقية من القطن الفاخر، نعومة وامتصاص ممتاز.',
      en: 'Hotel quality cotton towel set, excellent softness and absorption.'
    },
    colors: ['#FFFFFF', '#74B9FF', '#A29BFE'],
    stock: 60
  },
  {
    id: '8',
    name: { ar: 'طقم أدوات مائدة ستانلس ستيل', en: 'Stainless Steel Cutlery Set' },
    price: 1299,
    oldPrice: 1599,
    image: 'https://images.unsplash.com/photo-1530377383091-7a1dc8e5c0e5?w=800&h=800&fit=crop',
    category: 'dining',
    brand: 'WMF',
    rating: 4.9,
    reviews: 89,
    description: {
      ar: 'طقم أدوات مائدة ستانلس ستيل فاخر 72 قطعة، جودة ألمانية.',
      en: '72-piece luxury stainless steel cutlery set, German quality.'
    },
    colors: ['#B2BEC3', '#FDCB6E'],
    stock: 20
  },
];

export const PROMOTIONS: Promotion[] = [
  {
    id: 'p1',
    title: { ar: 'عروض الصيف الكبرى', en: 'Grand Summer Sale' },
    subtitle: { ar: 'خصم يصل إلى 50% على أدوات المطبخ', en: 'Up to 50% off cookware' },
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop'
  },
  {
    id: 'p2',
    title: { ar: 'تخفيضات نهاية الموسم', en: 'End of Season Sale' },
    subtitle: { ar: 'خصم 30% على جميع المفروشات', en: '30% off all textiles' },
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=400&fit=crop'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'أحمد محمد',
    role: { ar: 'عميل دائم', en: 'Regular Customer' },
    comment: { 
      ar: 'تجربة رائعة! المنتجات ذات جودة عالية والتوصيل سريع جداً. أنصح الجميع بالتسوق من Family Home.',
      en: 'Great experience! High quality products and very fast delivery. I recommend everyone to shop at Family Home.'
    },
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  },
  {
    id: 't2',
    name: 'سارة علي',
    role: { ar: 'مصممة ديكور', en: 'Interior Designer' },
    comment: { 
      ar: 'أفضل متجر للأدوات المنزلية! تشكيلة متنوعة وأسعار منافسة. فريق خدمة العملاء ممتاز.',
      en: 'Best home goods store! Diverse selection and competitive prices. Excellent customer service team.'
    },
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  {
    id: 't3',
    name: 'محمد حسن',
    role: { ar: 'شيف محترف', en: 'Professional Chef' },
    comment: { 
      ar: 'أدوات الطبخ من Family Home غيرت تجربة الطهي عندي تماماً. جودة احترافية بأسعار معقولة.',
      en: 'Cookware from Family Home completely changed my cooking experience. Professional quality at reasonable prices.'
    },
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
  }
];

// Helper functions
export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(p => p.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return PRODUCTS.filter(p => p.category === categoryId);
};

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(c => c.id === id);
};

export const searchProducts = (query: string, language: 'ar' | 'en'): Product[] => {
  const lowerQuery = query.toLowerCase();
  return PRODUCTS.filter(p => 
    p.name[language].toLowerCase().includes(lowerQuery) ||
    p.description[language].toLowerCase().includes(lowerQuery) ||
    (p.brand && p.brand.toLowerCase().includes(lowerQuery))
  );
};

export const filterProductsByPrice = (minPrice: number, maxPrice: number): Product[] => {
  return PRODUCTS.filter(p => p.price >= minPrice && p.price <= maxPrice);
};
