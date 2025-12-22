import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, CreditCard, DollarSign, Smartphone, 
  ArrowLeft, ArrowRight, Check, MapPin, User, Phone, Mail,
  Package, ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutSuccess from '@/components/CheckoutSuccess';
import { toast } from 'sonner';

type Step = 1 | 2 | 3;
type PaymentMethod = 'cod' | 'card' | 'instapay';

interface ShippingDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
}

const CheckoutPage = () => {
  const { t, isRTL, language } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shipping, setShipping] = useState<ShippingDetails>({
    name: user?.email?.split('@')[0] || '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    notes: '',
  });

  const shippingCost = totalPrice >= 500 ? 0 : 50;
  const grandTotal = totalPrice + shippingCost;

  const steps = [
    { num: 1, label: isRTL ? 'الشحن' : 'Shipping', icon: Truck },
    { num: 2, label: isRTL ? 'الدفع' : 'Payment', icon: CreditCard },
    { num: 3, label: isRTL ? 'التأكيد' : 'Confirm', icon: Check },
  ];

  const paymentMethods = [
    { id: 'cod' as const, label: isRTL ? 'الدفع عند الاستلام' : 'Cash on Delivery', icon: DollarSign },
    { id: 'card' as const, label: isRTL ? 'بطاقة ائتمان' : 'Credit Card', icon: CreditCard },
    { id: 'instapay' as const, label: 'InstaPay', icon: Smartphone },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!shipping.name || !shipping.phone || !shipping.address || !shipping.city) {
        toast.error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3) as Step);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowSuccess(true);
  };

  const handleSuccessComplete = () => {
    clearCart();
    navigate('/');
  };

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
        <Header />
        <main className="container mx-auto px-4 py-20 text-center pt-28">
          <Package size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">
            {isRTL ? 'سلة التسوق فارغة' : 'Your cart is empty'}
          </h1>
          <Link to="/" className="btn-neon px-8 py-3 rounded-xl inline-block text-primary-foreground">
            {isRTL ? 'تصفح المنتجات' : 'Browse Products'}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8 pt-28">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.num;
            const isCurrent = currentStep === step.num;
            
            return (
              <div key={step.num} className="flex items-center">
                <motion.div
                  className={`flex flex-col items-center gap-2 ${isCurrent ? 'scale-110' : ''}`}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground' 
                        : 'glass border border-border/50 text-muted-foreground'
                    }`}
                    style={isActive ? { boxShadow: '0 0 20px hsl(var(--neon-cyan) / 0.5)' } : {}}
                  >
                    <Icon size={22} />
                  </motion.div>
                  <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </motion.div>
                
                {idx < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-colors ${
                    currentStep > step.num ? 'bg-primary' : 'bg-border/50'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  className="card-neon p-6 md:p-8 rounded-2xl"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Truck className="text-primary" />
                    {isRTL ? 'تفاصيل الشحن' : 'Shipping Details'}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        {isRTL ? 'الاسم الكامل' : 'Full Name'} *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                          type="text"
                          value={shipping.name}
                          onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-transparent"
                          style={{ boxShadow: '0 0 10px hsl(var(--primary) / 0.1)' }}
                          placeholder={isRTL ? 'أدخل اسمك' : 'Enter your name'}
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        {isRTL ? 'رقم الهاتف' : 'Phone Number'} *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                          type="tel"
                          value={shipping.phone}
                          onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-transparent"
                          placeholder="01XXXXXXXXX"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        {isRTL ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                          type="email"
                          value={shipping.email}
                          onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-transparent"
                          placeholder={isRTL ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        {isRTL ? 'العنوان التفصيلي' : 'Detailed Address'} *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-4 text-muted-foreground" size={18} />
                        <textarea
                          value={shipping.address}
                          onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                          rows={3}
                          className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-transparent resize-none"
                          placeholder={isRTL ? 'المنطقة، الشارع، رقم المبنى، الشقة' : 'Area, Street, Building number, Apartment'}
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        {isRTL ? 'المدينة' : 'City'} *
                      </label>
                      <select
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl glass border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-transparent"
                      >
                        <option value="">{isRTL ? 'اختر المدينة' : 'Select City'}</option>
                        <option value="cairo">{isRTL ? 'القاهرة' : 'Cairo'}</option>
                        <option value="giza">{isRTL ? 'الجيزة' : 'Giza'}</option>
                        <option value="alexandria">{isRTL ? 'الإسكندرية' : 'Alexandria'}</option>
                        <option value="other">{isRTL ? 'أخرى' : 'Other'}</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        {isRTL ? 'ملاحظات' : 'Notes'}
                      </label>
                      <input
                        type="text"
                        value={shipping.notes}
                        onChange={(e) => setShipping({ ...shipping, notes: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl glass border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-transparent"
                        placeholder={isRTL ? 'ملاحظات إضافية (اختياري)' : 'Additional notes (optional)'}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  className="card-neon p-6 md:p-8 rounded-2xl"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <CreditCard className="text-primary" />
                    {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                  </h2>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const isSelected = paymentMethod === method.id;

                      return (
                        <motion.button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border/50 glass hover:border-primary/50'
                          }`}
                          style={isSelected ? { boxShadow: '0 0 20px hsl(var(--primary) / 0.3)' } : {}}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className={`p-3 rounded-full ${isSelected ? 'bg-primary text-primary-foreground' : 'glass'}`}>
                            <Icon size={24} />
                          </div>
                          <span className="font-medium text-lg">{method.label}</span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto"
                            >
                              <Check className="text-primary" size={24} />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Payment Info */}
                  {paymentMethod === 'instapay' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-4 rounded-xl glass border border-border/50"
                    >
                      <p className="text-sm text-muted-foreground">
                        {isRTL 
                          ? 'سيتم إرسال تفاصيل الدفع عبر InstaPay بعد تأكيد الطلب'
                          : 'InstaPay payment details will be sent after order confirmation'}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  className="card-neon p-6 md:p-8 rounded-2xl"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Check className="text-primary" />
                    {isRTL ? 'مراجعة الطلب' : 'Review Order'}
                  </h2>

                  {/* Shipping Summary */}
                  <div className="p-4 rounded-xl glass border border-border/50 mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Truck size={18} className="text-secondary" />
                      {isRTL ? 'عنوان الشحن' : 'Shipping Address'}
                    </h3>
                    <p className="text-muted-foreground">{shipping.name}</p>
                    <p className="text-muted-foreground">{shipping.phone}</p>
                    <p className="text-muted-foreground">{shipping.address}</p>
                    <p className="text-muted-foreground">{shipping.city}</p>
                  </div>

                  {/* Payment Summary */}
                  <div className="p-4 rounded-xl glass border border-border/50 mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CreditCard size={18} className="text-secondary" />
                      {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                    </h3>
                    <p className="text-muted-foreground">
                      {paymentMethods.find(m => m.id === paymentMethod)?.label}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-4 p-3 rounded-xl glass">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name[language]}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.product.name[language]}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × {item.product.price.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}
                          </p>
                        </div>
                        <span className="font-semibold">
                          {(item.product.price * item.quantity).toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              {currentStep > 1 ? (
                <motion.button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-border/50 hover:border-primary transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                  {isRTL ? 'السابق' : 'Back'}
                </motion.button>
              ) : (
                <Link 
                  to="/"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                  {isRTL ? 'العودة للتسوق' : 'Continue Shopping'}
                </Link>
              )}

              {currentStep < 3 ? (
                <motion.button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl btn-neon font-semibold text-primary-foreground"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isRTL ? 'التالي' : 'Next'}
                  {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </motion.button>
              ) : (
                <motion.button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl btn-neon font-semibold text-primary-foreground disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                      {isRTL ? 'جاري الإرسال...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      {isRTL ? 'تأكيد الطلب' : 'Place Order'}
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-neon p-6 rounded-2xl sticky top-28">
              <h3 className="text-lg font-bold mb-4">
                {isRTL ? 'ملخص الطلب' : 'Order Summary'}
              </h3>

              {/* Items Count */}
              <div className="flex justify-between text-sm mb-3">
                <span className="text-muted-foreground">
                  {isRTL ? 'المنتجات' : 'Items'} ({items.reduce((sum, i) => sum + i.quantity, 0)})
                </span>
                <span>{totalPrice.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm mb-3">
                <span className="text-muted-foreground">{isRTL ? 'الشحن' : 'Shipping'}</span>
                <span className={shippingCost === 0 ? 'text-secondary' : ''}>
                  {shippingCost === 0 
                    ? (isRTL ? 'مجاني' : 'Free') 
                    : `${shippingCost} ${isRTL ? 'ج.م' : 'EGP'}`}
                </span>
              </div>

              {/* Free shipping progress */}
              {shippingCost > 0 && (
                <div className="mb-4 p-3 rounded-lg glass text-xs">
                  <p className="text-muted-foreground mb-2">
                    {isRTL 
                      ? `أضف ${(500 - totalPrice).toLocaleString()} ج.م للحصول على شحن مجاني`
                      : `Add ${(500 - totalPrice).toLocaleString()} EGP for free shipping`}
                  </p>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((totalPrice / 500) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="border-t border-border/50 pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>{isRTL ? 'الإجمالي' : 'Total'}</span>
                  <motion.span
                    className="gradient-text"
                    animate={{ 
                      textShadow: [
                        '0 0 5px hsl(var(--neon-purple) / 0.3)',
                        '0 0 10px hsl(var(--neon-cyan) / 0.3)',
                        '0 0 5px hsl(var(--neon-purple) / 0.3)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {grandTotal.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}
                  </motion.span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-secondary" />
                  <span>{isRTL ? 'دفع آمن' : 'Secure'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck size={14} className="text-secondary" />
                  <span>{isRTL ? 'شحن سريع' : 'Fast'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Success Animation */}
      <CheckoutSuccess isVisible={showSuccess} onComplete={handleSuccessComplete} />
    </div>
  );
};

export default CheckoutPage;
