import { motion } from 'framer-motion'

/**
 * BookMascot — a friendly open-book character used across the app.
 *
 * Props:
 *   pose  — 'idle' | 'listening' | 'thinking' | 'speaking' | 'happy' | 'encouraging' | 'teaching' | 'celebrating'
 *   size  — pixel width/height (default 120)
 *   className — optional extra classes
 */

const POSE_CONFIG = {
  idle:         { bodyFill: '#3B82F6', eyeScale: 1,    mouthType: 'smile',   armAngle: 0,   bounce: true  },
  listening:    { bodyFill: '#2563EB', eyeScale: 1.2,  mouthType: 'open',    armAngle: 5,   bounce: false },
  thinking:     { bodyFill: '#F59E0B', eyeScale: 0.7,  mouthType: 'hmm',     armAngle: -5,  bounce: false },
  speaking:     { bodyFill: '#059669', eyeScale: 1.05, mouthType: 'talking', armAngle: 8,   bounce: false },
  happy:        { bodyFill: '#10B981', eyeScale: 1.1,  mouthType: 'grin',    armAngle: 20,  bounce: true  },
  encouraging:  { bodyFill: '#F97316', eyeScale: 1,    mouthType: 'smile',   armAngle: 15,  bounce: true  },
  teaching:     { bodyFill: '#3B82F6', eyeScale: 1,    mouthType: 'smile',   armAngle: 30,  bounce: false },
  celebrating:  { bodyFill: '#8B5CF6', eyeScale: 1.15, mouthType: 'grin',    armAngle: 35,  bounce: true  },
}

