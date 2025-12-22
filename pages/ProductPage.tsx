import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Star, Heart, ShoppingCart, Zap, 
  Truck, ShieldCheck, Award, ChevronLeft, ChevronRight,
  Plus, Minus, Package, RotateCcw, Headphones, Expand
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { getProductById, PRODUCTS, CATEGORIES } from '@/data/mockData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';
import ProductCard from '@/components/ProductCard';
import AddToCartSuccess from '@/components/AddToCartSuccess';
import ImageZoomModal from '@/components/ImageZoomModal';
import { toast } from 'sonner';
import { Product } from '@/types/store';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { language, t, isRTL } = useLanguage();
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  
  const product = getProductById(productId || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Mock multiple images (in real app, product would have multiple images)
  const productImages = product ? [
    product.image,
    product.image.replace('w=800', 'w=801'),
    product.image.replace('w=800', 'w=802'),
  ] : [];

  // Get related products from same category
  const relatedProducts = product 
    ? PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  const discount = product?.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    if (!product) return;
    // Product with selected options
    const productWithOptions = {
      ...product,
      selectedColor: selectedColor || (product.colors?.[0] || null),
      selectedQuantity: quantity,
    };
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowSuccess(true);
    toast.success(
      isRTL 
        ? `تم إضافة ${quantity} × ${product.name.ar} للسلة` 
        : `Added ${quantity} × ${product.name.en} to cart`
    );
  };

  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleWishlist(product);
    toast.success(
      isInWishlist(product.id) 
        ? (isRTL ? 'تم الإزالة من المفضلة' : 'Removed from wishlist')
        : (isRTL ? 'تم إضافة للمفضلة' : 'Added to wishlist')
    );
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    openCart();
  };

  const handleRelatedAddToCart = (p: Product) => {
    addToCart(p);
    toast.success(isRTL ? `تم إضافة ${p.name.ar} للسلة` : `${p.name.en} added to cart`);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {isRTL ? 'المنتج غير موجود' : 'Product Not Found'}
          </h1>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === product.category);

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                {isRTL ? 'الرئيسية' : 'Home'}
              </Link>
            </li>
            <li>/</li>
            {category && (
              <>
                <li>
                  <Link to={`/category/${category.id}`} className="hover:text-primary transition-colors">
                    {category.name[language]}
                  </Link>
                </li>
                <li>/</li>
              </>
            )}
            <li className="text-foreground font-medium truncate max-w-[200px]">
              {product.name[language]}
            </li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              ref={imageRef}
              className="relative aspect-square rounded-2xl overflow-hidden card-neon cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground text-sm font-bold">
                    {t('product.new')}
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground text-sm font-bold">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <motion.button
                className={`absolute top-4 right-4 z-20 p-3 rounded-full glass hover:bg-primary/20 transition-colors ${isInWishlist(product.id) ? 'text-pink-500' : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlistToggle}
              >
                <Heart size={22} className={isInWishlist(product.id) ? 'fill-pink-500 text-pink-500' : 'text-foreground'} />
              </motion.button>

              {/* Fullscreen Button */}
              <motion.button
                className="absolute bottom-4 right-4 z-20 p-3 rounded-full glass hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowImageModal(true)}
              >
                <Expand size={20} className="text-foreground" />
              </motion.button>

              {/* Image with Zoom Effect */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={productImages[selectedImage]}
                  alt={product.name[language]}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isZoomed ? 1.5 : 1,
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Glowing Border Effect */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" 
                style={{ boxShadow: 'inset 0 0 30px hsl(var(--neon-cyan) / 0.3), 0 0 30px hsl(var(--neon-purple) / 0.3)' }} 
              />

              {/* Navigation Arrows - Mobile Swipe Hint */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? productImages.length - 1 : prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:bg-primary/20 transition-colors z-10"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === productImages.length - 1 ? 0 : prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:bg-primary/20 transition-colors z-10"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {productImages.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx 
                      ? 'border-primary shadow-lg' 
                      : 'border-border/50 opacity-70 hover:opacity-100'
                  }`}
                  style={selectedImage === idx ? { boxShadow: '0 0 20px hsl(var(--neon-cyan) / 0.4)' } : {}}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            {product.brand && (
              <span className="text-sm text-muted-foreground uppercase tracking-wider">
                {product.brand}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {product.name[language]}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'} 
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                ({product.reviews} {isRTL ? 'تقييم' : 'reviews'})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <motion.span 
                className="text-4xl font-display font-bold gradient-text"
                animate={{ 
                  textShadow: [
                    '0 0 10px hsl(var(--neon-purple) / 0.5)',
                    '0 0 20px hsl(var(--neon-cyan) / 0.5)',
                    '0 0 10px hsl(var(--neon-purple) / 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {product.price.toLocaleString()} {t('product.egp')}
              </motion.span>
              {product.oldPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.oldPrice.toLocaleString()} {t('product.egp')}
                </span>
              )}
              {discount > 0 && (
                <span className="px-3 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-medium">
                  {isRTL ? `وفر ${discount}%` : `Save ${discount}%`}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-500 font-medium">
                    {isRTL ? `متوفر (${product.stock} قطعة)` : `In Stock (${product.stock} available)`}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-destructive font-medium">
                    {isRTL ? 'غير متوفر' : 'Out of Stock'}
                  </span>
                </>
              )}
            </div>

            {/* Color Options */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <span className="text-sm font-medium text-muted-foreground">
                  {isRTL ? 'اختر اللون:' : 'Select Color:'}
                  {selectedColor && (
                    <span className="ml-2 text-foreground font-semibold">{selectedColor}</span>
                  )}
                </span>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                        selectedColor === color 
                          ? 'border-primary ring-2 ring-primary/30' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      style={{ backgroundColor: color }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {selectedColor === color && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-3 h-3 rounded-full bg-background/80 shadow-lg" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <span className="text-sm font-medium text-muted-foreground">
                {isRTL ? 'الكمية:' : 'Quantity:'}
              </span>
              <div className="inline-flex items-center gap-1 p-1 rounded-xl glass border border-border/50">
                <motion.button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-3 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </motion.button>
                <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                <motion.button
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  className="p-3 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={quantity >= product.stock}
                >
                  <Plus size={18} />
                </motion.button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                onClick={handleAddToCart}
                className="flex-1 btn-neon py-4 rounded-xl font-bold flex items-center justify-center gap-3 text-primary-foreground btn-hover-pulse"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={product.stock === 0}
              >
                <ShoppingCart size={22} />
                {t('product.addToCart')}
              </motion.button>
              <motion.button
                onClick={handleBuyNow}
                className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-3 border-2 border-secondary text-secondary hover:bg-secondary/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={product.stock === 0}
              >
                <Zap size={22} />
                {isRTL ? 'اشتري الآن' : 'Buy Now'}
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 rounded-full glass">
                  <ShieldCheck size={24} className="text-secondary" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {isRTL ? 'دفع آمن' : 'Secure Payment'}
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 rounded-full glass">
                  <Truck size={24} className="text-secondary" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {isRTL ? 'توصيل سريع' : 'Fast Track Shipping'}
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 rounded-full glass">
                  <Award size={24} className="text-secondary" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {isRTL ? 'خدمة متميزة' : 'Premium Service'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Accordion */}
        <div className="mb-16">
          <Accordion type="single" collapsible className="card-neon p-6 space-y-2">
            <AccordionItem value="description" className="border-border/50">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-3">
                  <Package size={20} className="text-primary" />
                  {isRTL ? 'تفاصيل المنتج' : 'Product Details'}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                <p className="leading-relaxed">{product.description[language]}</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    {isRTL ? `الماركة: ${product.brand || 'غير محدد'}` : `Brand: ${product.brand || 'N/A'}`}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    {isRTL ? `رقم المنتج: ${product.id}` : `SKU: ${product.id}`}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    {isRTL ? `التصنيف: ${category?.name[language] || ''}` : `Category: ${category?.name[language] || ''}`}
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping" className="border-border/50">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-3">
                  <Truck size={20} className="text-primary" />
                  {isRTL ? 'معلومات الشحن' : 'Shipping Info'}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Truck size={18} className="text-secondary flex-shrink-0 mt-1" />
                    <span>{isRTL ? 'توصيل سريع وآمن لجميع المحافظات' : 'Express Secure Delivery nationwide'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Package size={18} className="text-secondary flex-shrink-0 mt-1" />
                    <span>{isRTL ? 'شحن فائق السرعة خلال 2-5 أيام' : 'Fast Track Shipping within 2-5 days'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <RotateCcw size={18} className="text-secondary flex-shrink-0 mt-1" />
                    <span>{isRTL ? 'سياسة استرجاع سلسة وخدمة ما بعد البيع متميزة' : 'Seamless Returns & Premium After-Sales Support'}</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="reviews" className="border-border/50">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-3">
                  <Star size={20} className="text-primary" />
                  {isRTL ? `التقييمات (${product.reviews})` : `Reviews (${product.reviews})`}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <span className="text-4xl font-bold gradient-text">{product.rating}</span>
                    <span className="text-muted-foreground">/5</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'} 
                        />
                      ))}
                    </div>
                    <span className="text-sm">{isRTL ? `بناءً على ${product.reviews} تقييم` : `Based on ${product.reviews} reviews`}</span>
                  </div>
                </div>
                <p className="text-center py-6 border-t border-border/50">
                  {isRTL ? 'كن أول من يقيم هذا المنتج!' : 'Be the first to review this product!'}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="support" className="border-border/50 border-b-0">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-3">
                  <Headphones size={20} className="text-primary" />
                  {isRTL ? 'الدعم والمساعدة' : 'Support & Help'}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                <p className="mb-4">{isRTL ? 'هل تحتاج مساعدة؟ فريقنا متاح لخدمتك!' : 'Need help? Our team is here to assist you!'}</p>
                <div className="flex flex-wrap gap-3">
                  <a href="tel:+201234567890" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-primary/10 transition-colors">
                    📞 {isRTL ? 'اتصل بنا' : 'Call Us'}
                  </a>
                  <a href="mailto:support@familyhome.com" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-primary/10 transition-colors">
                    ✉️ {isRTL ? 'راسلنا' : 'Email Us'}
                  </a>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
              <span className="gradient-text">
                {isRTL ? 'قد يعجبك أيضاً' : 'You May Also Like'}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Link to={`/product/${p.id}`}>
                    <ProductCard
                      product={p}
                      onAddToCart={handleRelatedAddToCart}
                      onQuickView={() => {}}
                      onToggleWishlist={() => toast.success(isRTL ? 'تم إضافة للمفضلة' : 'Added to wishlist')}
                      onToggleCompare={() => {}}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <FloatingContact />
      
      {/* Success Animation */}
      <AddToCartSuccess isVisible={showSuccess} onComplete={handleSuccessComplete} />
      
      {/* Image Zoom Modal */}
      <ImageZoomModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        images={productImages}
        initialIndex={selectedImage}
        productName={product.name[language]}
      />
    </div>
  );
};

export default ProductPage;
