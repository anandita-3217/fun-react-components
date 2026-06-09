// ExperienceTimeline.jsx
// Vertical scroll rail with GSAP ScrollTrigger scrubber dot
// Stack: React 18 + Chakra UI v2 + Framer Motion + GSAP ScrollTrigger

import { useEffect, useRef, useState } from "react";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const MotionBox = motion.create(Box);

// ── Data ─────────────────────────────────────────────────────────────────────
const EXPERIENCES = [
  {
    id: 1,
    role: "Senior Software Engineer",
    company: "Vercel",
    period: "2023 — Present",
    location: "Remote, USA",
    type: "Full-time",
    accent: "#14b8a6",
    description:
      "Leading frontend infrastructure for Next.js edge runtime. Shipping performance tooling used by 1M+ developers. Reduced cold-start latency by 38% via WASM worker pools.",
    highlights: ["Edge Runtime", "OSS Maintainer", "DX Platform"],
    tech: ["TypeScript", "Rust", "WebAssembly", "Next.js", "Turborepo"],
    impact: [{ label: "Latency ↓", value: "38%" }, { label: "Stars Earned", value: "2.1K" }],
  },
  {
    id: 2,
    role: "Software Engineer II",
    company: "Linear",
    period: "2021 — 2023",
    location: "San Francisco, CA",
    type: "Full-time",
    accent: "#7c3aed",
    description:
      "Built core product features including Cycles, Roadmaps, and the real-time collaborative editor. Wrote the offline-first sync engine using CRDTs and SQLite.",
    highlights: ["Real-time Sync", "CRDT Engine", "Product Features"],
    tech: ["React", "TypeScript", "Electron", "SQLite", "Node.js"],
    impact: [{ label: "DAU Growth", value: "3×" }, { label: "Sync Latency", value: "12ms" }],
  },
  {
    id: 3,
    role: "Frontend Engineer",
    company: "Figma",
    period: "2020 — 2021",
    location: "San Francisco, CA",
    type: "Full-time",
    accent: "#ec4899",
    description:
      "Contributed to the multiplayer canvas engine. Implemented variable fonts support and the advanced stroke editor. Core contributor to the plugin API v2 spec.",
    highlights: ["Canvas Engine", "Plugin API", "Variable Fonts"],
    tech: ["C++", "TypeScript", "WebGL", "WASM", "React"],
    impact: [{ label: "Plugins Built", value: "200+" }, { label: "Canvas FPS", value: "60fps" }],
  },
  {
    id: 4,
    role: "Software Engineer",
    company: "Stripe",
    period: "2018 — 2020",
    location: "San Francisco, CA",
    type: "Full-time",
    accent: "#e8c547",
    description:
      "Dashboard team — rebuilt the payments analytics views with D3 custom charts, built the Stripe CLI local listener, and maintained the React component library.",
    highlights: ["Payments Analytics", "Stripe CLI", "Design System"],
    tech: ["React", "Ruby", "D3.js", "Go", "PostgreSQL"],
    impact: [{ label: "Revenue Viz", value: "$480B" }, { label: "CLI Downloads", value: "1.8M" }],
  },
  {
    id: 5,
    role: "Fullstack Intern",
    company: "Notion",
    period: "Summer 2017",
    location: "San Francisco, CA",
    type: "Internship",
    accent: "#f4845f",
    description:
      "Shipped the first version of Notion API authentication flow and built internal tooling for the content moderation team. Converted the mobile web experience to PWA.",
    highlights: ["API Auth", "PWA", "Content Tools"],
    tech: ["React", "Node.js", "MongoDB", "Python"],
    impact: [{ label: "API Uptime", value: "99.9%" }, { label: "Load Time ↓", value: "2.4s" }],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
function RoleCard({ exp, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;

  const cardBg = useColorModeValue("rgba(247,247,248,0.93)", "rgba(10,10,10,0.84)");
  const borderColor = useColorModeValue("rgba(0,0,0,0.08)", "rgba(255,255,255,0.06)");
  const textColor = useColorModeValue("#111", "rgba(255,255,255,0.88)");
  const dimColor = useColorModeValue("#6b7280", "rgba(255,255,255,0.4)");
  const statLabel = useColorModeValue("#9ca3af", "rgba(255,255,255,0.28)");

  return (
    <Flex
      ref={ref}
      direction={{ base: "column", md: isEven ? "row" : "row-reverse" }}
      align={{ base: "flex-start", md: "center" }}
      gap={{ base: 4, md: 8 }}
      position="relative"
      w="full"
    >
      {/* Card */}
      <MotionBox
        flex={1}
        initial={{ opacity: 0, x: isEven ? -32 : 32 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
        position="relative"
        role="group"
      >
        <Box
          bg={cardBg}
          backdropFilter="blur(16px)"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="16px"
          p={{ base: 5, md: 7 }}
          position="relative"
          overflow="hidden"
          style={{ transition: "border-color 0.25s ease, box-shadow 0.25s ease" }}
          _groupHover={{
            borderColor: exp.accent,
            boxShadow: `0 0 32px ${exp.accent}18`,
          }}
        >
          {/* Top hairline */}
          <Box position="absolute" top={0} left={0} right={0} h="1px"
            bgGradient={`linear(to-r, transparent, ${exp.accent}55, transparent)`} />

          {/* Corner brackets */}
          {[
            { top: "10px", left: "10px", borderTop: "2px solid", borderLeft: "2px solid" },
            { bottom: "10px", right: "10px", borderBottom: "2px solid", borderRight: "2px solid" },
          ].map((style, i) => (
            <Box key={i} position="absolute" w="12px" h="12px" borderColor={`${exp.accent}30`}
              opacity={0} _groupHover={{ opacity: 1 }}
              style={{ transition: "opacity 0.2s ease", ...style }} />
          ))}

          {/* Header */}
          <Flex justify="space-between" align="flex-start" mb={4} flexWrap="wrap" gap={2}>
            <Box>
              <Flex align="center" gap={2} mb={1}>
                <Box
                  px={2} py={0.5} borderRadius="5px" border="1px solid"
                  borderColor={`${exp.accent}35`} bg={`${exp.accent}10`}
                  color={exp.accent}
                  fontFamily="'JetBrains Mono', monospace" fontSize="8px"
                  letterSpacing="0.18em" textTransform="uppercase"
                >
                  {exp.type}
                </Box>
                <Text fontFamily="'JetBrains Mono', monospace" fontSize="9px"
                  letterSpacing="0.12em" color={dimColor}>{exp.period}</Text>
              </Flex>
              <Text fontFamily="'Orbitron', sans-serif" fontWeight={800}
                fontSize={{ base: "15px", md: "18px" }} letterSpacing="-0.01em"
                color={textColor} _groupHover={{ color: exp.accent }}
                style={{ transition: "color 0.2s ease" }}>
                {exp.role}
              </Text>
              <Text fontFamily="'Sora', sans-serif" fontSize="13px"
                color={exp.accent} fontWeight={600} mt={0.5}>
                {exp.company}
              </Text>
            </Box>
            <Text fontFamily="'JetBrains Mono', monospace" fontSize="9px"
              letterSpacing="0.1em" color={dimColor}>{exp.location}</Text>
          </Flex>

          {/* Description */}
          <Text fontFamily="'Sora', sans-serif" fontSize="13px" color={dimColor}
            lineHeight={1.75} mb={5}>{exp.description}</Text>

          {/* Impact stats */}
          <Flex gap={6} mb={5}>
            {exp.impact.map((m) => (
              <Box key={m.label}>
                <Text fontFamily="'Orbitron', sans-serif" fontWeight={800}
                  fontSize="22px" color={exp.accent}
                  _groupHover={{ textShadow: `0 0 20px ${exp.accent}` }}
                  style={{ transition: "text-shadow 0.25s ease" }}>
                  {m.value}
                </Text>
                <Text fontFamily="'Sora', sans-serif" fontSize="10px"
                  letterSpacing="0.12em" textTransform="uppercase" color={statLabel}>
                  {m.label}
                </Text>
              </Box>
            ))}
          </Flex>

          <Box h="1px" bgGradient="linear(to-r, transparent, rgba(124,58,237,0.25), transparent)" mb={4} />

          {/* Highlights */}
          <Flex flexWrap="wrap" gap={1.5} mb={3}>
            {exp.highlights.map((h) => (
              <Box key={h} px={2} py={0.5} borderRadius="5px"
                border="1px solid" borderColor={`${exp.accent}28`}
                bg={`${exp.accent}08`} color={exp.accent}
                fontFamily="'JetBrains Mono', monospace" fontSize="8px"
                letterSpacing="0.14em" textTransform="uppercase">
                {h}
              </Box>
            ))}
          </Flex>

          {/* Tech */}
          <Flex flexWrap="wrap" gap={1.5}>
            {exp.tech.map((t) => (
              <Box key={t} px={2} py={0.5} borderRadius="5px"
                border="1px solid" borderColor="rgba(255,255,255,0.07)"
                bg="rgba(255,255,255,0.03)" color={dimColor}
                fontFamily="'JetBrains Mono', monospace" fontSize="8px"
                letterSpacing="0.12em" textTransform="uppercase">
                {t}
              </Box>
            ))}
          </Flex>
        </Box>
      </MotionBox>

      {/* Timeline connector (desktop) */}
      <Flex
        display={{ base: "none", md: "flex" }}
        direction="column"
        align="center"
        flexShrink={0}
        gap={0}
        w="40px"
      >
        <MotionBox
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          w="14px"
          h="14px"
          borderRadius="50%"
          bg={exp.accent}
          boxShadow={`0 0 18px ${exp.accent}`}
          position="relative"
          zIndex={2}
        >
          {/* Inner pulse */}
          <Box position="absolute" inset="-4px" borderRadius="50%"
            border="1px solid" borderColor={`${exp.accent}45`} />
        </MotionBox>
      </Flex>

      {/* Mobile dot */}
      <MotionBox
        display={{ base: "flex", md: "none" }}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.35 }}
        w="8px" h="8px" borderRadius="50%"
        bg={exp.accent}
        boxShadow={`0 0 12px ${exp.accent}`}
        flexShrink={0}
        mt={1}
      />
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ExperienceTimeline() {
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const scrubberRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const dimColor = useColorModeValue("#9ca3af", "rgba(255,255,255,0.28)");
  const line2Color = useColorModeValue("#2a2a2a", "rgba(255,255,255,0.18)");
  const railColor = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");

  // GSAP ScrollTrigger scrubber
  useEffect(() => {
    if (!railRef.current || !scrubberRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%",
      end: "bottom 60%",
      scrub: 1,
      onUpdate: (self) => {
        setProgress(self.progress);
        if (scrubberRef.current) {
          const rail = railRef.current;
          const railH = rail.offsetHeight;
          gsap.set(scrubberRef.current, { y: self.progress * (railH - 20) });
        }
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <Box
      as="section"
      ref={sectionRef}
      bg="transparent"
      px={{ base: 5, md: 12, lg: 20 }}
      py={{ base: 20, md: 16 }}
    >
      <Flex direction="column" align="flex-start" w="full" maxW="1200px" mx="auto" gap={8}>
        {/* Header */}
        <Box mb={4}>
          <Flex align="center" gap={3} mb={3}>
            <Box w="24px" h="1px" bgGradient="linear(to-r, #ec4899, #7c3aed)" />
            <Text fontFamily="'JetBrains Mono', monospace" fontSize="9px"
              letterSpacing="0.3em" textTransform="uppercase" color={dimColor}>
              Career
            </Text>
          </Flex>
          <Text fontFamily="'Orbitron', sans-serif" fontWeight={900}
            fontSize={{ base: "26px", md: "clamp(26px,4vw,40px)" }}
            letterSpacing="-0.02em" lineHeight={1.05}
            bgGradient="linear(to-r, #1e40af, #7c3aed, #ec4899)"
            bgClip="text" display="inline-block" w="fit-content">
            Where I've
          </Text>
          <Text fontFamily="'Orbitron', sans-serif" fontWeight={900}
            fontSize={{ base: "26px", md: "clamp(26px,4vw,40px)" }}
            letterSpacing="-0.02em" lineHeight={1.05} color={line2Color}>
            Shipped.
          </Text>
        </Box>

        <Flex w="full" gap={{ base: 4, md: 8 }} align="flex-start">
          {/* Desktop: Rail */}
          <Box
            display={{ base: "none", md: "flex" }}
            flexDirection="column"
            alignItems="center"
            flexShrink={0}
            w="40px"
            position="relative"
          >
            {/* Rail background */}
            <Box
              ref={railRef}
              position="absolute"
              top={0}
              bottom={0}
              left="50%"
              transform="translateX(-50%)"
              w="1px"
              bg={railColor}
            />
            {/* Progress fill */}
            <Box
              position="absolute"
              top={0}
              left="50%"
              transform="translateX(-50%)"
              w="1px"
              bgGradient="linear(to-b, #1e40af, #7c3aed, #ec4899)"
              style={{ height: `${progress * 100}%`, transition: "height 0.1s linear" }}
            />
            {/* Scrubber dot */}
            <Box
              ref={scrubberRef}
              position="absolute"
              top={0}
              left="50%"
              transform="translateX(-50%)"
              w="20px"
              h="20px"
              borderRadius="50%"
              bg="rgba(10,10,10,0.9)"
              border="2px solid"
              borderColor="#7c3aed"
              boxShadow="0 0 16px #7c3aed, 0 0 32px rgba(124,58,237,0.3)"
              zIndex={10}
            />
          </Box>

          {/* Cards column */}
          <Flex direction="column" flex={1} gap={{ base: 6, md: 10 }}>
            {EXPERIENCES.map((exp, i) => (
              <RoleCard key={exp.id} exp={exp} index={i} />
            ))}
          </Flex>
        </Flex>

        {/* Footer year range */}
        <Flex align="center" gap={4} mt={4}>
          <Text fontFamily="'JetBrains Mono', monospace" fontSize="10px"
            letterSpacing="0.18em" textTransform="uppercase" color={dimColor}>
            2017 — Present
          </Text>
          <Box flex={1} h="1px" bgGradient="linear(to-r, rgba(124,58,237,0.3), transparent)" />
          <Text fontFamily="'JetBrains Mono', monospace" fontSize="10px"
            letterSpacing="0.18em" color={dimColor}>{EXPERIENCES.length} roles</Text>
        </Flex>
      </Flex>
    </Box>
  );
}