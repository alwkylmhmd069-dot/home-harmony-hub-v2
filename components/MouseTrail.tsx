import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  color: string;
}

const MouseTrail = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const particleIdRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const throttleRef = useRef(false);

  // Neon colors palette
  const neonColors = [
    'hsl(271, 76%, 53%)', // Purple
    'hsl(180, 100%, 50%)', // Cyan
    'hsl(330, 100%, 60%)', // Pink
    'hsl(271, 76%, 65%)', // Light Purple
    'hsl(180, 100%, 60%)', // Light Cyan
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const createParticle = useCallback((x: number, y: number) => {
    const id = particleIdRef.current++;
    const color = neonColors[Math.floor(Math.random() * neonColors.length)];
    const size = Math.random() * 6 + 4;

    const newParticle: Particle = { id, x, y, color, size };
    
    setParticles(prev => [...prev.slice(-20), newParticle]);

    // Auto-remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 800);
  }, []);

  const createBurst = useCallback((x: number, y: number) => {
    const burstCount = 8;
    const newBurstParticles: BurstParticle[] = [];

    for (let i = 0; i < burstCount; i++) {
      const id = particleIdRef.current++;
      const angle = (i / burstCount) * Math.PI * 2;
      const color = neonColors[Math.floor(Math.random() * neonColors.length)];
      
      newBurstParticles.push({ id, x, y, angle, color });
    }

    setBurstParticles(prev => [...prev, ...newBurstParticles]);

    // Auto-remove burst particles
    setTimeout(() => {
      setBurstParticles(prev => 
        prev.filter(p => !newBurstParticles.some(np => np.id === p.id))
      );
    }, 600);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (throttleRef.current) return;
      
      const distance = Math.hypot(
        e.clientX - lastPositionRef.current.x,
        e.clientY - lastPositionRef.current.y
      );

      if (distance > 10) {
        createParticle(e.clientX, e.clientY);
        lastPositionRef.current = { x: e.clientX, y: e.clientY };
        
        throttleRef.current = true;
        setTimeout(() => {
          throttleRef.current = false;
        }, 30);
      }
    };

    const handleClick = (e: MouseEvent) => {
      createBurst(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [isMobile, createParticle, createBurst]);

  // Touch ripple effect for mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        createBurst(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('touchstart', handleTouch);
    return () => window.removeEventListener('touchstart', handleTouch);
  }, [isMobile, createBurst]);

  if (isMobile && burstParticles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Trail particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x, 
              y: particle.y, 
              scale: 1, 
              opacity: 0.8 
            }}
            animate={{ 
              scale: 0, 
              opacity: 0,
              y: particle.y - 30,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}, 0 0 ${particle.size * 4}px ${particle.color}`,
              transform: `translate(-50%, -50%)`,
              left: 0,
              top: 0,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Burst particles */}
      <AnimatePresence>
        {burstParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x, 
              y: particle.y, 
              scale: 1, 
              opacity: 1 
            }}
            animate={{ 
              x: particle.x + Math.cos(particle.angle) * 60,
              y: particle.y + Math.sin(particle.angle) * 60,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute rounded-full"
            style={{
              width: 6,
              height: 6,
              backgroundColor: particle.color,
              boxShadow: `0 0 8px ${particle.color}, 0 0 16px ${particle.color}`,
              transform: `translate(-50%, -50%)`,
              left: 0,
              top: 0,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MouseTrail;
