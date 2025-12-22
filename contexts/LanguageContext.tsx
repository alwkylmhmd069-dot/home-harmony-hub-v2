import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Translations> = {
  en: {
    // Header
    "header.home": "Home",
    "header.products": "Products",
    "header.categories": "Categories",
    "header.offers": "Offers",
    "header.cart": "Cart",
    "header.wishlist": "Wishlist",
    "header.account": "Account",
    "header.search": "Search products...",
    "header.admin": "Admin Panel",
    
    // Hero
    "hero.title": "Family Home",
    "hero.subtitle": "Premium Home Essentials",
    "hero.description": "Discover our exclusive collection of premium home products that combine elegance with functionality",
    "hero.shopNow": "Shop Now",
    "hero.viewCollection": "View Collection",
    "hero.newCollection": "New Collection",
    
    // Products
    "product.addToCart": "Add to Cart",
    "product.quickView": "Quick View",
    "product.addToWishlist": "Add to Wishlist",
    "product.compare": "Compare",
    "product.price": "Price",
    "product.egp": "EGP",
    "product.new": "New",
    "product.sale": "Sale",
    "product.outOfStock": "Out of Stock",
    "product.inStock": "In Stock",
    "product.featured": "Featured Products",
    "product.rating": "Rating",
    "product.reviews": "Reviews",
    "product.description": "Description",
    "product.specifications": "Specifications",
    "product.relatedProducts": "Related Products",
    
    // Categories
    "categories.title": "Shop by Category",
    "categories.viewAll": "View All",
    "categories.kitchen": "Kitchen",
    "categories.bathroom": "Bathroom",
    "categories.bedroom": "Bedroom",
    "categories.living": "Living Room",
    "categories.outdoor": "Outdoor",
    "categories.cleaning": "Cleaning",
    "categories.cookware": "Cookware & Bakeware",
    "categories.appliances": "Home Appliances",
    "categories.dining": "Dining & Serving",
    "categories.furniture": "Furniture & Decor",
    "categories.organization": "Organization & Bath",
    "categories.textiles": "Home Textiles",
    "categories.smartHome": "Smart Home",
    
    // Features
    "features.freeShipping": "Express Secure Delivery",
    "features.freeShippingDesc": "Fast Track Shipping",
    "features.securePayment": "Secure Payment",
    "features.securePaymentDesc": "100% Protected Transactions",
    "features.support": "Premium Support",
    "features.supportDesc": "Dedicated Concierge Service",
    "features.returns": "Seamless Returns",
    "features.returnsDesc": "Premium After-Sales Support",
    "features.quality": "Premium Quality",
    "features.qualityDesc": "Guaranteed Authentic Products",
    
    // Footer
    "footer.about": "About Us",
    "footer.aboutDesc": "Family Home is your destination for premium home essentials that combine elegance with functionality.",
    "footer.contact": "Contact",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.newsletter": "Subscribe to our newsletter",
    "footer.emailPlaceholder": "Enter your email",
    "footer.subscribe": "Subscribe",
    "footer.rights": "All rights reserved",
    "footer.quickLinks": "Quick Links",
    "footer.support": "Support",
    "footer.followUs": "Follow Us",
    
    // Filters
    "filter.priceRange": "Price Range",
    "filter.productsAvailable": "products available",
    "filter.sortBy": "Sort By",
    "filter.newest": "Newest",
    "filter.priceLow": "Price: Low to High",
    "filter.priceHigh": "Price: High to Low",
    "filter.popular": "Most Popular",
    "filter.category": "Category",
    "filter.brand": "Brand",
    "filter.color": "Color",
    "filter.all": "All",
    "filter.clearAll": "Clear All",
    "filter.apply": "Apply Filters",
    
    // Cart
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.total": "Total",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.checkout": "Checkout",
    "cart.continueShopping": "Continue Shopping",
    "cart.remove": "Remove",
    "cart.quantity": "Quantity",
    
    // Testimonials
    "testimonials.title": "What Our Customers Say",
    "testimonials.subtitle": "Real reviews from satisfied customers",
    
    // Promotions
    "promotions.title": "Special Offers",
    "promotions.viewOffer": "View Offer",
  },
  ar: {
    // Header
    "header.home": "الرئيسية",
    "header.products": "المنتجات",
    "header.categories": "الأقسام",
    "header.offers": "العروض",
    "header.cart": "السلة",
    "header.wishlist": "المفضلة",
    "header.account": "حسابي",
    "header.search": "ابحث عن المنتجات...",
    "header.admin": "لوحة الإدارة",
    
    // Hero
    "hero.title": "فاميلي هوم",
    "hero.subtitle": "أدوات منزلية مميزة",
    "hero.description": "اكتشف مجموعتنا الحصرية من المنتجات المنزلية الفاخرة التي تجمع بين الأناقة والوظيفة",
    "hero.shopNow": "تسوق الآن",
    "hero.viewCollection": "شاهد المجموعة",
    "hero.newCollection": "مجموعة جديدة",
    
    // Products
    "product.addToCart": "أضف للسلة",
    "product.quickView": "عرض سريع",
    "product.addToWishlist": "أضف للمفضلة",
    "product.compare": "قارن",
    "product.price": "السعر",
    "product.egp": "جنيه",
    "product.new": "جديد",
    "product.sale": "خصم",
    "product.outOfStock": "نفذ من المخزون",
    "product.inStock": "متوفر",
    "product.featured": "منتجات مميزة",
    "product.rating": "التقييم",
    "product.reviews": "التقييمات",
    "product.description": "الوصف",
    "product.specifications": "المواصفات",
    "product.relatedProducts": "منتجات ذات صلة",
    
    // Categories
    "categories.title": "تسوق حسب القسم",
    "categories.viewAll": "عرض الكل",
    "categories.kitchen": "المطبخ",
    "categories.bathroom": "الحمام",
    "categories.bedroom": "غرفة النوم",
    "categories.living": "غرفة المعيشة",
    "categories.outdoor": "الحديقة",
    "categories.cleaning": "التنظيف",
    "categories.cookware": "أدوات الطهي والخبز",
    "categories.appliances": "الأجهزة الكهربائية",
    "categories.dining": "مائدة الطعام والضيافة",
    "categories.furniture": "الأثاث والديكور",
    "categories.organization": "التنظيم والحمام",
    "categories.textiles": "المفروشات والسجاد",
    "categories.smartHome": "المنزل الذكي",
    
    // Features
    "features.freeShipping": "توصيل سريع وآمن",
    "features.freeShippingDesc": "شحن فائق السرعة",
    "features.securePayment": "دفع آمن",
    "features.securePaymentDesc": "معاملات محمية 100%",
    "features.support": "دعم متميز",
    "features.supportDesc": "خدمة عملاء حصرية",
    "features.returns": "استرجاع سلس",
    "features.returnsDesc": "خدمة ما بعد البيع المتميزة",
    "features.quality": "جودة فاخرة",
    "features.qualityDesc": "منتجات أصلية مضمونة",
    
    // Footer
    "footer.about": "من نحن",
    "footer.aboutDesc": "فاميلي هوم وجهتك للأدوات المنزلية الفاخرة التي تجمع بين الأناقة والوظيفة.",
    "footer.contact": "اتصل بنا",
    "footer.privacy": "سياسة الخصوصية",
    "footer.terms": "شروط الخدمة",
    "footer.newsletter": "اشترك في نشرتنا البريدية",
    "footer.emailPlaceholder": "أدخل بريدك الإلكتروني",
    "footer.subscribe": "اشترك",
    "footer.rights": "جميع الحقوق محفوظة",
    "footer.quickLinks": "روابط سريعة",
    "footer.support": "الدعم",
    "footer.followUs": "تابعنا",
    
    // Filters
    "filter.priceRange": "نطاق السعر",
    "filter.productsAvailable": "منتج متاح",
    "filter.sortBy": "ترتيب حسب",
    "filter.newest": "الأحدث",
    "filter.priceLow": "السعر: من الأقل للأعلى",
    "filter.priceHigh": "السعر: من الأعلى للأقل",
    "filter.popular": "الأكثر شعبية",
    "filter.category": "الفئة",
    "filter.brand": "الماركة",
    "filter.color": "اللون",
    "filter.all": "الكل",
    "filter.clearAll": "مسح الكل",
    "filter.apply": "تطبيق الفلاتر",
    
    // Cart
    "cart.title": "سلة التسوق",
    "cart.empty": "سلتك فارغة",
    "cart.total": "الإجمالي",
    "cart.subtotal": "المجموع الفرعي",
    "cart.shipping": "الشحن",
    "cart.checkout": "إتمام الشراء",
    "cart.continueShopping": "متابعة التسوق",
    "cart.remove": "إزالة",
    "cart.quantity": "الكمية",
    
    // Testimonials
    "testimonials.title": "آراء عملائنا",
    "testimonials.subtitle": "تقييمات حقيقية من عملاء راضين",
    
    // Promotions
    "promotions.title": "عروض خاصة",
    "promotions.viewOffer": "شاهد العرض",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
      applyLanguage(savedLanguage);
    } else {
      applyLanguage('ar');
    }
  }, []);

  const applyLanguage = (lang: Language) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    applyLanguage(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL: language === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};
