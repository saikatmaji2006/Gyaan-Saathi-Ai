import { motion } from 'framer-motion'

const states = {
  idle: { bodyColor: '#4F46E5', eyeScale: 1 },
  listening: { bodyColor: '#DC2626', eyeScale: 1.15 },
  processing: { bodyColor: '#D97706', eyeScale: 0.85 },
  speaking: { bodyColor: '#059669', eyeScale: 1.05 },
}

export default function Avatar({ state = 'idle', size = 120 }) {
  const s = states[state] || states.idle

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      animate={{ y: state === 'idle' ? [0, -4, 0] : 0 }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: s.bodyColor,
          opacity: state === 'listening' ? [0.15, 0.3, 0.15] : 0.1,
          scale: state === 'listening' ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ filter: 'blur(20px)' }}
      />

      {/* Main body */}
      <svg viewBox="0 0 120 120" width={size} height={size}>
        {/* Body circle */}
        <motion.circle
          cx="60" cy="65" r="40"
          animate={{ fill: s.bodyColor }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Belly */}
        <ellipse cx="60" cy="75" rx="25" ry="20" fill="white" opacity="0.2" />
        
        {/* Left ear */}
        <motion.polygon
          points="30,35 20,10 45,30"
          animate={{ fill: s.bodyColor }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Right ear */}
        <motion.polygon
          points="90,35 100,10 75,30"
          animate={{ fill: s.bodyColor }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Face circle */}
        <circle cx="60" cy="60" r="28" fill="white" opacity="0.15" />
        
        {/* Left eye */}
        <motion.ellipse
          cx="48" cy="56"
          rx="6" ry="7"
          fill="white"
          animate={{ scaleY: s.eyeScale }}
          transition={{ duration: 0.3 }}
        />
        <motion.circle
          cx="49" cy="57" r="3"
          fill="#1a1a2e"
          animate={{
            x: state === 'listening' ? [-1, 1, -1] : 0,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Right eye */}
        <motion.ellipse
          cx="72" cy="56"
          rx="6" ry="7"
          fill="white"
          animate={{ scaleY: s.eyeScale }}
          transition={{ duration: 0.3 }}
        />
        <motion.circle
          cx="71" cy="57" r="3"
          fill="#1a1a2e"
          animate={{
            x: state === 'listening' ? [-1, 1, -1] : 0,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Beak / mouth */}
        {state === 'speaking' ? (
          <motion.ellipse
            cx="60" cy="72" rx="5" ry="4"
            fill="#1a1a2e"
            animate={{ ry: [3, 5, 3] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
        ) : (
          <polygon points="56,70 60,75 64,70" fill="#F59E0B" />
        )}
        
        {/* Graduation cap */}
        <polygon points="60,22 35,32 60,38 85,32" fill="#1a1a2e" />
        <rect x="55" y="18" width="10" height="6" rx="1" fill="#1a1a2e" />
        <line x1="82" y1="32" x2="88" y2="42" stroke="#1a1a2e" strokeWidth="2" />
        <circle cx="88" cy="44" r="3" fill="#F59E0B" />
      </svg>
    </motion.div>
  )
}
