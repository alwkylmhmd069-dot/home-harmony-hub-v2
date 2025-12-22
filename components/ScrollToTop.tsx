import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: {
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }
          }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed z-40 p-4 rounded-full btn-neon text-primary-foreground shadow-lg lg:bottom-6 lg:right-6 max-lg:bottom-24 max-lg:left-6"
          style={{
            boxShadow: '0 0 30px hsl(var(--neon-purple) / 0.5), 0 0 60px hsl(var(--neon-cyan) / 0.3)',
          }}
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px hsl(var(--neon-purple) / 0.5)',
                '0 0 40px hsl(var(--neon-purple) / 0.7)',
                '0 0 20px hsl(var(--neon-purple) / 0.5)',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full"
          />
          <ArrowUp className="w-5 h-5 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
