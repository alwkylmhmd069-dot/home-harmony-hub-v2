import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, ArrowRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';

// Mock order data
const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-12-20',
    total: 1250,
    status: 'delivered',
    items: [
      { name: { en: 'Premium Cookware Set', ar: 'طقم أواني طهي فاخر' }, quantity: 1, price: 850 },
      { name: { en: 'Kitchen Towels Pack', ar: 'عبوة مناشف مطبخ' }, quantity: 2, price: 200 },
    ],
  },
  {
    id: 'ORD-2024-002',
    date: '2024-12-18',
    total: 3500,
    status: 'shipped',
    items: [
      { name: { en: 'Smart Blender Pro', ar: 'خلاط ذكي برو' }, quantity: 1, price: 2500 },
      { name: { en: 'Glass Food Containers', ar: 'حاويات طعام زجاجية' }, quantity: 3, price: 1000 },
    ],
  },
  {
    id: 'ORD-2024-003',
    date: '2024-12-15',
    total: 750,
    status: 'pending',
    items: [
      { name: { en: 'Ceramic Plates Set', ar: 'طقم أطباق سيراميك' }, quantity: 1, price: 750 },
    ],
  },
  {
    id: 'ORD-2024-004',
    date: '2024-12-10',
    total: 450,
    status: 'cancelled',
    items: [
      { name: { en: 'Stainless Steel Cutlery', ar: 'أدوات مائدة ستانلس ستيل' }, quantity: 1, price: 450 },
    ],
  },
];

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    label: { en: 'Pending', ar: 'قيد الانتظار' },
  },
  shipped: {
    icon: Truck,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    label: { en: 'Shipped', ar: 'تم الشحن' },
  },
  delivered: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    label: { en: 'Delivered', ar: 'تم التوصيل' },
  },
  cancelled: {
    icon: XCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/30',
    label: { en: 'Cancelled', ar: 'ملغي' },
  },
};

const OrderHistoryPage = () => {
  const { language, isRTL, t } = useLanguage();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                {isRTL ? 'الرئيسية' : 'Home'}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">
              {isRTL ? 'طلباتي' : 'My Orders'}
            </li>
          </ol>
        </nav>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            <span className="gradient-text">
              {isRTL ? 'طلباتي' : 'My Orders'}
            </span>
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'تتبع جميع طلباتك ومشترياتك السابقة' : 'Track all your orders and past purchases'}
          </p>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-4">
          {mockOrders.map((order, index) => {
            const status = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-neon p-6"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl glass">
                      <Package size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bgColor} border ${status.borderColor}`}>
                    <StatusIcon size={18} className={status.color} />
                    <span className={`font-medium ${status.color}`}>
                      {status.label[language]}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm">{item.quantity}x</span>
                        <span className="font-medium">{item.name[language]}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {item.price.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div>
                    <span className="text-muted-foreground text-sm">
                      {isRTL ? 'الإجمالي:' : 'Total:'}
                    </span>
                    <span className="font-bold text-lg gradient-text mx-2">
                      {order.total.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                  
                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-primary/10 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isRTL ? 'عرض التفاصيل' : 'View Details'}
                    {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {mockOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Package size={64} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">
              {isRTL ? 'لا توجد طلبات بعد' : 'No orders yet'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isRTL ? 'ابدأ التسوق الآن واكتشف منتجاتنا المميزة' : 'Start shopping now and discover our amazing products'}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 btn-neon px-6 py-3 rounded-xl font-semibold text-primary-foreground"
            >
              {isRTL ? 'تسوق الآن' : 'Shop Now'}
            </Link>
          </motion.div>
        )}
      </main>

      <Footer />
      <FloatingContact />
    </div>
  );
};

export default OrderHistoryPage;
