import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';
import { toast } from 'sonner';

const WishlistPage = () => {
  const { t, isRTL, language } = useLanguage();
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product);
    toast.success(isRTL ? `تم إضافة ${product.name.ar} للسلة` : `${product.name.en} added to cart`);
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    toast.success(isRTL ? 'تم الإزالة من المفضلة' : 'Removed from wishlist');
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8 pt-28">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.div
              className="p-3 rounded-2xl glass"
              style={{ boxShadow: '0 0 20px hsl(var(--neon-purple) / 0.3)' }}
            >
              <Heart size={28} className="text-pink-500 fill-pink-500" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {isRTL ? 'قائمة المفضلة' : 'My Wishlist'}
              </h1>
              <p className="text-muted-foreground">
                {items.length} {isRTL ? 'منتجات' : 'items'}
              </p>
            </div>
          </div>
          
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary hover:underline"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isRTL ? 'العودة للتسوق' : 'Continue Shopping'}
          </Link>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              className="p-6 rounded-full glass mb-6"
              animate={{ 
                boxShadow: [
                  '0 0 20px hsl(var(--neon-purple) / 0.3)',
                  '0 0 40px hsl(var(--neon-cyan) / 0.3)',
                  '0 0 20px hsl(var(--neon-purple) / 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart size={48} className="text-muted-foreground" />
            </motion.div>
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'قائمة المفضلة فارغة' : 'Your wishlist is empty'}
            </h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              {isRTL 
                ? 'اكتشف منتجاتنا الرائعة وأضف ما يعجبك لقائمة المفضلة' 
                : 'Explore our amazing products and add your favorites here'}
            </p>
            <Link 
              to="/"
              className="btn-neon px-8 py-3 rounded-xl font-semibold text-primary-foreground"
            >
              {isRTL ? 'تصفح المنتجات' : 'Browse Products'}
            </Link>
          </motion.div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {items.map((product) => {
                const discount = product.oldPrice 
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
                  : 0;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.5, 
                      rotate: -10,
                      transition: { duration: 0.3 }
                    }}
                    className="card-neon rounded-2xl overflow-hidden group"
                  >
                    {/* Image */}
                    <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name[language]}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && (
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground text-xs font-bold">
                            {isRTL ? 'جديد' : 'New'}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground text-xs font-bold">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        onClick={(e) => { e.preventDefault(); handleRemove(product.id); }}
                        className="absolute top-3 right-3 p-2 rounded-full glass hover:bg-destructive/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={18} className="text-destructive" />
                      </motion.button>
                    </Link>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                          {product.name[language]}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold gradient-text">
                          {product.price.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <motion.button
                        onClick={() => handleAddToCart(product)}
                        className="w-full btn-neon py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-primary-foreground"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ShoppingCart size={18} />
                        {isRTL ? 'أضف للسلة' : 'Add to Cart'}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
      <FloatingContact />
    </div>
  );
};

export default WishlistPage;
