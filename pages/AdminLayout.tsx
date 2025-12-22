import { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminDesignSettings from '@/components/admin/AdminDesignSettings';

const AdminLayout = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isRTL } = useLanguage();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  // Determine which component to render based on the path
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === '/admin') return <AdminOverview />;
    if (path === '/admin/orders') return <AdminOrders />;
    if (path === '/admin/products') return <AdminProducts />;
    if (path === '/admin/design') return <AdminDesignSettings />;
    
    return <AdminOverview />;
  };

  return (
    <div className={`min-h-screen bg-background flex ${isRTL ? 'flex-row-reverse' : ''}`}>
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminLayout;
