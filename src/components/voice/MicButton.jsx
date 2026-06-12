import { motion } from 'framer-motion'

export default function MicButton({ isRecording, onClick, size = 72 }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative rounded-full flex items-center justify-center cursor-pointer border-none
        ${isRecording ? 'mic-pulse-recording' : 'mic-pulse'}
      `}
      style={{
        width: size,
        height: size,
        background: isRecording ? 'var(--error)' : 'var(--accent)',
      }}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {/* Mic icon */}
      <svg
        width={size * 0.36}
        height={size * 0.36}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isRecording ? (
          /* Stop icon */
          <rect x="6" y="6" width="12" height="12" rx="2" fill="white" stroke="none" />
        ) : (
          /* Mic icon */
          <>
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="17" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </>
        )}
      </svg>
    </motion.button>
  )
}
