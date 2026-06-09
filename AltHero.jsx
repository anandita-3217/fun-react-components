import Hero from "./assets/Hero.jpg";
// 

import React, { useState } from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const HeroMaskReveal = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Replace these URLs with your actual images
  const colorImage = Hero;
  const grayscaleImage = Hero;

  return (
    
      <Box
        position="relative"
        width="100vw"
        height="100vh"
        overflow="hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Background layer - Color image */}
        <Box
          position="absolute"
          inset="0"
          backgroundImage={`url(${colorImage})`}
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
        />

        {/* Foreground layer - Grayscale image with mask */}
        <Box
          position="absolute"
          inset="0"
          backgroundImage={`url(${grayscaleImage})`}
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          filter="grayscale(100%) invert(100%) brightness(40%)"
          // filter="grayscale(100%)"
          style={{
            maskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 100%, black 100%, black 100%)`,
            WebkitMaskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 100%, black 100%, black 100%)`,
          }}
        />

        {/* Content overlay */}
        <Box
          position="absolute"
          inset="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0, 0, 0, 0.3)"
        >
          <VStack spacing={4} textAlign="center" px={4}>
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
              fontWeight="bold"
              color="white"
              textShadow="0 2px 10px rgba(0,0,0,0.5)"
            >
              I am Anandita
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
              color="white"
              maxW="2xl"
              textShadow="0 2px 10px rgba(0,0,0,0.5)"
            >
              ML Explorer and Design Experimenter 
            </Text>
          </VStack>
        </Box>
      </Box>
    
  );
};

export default HeroMaskReveal;
// Hero mask reveal should go to some other project doesnt sit with this one well - and improve the trainsition for cursorr tracking not smooth