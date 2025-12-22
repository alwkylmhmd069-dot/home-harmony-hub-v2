import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sparkle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface HeaderSparklesProps {
  isActive: boolean;
}

const HeaderSparkles = ({ isActive }: HeaderSparklesProps) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const colors = [
    'hsl(var(--neon-cyan))',
    'hsl(var(--neon-purple))',
    'hsl(var(--neon-pink))',
    'hsl(var(--primary))',
  ];

  const createSparkle = useCallback((x: number, y: number): Sparkle => ({
    id: `${Date.now()}-${Math.random()}`,
    x,
    y,
    size: Math.random() * 6 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
  }), []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isActive) return;
    
    // Only create sparkle occasionally for performance
    if (Math.random() > 0.85) {
      const sparkle = createSparkle(e.clientX, e.clientY);
      setSparkles(prev => [...prev.slice(-15), sparkle]);
    }
  }, [isActive, createSparkle]);

  useEffect(() => {
    if (isActive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isActive, handleMouseMove]);

  // Auto-remove sparkles after animation
  useEffect(() => {
    const timer = setInterval(() => {
      setSparkles(prev => prev.slice(1));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[45] overflow-hidden">
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: sparkle.x,
              y: sparkle.y,
            }}
            animate={{ 
              opacity: 0, 
              scale: 1,
              y: sparkle.y - 30,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute"
            style={{
              width: sparkle.size,
              height: sparkle.size,
              left: -sparkle.size / 2,
              top: -sparkle.size / 2,
            }}
          >
            {/* Star shape using SVG */}
            <svg
              viewBox="0 0 24 24"
              fill={sparkle.color}
              style={{
                filter: `drop-shadow(0 0 ${sparkle.size}px ${sparkle.color})`,
              }}
            >
              <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default HeaderSparkles;