export default function BookMascot({ pose = 'idle', size = 120, className = '' }) {
  const config = POSE_CONFIG[pose] || POSE_CONFIG.idle

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      animate={config.bounce ? { y: [0, -4, 0] } : { y: 0 }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 140 150" width={size} height={size} style={{ overflow: 'visible' }}>

        {/* ── Book Body (open book shape) ── */}
        {/* Left page */}
        <motion.path
          d="M 30 35 Q 30 30, 35 28 L 70 22 L 70 110 L 35 115 Q 30 116, 30 110 Z"
          animate={{ fill: config.bodyFill }}
          transition={{ duration: 0.3 }}
          stroke="#1e3a5f"
          strokeWidth="1.5"
        />
        {/* Right page */}
        <motion.path
          d="M 110 35 Q 110 30, 105 28 L 70 22 L 70 110 L 105 115 Q 110 116, 110 110 Z"
          animate={{ fill: config.bodyFill }}
          transition={{ duration: 0.3 }}
          stroke="#1e3a5f"
          strokeWidth="1.5"
        />
        {/* Spine */}
        <rect x="67" y="20" width="6" height="96" rx="2" fill="#1e3a5f" opacity="0.3" />

        {/* Page lines (left) */}
        <line x1="38" y1="90" x2="64" y2="86" stroke="white" strokeWidth="1" opacity="0.25" />
        <line x1="38" y1="96" x2="64" y2="92" stroke="white" strokeWidth="1" opacity="0.25" />
        <line x1="38" y1="102" x2="64" y2="98" stroke="white" strokeWidth="1" opacity="0.25" />

        {/* Page lines (right) */}
        <line x1="76" y1="86" x2="102" y2="90" stroke="white" strokeWidth="1" opacity="0.25" />
        <line x1="76" y1="92" x2="102" y2="96" stroke="white" strokeWidth="1" opacity="0.25" />
        <line x1="76" y1="98" x2="102" y2="102" stroke="white" strokeWidth="1" opacity="0.25" />

        {/* ── Face area (lighter oval) ── */}
        <ellipse cx="70" cy="58" rx="30" ry="26" fill="white" opacity="0.2" />

        {/* ── Eyes ── */}
        {/* Left eye white */}
        <motion.ellipse
          cx="55" cy="52"
          rx="8" ry="9"
          fill="white"
          animate={{ scaleY: config.eyeScale }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: '55px 52px' }}
        />
        {/* Left pupil */}
        <motion.circle
          cx="57" cy="53" r="4"
          fill="#1e293b"
          animate={{
            x: pose === 'listening' ? [-1, 1, -1] : pose === 'teaching' ? [0, 2, 0] : 0,
          }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        {/* Left eye shine */}
        <circle cx="58.5" cy="50.5" r="1.5" fill="white" opacity="0.8" />

        {/* Right eye white */}
        <motion.ellipse
          cx="85" cy="52"
          rx="8" ry="9"
          fill="white"
          animate={{ scaleY: config.eyeScale }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: '85px 52px' }}
        />
        {/* Right pupil */}
        <motion.circle
          cx="83" cy="53" r="4"
          fill="#1e293b"
          animate={{
            x: pose === 'listening' ? [-1, 1, -1] : pose === 'teaching' ? [0, 2, 0] : 0,
          }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        {/* Right eye shine */}
        <circle cx="84.5" cy="50.5" r="1.5" fill="white" opacity="0.8" />

        {/* Eyebrows */}
        {pose === 'thinking' && (
          <>
            <line x1="48" y1="40" x2="61" y2="42" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
            <line x1="80" y1="42" x2="93" y2="40" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {(pose === 'happy' || pose === 'celebrating') && (
          <>
            <path d="M 48 42 Q 54 38, 61 42" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 79 42 Q 86 38, 93 42" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* ── Mouth ── */}
        {config.mouthType === 'smile' && (
          <path d="M 61 68 Q 70 76, 79 68" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {config.mouthType === 'grin' && (
          <path d="M 58 66 Q 70 80, 82 66" stroke="#1e293b" strokeWidth="2" fill="#fff" strokeLinecap="round" />
        )}
        {config.mouthType === 'open' && (
          <ellipse cx="70" cy="70" rx="6" ry="5" fill="#1e293b" />
        )}
        {config.mouthType === 'hmm' && (
          <line x1="63" y1="70" x2="77" y2="70" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        )}
        {config.mouthType === 'talking' && (
          <motion.ellipse
            cx="70" cy="70"
            rx="7"
            fill="#1e293b"
            animate={{ ry: [4, 7, 4] }}
            transition={{ duration: 0.35, repeat: Infinity }}
          />
        )}

        {/* ── Blush cheeks ── */}
        <circle cx="45" cy="64" r="5" fill="#FDA4AF" opacity="0.4" />
        <circle cx="95" cy="64" r="5" fill="#FDA4AF" opacity="0.4" />

        {/* ── Left Arm ── */}
        <motion.g
          animate={{ rotate: -config.armAngle }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ transformOrigin: '30px 75px' }}
        >
          <path d="M 30 75 Q 18 85, 14 95" stroke={config.bodyFill} strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Hand */}
          <circle cx="14" cy="97" r="5" fill="#FBBF24" />
          {(pose === 'encouraging' || pose === 'happy') && (
            /* Thumbs up */
            <rect x="11" y="88" width="4" height="8" rx="2" fill="#FBBF24" />
          )}
        </motion.g>

        {/* ── Right Arm ── */}
        <motion.g
          animate={{ rotate: config.armAngle }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ transformOrigin: '110px 75px' }}
        >
          <path d="M 110 75 Q 122 85, 126 95" stroke={config.bodyFill} strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Hand */}
          <circle cx="126" cy="97" r="5" fill="#FBBF24" />
          {pose === 'teaching' && (
            /* Pointer finger */
            <rect x="125" y="87" width="3" height="10" rx="1.5" fill="#FBBF24" />
          )}
        </motion.g>

        {/* ── Legs ── */}
        <rect x="50" y="112" width="10" height="18" rx="5" fill={config.bodyFill} stroke="#1e3a5f" strokeWidth="1" />
        <rect x="80" y="112" width="10" height="18" rx="5" fill={config.bodyFill} stroke="#1e3a5f" strokeWidth="1" />
        {/* Shoes */}
        <ellipse cx="55" cy="132" rx="8" ry="4" fill="#1e3a5f" />
        <ellipse cx="85" cy="132" rx="8" ry="4" fill="#1e3a5f" />

        {/* ── Celebrating sparkles ── */}
        {pose === 'celebrating' && (
          <>
            <motion.circle
              cx="25" cy="30" r="3" fill="#FBBF24"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.circle
              cx="115" cy="25" r="2.5" fill="#F472B6"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="120" cy="45" r="2" fill="#34D399"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
            />
            <motion.polygon
              points="20,50 22,44 24,50 18,47 26,47"
              fill="#FBBF24"
              animate={{ opacity: [0, 1, 0], rotate: [0, 30, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              style={{ transformOrigin: '22px 47px' }}
            />
          </>
        )}

        {/* ── Listening pulse rings ── */}
        {pose === 'listening' && (
          <>
            <motion.circle
              cx="70" cy="60" r="42"
              fill="none" stroke="#2563EB"
              strokeWidth="1.5"
              animate={{ r: [42, 55, 42], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.circle
              cx="70" cy="60" r="48"
              fill="none" stroke="#2563EB"
              strokeWidth="1"
              animate={{ r: [48, 62, 48], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}

        {/* ── Thinking dots ── */}
        {pose === 'thinking' && (
          <>
            <motion.circle
              cx="100" cy="38" r="2.5" fill="#F59E0B"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
            />
            <motion.circle
              cx="110" cy="30" r="3" fill="#F59E0B"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.25 }}
            />
            <motion.circle
              cx="120" cy="22" r="3.5" fill="#F59E0B"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </svg>
    </motion.div>
  )
}
