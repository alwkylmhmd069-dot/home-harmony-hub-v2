import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Truck } from 'lucide-react';
import { useCart, FREE_SHIPPING } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { language, isRTL } = useLanguage();

  const shippingProgress = Math.min((totalPrice / FREE_SHIPPING) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING - totalPrice, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-md z-[101] flex flex-col`}
            style={{
              background: 'linear-gradient(135deg, hsl(var(--card) / 0.95), hsl(var(--background) / 0.98))',
              backdropFilter: 'blur(24px)',
              borderLeft: isRTL ? 'none' : '1px solid hsl(var(--border) / 0.3)',
              borderRight: isRTL ? '1px solid hsl(var(--border) / 0.3)' : 'none',
              boxShadow: '0 0 60px hsl(var(--neon-purple) / 0.2)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="font-display font-bold text-xl">
                  {isRTL ? 'سلة التسوق' : 'Shopping Cart'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-sm font-bold">
                  {totalItems}
                </span>
              </div>
              <motion.button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Free Shipping Progress */}
            <div className="px-6 py-4 border-b border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Truck className={`w-4 h-4 ${shippingProgress >= 100 ? 'text-secondary' : 'text-muted-foreground'}`} />
                <span className="text-sm">
                  {shippingProgress >= 100 ? (
                    <span className="text-secondary font-medium">
                      {isRTL ? '🎉 تهانينا! الشحن مجاني' : '🎉 Congrats! Free shipping unlocked'}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      {isRTL
                        ? `أضف ${remainingForFreeShipping.toLocaleString()} ج.م للشحن المجاني`
                        : `Add ${remainingForFreeShipping.toLocaleString()} EGP for free shipping`}
                    </span>
                  )}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${shippingProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{
                    background: shippingProgress >= 100
                      ? 'linear-gradient(90deg, hsl(var(--secondary)), hsl(var(--neon-cyan)))'
                      : 'var(--gradient-neon)',
                  }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      {isRTL ? 'سلة التسوق فارغة' : 'Your cart is empty'}
                    </p>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRTL ? 100 : -100, height: 0, marginBottom: 0 }}
                      transition={{ type: 'spring', damping: 20 }}
                      className="flex gap-4 p-4 rounded-xl glass border border-border/30"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name[language]}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">
                          {item.product.name[language]}
                        </h3>
                        <p className="text-primary font-bold">
                          {item.product.price.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <motion.button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus className="w-3 h-3" />
                          </motion.button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <motion.button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors self-start"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border/30 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {isRTL ? 'المجموع الفرعي' : 'Subtotal'}
                  </span>
                  <span className="font-bold text-lg">
                    {totalPrice.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}
                  </span>
                </div>

                {/* Checkout Button */}
                <motion.button
                  className="w-full py-4 rounded-xl btn-neon text-primary-foreground font-bold text-lg btn-hover-pulse"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isRTL ? 'إتمام الطلب' : 'Proceed to Checkout'}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
