import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading, signIn, signUp } = useAuth();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: isRTL ? 'خطأ في تسجيل الدخول' : 'Login Error',
              description: isRTL ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password',
              variant: 'destructive',
            });
          } else {
            toast({
              title: isRTL ? 'خطأ' : 'Error',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: isRTL ? 'مرحباً!' : 'Welcome!',
            description: isRTL ? 'تم تسجيل الدخول بنجاح' : 'Successfully logged in',
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: isRTL ? 'خطأ' : 'Error',
              description: isRTL ? 'هذا البريد مسجل بالفعل' : 'This email is already registered',
              variant: 'destructive',
            });
          } else {
            toast({
              title: isRTL ? 'خطأ' : 'Error',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: isRTL ? 'تم التسجيل!' : 'Registered!',
            description: isRTL ? 'تم إنشاء حسابك بنجاح' : 'Your account has been created',
          });
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card-neon p-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180 ml-2' : 'mr-2'}`} />
            {isRTL ? 'العودة' : 'Back'}
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {isLogin 
                ? (isRTL ? 'تسجيل الدخول' : 'Sign In') 
                : (isRTL ? 'إنشاء حساب' : 'Sign Up')}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? (isRTL ? 'أدخل بياناتك للوصول لحسابك' : 'Enter your credentials to access your account')
                : (isRTL ? 'أنشئ حساباً جديداً' : 'Create a new account')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
              <div className="relative">
                <Mail className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-muted-foreground`} />
                <Input
                  id="email"
                  type="email"
                  placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={isRTL ? 'pr-10' : 'pl-10'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{isRTL ? 'كلمة المرور' : 'Password'}</Label>
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-muted-foreground`} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-muted-foreground hover:text-foreground`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full btn-neon text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (isRTL ? 'جاري التحميل...' : 'Loading...') 
                : isLogin 
                  ? (isRTL ? 'تسجيل الدخول' : 'Sign In')
                  : (isRTL ? 'إنشاء حساب' : 'Sign Up')}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLogin 
                ? (isRTL ? 'ليس لديك حساب؟' : "Don't have an account?")
                : (isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?')}
              {' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin 
                  ? (isRTL ? 'إنشاء حساب' : 'Sign Up')
                  : (isRTL ? 'تسجيل الدخول' : 'Sign In')}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
