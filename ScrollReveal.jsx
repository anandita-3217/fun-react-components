import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const MotionBox = motion.create(Box);

const ScrollReveal = ({ 
  children, 
  direction = 'up', // 'up', 'down', 'left', 'right', 'fade', 'scale'
  delay = 0,
  duration = 0.6,
  once = false,
  threshold = 0.1,
  distance = 50,
  ...props 
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: threshold,
  });

  const variants = {
    hidden: (() => {
      switch(direction) {
        case 'up':
          return { opacity: 0, y: distance };
        case 'down':
          return { opacity: 0, y: -distance };
        case 'left':
          return { opacity: 0, x: distance };
        case 'right':
          return { opacity: 0, x: -distance };
        case 'scale':
          return { opacity: 0, scale: 0.8 };
        case 'fade':
        default:
          return { opacity: 0 };
      }
    })(),
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <MotionBox
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      {...props}
    >
      {children}
    </MotionBox>
  );
};

// Stagger children reveal
export const ScrollRevealStagger = ({ 
  children, 
  staggerDelay = 0.1,
  ...props 
}) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <MotionBox
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <MotionBox key={index} variants={itemVariants}>
          {child}
        </MotionBox>
      ))}
    </MotionBox>
  );
};

export default ScrollReveal;