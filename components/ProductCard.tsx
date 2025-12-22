import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, GitCompare, ShoppingCart, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/types/store';

interface ProductCardProps {
  product: Product;
  isInWishlist?: boolean;
  isInCompare?: boolean;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
}

const ProductCard = ({ 
  product, 
  isInWishlist = false, 
  isInCompare = false,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  onToggleCompare,
}: ProductCardProps) => {
  const { t, language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const displayName = product.name[language];
  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  // 3D Tilt effect handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / centerY * -8;
    const tiltY = (x - centerX) / centerX * 8;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div
        ref={cardRef}
        className={`card-neon p-4 relative group ${isInCompare ? 'ring-2 ring-secondary/30' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          y: isHovered ? -8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
      {/* Product Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-muted/30">
        {/* Wishlist Button - Always visible on top corner */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product); }}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all ${
            isInWishlist 
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
              : 'bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            boxShadow: isInWishlist ? '0 0 20px hsl(var(--primary) / 0.5)' : 'none',
          }}
        >
          <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Badges - Left side */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground text-xs font-bold">
              {t('product.new')}
            </span>
          )}
          {discount > 0 && (
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground text-xs font-bold">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick Actions - Show on hover */}
        <motion.div
          className="absolute top-14 right-3 z-20 flex flex-col gap-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            onClick={(e) => { e.stopPropagation(); onToggleCompare?.(product); }}
            className={`p-2 rounded-full transition-all ${
              isInCompare 
                ? 'bg-secondary text-secondary-foreground' 
                : 'bg-background/80 backdrop-blur-sm hover:bg-secondary hover:text-secondary-foreground'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <GitCompare size={16} />
          </motion.button>
          <motion.button
            onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
            className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-muted transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Eye size={16} />
          </motion.button>
        </motion.div>

        <img
          src={product.image}
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Add to Cart Overlay */}
        <motion.div
          className="absolute inset-x-0 bottom-0 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={() => onAddToCart?.(product)}
            className="w-full btn-neon py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-primary-foreground btn-hover-pulse"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCart size={18} />
            {t('product.addToCart')}
          </motion.button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="space-y-2" style={{ transform: 'translateZ(20px)' }}>
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'} 
            />
          ))}
          <span className="text-xs text-muted-foreground ms-1">({product.reviews})</span>
        </div>

        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5">
            {product.colors.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border-2 border-border cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        {/* Brand */}
        {product.brand && (
          <span className="text-xs text-muted-foreground">{product.brand}</span>
        )}

        {/* Name */}
        <h3 className="font-bold text-foreground line-clamp-2 leading-tight">
          {displayName}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-xl gradient-text">
            {product.price.toLocaleString()} {t('product.egp')}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
