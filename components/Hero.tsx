import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDesign } from '@/contexts/DesignContext';
import heroBackground from '@/assets/hero-background.webp';
import { useRef } from 'react';

const Hero = () => {
  const { t, isRTL } = useLanguage();
  const { settings } = useDesign();
  const containerRef = useRef<HTMLDivElement>(null);

  // Get hero height from settings or use default
  const heroHeight = settings.hero_height || '100vh';

  // Parallax scrolling effect
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 800], [0, 300]);
  const textY = useTransform(scrollY, [0, 800], [0, 150]);
  const blobY = useTransform(scrollY, [0, 800], [0, 200]);
  const parallaxOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  // 3D Tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Generate random particles for magical effect
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <section 
      ref={containerRef}
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: heroHeight, minHeight: '500px', perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Full Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          y: backgroundY,
          rotateX,
          rotateY,
        }}
      />

      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/50" />

      {/* Neon Glow Overlay Effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--neon-purple) / 0.15) 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--neon-cyan) / 0.1) 0%, transparent 50%)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Moving Light Particles - Reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.slice(0, 20).map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full hidden sm:block"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, hsl(var(--neon-cyan)) 0%, transparent 70%)`,
              boxShadow: `0 0 ${particle.size * 3}px hsl(var(--neon-cyan) / 0.8)`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -50, -100],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Floating Stars Animation - Hidden on mobile for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.3, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Star className="w-3 h-3 text-secondary fill-secondary" />
          </motion.div>
        ))}
      </div>

      {/* Animated Light Beams - Hidden on mobile */}
      <motion.div
        className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-neon-cyan/40 via-neon-purple/20 to-transparent hidden md:block"
        style={{ filter: 'blur(8px)' }}
        animate={{
          opacity: [0, 0.5, 0],
          x: [0, 100, 200],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-neon-purple/40 via-neon-cyan/20 to-transparent hidden md:block"
        style={{ filter: 'blur(8px)' }}
        animate={{
          opacity: [0, 0.5, 0],
          x: [0, -100, -200],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 2 }}
      />

      {/* Parallax Floating Blobs */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 rounded-full bg-gradient-radial from-primary/30 to-transparent blur-3xl pointer-events-none hidden md:block"
        style={{ y: blobY, opacity: parallaxOpacity }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-60 h-60 rounded-full bg-gradient-radial from-secondary/20 to-transparent blur-3xl pointer-events-none hidden md:block"
        style={{ y: blobY, opacity: parallaxOpacity }}
      />

      {/* Text Content Layer with 3D Tilt and Parallax */}
      <motion.div 
        className="container mx-auto px-4 relative z-10"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', y: textY, opacity: parallaxOpacity }}
      >
        <div className="flex flex-col items-center justify-center text-center gap-4 md:gap-6">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full bg-background/40 backdrop-blur-md border border-primary/40 mb-4 md:mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
              </motion.div>
              <span className="text-xs md:text-sm font-bold text-foreground">{t('hero.subtitle')}</span>
              <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            </motion.div>

            {/* Text Background - Subtle gradient behind text only */}
            <div 
              className="relative rounded-2xl md:rounded-3xl p-4 md:p-8 mb-4"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.2) 100%)',
              }}
            >
              {/* Arabic Title with Cairo ExtraBold - Sharp & Clear */}
              <motion.h1
                className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black mb-2 md:mb-4 leading-tight"
                style={{ 
                  fontFamily: "'Cairo', sans-serif",
                  fontWeight: 800,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.span 
                  className="inline-block"
                  style={{
                    color: '#E0F7FA', // Very Light Cyan
                    WebkitTextStroke: '0.5px rgba(0,0,0,0.6)',
                    filter: 'drop-shadow(0 0 5px #3B82F6) drop-shadow(0 0 15px #3B82F6) drop-shadow(0 0 30px #3B82F6)',
                  }}
                  animate={{
                    filter: [
                      'drop-shadow(0 0 5px #3B82F6) drop-shadow(0 0 15px #3B82F6) drop-shadow(0 0 30px #3B82F6)',
                      'drop-shadow(0 0 8px #3B82F6) drop-shadow(0 0 25px #3B82F6) drop-shadow(0 0 50px #3B82F6)',
                      'drop-shadow(0 0 5px #3B82F6) drop-shadow(0 0 15px #3B82F6) drop-shadow(0 0 30px #3B82F6)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  فاميلي هوم
                </motion.span>
              </motion.h1>

              {/* English Title with Orbitron Bold - Sharp & Clear */}
              <motion.h2
                className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-bold mb-2 tracking-widest"
                style={{ 
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.span 
                  style={{
                    color: '#00D2FF', // Soft Electric Blue
                    WebkitTextStroke: '0.5px rgba(0,0,0,0.5)',
                    filter: 'drop-shadow(0 0 5px #00D2FF) drop-shadow(0 0 15px #00D2FF)',
                  }}
                  animate={{
                    filter: [
                      'drop-shadow(0 0 5px #00D2FF) drop-shadow(0 0 15px #00D2FF)',
                      'drop-shadow(0 0 10px #00D2FF) drop-shadow(0 0 25px #00D2FF)',
                      'drop-shadow(0 0 5px #00D2FF) drop-shadow(0 0 15px #00D2FF)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  FAMILY HOME
                </motion.span>
              </motion.h2>
            </div>

            {/* Description */}
            <motion.p
              className="text-sm md:text-lg lg:text-xl text-foreground/90 mb-6 md:mb-8 leading-relaxed font-medium backdrop-blur-sm bg-background/30 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4"
              style={{ fontFamily: "'Cairo', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {t('hero.description')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                className="relative btn-neon px-6 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-xl flex items-center justify-center gap-2 md:gap-3 text-primary-foreground overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <span className="relative z-10">{t('hero.shopNow')}</span>
                <ArrowRight className={`w-5 h-5 md:w-6 md:h-6 relative z-10 ${isRTL ? 'rotate-180' : ''}`} />
              </motion.button>

              <motion.button
                className="px-6 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-xl bg-background/40 backdrop-blur-md border-2 border-primary/40 hover:border-primary/80 transition-all flex items-center justify-center gap-2 md:gap-3 hover:bg-primary/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('hero.viewCollection')}
              </motion.button>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 md:gap-4 mt-6 md:mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {['🚚 شحن سريع', '💰 أسعار مناسبة', '✅ جودة مضمونة', '📞 دعم دائم'].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-background/40 backdrop-blur-md border border-secondary/30 text-xs md:text-sm font-medium"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.1, borderColor: 'hsl(var(--secondary))' }}
                >
                  {feature}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-8 h-12 rounded-full border-2 border-foreground/60 flex items-start justify-center p-2 bg-background/40 backdrop-blur-md">
          <motion.div
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;