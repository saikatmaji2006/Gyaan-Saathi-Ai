import { motion, AnimatePresence } from 'framer-motion'

/**
 * SpeechBubble — a cloud-shaped dialogue box that appears near the mascot.
 *
 * Props:
 *   text      — the text to display
 *   visible   — whether the bubble is shown
 *   position  — 'left' | 'right' (tail direction, default 'left')
 *   maxWidth  — max width in px (default 260)
 *   className — optional extra classes
 */
export default function SpeechBubble({ text, visible = true, position = 'right', maxWidth = 260, className = '' }) {
  if (!text) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`speech-bubble speech-bubble--${position} ${className}`}
          style={{ maxWidth }}
        >
          <p className="speech-bubble__text">{text}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
