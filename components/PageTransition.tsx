import { motion, Variants, Easing } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const easeOut: Easing = [0.22, 1, 0.36, 1];
const easeIn: Easing = [0.22, 0, 0.36, 0];

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: easeIn,
    },
  },
};

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
