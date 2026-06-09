import React, { useState } from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const CursorMaskReveal = ({ 
  colorImage, 
  grayscaleImage, 
  title = "Discover the World",
  subtitle = "Move your cursor to reveal the beauty",
  maskSize = 200,
  overlayOpacity = 0.3,
  height = "100vh",
  children
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Box
      position="relative"
      width="100%"
      height={height}
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
        style={{
          maskImage: `radial-gradient(circle ${maskSize}px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 100%, black 100%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${maskSize}px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 100%, black 100%, black 100%)`,
        }}
      />

      {/* Content overlay */}
      <Box
        position="absolute"
        inset="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={`rgba(0, 0, 0, ${overlayOpacity})`}
      >
        {children || (
          <VStack spacing={4} textAlign="center" px={4}>
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
              fontWeight="bold"
              color="white"
              textShadow="0 2px 10px rgba(0,0,0,0.5)"
            >
              {title}
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
              color="white"
              maxW="2xl"
              textShadow="0 2px 10px rgba(0,0,0,0.5)"
            >
              {subtitle}
            </Text>
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default CursorMaskReveal;

// Example usage:
/*
import HeroMaskReveal from './HeroMaskReveal';
import HeroBack from "./assets/Hero.jpg";
import HeroFore from "./assets/HeroFore.jpg";

// Basic usage
<HeroMaskReveal 
  colorImage={HeroBack}
  grayscaleImage={HeroFore}
/>

// Custom props
<HeroMaskReveal 
  colorImage={HeroBack}
  grayscaleImage={HeroFore}
  title="Welcome to Our World"
  subtitle="Explore the possibilities"
  maskSize={300}
  overlayOpacity={0.5}
  height="80vh"
/>

// Custom children content
<HeroMaskReveal 
  colorImage={HeroBack}
  grayscaleImage={HeroFore}
>
  <VStack spacing={6}>
    <Heading color="white">Custom Content</Heading>
    <Button colorScheme="blue">Get Started</Button>
  </VStack>
</HeroMaskReveal>
*/
// example usage

// import CursorMaskReveal from './ui/CursorMaskReveal';
// import HeroBack from "./assets/Hero.jpg";
// import HeroFore from "./assets/HeroFore.jpg";
// import {VStack, Heading, Button} from '@chakra-ui/react';

// function Options(){
//     return (
//         <>
//             {/* Basic usage */}
//             {/* <CursorMaskReveal 
//                 colorImage={HeroBack}
//                 grayscaleImage={HeroFore}
//             /> */}
            
//             {/* Custom props */}
//             <CursorMaskReveal 
//                 colorImage={HeroBack}
//                 grayscaleImage={HeroFore}
//                 title="Welcome to Our World"
//                 subtitle="Explore the possibilities"
//                 maskSize={300}
//                 overlayOpacity={0.5}
//                 height="80vh"
//             />
            
//             {/* Custom children content */}
//             {/* <CursorMaskReveal 
//                 colorImage={HeroBack}
//                 grayscaleImage={HeroFore}
//             >
//                 <VStack spacing={6}>
//                     <Heading color="white">Custom Content</Heading>
//                     <Button colorScheme="blue">Get Started</Button>
//                 </VStack>
//             </CursorMaskReveal> */}
//         </>
//     );
// } 

// export default Options;