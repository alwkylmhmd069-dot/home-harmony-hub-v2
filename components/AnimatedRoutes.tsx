import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import CategoryPage from '@/pages/CategoryPage';
import ProductPage from '@/pages/ProductPage';
import WishlistPage from '@/pages/WishlistPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderHistoryPage from '@/pages/OrderHistoryPage';
import Auth from '@/pages/Auth';
import AdminLayout from '@/pages/AdminLayout';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/category/:categoryId" element={<PageTransition><CategoryPage /></PageTransition>} />
        <Route path="/product/:productId" element={<PageTransition><ProductPage /></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><WishlistPage /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
        <Route path="/orders" element={<PageTransition><OrderHistoryPage /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminLayout /></PageTransition>} />
        <Route path="/admin/orders" element={<PageTransition><AdminLayout /></PageTransition>} />
        <Route path="/admin/products" element={<PageTransition><AdminLayout /></PageTransition>} />
        <Route path="/admin/design" element={<PageTransition><AdminLayout /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
