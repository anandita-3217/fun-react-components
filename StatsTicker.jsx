// StatsTicker.jsx
// Horizontal marquee strip — dev metrics, cinematic stock-ticker vibe
// Stack: React 18 + Chakra UI v2 + Framer Motion + GSAP

import { useRef, useEffect, useState } from "react";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

const MotionBox = motion.create(Box);

// ── Ticker items ─────────────────────────────────────────────────────────────
const ITEMS = [
  { label: "GitHub Commits", value: "1,240", change: "+14%", up: true, accent: "#14b8a6" },
  { label: "Projects Shipped", value: "14", change: "+3 YTD", up: true, accent: "#7c3aed" },
  { label: "Coffee / Day", value: "3.2", change: "cups", up: null, accent: "#e8c547" },
  { label: "Open Source Stars", value: "4.3K", change: "+620", up: true, accent: "#ec4899" },
  { label: "Years Coding", value: "8+", change: "since 2016", up: null, accent: "#14b8a6" },
  { label: "PR Merged", value: "892", change: "+88", up: true, accent: "#f4845f" },
  { label: "Countries Worked From", value: "7", change: "remote first", up: null, accent: "#7c3aed" },
  { label: "Avg Deploy Time", value: "38ms", change: "-12ms", up: true, accent: "#14b8a6" },
  { label: "Lines Deleted", value: "220K", change: "best PR", up: true, accent: "#ec4899" },
  { label: "Response SLA", value: "< 24h", change: "always", up: null, accent: "#e8c547" },
];

// Duplicate for seamless loop
const TRACK = [...ITEMS, ...ITEMS, ...ITEMS];

function TickerItem({ item }) {
  const dimColor = useColorModeValue("#6b7280", "rgba(255,255,255,0.28)");
  const textColor = useColorModeValue("#111", "rgba(255,255,255,0.88)");
  const [hovered, setHovered] = useState(false);

  return (
    <Flex
      align="center"
      gap={3}
      px={6}
      flexShrink={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "default" }}
    >
      {/* Divider dot */}
      <Box
        w="4px"
        h="4px"
        borderRadius="50%"
        bg={item.accent}
        opacity={0.5}
        boxShadow={hovered ? `0 0 8px ${item.accent}` : "none"}
        style={{ transition: "box-shadow 0.2s ease" }}
      />

      {/* Label */}
      <Text
        fontFamily="'JetBrains Mono', monospace"
        fontSize="9px"
        letterSpacing="0.18em"
        textTransform="uppercase"
        color={dimColor}
        whiteSpace="nowrap"
      >
        {item.label}
      </Text>

      {/* Value */}
      <Text
        fontFamily="'Orbitron', sans-serif"
        fontWeight={800}
        fontSize="14px"
        color={hovered ? item.accent : textColor}
        whiteSpace="nowrap"
        style={{ transition: "color 0.2s ease" }}
      >
        {item.value}
      </Text>

      {/* Change badge */}
      {item.change && (
        <Box
          px={1.5}
          py={0.5}
          borderRadius="4px"
          border="1px solid"
          borderColor={
            item.up === null
              ? "rgba(255,255,255,0.08)"
              : item.up
              ? `${item.accent}35`
              : "rgba(239,68,68,0.3)"
          }
          bg={
            item.up === null
              ? "rgba(255,255,255,0.03)"
              : item.up
              ? `${item.accent}10`
              : "rgba(239,68,68,0.08)"
          }
          color={
            item.up === null
              ? dimColor
              : item.up
              ? item.accent
              : "rgba(239,68,68,0.8)"
          }
          fontFamily="'JetBrains Mono', monospace"
          fontSize="8px"
          letterSpacing="0.1em"
          whiteSpace="nowrap"
        >
          {item.up === true ? "↑ " : item.up === false ? "↓ " : ""}
          {item.change}
        </Box>
      )}
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function StatsTicker({ pauseOnHover = true }) {
  const trackRef = useRef(null);
  const tlRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const bg = useColorModeValue("rgba(247,247,248,0.92)", "rgba(6,6,8,0.88)");
  const borderColor = useColorModeValue("rgba(0,0,0,0.08)", "rgba(255,255,255,0.06)");

  // GSAP infinite marquee
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Width of one repetition (1/3 of total since we tripled)
    const totalW = track.scrollWidth;
    const oneW = totalW / 3;

    tlRef.current = gsap.to(track, {
      x: `-=${oneW}`,
      duration: 38,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((v) => parseFloat(v) % oneW),
      },
    });

    return () => tlRef.current?.kill();
  }, []);

  // Pause / resume on hover
  useEffect(() => {
    if (!tlRef.current) return;
    if (paused) {
      gsap.to(tlRef.current, { timeScale: 0, duration: 0.4, ease: "power2.out" });
    } else {
      gsap.to(tlRef.current, { timeScale: 1, duration: 0.4, ease: "power2.in" });
    }
  }, [paused]);

  return (
    <Box
      as="section"
      bg="transparent"
      py={0}
      w="full"
      overflow="hidden"
      position="relative"
    >
      <Box
        bg={bg}
        backdropFilter="blur(16px)"
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor={borderColor}
        position="relative"
        onMouseEnter={() => pauseOnHover && setPaused(true)}
        onMouseLeave={() => pauseOnHover && setPaused(false)}
      >
        {/* Top hairline */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="1px"
          bgGradient="linear(to-r, transparent, #7c3aed, #ec4899, transparent)"
        />

        {/* Left fade mask */}
        <Box
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          w="80px"
          bgGradient={`linear(to-r, ${bg.replace("0.92", "1").replace("0.88", "1")}, transparent)`}
          zIndex={2}
          pointerEvents="none"
        />

        {/* Right fade mask */}
        <Box
          position="absolute"
          right={0}
          top={0}
          bottom={0}
          w="80px"
          bgGradient={`linear(to-l, ${bg.replace("0.92", "1").replace("0.88", "1")}, transparent)`}
          zIndex={2}
          pointerEvents="none"
        />

        {/* Live indicator */}
        <Box
          position="absolute"
          left={4}
          top="50%"
          transform="translateY(-50%)"
          zIndex={3}
          display="flex"
          alignItems="center"
          gap={1.5}
        >
          <Box
            w="6px"
            h="6px"
            borderRadius="50%"
            bg="#14b8a6"
            boxShadow="0 0 8px #14b8a6"
            style={{ animation: "blink 2s ease-in-out infinite" }}
          />
          <Text
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color="rgba(20,184,166,0.7)"
          >
            Live
          </Text>
        </Box>

        {/* Pause indicator */}
        {paused && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            position="absolute"
            right={4}
            top="50%"
            transform="translateY(-50%)"
            zIndex={3}
          >
            <Text
              fontFamily="'JetBrains Mono', monospace"
              fontSize="8px"
              letterSpacing="0.2em"
              textTransform="uppercase"
              color="rgba(124,58,237,0.6)"
            >
              ⏸ Paused
            </Text>
          </MotionBox>
        )}

        {/* Ticker track */}
        <Box overflow="hidden" py={3} pl="80px" pr="80px">
          <Flex ref={trackRef} align="center" style={{ willChange: "transform" }}>
            {TRACK.map((item, i) => (
              <TickerItem key={`${item.label}-${i}`} item={item} />
            ))}
          </Flex>
        </Box>

        {/* Bottom hairline */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="1px"
          bgGradient="linear(to-r, transparent, rgba(124,58,237,0.2), transparent)"
        />
      </Box>
    </Box>
  );
}