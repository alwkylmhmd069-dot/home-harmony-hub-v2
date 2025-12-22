import { useState } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { X, Mail, Phone, Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMethod = 'email' | 'phone';
type AuthMode = 'login' | 'signup';

// Google Icon
const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();
  const dragControls = useDragControls();
  
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    
    if (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMethod === 'email') {
      if (!email || !password) {
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields',
          variant: 'destructive',
        });
        return;
      }

      if (password.length < 6) {
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitting(true);

      try {
        if (authMode === 'login') {
          const { error } = await signIn(email, password);
          if (error) {
            toast({
              title: isRTL ? 'خطأ في تسجيل الدخول' : 'Login Error',
              description: error.message.includes('Invalid login credentials')
                ? (isRTL ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password')
                : error.message,
              variant: 'destructive',
            });
          } else {
            toast({
              title: isRTL ? 'مرحباً!' : 'Welcome!',
              description: isRTL ? 'تم تسجيل الدخول بنجاح' : 'Successfully logged in',
            });
            onClose();
          }
        } else {
          const { error } = await signUp(email, password);
          if (error) {
            toast({
              title: isRTL ? 'خطأ' : 'Error',
              description: error.message.includes('already registered')
                ? (isRTL ? 'هذا البريد مسجل بالفعل' : 'This email is already registered')
                : error.message,
              variant: 'destructive',
            });
          } else {
            toast({
              title: isRTL ? 'تم التسجيل!' : 'Registered!',
              description: isRTL ? 'تم إنشاء حسابك بنجاح' : 'Your account has been created',
            });
            onClose();
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Phone auth - using Supabase phone auth
      if (!phone) {
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'يرجى إدخال رقم الهاتف' : 'Please enter your phone number',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const { error } = await supabase.auth.signInWithOtp({
          phone: phone,
        });
        
        if (error) {
          toast({
            title: isRTL ? 'خطأ' : 'Error',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: isRTL ? 'تم الإرسال' : 'Sent!',
            description: isRTL ? 'تم إرسال رمز التحقق' : 'Verification code sent',
          });
        }
      } catch (error) {
        console.error('Phone auth error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setEmail('');
    setPhone('');
    setPassword('');
    setShowPassword(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100]"
          />
          
          {/* Modal - Bottom Sheet on mobile with swipe, centered on desktop */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-md z-[101] md:p-4 touch-none md:touch-auto md:drag-none"
            style={{ touchAction: 'none' }}
          >
            <div 
              className="rounded-t-3xl md:rounded-2xl p-4 sm:p-6 overflow-hidden max-h-[90vh] overflow-y-auto glass"
              style={{
                background: 'linear-gradient(135deg, hsl(222 47% 11% / 0.95), hsl(222 47% 8% / 0.95))',
                backdropFilter: 'blur(24px)',
                border: '1px solid hsl(271 30% 25% / 0.5)',
                boxShadow: '0 8px 32px hsl(271 76% 53% / 0.3), 0 0 100px hsl(180 100% 50% / 0.1)',
              }}
            >
              {/* Drag Handle - Mobile only */}
              <div 
                className="md:hidden flex justify-center pb-3 cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <motion.div 
                  className="w-12 h-1.5 bg-muted-foreground/40 rounded-full"
                  whileHover={{ backgroundColor: 'hsl(var(--primary) / 0.6)' }}
                  whileTap={{ backgroundColor: 'hsl(var(--primary))' }}
                />
              </div>
              
              {/* Close Button - Larger on mobile */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-3 sm:p-2 rounded-xl md:rounded-lg hover:bg-muted/50 transition-colors touch-manipulation"
              >
                <X size={24} className="text-muted-foreground sm:w-5 sm:h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-4 sm:mb-6 mt-2 md:mt-0">
                <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-1 sm:mb-2">
                  {authMode === 'login' 
                    ? (isRTL ? 'تسجيل الدخول' : 'Sign In') 
                    : (isRTL ? 'إنشاء حساب' : 'Sign Up')}
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {authMode === 'login'
                    ? (isRTL ? 'أدخل بياناتك للوصول لحسابك' : 'Enter your credentials')
                    : (isRTL ? 'أنشئ حساباً جديداً' : 'Create a new account')}
                </p>
              </div>

              {/* Google Sign In - Text truncate for overflow */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full mb-3 sm:mb-4 py-4 sm:py-5 glass border-border/50 hover:border-primary/50 text-sm sm:text-base btn-hover-pulse"
              >
                <GoogleIcon size={18} />
                <span className={`${isRTL ? 'mr-2' : 'ml-2'} truncate`}>
                  {isRTL ? 'المتابعة مع Google' : 'Continue with Google'}
                </span>
              </Button>

              {/* Divider */}
              <div className="relative my-3 sm:my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {isRTL ? 'أو' : 'or'}
                  </span>
                </div>
              </div>

              {/* Auth Method Tabs - Compact on mobile */}
              <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4">
                <button
                  onClick={() => { setAuthMethod('email'); resetForm(); }}
                  className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 rounded-lg transition-colors text-xs sm:text-sm ${
                    authMethod === 'email' 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'glass border-border/50'
                  }`}
                >
                  <Mail size={14} className="sm:w-4 sm:h-4" />
                  <span>{isRTL ? 'البريد' : 'Email'}</span>
                </button>
                <button
                  onClick={() => { setAuthMethod('phone'); resetForm(); }}
                  className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 rounded-lg transition-colors text-xs sm:text-sm ${
                    authMethod === 'phone' 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'glass border-border/50'
                  }`}
                >
                  <Phone size={14} className="sm:w-4 sm:h-4" />
                  <span>{isRTL ? 'الهاتف' : 'Phone'}</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {authMethod === 'email' ? (
                  <>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="modal-email" className="text-sm">{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
                      <div className="relative">
                        <Mail className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-muted-foreground`} />
                        <Input
                          id="modal-email"
                          type="email"
                          placeholder={isRTL ? 'أدخل بريدك' : 'Enter your email'}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`${isRTL ? 'pr-10' : 'pl-10'} bg-muted/30 border-border/50 h-11 sm:h-10`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="modal-password" className="text-sm">{isRTL ? 'كلمة المرور' : 'Password'}</Label>
                      <div className="relative">
                        <Lock className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-muted-foreground`} />
                        <Input
                          id="modal-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter your password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} bg-muted/30 border-border/50 h-11 sm:h-10`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-muted-foreground p-1`}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="modal-phone" className="text-sm">{isRTL ? 'رقم الهاتف' : 'Phone Number'}</Label>
                    <div className="relative">
                      <Phone className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-muted-foreground`} />
                      <Input
                        id="modal-phone"
                        type="tel"
                        placeholder={isRTL ? '+20 xxx xxx xxxx' : '+20 xxx xxx xxxx'}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`${isRTL ? 'pr-10' : 'pl-10'} bg-muted/30 border-border/50 h-11 sm:h-10`}
                        dir="ltr"
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full btn-neon text-primary-foreground py-5 sm:py-5 text-sm sm:text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (isRTL ? 'جاري التحميل...' : 'Loading...') 
                    : authMode === 'login' 
                      ? (isRTL ? 'تسجيل الدخول' : 'Sign In')
                      : (isRTL ? 'إنشاء حساب' : 'Sign Up')}
                </Button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-3 sm:mt-4 text-center pb-2 md:pb-0">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {authMode === 'login' 
                    ? (isRTL ? 'ليس لديك حساب؟' : "Don't have an account?")
                    : (isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?')}
                  {' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); resetForm(); }}
                    className="text-primary hover:underline font-medium"
                  >
                    {authMode === 'login' 
                      ? (isRTL ? 'إنشاء حساب' : 'Sign Up')
                      : (isRTL ? 'تسجيل الدخول' : 'Sign In')}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
