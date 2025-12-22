import { motion } from 'framer-motion';

const BackgroundBlobs = () => {
  const blobs = [
    {
      id: 1,
      size: 'w-[600px] h-[600px]',
      position: '-top-40 -left-40',
      color: 'from-primary/30 via-purple-600/20 to-transparent',
      duration: 25,
      delay: 0,
    },
    {
      id: 2,
      size: 'w-[500px] h-[500px]',
      position: 'top-1/3 -right-40',
      color: 'from-secondary/25 via-cyan-500/15 to-transparent',
      duration: 30,
      delay: 5,
    },
    {
      id: 3,
      size: 'w-[400px] h-[400px]',
      position: 'bottom-20 left-1/4',
      color: 'from-primary/20 via-violet-600/15 to-transparent',
      duration: 20,
      delay: 2,
    },
    {
      id: 4,
      size: 'w-[350px] h-[350px]',
      position: 'top-1/2 left-1/3',
      color: 'from-secondary/20 via-teal-500/10 to-transparent',
      duration: 28,
      delay: 8,
    },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className={`absolute ${blob.size} ${blob.position} rounded-full bg-gradient-radial ${blob.color} blur-3xl`}
          animate={{
            x: [0, 30, -20, 40, 0],
            y: [0, -40, 20, -30, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
            opacity: [0.6, 0.8, 0.5, 0.7, 0.6],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: blob.delay,
          }}
          style={{
            background: `radial-gradient(circle, var(--tw-gradient-stops))`,
          }}
        />
      ))}

      {/* Additional atmospheric glow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse at 20% 30%, hsl(271 76% 53% / 0.08) 0%, transparent 50%)',
            'radial-gradient(ellipse at 80% 70%, hsl(180 100% 50% / 0.08) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 50%, hsl(271 76% 53% / 0.06) 0%, transparent 50%)',
            'radial-gradient(ellipse at 20% 30%, hsl(271 76% 53% / 0.08) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default BackgroundBlobs;
