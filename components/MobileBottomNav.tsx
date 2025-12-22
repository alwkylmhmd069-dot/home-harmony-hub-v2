import { motion } from 'framer-motion';
import { Home, Search, ShoppingCart, User, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';

interface MobileBottomNavProps {
  onSearchClick: () => void;
  onUserClick: () => void;
  onCartClick: () => void;
}

const MobileBottomNav = ({ onSearchClick, onUserClick, onCartClick }: MobileBottomNavProps) => {
  const { isRTL } = useLanguage();
  const { totalItems } = useCart();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: isRTL ? 'الرئيسية' : 'Home', href: '/', action: undefined },
    { icon: Search, label: isRTL ? 'بحث' : 'Search', href: undefined, action: onSearchClick },
    { icon: Heart, label: isRTL ? 'المفضلة' : 'Wishlist', href: '/wishlist', action: undefined },
    { icon: ShoppingCart, label: isRTL ? 'السلة' : 'Cart', href: undefined, action: onCartClick, badge: totalItems },
    { icon: User, label: isRTL ? 'حسابي' : 'Profile', href: undefined, action: onUserClick, active: !!user },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-bottom-nav safe-area-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          
          const content = (
            <motion.div
              className="relative flex flex-col items-center justify-center gap-0.5 p-2 rounded-xl min-w-[56px]"
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
            >
              {/* Glow effect on hover/active */}
              <div className={`relative ${item.active ? 'text-primary' : 'text-muted-foreground'}`}>
                <Icon size={20} className="relative z-10 transition-colors duration-200" />
                
                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground z-20"
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </motion.span>
                )}
              </div>
              
              <span className={`text-[10px] font-medium ${item.active ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
              
              {/* Active indicator glow */}
              {item.active && (
                <motion.div
                  layoutId="activeNavGlow"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  style={{
                    boxShadow: '0 0 15px hsl(var(--primary) / 0.3)',
                  }}
                />
              )}
            </motion.div>
          );

          if (item.href) {
            return (
              <a key={index} href={item.href} className="flex-1 flex justify-center">
                {content}
              </a>
            );
          }

          return (
            <button
              key={index}
              onClick={item.action}
              className="flex-1 flex justify-center"
            >
              {content}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
