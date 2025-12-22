import { useState, useRef } from 'react';
import { motion, useScroll, Variants, Easing } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { PRODUCTS } from '@/data/mockData';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './skeletons/ProductCardSkeleton';
import AddToCartSuccess from './AddToCartSuccess';
import { toast } from 'sonner';
import { Product } from '@/types/store';

const easeOut: Easing = [0.22, 1, 0.36, 1];

const FeaturedProducts = () => {
  const { t, isRTL } = useLanguage();
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Parallax for section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Enhanced 3D fade-in animation for cards
  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateX: 15,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setShowSuccess(true);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    openCart();
  };

  const handleQuickView = (product: Product) => {
    toast.info(isRTL ? `عرض سريع: ${product.name.ar}` : `Quick view: ${product.name.en}`);
  };

  const handleToggleWishlist = (product: Product) => {
    toggleWishlist(product);
    const inWishlist = isInWishlist(product.id);
    toast.success(
      inWishlist 
        ? (isRTL ? `تم إزالة ${product.name.ar} من المفضلة` : `${product.name.en} removed from wishlist`)
        : (isRTL ? `تم إضافة ${product.name.ar} للمفضلة` : `${product.name.en} added to wishlist`)
    );
  };

  const handleToggleCompare = (product: Product) => {
    toast.success(isRTL ? `تم إضافة ${product.name.ar} للمقارنة` : `${product.name.en} added to compare`);
  };

  return (
    <section ref={sectionRef} className="py-20 relative" style={{ perspective: '1200px' }}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center md:text-start mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              <span className="gradient-text">{t('product.featured')}</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('hero.description').slice(0, 60)}...
            </p>
          </div>

          <motion.a
            href="/products"
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-primary/30 hover:border-primary/60 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('categories.viewAll')}
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </motion.a>
        </motion.div>

        {/* Products Grid with 3D Perspective */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {isLoading
            ? [...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : PRODUCTS.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard
                    product={product}
                    isInWishlist={isInWishlist(product.id)}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    onToggleWishlist={handleToggleWishlist}
                    onToggleCompare={handleToggleCompare}
                  />
                </motion.div>
              ))}
        </motion.div>
      </div>

      {/* Success Animation */}
      <AddToCartSuccess isVisible={showSuccess} onComplete={handleSuccessComplete} />
    </section>
  );
};

export default FeaturedProducts;