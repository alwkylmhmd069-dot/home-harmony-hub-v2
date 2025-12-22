import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface AddToCartSuccessProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const AddToCartSuccess = ({ isVisible, onComplete }: AddToCartSuccessProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onAnimationComplete={() => {
            if (isVisible) {
              setTimeout(() => onComplete?.(), 800);
            }
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
        >
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/20 backdrop-blur-sm"
          />

          {/* Success circle */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              transition: {
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }
            }}
            exit={{ scale: 0, rotate: 180 }}
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: 'var(--gradient-neon)',
              boxShadow: '0 0 40px hsl(var(--neon-purple) / 0.6), 0 0 80px hsl(var(--neon-cyan) / 0.4)',
            }}
          >
            {/* Pulse rings */}
            <motion.div
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ 
                scale: 2, 
                opacity: 0,
                transition: { duration: 0.8, ease: 'easeOut' }
              }}
              className="absolute inset-0 rounded-full"
              style={{ background: 'var(--gradient-neon)' }}
            />
            <motion.div
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ 
                scale: 2.5, 
                opacity: 0,
                transition: { duration: 1, ease: 'easeOut', delay: 0.1 }
              }}
              className="absolute inset-0 rounded-full"
              style={{ background: 'var(--gradient-neon)' }}
            />

            {/* Checkmark */}
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                transition: { delay: 0.2, duration: 0.4 }
              }}
            >
              <Check className="w-12 h-12 text-primary-foreground" strokeWidth={3} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartSuccess;
