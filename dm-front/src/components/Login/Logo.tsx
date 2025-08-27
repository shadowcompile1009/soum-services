import { Text } from '@/components/Text';
import { Box } from '@/components/Box';

function DeltaLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
    >
      <defs>
        <linearGradient
          gradientTransform="rotate(25)"
          id="a"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#006678" />
          <stop offset="100%" stopColor="#4FA8FF" />
        </linearGradient>
      </defs>
      <path
        d="M0 32h32V0H0v32zM2 2h2.981L16.01 21.103 27.04 2H30v28H2V2z"
        fill="url(#a)"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <Box cssProps={{ position: 'relative' }}>
      <Box cssProps={{ position: 'absolute', top: 4 }}>
        <DeltaLogo />
      </Box>
      <Box cssProps={{ paddingLeft: 40 }}>
        <Text
          fontSize="headingTwo"
          fontWeight="semibold"
          color="static.black"
          lineHeight="1"
        >
          Delta Machine
        </Text>
        <Text fontSize="baseText" fontWeight="regular" color="static.black">
          By Soum
        </Text>
      </Box>
    </Box>
  );
}
