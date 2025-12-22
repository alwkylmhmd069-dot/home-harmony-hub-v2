import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light') {
      setIsDark(false);
      root.classList.add('light');
    } else if (savedTheme === 'dark' || prefersDark) {
      setIsDark(true);
      root.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  // Sun rays for the sun icon
  const sunRays = Array.from({ length: 8 }, (_, i) => i * 45);

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl glass glass-hover border border-primary/20 overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        boxShadow: isDark 
          ? '0 0 15px hsl(180 100% 50% / 0.4), 0 0 30px hsl(180 100% 50% / 0.2)' 
          : '0 0 15px hsl(45 100% 50% / 0.4), 0 0 30px hsl(45 100% 50% / 0.2)',
      }}
    >
      <div className="relative w-5 h-5">
        <AnimatePresence mode="wait">
          {isDark ? (
            // Sun Icon with Cyan Neon Glow
            <motion.div
              key="sun"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* Sun rays */}
              {sunRays.map((rotation, i) => (
                <motion.span
                  key={i}
                  className="absolute w-0.5 h-1.5 bg-yellow-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: 'center',
                    transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-9px)`,
                    boxShadow: '0 0 4px hsl(180 100% 50%), 0 0 8px hsl(180 100% 50% / 0.5)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.03, duration: 0.2 }}
                />
              ))}
              {/* Sun center */}
              <motion.div
                className="absolute inset-1 rounded-full bg-yellow-400"
                style={{
                  boxShadow: '0 0 10px hsl(180 100% 50%), 0 0 20px hsl(180 100% 50% / 0.6), 0 0 30px hsl(180 100% 50% / 0.4)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 10px hsl(180 100% 50%), 0 0 20px hsl(180 100% 50% / 0.6), 0 0 30px hsl(180 100% 50% / 0.4)',
                    '0 0 15px hsl(180 100% 50%), 0 0 30px hsl(180 100% 50% / 0.8), 0 0 45px hsl(180 100% 50% / 0.5)',
                    '0 0 10px hsl(180 100% 50%), 0 0 20px hsl(180 100% 50% / 0.6), 0 0 30px hsl(180 100% 50% / 0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          ) : (
            // Moon Icon with Golden Amber Glow
            <motion.div
              key="moon"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                className="relative w-4 h-4"
                animate={{
                  boxShadow: [
                    '0 0 10px hsl(45 100% 50%), 0 0 20px hsl(45 100% 50% / 0.6)',
                    '0 0 15px hsl(45 100% 50%), 0 0 30px hsl(45 100% 50% / 0.8)',
                    '0 0 10px hsl(45 100% 50%), 0 0 20px hsl(45 100% 50% / 0.6)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ borderRadius: '50%' }}
              >
                {/* Moon crescent using clip path */}
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <defs>
                    <filter id="glow-amber">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    fill="hsl(271 76% 53%)"
                    stroke="hsl(271 76% 60%)"
                    strokeWidth="1"
                    filter="url(#glow-amber)"
                    style={{
                      filter: 'drop-shadow(0 0 6px hsl(45 100% 50%)) drop-shadow(0 0 12px hsl(45 100% 50% / 0.6))',
                    }}
                  />
                </svg>
              </motion.div>
              {/* Stars around moon */}
              {[
                { top: '0', right: '0', delay: 0.2 },
                { bottom: '2px', left: '0', delay: 0.3 },
                { top: '50%', right: '-2px', delay: 0.4 },
              ].map((star, i) => (
                <motion.span
                  key={i}
                  className="absolute w-1 h-1 bg-amber-300 rounded-full"
                  style={{ ...star }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1, 0.8], opacity: [0, 1, 0.7] }}
                  transition={{ 
                    delay: star.delay, 
                    duration: 1.5, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
