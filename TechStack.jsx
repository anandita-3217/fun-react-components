// TechStack.jsx
// Horizontal tech stack display — grouped by category, proficiency bars,
// hover details, GSAP entrance. Zero external chart deps.
// Stack: React 18 + Chakra UI v2 + Framer Motion + GSAP

import { useRef, useState } from "react";
import { Box, Flex, Text, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { gsap } from "gsap";

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

// ── Stack data — edit freely ──────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "languages",
    label: "Languages",
    accent: "#14b8a6",
    icon: "{ }",
    items: [
      {
        name: "Python",
        level: 82,
        tag: "Primary",
        note: "Data scripts, APIs, automation & ML experiments",
        years: "3 yrs",
      },
      {
        name: "JavaScript",
        level: 78,
        tag: "Primary",
        note: "Full-stack web, async patterns, browser APIs",
        years: "2 yrs",
      },
      {
        name: "TypeScript",
        level: 68,
        tag: "Learning",
        note: "Type-safe React apps and Node services",
        years: "1 yr",
      },
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    accent: "#7c3aed",
    icon: "⬡",
    items: [
      {
        name: "React",
        level: 75,
        tag: "Confident",
        note: "Hooks, context, custom component libraries",
        years: "2 yrs",
      },
      {
        name: "Next.js",
        level: 65,
        tag: "Comfortable",
        note: "SSR, SSG, App Router, API routes",
        years: "1 yr",
      },
      {
        name: "Node / Express",
        level: 70,
        tag: "Confident",
        note: "REST APIs, middleware, JWT auth flows",
        years: "1.5 yrs",
      },
      {
        name: "Django",
        level: 72,
        tag: "Confident",
        note: "ORM, DRF, admin panel, auth system",
        years: "2 yrs",
      },
      {
        name: "FastAPI",
        level: 65,
        tag: "Comfortable",
        note: "Async endpoints, Pydantic schemas, docs",
        years: "1 yr",
      },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    accent: "#ec4899",
    icon: "▦",
    items: [
      {
        name: "PostgreSQL",
        level: 70,
        tag: "Confident",
        note: "Relational modelling, joins, indexing basics",
        years: "1.5 yrs",
      },
      {
        name: "MongoDB",
        level: 65,
        tag: "Comfortable",
        note: "Document design, aggregation pipelines",
        years: "1 yr",
      },
      {
        name: "Redis",
        level: 50,
        tag: "Familiar",
        note: "Caching layers, session storage, pub/sub",
        years: "< 1 yr",
      },
    ],
  },
  {
    id: "devtools",
    label: "Dev Tools",
    accent: "#e8c547",
    icon: "◈",
    items: [
      {
        name: "Git / GitHub",
        level: 85,
        tag: "Strong",
        note: "Branching, PRs, CI workflows, code review",
        years: "3 yrs",
      },
      {
        name: "Docker",
        level: 58,
        tag: "Comfortable",
        note: "Containerising apps, compose, basic networking",
        years: "1 yr",
      },
      {
        name: "Linux / Bash",
        level: 65,
        tag: "Comfortable",
        note: "CLI fluency, shell scripts, server setup",
        years: "2 yrs",
      },
    ],
  },
];

// Tag → color map
const TAG_META = {
  Primary:     { bg: "rgba(20,184,166,0.12)",  border: "rgba(20,184,166,0.35)",  color: "#14b8a6" },
  Strong:      { bg: "rgba(20,184,166,0.12)",  border: "rgba(20,184,166,0.35)",  color: "#14b8a6" },
  Confident:   { bg: "rgba(124,58,237,0.12)",  border: "rgba(124,58,237,0.35)",  color: "#7c3aed" },
  Comfortable: { bg: "rgba(236,72,153,0.10)",  border: "rgba(236,72,153,0.30)",  color: "#ec4899" },
  Learning:    { bg: "rgba(232,197,71,0.12)",  border: "rgba(232,197,71,0.35)",  color: "#e8c547" },
  Familiar:    { bg: "rgba(244,132,95,0.12)",  border: "rgba(244,132,95,0.35)",  color: "#f4845f" },
};

// ── Proficiency bar ───────────────────────────────────────────────────────────
function ProficiencyBar({ level, accent, animate }) {
  const trackColor = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  return (
    <Box w="full" h="3px" bg={trackColor} borderRadius="2px" overflow="hidden">
      <MotionBox
        h="full"
        borderRadius="2px"
        bg={accent}
        initial={{ width: 0 }}
        animate={{ width: animate ? `${level}%` : 0 }}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
        boxShadow={`0 0 6px ${accent}80`}
      />
    </Box>
  );
}

// ── Single skill card ─────────────────────────────────────────────────────────
function SkillCard({ item, accent, catIdx, itemIdx, inView }) {
  const [hovered, setHovered] = useState(false);

  const cardBg   = useColorModeValue("rgba(247,247,248,0.92)", "rgba(10,10,10,0.82)");
  const borderColor = useColorModeValue("rgba(0,0,0,0.08)", "rgba(255,255,255,0.06)");
  const textColor = useColorModeValue("#111", "rgba(255,255,255,0.88)");
  const dimColor  = useColorModeValue("#6b7280", "rgba(255,255,255,0.38)");

  const tag = TAG_META[item.tag] || TAG_META.Familiar;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: catIdx * 0.08 + itemIdx * 0.06,
        ease: [0.23, 1, 0.32, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      position="relative"
      role="group"
    >
      <Box
        bg={cardBg}
        backdropFilter="blur(14px)"
        border="1px solid"
        borderColor={hovered ? `${accent}50` : borderColor}
        borderRadius="12px"
        px={4}
        py={4}
        h="full"
        position="relative"
        overflow="hidden"
        style={{
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          boxShadow: hovered ? `0 0 24px ${accent}14` : "none",
        }}
      >
        {/* Top hairline */}
        <Box
          position="absolute"
          top={0} left={0} right={0} h="1px"
          bgGradient={`linear(to-r, transparent, ${accent}${hovered ? "60" : "28"}, transparent)`}
          style={{ transition: "opacity 0.2s ease" }}
        />

        {/* Name + tag row */}
        <Flex justify="space-between" align="flex-start" mb={3} gap={2}>
          <Text
            fontFamily="'Orbitron', sans-serif"
            fontWeight={700}
            fontSize="12px"
            letterSpacing="0.01em"
            color={hovered ? accent : textColor}
            style={{ transition: "color 0.2s ease" }}
          >
            {item.name}
          </Text>
          <Box
            px={1.5} py={0.5}
            borderRadius="4px"
            border="1px solid"
            borderColor={tag.border}
            bg={tag.bg}
            color={tag.color}
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7px"
            letterSpacing="0.16em"
            textTransform="uppercase"
            flexShrink={0}
          >
            {item.tag}
          </Box>
        </Flex>

        {/* Bar */}
        <Box mb={2}>
          <ProficiencyBar level={item.level} accent={accent} animate={inView} />
        </Box>

        {/* Level % + years */}
        <Flex justify="space-between" align="center" mb={3}>
          <Text
            fontFamily="'JetBrains Mono', monospace"
            fontSize="9px"
            letterSpacing="0.1em"
            color={accent}
          >
            {item.level}%
          </Text>
          <Text
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8px"
            letterSpacing="0.1em"
            color={dimColor}
          >
            {item.years}
          </Text>
        </Flex>

        {/* Note — slides in on hover */}
        <AnimatePresence>
          {hovered && (
            <MotionBox
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              overflow="hidden"
            >
              <Box
                h="1px"
                bgGradient={`linear(to-r, transparent, ${accent}30, transparent)`}
                mb={2}
              />
              <Text
                fontFamily="'Sora', sans-serif"
                fontSize="11px"
                color={dimColor}
                lineHeight={1.65}
              >
                {item.note}
              </Text>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </MotionBox>
  );
}

// ── Category section ──────────────────────────────────────────────────────────
function CategorySection({ cat, catIdx }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const dimColor    = useColorModeValue("#9ca3af", "rgba(255,255,255,0.28)");
  const borderColor = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.05)");

  return (
    <Box ref={ref}>
      {/* Category header */}
      <MotionFlex
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        align="center"
        gap={3}
        mb={4}
      >
        {/* Icon chip */}
        <Flex
          w="30px" h="30px"
          borderRadius="8px"
          border="1px solid"
          borderColor={`${cat.accent}35`}
          bg={`${cat.accent}10`}
          align="center"
          justify="center"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="11px"
          color={cat.accent}
          flexShrink={0}
        >
          {cat.icon}
        </Flex>

        <Text
          fontFamily="'Orbitron', sans-serif"
          fontWeight={800}
          fontSize="11px"
          letterSpacing="0.12em"
          textTransform="uppercase"
          color={cat.accent}
        >
          {cat.label}
        </Text>

        {/* Count */}
        <Box
          px={2} py={0.5}
          borderRadius="5px"
          border="1px solid"
          borderColor={`${cat.accent}25`}
          bg={`${cat.accent}08`}
          fontFamily="'JetBrains Mono', monospace"
          fontSize="8px"
          letterSpacing="0.12em"
          color={`${cat.accent}90`}
        >
          {cat.items.length} tools
        </Box>

        {/* Trailing line */}
        <Box flex={1} h="1px" bgGradient={`linear(to-r, ${cat.accent}25, transparent)`} />
      </MotionFlex>

      {/* Cards grid */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: cat.items.length >= 4 ? 3 : cat.items.length, lg: cat.items.length }}
        spacing={3}
      >
        {cat.items.map((item, i) => (
          <SkillCard
            key={item.name}
            item={item}
            accent={cat.accent}
            catIdx={catIdx}
            itemIdx={i}
            inView={inView}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

// ── Aggregate stat row ────────────────────────────────────────────────────────
function AggregateStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const dimColor  = useColorModeValue("#9ca3af", "rgba(255,255,255,0.28)");
  const cardBg    = useColorModeValue("rgba(247,247,248,0.90)", "rgba(10,10,10,0.78)");
  const borderColor = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.05)");

  const totalTools = CATEGORIES.reduce((a, c) => a + c.items.length, 0);
  const avgLevel   = Math.round(
    CATEGORIES.flatMap((c) => c.items).reduce((a, i) => a + i.level, 0) /
      CATEGORIES.flatMap((c) => c.items).length
  );
  const primaryCount = CATEGORIES.flatMap((c) =>
    c.items.filter((i) => ["Primary", "Strong", "Confident"].includes(i.tag))
  ).length;

  const stats = [
    { label: "Technologies", value: totalTools, accent: "#14b8a6", suffix: "" },
    { label: "Avg Proficiency", value: avgLevel, accent: "#7c3aed", suffix: "%" },
    { label: "Confident+ Tools", value: primaryCount, accent: "#ec4899", suffix: "" },
    { label: "Years Learning", value: "3+", accent: "#e8c547", suffix: "" },
  ];

  return (
    <Box
      ref={ref}
      bg={cardBg}
      backdropFilter="blur(14px)"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="14px"
      px={{ base: 5, md: 8 }}
      py={5}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute" top={0} left={0} right={0} h="1px"
        bgGradient="linear(to-r, transparent, #7c3aed, #ec4899, transparent)"
      />

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 6, md: 10 }}>
        {stats.map((s, i) => (
          <MotionBox
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            role="group"
          >
            <Text
              fontFamily="'Orbitron', sans-serif"
              fontWeight={800}
              fontSize={{ base: "24px", md: "30px" }}
              color={s.accent}
              lineHeight={1}
              mb={1}
              _groupHover={{ textShadow: `0 0 20px ${s.accent}` }}
              style={{ transition: "text-shadow 0.25s ease" }}
            >
              {s.value}{s.suffix}
            </Text>
            <Text
              fontFamily="'Sora', sans-serif"
              fontSize="10px"
              letterSpacing="0.12em"
              textTransform="uppercase"
              color={dimColor}
            >
              {s.label}
            </Text>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Box>
  );
}

// ── Proficiency legend ────────────────────────────────────────────────────────
function Legend() {
  const dimColor = useColorModeValue("#9ca3af", "rgba(255,255,255,0.28)");
  const entries = [
    { tag: "Strong / Primary", color: "#14b8a6", range: "80–100%" },
    { tag: "Confident",        color: "#7c3aed", range: "65–79%" },
    { tag: "Comfortable",      color: "#ec4899", range: "55–64%" },
    { tag: "Familiar",         color: "#f4845f", range: "40–54%" },
    { tag: "Learning",         color: "#e8c547", range: "< 40%" },
  ];

  return (
    <Flex flexWrap="wrap" gap={{ base: 3, md: 5 }} align="center">
      <Text
        fontFamily="'JetBrains Mono', monospace"
        fontSize="8px"
        letterSpacing="0.2em"
        textTransform="uppercase"
        color={dimColor}
        mr={1}
      >
        Legend:
      </Text>
      {entries.map((e) => (
        <Flex key={e.tag} align="center" gap={1.5}>
          <Box w="8px" h="8px" borderRadius="2px" bg={e.color} opacity={0.8} />
          <Text fontFamily="'JetBrains Mono', monospace" fontSize="8px" letterSpacing="0.1em" color={dimColor}>
            {e.tag}
          </Text>
          <Text fontFamily="'JetBrains Mono', monospace" fontSize="8px" color={`${e.color}80`}>
            {e.range}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function TechStack() {
  const dimColor  = useColorModeValue("#9ca3af", "rgba(255,255,255,0.28)");
  const line2Color = useColorModeValue("#2a2a2a", "rgba(255,255,255,0.18)");

  return (
    <Box
      as="section"
      bg="transparent"
      px={{ base: 5, md: 12, lg: 20 }}
      py={{ base: 20, md: 16 }}
    >
      <Flex direction="column" align="flex-start" w="full" maxW="1200px" mx="auto" gap={10}>

        {/* ── Section Header ── */}
        <Box>
          <Flex align="center" gap={3} mb={3}>
            <Box w="24px" h="1px" bgGradient="linear(to-r, #ec4899, #7c3aed)" />
            <Text
              fontFamily="'JetBrains Mono', monospace"
              fontSize="9px"
              letterSpacing="0.3em"
              textTransform="uppercase"
              color={dimColor}
            >
              Arsenal
            </Text>
          </Flex>
          <Text
            fontFamily="'Orbitron', sans-serif"
            fontWeight={900}
            fontSize={{ base: "26px", md: "clamp(26px,4vw,40px)" }}
            letterSpacing="-0.02em"
            lineHeight={1.05}
            bgGradient="linear(to-r, #1e40af, #7c3aed, #ec4899)"
            bgClip="text"
            display="inline-block"
            w="fit-content"
          >
            What I build
          </Text>
          <Text
            fontFamily="'Orbitron', sans-serif"
            fontWeight={900}
            fontSize={{ base: "26px", md: "clamp(26px,4vw,40px)" }}
            letterSpacing="-0.02em"
            lineHeight={1.05}
            color={line2Color}
          >
            with.
          </Text>

          <Text
            fontFamily="'Sora', sans-serif"
            fontSize={{ base: "13px", md: "14px" }}
            color={dimColor}
            lineHeight={1.8}
            maxW="520px"
            mt={4}
          >
            Three years in — still learning every day. These are the tools I
            reach for first, with honest numbers on where I actually stand.
          </Text>
        </Box>

        {/* ── Aggregate stats ── */}
        <AggregateStats />

        {/* ── Category sections ── */}
        <Flex direction="column" gap={10} w="full">
          {CATEGORIES.map((cat, i) => (
            <CategorySection key={cat.id} cat={cat} catIdx={i} />
          ))}
        </Flex>

        {/* ── Legend ── */}
        <Box w="full">
          <Box h="1px" bgGradient="linear(to-r, transparent, rgba(124,58,237,0.25), transparent)" mb={5} />
          <Legend />
        </Box>

      </Flex>
    </Box>
  );
}

// ── Usage ─────────────────────────────────────────────────────────────────────
// <TechStack />
// No props needed. Edit CATEGORIES[] at the top to update your stack.
// Each item: { name, level (0–100), tag, note, years }
// Tags: "Primary" | "Strong" | "Confident" | "Comfortable" | "Familiar" | "Learning"