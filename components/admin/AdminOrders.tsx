import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Truck, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  customer_address: string;
  total_price: number;
  order_status: string;
  payment_status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-500',
  processing: 'bg-yellow-500/20 text-yellow-500',
  shipped: 'bg-purple-500/20 text-purple-500',
  delivered: 'bg-green-500/20 text-green-500',
  cancelled: 'bg-red-500/20 text-red-500',
};

const statusIcons: Record<string, React.ElementType> = {
  new: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحميل الطلبات' : 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, order_status: newStatus } : order
      ));

      toast({
        title: isRTL ? 'تم التحديث' : 'Updated',
        description: isRTL ? 'تم تحديث حالة الطلب' : 'Order status updated',
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحديث الطلب' : 'Failed to update order',
        variant: 'destructive',
      });
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      new: { en: 'New', ar: 'جديد' },
      processing: { en: 'Processing', ar: 'قيد المعالجة' },
      shipped: { en: 'Shipped', ar: 'تم الشحن' },
      delivered: { en: 'Delivered', ar: 'تم التوصيل' },
      cancelled: { en: 'Cancelled', ar: 'ملغي' },
    };
    return labels[status]?.[isRTL ? 'ar' : 'en'] || status;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-neon p-6 animate-pulse">
            <div className="h-4 w-full bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {isRTL ? 'إدارة الطلبات' : 'Orders Management'}
        </h1>
        <p className="text-muted-foreground">
          {isRTL ? `${orders.length} طلب` : `${orders.length} orders`}
        </p>
      </div>

      <div className="card-neon overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{isRTL ? 'رقم الطلب' : 'Order ID'}</TableHead>
              <TableHead>{isRTL ? 'العميل' : 'Customer'}</TableHead>
              <TableHead>{isRTL ? 'الهاتف' : 'Phone'}</TableHead>
              <TableHead>{isRTL ? 'المجموع' : 'Total'}</TableHead>
              <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
              <TableHead>{isRTL ? 'التاريخ' : 'Date'}</TableHead>
              <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {isRTL ? 'لا توجد طلبات' : 'No orders found'}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => {
                const StatusIcon = statusIcons[order.order_status] || Clock;
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <TableCell className="font-mono text-sm">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.customer_phone}</TableCell>
                    <TableCell className="font-bold">
                      {order.total_price.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.order_status]}>
                        <StatusIcon className="w-3 h-3 me-1" />
                        {getStatusLabel(order.order_status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.order_status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">{getStatusLabel('new')}</SelectItem>
                          <SelectItem value="processing">{getStatusLabel('processing')}</SelectItem>
                          <SelectItem value="shipped">{getStatusLabel('shipped')}</SelectItem>
                          <SelectItem value="delivered">{getStatusLabel('delivered')}</SelectItem>
                          <SelectItem value="cancelled">{getStatusLabel('cancelled')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
