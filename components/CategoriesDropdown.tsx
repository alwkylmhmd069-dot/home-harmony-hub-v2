import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Grid3X3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  icon: string | null;
  color: string | null;
}

interface CategoriesDropdownProps {
  isMobileSidebar?: boolean;
  isSidebar?: boolean;
  isAllCategories?: boolean;
  onClose?: () => void;
  onSelect?: () => void;
}

const CategoriesDropdown = ({ isMobileSidebar = false, isSidebar = false, isAllCategories = false, onClose, onSelect }: CategoriesDropdownProps) => {
  const { language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_en');
      
      if (error) throw error;
      return data as Category[];
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = () => {
    onClose?.();
    onSelect?.();
  };

  // Mobile Sidebar View - Full width grid
  if (isMobileSidebar || isSidebar) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {categories.length === 0 ? (
          <p className="col-span-2 text-muted-foreground text-sm p-3 text-center">
            {isRTL ? 'لا توجد أقسام' : 'No categories'}
          </p>
        ) : (
          categories.map((category) => (
            <motion.a
              key={category.id}
              href={`/category/${category.id}`}
              onClick={handleCategoryClick}
              className="flex flex-col items-center gap-2 p-4 rounded-xl glass glass-hover border border-border/30 text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: category.color ? `${category.color}20` : 'hsl(var(--primary) / 0.1)' }}
              >
                {category.icon || '📦'}
              </span>
              <span className="text-foreground font-medium text-sm">
                {language === 'ar' ? category.name_ar : category.name_en}
              </span>
            </motion.a>
          ))
        )}
      </div>
    );
  }

  // Desktop Dropdown View - More compact or "All Categories" button style
  return (
    <div ref={dropdownRef} className="relative flex-shrink-0">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-xl text-sm font-medium transition-all ${
          isAllCategories 
            ? 'px-4 py-2.5 glass glass-hover border border-primary/30 text-foreground hover:border-primary/50'
            : 'px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30'
        }`}
        whileHover={{ y: -1, scale: isAllCategories ? 1.02 : 1 }}
        whileTap={{ scale: 0.98 }}
        style={isAllCategories ? {
          boxShadow: '0 0 15px hsl(var(--primary) / 0.2)',
        } : undefined}
      >
        <Grid3X3 size={isAllCategories ? 16 : 14} className="text-primary" />
        <span className="whitespace-nowrap">{isRTL ? 'جميع الأقسام' : 'All Categories'}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full mt-2 ${isRTL ? 'right-0' : 'left-0'} w-64 z-50 rounded-xl overflow-hidden`}
            style={{
              background: 'linear-gradient(135deg, hsl(222 47% 11% / 0.98), hsl(222 47% 8% / 0.98))',
              backdropFilter: 'blur(20px)',
              border: '1px solid hsl(271 30% 25% / 0.5)',
              boxShadow: '0 8px 32px hsl(271 76% 53% / 0.2), 0 0 60px hsl(180 100% 50% / 0.1)',
            }}
          >
            <div className="p-2 max-h-80 overflow-y-auto scrollbar-hide">
              {categories.length === 0 ? (
                <p className="text-muted-foreground text-sm p-3 text-center">
                  {isRTL ? 'لا توجد أقسام' : 'No categories'}
                </p>
              ) : (
                categories.map((category) => (
                  <motion.a
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors group"
                    whileHover={{ x: isRTL ? -4 : 4 }}
                  >
                    <span 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: category.color ? `${category.color}20` : 'hsl(var(--primary) / 0.1)' }}
                    >
                      {category.icon || '📦'}
                    </span>
                    <span className="text-foreground group-hover:text-primary transition-colors font-medium">
                      {language === 'ar' ? category.name_ar : category.name_en}
                    </span>
                  </motion.a>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoriesDropdown;