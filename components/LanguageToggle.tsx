import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleLanguage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      setLanguage(language === 'en' ? 'ar' : 'en');
      setIsAnimating(false);
    }, 200);
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className="relative flex items-center gap-2 px-4 py-2 rounded-xl glass glass-hover border border-primary/20 transition-all duration-300 hover:border-primary/50 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={isAnimating}
    >
      <Globe 
        size={18} 
        className="text-primary transition-transform duration-300 group-hover:rotate-180" 
      />
      <span className="text-sm font-semibold text-foreground min-w-[50px] text-center">
        {language === 'en' ? 'العربية' : 'English'}
      </span>
      <motion.div
        className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-primary to-secondary"
        animate={{
          left: language === 'en' ? 4 : 'auto',
          right: language === 'ar' ? 4 : 'auto',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </motion.button>
  );
};

export default LanguageToggle;
