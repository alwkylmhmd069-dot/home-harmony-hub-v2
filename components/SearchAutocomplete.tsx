import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Package, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRODUCTS, CATEGORIES } from '@/data/mockData';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isExpanded?: boolean;
  onClose?: () => void;
  className?: string;
  placeholder?: string;
}

const SearchAutocomplete = ({
  value,
  onChange,
  onFocus,
  onBlur,
  isExpanded = true,
  onClose,
  className = '',
  placeholder,
}: SearchAutocompleteProps) => {
  const { language, isRTL, t } = useLanguage();
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter products and categories based on search
  const filteredProducts = value.length >= 2 
    ? PRODUCTS.filter(p => 
        p.name[language].toLowerCase().includes(value.toLowerCase()) ||
        p.brand?.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredCategories = value.length >= 2
    ? CATEGORIES.filter(c =>
        c.name[language].toLowerCase().includes(value.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults = filteredProducts.length > 0 || filteredCategories.length > 0;

  useEffect(() => {
    setShowDropdown(isFocused && value.length >= 2);
  }, [isFocused, value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    // Delay to allow click on dropdown items
    setTimeout(() => {
      setIsFocused(false);
      onBlur?.();
    }, 200);
  };

  const handleSelectProduct = (productId: string) => {
    setShowDropdown(false);
    onChange('');
    navigate(`/product/${productId}`);
  };

  const handleSelectCategory = (categoryId: string) => {
    setShowDropdown(false);
    onChange('');
    navigate(`/category/${categoryId}`);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div
        className={`search-pill flex items-center gap-2 px-4 py-2.5 ${isFocused ? 'ring-2 ring-neon-cyan/30' : ''}`}
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Search className="text-muted-foreground h-4 w-4 flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || t('header.search')}
          className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground text-foreground"
          autoComplete="off"
        />
        {value && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => { onChange(''); onClose?.(); }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </motion.button>
        )}
      </motion.div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {showDropdown && hasResults && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full mt-2 w-full z-[100] rounded-xl overflow-hidden backdrop-blur-2xl"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--card) / 0.98), hsl(var(--background) / 0.98))',
              border: '1px solid hsl(var(--border) / 0.5)',
              boxShadow: '0 8px 32px hsl(var(--primary) / 0.2), 0 0 60px hsl(var(--neon-cyan) / 0.1)',
            }}
          >
            <div className="max-h-80 overflow-y-auto">
              {/* Categories */}
              {filteredCategories.length > 0 && (
                <div className="p-2 border-b border-border/30">
                  <p className="px-3 py-1 text-xs text-muted-foreground font-medium uppercase tracking-wide flex items-center gap-2">
                    <Tag size={12} />
                    {isRTL ? 'الأقسام' : 'Categories'}
                  </p>
                  {filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleSelectCategory(category.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-start"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center ${category.color}`}>
                        <Tag size={14} />
                      </div>
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {category.name[language]}
                      </span>
                      <ArrowRight size={14} className={`text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  ))}
                </div>
              )}

              {/* Products */}
              {filteredProducts.length > 0 && (
                <div className="p-2">
                  <p className="px-3 py-1 text-xs text-muted-foreground font-medium uppercase tracking-wide flex items-center gap-2">
                    <Package size={12} />
                    {isRTL ? 'المنتجات' : 'Products'}
                  </p>
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-start"
                    >
                      <img
                        src={product.image}
                        alt={product.name[language]}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {product.name[language]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.price} {t('product.egp')}
                        </p>
                      </div>
                      <ArrowRight size={14} className={`text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results message */}
      <AnimatePresence>
        {showDropdown && !hasResults && value.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full z-[100] rounded-xl p-4 text-center backdrop-blur-2xl"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--card) / 0.98), hsl(var(--background) / 0.98))',
              border: '1px solid hsl(var(--border) / 0.5)',
            }}
          >
            <p className="text-sm text-muted-foreground">
              {isRTL ? 'لا توجد نتائج' : 'No results found'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchAutocomplete;
