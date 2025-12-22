import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Palette, 
  Settings, 
  Home,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { isRTL } = useLanguage();

  const menuItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: isRTL ? 'لوحة التحكم' : 'Overview',
    },
    {
      path: '/admin/orders',
      icon: ShoppingCart,
      label: isRTL ? 'الطلبات' : 'Orders',
    },
    {
      path: '/admin/products',
      icon: Package,
      label: isRTL ? 'المنتجات' : 'Products',
    },
    {
      path: '/admin/design',
      icon: Palette,
      label: isRTL ? 'إعدادات التصميم' : 'Design Settings',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <aside className="w-64 min-h-screen bg-card border-e border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-text">
            {isRTL ? 'لوحة الإدارة' : 'Admin Panel'}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <motion.div
              whileHover={{ x: isRTL ? -4 : 4 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isActive(item.path) && (
                <ChevronRight className={`w-4 h-4 ms-auto ${isRTL ? 'rotate-180' : ''}`} />
              )}
            </motion.div>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Link to="/">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Home className="w-4 h-4" />
            {isRTL ? 'العودة للمتجر' : 'Back to Store'}
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" />
          {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
