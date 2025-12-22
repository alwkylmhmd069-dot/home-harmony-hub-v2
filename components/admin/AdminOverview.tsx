import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isRTL } = useLanguage();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_price, order_status');

      const totalOrders = ordersData?.length || 0;
      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;
      const pendingOrders = ordersData?.filter(o => o.order_status === 'new' || o.order_status === 'processing').length || 0;

      setStats({
        totalProducts: productsCount || 0,
        totalOrders,
        totalRevenue,
        pendingOrders,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: isRTL ? 'إجمالي المنتجات' : 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: isRTL ? 'إجمالي الطلبات' : 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: isRTL ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: `${stats.totalRevenue.toLocaleString()} ${isRTL ? 'ج.م' : 'EGP'}`,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      trend: '+15%',
      trendUp: true,
    },
    {
      title: isRTL ? 'الطلبات المعلقة' : 'Pending Orders',
      value: stats.pendingOrders,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      trend: '-3%',
      trendUp: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card-neon p-6 animate-pulse">
            <div className="h-12 w-12 rounded-xl bg-muted mb-4" />
            <div className="h-4 w-24 bg-muted rounded mb-2" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {isRTL ? 'لوحة التحكم' : 'Dashboard Overview'}
        </h1>
        <p className="text-muted-foreground">
          {isRTL ? 'مرحباً بك في لوحة تحكم المتجر' : 'Welcome to your store dashboard'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-neon p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card-neon p-6">
        <h2 className="text-xl font-bold mb-4">
          {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
        </h2>
        <div className="text-center text-muted-foreground py-8">
          {isRTL ? 'لا يوجد نشاط حديث' : 'No recent activity'}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
