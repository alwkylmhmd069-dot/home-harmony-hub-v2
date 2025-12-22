import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface CheckoutSuccessProps {
  isVisible: boolean;
  onComplete?: () => void;
}

// Confetti particle component
const Confetti = ({ delay }: { delay: number }) => {
  const colors = ['#a855f7', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomX = Math.random() * 100;
  const randomRotation = Math.random() * 360;
  const randomScale = 0.5 + Math.random() * 0.5;

  return (
    <motion.div
      className="absolute w-3 h-3"
      style={{
        left: `${randomX}%`,
        top: '-10px',
        backgroundColor: randomColor,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      }}
      initial={{ y: 0, rotate: 0, opacity: 1, scale: randomScale }}
      animate={{
        y: window.innerHeight + 100,
        rotate: randomRotation + 360 * 3,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay: delay,
        ease: 'easeIn',
      }}
    />
  );
};

const CheckoutSuccess = ({ isVisible, onComplete }: CheckoutSuccessProps) => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [confettiPieces, setConfettiPieces] = useState<number[]>([]);

  const handleViewOrders = () => {
    navigate('/orders');
  };

  useEffect(() => {
    if (isVisible) {
      // Generate confetti pieces
      setConfettiPieces(Array.from({ length: 50 }, (_, i) => i));
      
      // Auto-complete after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl overflow-hidden"
        >
          {/* Confetti */}
          {confettiPieces.map((i) => (
            <Confetti key={i} delay={i * 0.05} />
          ))}

          {/* Success Content */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
            className="text-center relative z-10"
          >
            {/* Glowing Circle */}
            <motion.div
              className="relative mx-auto mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Outer glow rings */}
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, hsl(var(--neon-cyan) / ${0.3 / ring}) 0%, transparent 70%)`,
                    transform: `scale(${1 + ring * 0.5})`,
                  }}
                  animate={{
                    scale: [1 + ring * 0.5, 1.5 + ring * 0.5, 1 + ring * 0.5],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: ring * 0.2,
                  }}
                />
              ))}

              {/* Main circle */}
              <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center relative"
                style={{
                  boxShadow: '0 0 60px hsl(var(--secondary) / 0.5), 0 0 100px hsl(var(--neon-cyan) / 0.3)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 60px hsl(var(--secondary) / 0.5), 0 0 100px hsl(var(--neon-cyan) / 0.3)',
                    '0 0 80px hsl(var(--secondary) / 0.7), 0 0 120px hsl(var(--neon-cyan) / 0.5)',
                    '0 0 60px hsl(var(--secondary) / 0.5), 0 0 100px hsl(var(--neon-cyan) / 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <Check size={64} className="text-primary-foreground" strokeWidth={3} />
                </motion.div>
              </motion.div>

              {/* Sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${50 + 45 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                    top: `${50 + 45 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Sparkles size={24} className="text-secondary" />
                </motion.div>
              ))}
            </motion.div>

            {/* Text */}
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-4 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {isRTL ? 'تم تأكيد طلبك!' : 'Order Confirmed!'}
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground mb-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {isRTL 
                ? 'شكراً لك! سنقوم بتجهيز طلبك وإرساله في أقرب وقت ممكن.'
                : 'Thank you! We will prepare and ship your order as soon as possible.'}
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={handleViewOrders}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold glass border border-primary/30 hover:bg-primary/10 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Package size={20} />
                {isRTL ? 'عرض طلباتي' : 'View My Orders'}
              </motion.button>
              
              <motion.button
                onClick={onComplete}
                className="btn-neon px-8 py-3 rounded-xl font-semibold text-primary-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isRTL ? 'العودة للتسوق' : 'Continue Shopping'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutSuccess;
