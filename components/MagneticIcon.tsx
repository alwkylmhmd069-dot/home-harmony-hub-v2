import { useState, useRef, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticIconProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  badge?: number;
  glowColor?: 'cyan' | 'purple' | 'pink';
  pulse?: boolean;
}

const MagneticIcon = ({ 
  children, 
  className = '', 
  onClick, 
  badge,
  glowColor = 'cyan',
  pulse = false,
}: MagneticIconProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Subtle rotation based on mouse position
  const rotateX = useTransform(ySpring, [-10, 10], [5, -5]);
  const rotateY = useTransform(xSpring, [-10, 10], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Magnetic pull - icons follow cursor slightly
    x.set(distanceX * 0.3);
    y.set(distanceY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const glowColors = {
    cyan: {
      bg: 'hsl(var(--neon-cyan) / 0.15)',
      border: 'hsl(var(--neon-cyan) / 0.5)',
      shadow: '0 0 20px hsl(var(--neon-cyan) / 0.5), 0 0 40px hsl(var(--neon-cyan) / 0.3)',
      text: 'text-neon-cyan',
    },
    purple: {
      bg: 'hsl(var(--neon-purple) / 0.15)',
      border: 'hsl(var(--neon-purple) / 0.5)',
      shadow: '0 0 20px hsl(var(--neon-purple) / 0.5), 0 0 40px hsl(var(--neon-purple) / 0.3)',
      text: 'text-neon-purple',
    },
    pink: {
      bg: 'hsl(var(--neon-pink) / 0.15)',
      border: 'hsl(var(--neon-pink) / 0.5)',
      shadow: '0 0 20px hsl(var(--neon-pink) / 0.5), 0 0 40px hsl(var(--neon-pink) / 0.3)',
      text: 'text-neon-pink',
    },
  };

  const colors = glowColors[glowColor];

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative p-2.5 rounded-xl transition-all duration-300 ${className}`}
      style={{
        x: xSpring,
        y: ySpring,
        rotateX,
        rotateY,
        perspective: 1000,
        backgroundColor: isHovered ? colors.bg : 'transparent',
        borderColor: isHovered ? colors.border : 'hsl(var(--border) / 0.3)',
        boxShadow: isHovered ? colors.shadow : 'none',
      }}
      whileTap={{ scale: 0.92 }}
      animate={{
        y: isHovered ? [0, -3, 0] : 0,
      }}
      transition={{
        y: {
          duration: 0.6,
          repeat: isHovered ? Infinity : 0,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
      }}
    >
      {/* Glow ring effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          opacity: isHovered ? [0.5, 1, 0.5] : 0,
          scale: isHovered ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(circle, ${colors.bg} 0%, transparent 70%)`,
        }}
      />
      
      {/* Icon wrapper with color transition */}
      <motion.div
        className={`relative z-10 transition-colors duration-300 ${isHovered ? colors.text : 'text-foreground'}`}
        animate={{
          filter: isHovered 
            ? `drop-shadow(0 0 8px ${glowColor === 'cyan' ? 'hsl(var(--neon-cyan))' : glowColor === 'purple' ? 'hsl(var(--neon-purple))' : 'hsl(var(--neon-pink))'})`
            : 'none',
        }}
      >
        {children}
      </motion.div>

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ 
            scale: pulse ? [1, 1.3, 1] : 1,
          }}
          transition={{
            duration: 0.4,
            ease: 'easeOut',
          }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-primary to-secondary text-[10px] font-bold flex items-center justify-center text-primary-foreground z-20"
          style={{
            boxShadow: pulse 
              ? '0 0 20px hsl(var(--primary) / 0.8), 0 0 40px hsl(var(--neon-pink) / 0.5)' 
              : '0 0 10px hsl(var(--primary) / 0.5)',
          }}
        >
          {badge > 9 ? '9+' : badge}
        </motion.span>
      )}
    </motion.button>
  );
};

export default MagneticIcon;
