import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  price: number;
  old_price: number | null;
  stock: number;
  is_active: boolean | null;
  is_new: boolean | null;
  image_url: string | null;
  sku: string | null;
  category_id: string | null;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    price: '',
    old_price: '',
    stock: '',
    is_active: true,
    is_new: false,
    image_url: '',
    sku: '',
  });
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحميل المنتجات' : 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name_en: formData.name_en,
      name_ar: formData.name_ar,
      description_en: formData.description_en || null,
      description_ar: formData.description_ar || null,
      price: parseFloat(formData.price) || 0,
      old_price: formData.old_price ? parseFloat(formData.old_price) : null,
      stock: parseInt(formData.stock) || 0,
      is_active: formData.is_active,
      is_new: formData.is_new,
      image_url: formData.image_url || null,
      sku: formData.sku || null,
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast({
          title: isRTL ? 'تم التحديث' : 'Updated',
          description: isRTL ? 'تم تحديث المنتج بنجاح' : 'Product updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
        toast({
          title: isRTL ? 'تمت الإضافة' : 'Added',
          description: isRTL ? 'تم إضافة المنتج بنجاح' : 'Product added successfully',
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حفظ المنتج' : 'Failed to save product',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      
      toast({
        title: isRTL ? 'تم الحذف' : 'Deleted',
        description: isRTL ? 'تم حذف المنتج' : 'Product deleted',
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حذف المنتج' : 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name_en: product.name_en,
      name_ar: product.name_ar,
      description_en: product.description_en || '',
      description_ar: product.description_ar || '',
      price: String(product.price),
      old_price: product.old_price ? String(product.old_price) : '',
      stock: String(product.stock),
      is_active: product.is_active ?? true,
      is_new: product.is_new ?? false,
      image_url: product.image_url || '',
      sku: product.sku || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name_en: '',
      name_ar: '',
      description_en: '',
      description_ar: '',
      price: '',
      old_price: '',
      stock: '',
      is_active: true,
      is_new: false,
      image_url: '',
      sku: '',
    });
  };

  const filteredProducts = products.filter(product =>
    product.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name_ar.includes(searchQuery) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {isRTL ? 'إدارة المنتجات' : 'Products Management'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? `${products.length} منتج` : `${products.length} products`}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="btn-neon text-primary-foreground">
              <Plus className="w-4 h-4 me-2" />
              {isRTL ? 'إضافة منتج' : 'Add Product'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct 
                  ? (isRTL ? 'تعديل المنتج' : 'Edit Product')
                  : (isRTL ? 'إضافة منتج جديد' : 'Add New Product')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}</Label>
                  <Input
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    required
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
                  <Textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
                  <Textarea
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{isRTL ? 'السعر' : 'Price'}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'السعر القديم' : 'Old Price'}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.old_price}
                    onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'المخزون' : 'Stock'}</Label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isRTL ? 'رابط الصورة' : 'Image URL'}</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'رمز المنتج (SKU)' : 'SKU'}</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>{isRTL ? 'نشط' : 'Active'}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_new}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                  />
                  <Label>{isRTL ? 'جديد' : 'New'}</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button type="submit" className="btn-neon text-primary-foreground">
                  {editingProduct 
                    ? (isRTL ? 'تحديث' : 'Update')
                    : (isRTL ? 'إضافة' : 'Add')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-muted-foreground`} />
        <Input
          placeholder={isRTL ? 'بحث عن منتج...' : 'Search products...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={isRTL ? 'pr-10' : 'pl-10'}
        />
      </div>

      {/* Products Table */}
      <div className="card-neon overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{isRTL ? 'الصورة' : 'Image'}</TableHead>
              <TableHead>{isRTL ? 'المنتج' : 'Product'}</TableHead>
              <TableHead>{isRTL ? 'SKU' : 'SKU'}</TableHead>
              <TableHead>{isRTL ? 'السعر' : 'Price'}</TableHead>
              <TableHead>{isRTL ? 'المخزون' : 'Stock'}</TableHead>
              <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
              <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {isRTL ? 'لا توجد منتجات' : 'No products found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <TableCell>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name_en}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Image className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{isRTL ? product.name_ar : product.name_en}</p>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? product.name_en : product.name_ar}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{product.sku || '-'}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold">{product.price.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}</p>
                      {product.old_price && (
                        <p className="text-sm text-muted-foreground line-through">
                          {product.old_price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {product.is_active && (
                        <Badge variant="outline" className="bg-green-500/20 text-green-500">
                          {isRTL ? 'نشط' : 'Active'}
                        </Badge>
                      )}
                      {product.is_new && (
                        <Badge variant="outline" className="bg-blue-500/20 text-blue-500">
                          {isRTL ? 'جديد' : 'New'}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProducts;
