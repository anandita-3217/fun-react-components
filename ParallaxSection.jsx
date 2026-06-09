import React, { useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const MotionBox = motion.create(Box);

const ParallaxSection = ({ 
  children, 
  speed = 0.5,
  direction = 'up', // 'up', 'down', 'left', 'right'
  id,
  ...props 
}) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Calculate movement based on direction
  const getTransform = () => {
    const distance = 200 * speed;
    
    switch(direction) {
      case 'down':
        return {
          y: useSpring(
            useTransform(scrollYProgress, [0, 1], [-distance, distance]),
            springConfig
          )
        };
      case 'left':
        return {
          x: useSpring(
            useTransform(scrollYProgress, [0, 1], [distance, -distance]),
            springConfig
          )
        };
      case 'right':
        return {
          x: useSpring(
            useTransform(scrollYProgress, [0, 1], [-distance, distance]),
            springConfig
          )
        };
      case 'up':
      default:
        return {
          y: useSpring(
            useTransform(scrollYProgress, [0, 1], [distance, -distance]),
            springConfig
          )
        };
    }
  };

  const transform = getTransform();

  return (
    <MotionBox
      ref={ref}
      id={id}
      style={transform}
      {...props}
    >
      {children}
    </MotionBox>
  );
};

export default ParallaxSection;