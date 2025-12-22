import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORIES } from '@/data/mockData';

const TabletCategoriesBar = () => {
  const { language, isRTL } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    
    const isAtStart = el.scrollLeft <= 10;
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
    
    if (isRTL) {
      setShowLeftFade(!isAtEnd);
      setShowRightFade(!isAtStart);
    } else {
      setShowLeftFade(!isAtStart);
      setShowRightFade(!isAtEnd);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    checkScroll();
    el.addEventListener('scroll', checkScroll);
    return () => el.removeEventListener('scroll', checkScroll);
  }, [isRTL]);

  return (
    <div className="relative">
      {/* Left Fade Indicator */}
      <div
        className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 bottom-0 w-12 pointer-events-none z-10 transition-opacity duration-300 ${
          showLeftFade ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: isRTL
            ? 'linear-gradient(to left, transparent, hsl(var(--background)))'
            : 'linear-gradient(to right, hsl(var(--background)), transparent)',
        }}
      />

      {/* Categories Scroll Container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 px-1"
        style={{ scrollBehavior: 'smooth' }}
      >
        {CATEGORIES.map((category, index) => (
          <motion.a
            key={category.id}
            href={`/category/${category.id}`}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full glass glass-hover border border-border/30 text-sm font-medium text-foreground whitespace-nowrap transition-all duration-200"
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 0 15px hsl(var(--primary) / 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={`w-2 h-2 rounded-full ${category.color.replace('text-', 'bg-')}`} />
            <span>{category.name[language]}</span>
          </motion.a>
        ))}
      </div>

      {/* Right Fade Indicator */}
      <div
        className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 bottom-0 w-12 pointer-events-none z-10 transition-opacity duration-300 ${
          showRightFade ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: isRTL
            ? 'linear-gradient(to right, transparent, hsl(var(--background)))'
            : 'linear-gradient(to left, transparent, hsl(var(--background)))',
        }}
      />
    </div>
  );
};

export default TabletCategoriesBar;
