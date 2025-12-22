import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Bell, LayoutDashboard, UserPlus, Heart, ChevronDown, Search, Package } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import CategoriesDropdown from './CategoriesDropdown';
import AuthModal from './AuthModal';
import MagneticIcon from './MagneticIcon';
import HeaderSparkles from './HeaderSparkles';
import SearchAutocomplete from './SearchAutocomplete';

import MobileBottomNav from './MobileBottomNav';
import logo from '@/assets/logo.png';

const Header = () => {
  const { t, isRTL, language } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const { totalItems, openCart } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const [prevWishlistItems, setPrevWishlistItems] = useState(wishlistItems);
  const [wishlistPulse, setWishlistPulse] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(2);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesSidebarOpen, setIsCategoriesSidebarOpen] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const brandName = language === 'ar' ? 'فاملي هوم' : 'Family Home';

  const navItems = [
    { key: 'header.home', href: '/' },
    { key: 'header.products', href: '/products' },
    { key: 'header.offers', href: '/offers' },
  ];

  const handleUserClick = () => {
    if (user) {
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isUserMenuOpen && !(e.target as Element).closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  // Wishlist pulse animation when items change
  useEffect(() => {
    if (wishlistItems > prevWishlistItems) {
      setWishlistPulse(true);
      const timeout = setTimeout(() => setWishlistPulse(false), 600);
      return () => clearTimeout(timeout);
    }
    setPrevWishlistItems(wishlistItems);
  }, [wishlistItems, prevWishlistItems]);

  return (
    <>
      {/* Magic Sparkles Effect */}
      <HeaderSparkles isActive={isHeaderHovered} />

      <header 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 glass-header"
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        <div className="container mx-auto px-4">
          {/* Desktop Header - Single Row */}
          <div className="hidden lg:flex items-center justify-between h-16 gap-6">
            {/* Left: Logo + Brand Name */}
            <motion.a 
              href="/" 
              className="flex items-center gap-3 flex-shrink-0 group min-w-fit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="relative flex-shrink-0"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={logo} 
                  alt="Family Home" 
                  className="h-10 w-10 rounded-xl object-cover"
                  style={{
                    boxShadow: '0 0 15px hsl(var(--primary) / 0.4)',
                  }}
                />
                {/* Glow ring on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: '0 0 25px hsl(var(--neon-cyan) / 0.5), 0 0 50px hsl(var(--neon-purple) / 0.3)',
                  }}
                />
              </motion.div>
              
              {/* Brand Name with Gradient */}
              <motion.span 
                className="font-display font-bold text-lg brand-gradient-text whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
              >
                {brandName}
              </motion.span>
            </motion.a>

            {/* Center: Nav Links */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {navItems.map((item) => (
                <motion.a
                  key={item.key}
                  href={item.href}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors relative group font-medium rounded-lg hover:bg-muted/30"
                  whileHover={{ y: -1 }}
                >
                  {t(item.key)}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-300 group-hover:w-3/4 rounded-full" />
                </motion.a>
              ))}
            </div>

            {/* Categories Dropdown + Wide Search Bar */}
            <div className="flex items-center gap-3 flex-1 max-w-2xl">
              <CategoriesDropdown isAllCategories />
              <SearchAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                className="flex-1"
              />
            </div>

            {/* Right: Action Icons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <ThemeToggle />
              <LanguageToggle />
              
              {/* Wishlist */}
              <a href="/wishlist">
                <MagneticIcon glowColor="pink" badge={wishlistItems} pulse={wishlistPulse}>
                  <Heart size={18} />
                </MagneticIcon>
              </a>

              {/* Notifications */}
              <MagneticIcon 
                glowColor="purple" 
                badge={notificationCount}
              >
                <Bell size={18} />
              </MagneticIcon>

              {/* Cart */}
              <MagneticIcon 
                onClick={openCart}
                glowColor="cyan"
                badge={totalItems}
              >
                <ShoppingCart size={18} />
              </MagneticIcon>

              {/* User */}
              <div className="relative user-menu-container">
                <MagneticIcon
                  onClick={handleUserClick}
                  glowColor="purple"
                  className={user ? 'ring-2 ring-primary/30 rounded-xl' : ''}
                >
                  <User size={18} />
                </MagneticIcon>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {user && isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-56 z-50 rounded-xl overflow-hidden backdrop-blur-2xl`}
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--card) / 0.95), hsl(var(--background) / 0.95))',
                        border: '1px solid hsl(var(--border) / 0.5)',
                        boxShadow: '0 8px 32px hsl(var(--primary) / 0.2), 0 0 60px hsl(var(--neon-cyan) / 0.1)',
                      }}
                    >
                      <div className="p-2">
                        <p className="px-3 py-2 text-sm text-muted-foreground truncate border-b border-border/50 mb-2">
                          {user.email}
                        </p>
                        
                        <a
                          href="/orders"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 text-foreground transition-colors"
                        >
                          <Package size={18} className="text-primary" />
                          <span>{isRTL ? 'طلباتي' : 'My Orders'}</span>
                        </a>
                        
                        {isAdmin && (
                          <a
                            href="/admin"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 text-foreground transition-colors"
                          >
                            <LayoutDashboard size={18} className="text-primary" />
                            <span>{isRTL ? 'لوحة التحكم' : 'Admin Dashboard'}</span>
                          </a>
                        )}
                        
                        <a
                          href="/marketer/register"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/10 text-foreground transition-colors"
                        >
                          <UserPlus size={18} className="text-secondary" />
                          <span>{isRTL ? 'انضم كمسوق' : 'Join as Marketer'}</span>
                        </a>

                        <button
                          onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive mt-2 transition-colors"
                        >
                          <X size={18} />
                          <span>{isRTL ? 'تسجيل الخروج' : 'Sign Out'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Tablet Header */}
          <div className="hidden md:flex lg:hidden flex-col">
            {/* Row 1: Logo, Categories, Search, Icons */}
            <div className="flex items-center justify-between h-14 gap-3">
              {/* Logo + Brand */}
              <motion.a 
                href="/" 
                className="flex items-center gap-2 flex-shrink-0 min-w-fit"
                whileTap={{ scale: 0.98 }}
              >
                <img 
                  src={logo} 
                  alt="Family Home" 
                  className="h-9 w-9 rounded-xl object-cover flex-shrink-0"
                  style={{ boxShadow: '0 0 12px hsl(var(--primary) / 0.3)' }}
                />
                <span className="font-display font-bold text-sm brand-gradient-text whitespace-nowrap">
                  {brandName}
                </span>
              </motion.a>

              {/* Categories Dropdown + Search */}
              <div className="flex items-center gap-2 flex-1 max-w-xl">
                <CategoriesDropdown isAllCategories />
                <SearchAutocomplete
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="flex-1"
                />
              </div>

              {/* Icons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <ThemeToggle />
                <LanguageToggle />
                <MagneticIcon onClick={openCart} glowColor="cyan" badge={totalItems}>
                  <ShoppingCart size={18} />
                </MagneticIcon>
                <MagneticIcon onClick={handleUserClick} glowColor="purple" className={user ? 'ring-2 ring-primary/30 rounded-xl' : ''}>
                  <User size={18} />
                </MagneticIcon>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden">
            {/* Row 1: Logo + Brand center, toggles on sides */}
            <div className="flex items-center justify-between h-14 gap-2">
              {/* Left - Toggles */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <ThemeToggle />
                <LanguageToggle />
              </div>

              {/* Center - Logo + Brand */}
              <motion.a 
                href="/" 
                className="flex items-center gap-1.5 flex-shrink min-w-0"
                whileTap={{ scale: 0.98 }}
              >
                <img 
                  src={logo} 
                  alt="Family Home" 
                  className="h-8 w-8 rounded-xl object-cover flex-shrink-0"
                  style={{ boxShadow: '0 0 10px hsl(var(--primary) / 0.3)' }}
                />
                <span className="font-display font-bold text-xs sm:text-sm brand-gradient-text whitespace-nowrap truncate max-w-[100px] sm:max-w-none">
                  {brandName}
                </span>
              </motion.a>

              {/* Right - Menu */}
              <motion.button
                className="p-2 rounded-xl glass glass-hover"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.button>
            </div>

            {/* Row 2: Search & Categories - Slim */}
            <div className="flex items-center gap-2 pb-2">
              {/* Categories Button */}
              <motion.button
                onClick={() => setIsCategoriesSidebarOpen(true)}
                className="flex items-center gap-1 px-3 py-2 rounded-full glass glass-hover border border-primary/20 text-xs font-medium whitespace-nowrap"
                whileTap={{ scale: 0.98 }}
              >
                <span>{isRTL ? 'الأقسام' : 'Categories'}</span>
                <ChevronDown size={12} />
              </motion.button>

              {/* Search - Expandable on mobile */}
              <AnimatePresence mode="wait">
                {mobileSearchOpen ? (
                  <motion.div 
                    key="expanded"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="flex-1"
                  >
                    <SearchAutocomplete
                      value={searchQuery}
                      onChange={setSearchQuery}
                      onClose={() => setMobileSearchOpen(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1"
                  >
                    <button
                      onClick={() => setMobileSearchOpen(true)}
                      className="w-full search-pill flex items-center gap-2 px-3 py-2"
                    >
                      <Search className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm text-muted-foreground">{t('header.search')}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden glass border-t border-border/30"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    className="block py-3 px-4 rounded-xl hover:bg-muted/50 transition-colors font-medium"
                  >
                    {t(item.key)}
                  </a>
                ))}

                {isAdmin && (
                  <a
                    href="/admin"
                    className="flex items-center gap-3 py-3 px-4 rounded-xl bg-primary/10 border border-primary/30 font-medium"
                  >
                    <LayoutDashboard size={18} className="text-primary" />
                    <span>{isRTL ? 'لوحة التحكم' : 'Admin Dashboard'}</span>
                  </a>
                )}

                <a
                  href="/marketer/register"
                  className="flex items-center gap-3 py-3 px-4 rounded-xl bg-secondary/10 border border-secondary/30 font-medium"
                >
                  <UserPlus size={18} className="text-secondary" />
                  <span>{isRTL ? 'انضم كمسوق' : 'Join as Marketer'}</span>
                </a>

                {!user ? (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-neon text-primary-foreground font-medium"
                  >
                    <User size={18} />
                    <span>{isRTL ? 'تسجيل الدخول' : 'Sign In'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/20 border border-destructive/30 text-destructive font-medium"
                  >
                    <X size={18} />
                    <span>{isRTL ? 'تسجيل الخروج' : 'Sign Out'}</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Categories Sidebar */}
      <AnimatePresence>
        {isCategoriesSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
              onClick={() => setIsCategoriesSidebarOpen(false)}
            />
            
            <motion.div
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-80 max-w-[85vw] z-[70] glass-header`}
            >
              <div className="p-4 border-b border-border/30 flex items-center justify-between">
                <h2 className="font-display font-bold text-lg">{t('header.categories')}</h2>
                <button
                  onClick={() => setIsCategoriesSidebarOpen(false)}
                  className="p-2 rounded-xl glass glass-hover"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
                <CategoriesDropdown isSidebar onSelect={() => setIsCategoriesSidebarOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        onSearchClick={() => setMobileSearchOpen(true)}
        onUserClick={handleUserClick}
        onCartClick={openCart}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Spacer for fixed header + bottom nav on mobile */}
      <div className="h-[120px] md:h-[80px] lg:h-16" />
    </>
  );
};

export default Header;
