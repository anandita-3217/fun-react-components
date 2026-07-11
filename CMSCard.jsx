import {
  Badge,
  Box,
  Button,
  Card,
  Collapse,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Title,
  Transition,
  useMantineTheme
} from '@mantine/core'
import { ChevronDown, ChevronUp } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState } from 'react'

export default function CMSCard({ thumbnail, name, position, description, socials, nickname }) {
  const theme = useMantineTheme()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Card
      style={{
        width: '60%',
        borderRadius: 12,
        backgroundColor: `color-mix(in srgb, var(--mantine-color-${theme.primaryColor}-5) 10%, var(--mantine-color-body))`
      }}
    >
      <Stack>
        <Box style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', maxHeight: 200 }}>
          <Image
            src={thumbnail}
            height={150}
            style={{ objectFit: 'cover', width: '100%', display: 'block' }}
          />
          {/* Lighter blurring affect */}
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, transparent 40%, var(--mantine-color-body) 100%)'
            }}
          />
          <Group>
            <Box style={{ position: 'absolute', bottom: 14, left: 15 }}>
              <Stack gap={1}>
                <Title
                  order={1}
                  fw={600}
                  style={{
                    color: `var(--mantine-color-${theme.primaryColor}-5)`
                  }}
                >
                  {name}
                </Title>
                <Text size="sm" c={`var(--mantine-color-${theme.primaryColor}-5)`}>
                  {position}
                </Text>
              </Stack>
            </Box>
            <Transition mounted={isOpen} transition="fade-up" duration={300} timingFunction="ease">
              {(styles) => (
                <Box style={{ position: 'absolute', bottom: 14, right: 15, ...styles }}>
                  <Badge variant="dot">{nickname}</Badge>
                </Box>
              )}
            </Transition>
          </Group>
        </Box>
        <Box
          style={{
            borderRadius: 12,
            padding: 12,
            backgroundColor: `color-mix(in srgb, var(--mantine-color-${theme.primaryColor}-5) 20%, var(--mantine-color-body))`
          }}
        >
          <Collapse
            in={isOpen}
            transitionDuration={400}
            transitionTimingFunction="ease"
            style={{
              borderRadius: 12,
              backgroundColor: `color-mix(in srgb, var(--mantine-color-${theme.primaryColor}-5) 20%, var(--mantine-color-body))`,
              overflow: 'hidden' // ✅ prevents content from pushing width during animation
            }}
          >
            <Stack mt="sm" px="xs">
              <Box>
                <Text color={`var(--mantine-color-${theme.primaryColor})-5`}>Lets Catch up</Text>
                <Group gap="xs" mt={4}>
                  {socials.map((social) => (
                    <Badge
                      key={social.label}
                      variant="light"
                      component="a"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ cursor: 'pointer' }}
                    >
                      {social.label}
                    </Badge>
                  ))}
                </Group>
              </Box>
              <Divider color={theme.primaryColor} />
              <Box
                style={{
                  borderRadius: 12,
                  paddingTop: 5,
                  inset: 5
                }}
              >
                <Text size="sm">{description}</Text>
              </Box>
            </Stack>
          </Collapse>
        </Box>
      </Stack>

      <Button variant="transparent" onClick={() => setIsOpen((c) => !c)}>
        {!isOpen ? <ChevronDown icon={20} /> : <ChevronUp icon={20} />}
      </Button>
    </Card>
  )
}
CMSCard.propTypes = {
  thumbnail: PropTypes.string,
  name: PropTypes.string,
  position: PropTypes.string,
  socials: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, url: PropTypes.string })),
  description: PropTypes.string,
  nickname: PropTypes.string
}