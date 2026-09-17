import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BookMascot from './BookMascot'
import { isBackendAvailable } from '../../services/api'

const MASCOT_POSES = ['idle', 'thinking', 'listening', 'teaching', 'happy']

const STATUS_MESSAGES = [
  'Waking up the AI brain… 🧠',
  'Preparing your learning experience…',
  'Setting up voice recognition… 🎙️',
  'Loading educational superpowers… ✨',
  'Connecting to AI backend…',
  'Almost there, hold on… ⏳',
  'Gyan Saathi is stretching… 🤸',
  'Warming up the knowledge engine…',
]

const DID_YOU_KNOW = [
  'India has the largest school system in the world with over 1.5 million schools!',
  'The word "algebra" comes from the Arabic "al-jabr", meaning reunion of broken parts.',
  'Photosynthesis produces about 330 billion tonnes of oxygen every year!',
  'The human brain can process an image in just 13 milliseconds.',
  'A single Google search uses about 0.3 watt-hours of electricity.',
  'The first computer programmer was Ada Lovelace, who wrote the first algorithm in 1843.',
  'Sound travels about 4.3 times faster through water than through air!',
  'There are more possible games of chess than atoms in the observable universe.',
  'Honey never spoils — archaeologists have found 3,000-year-old honey still edible!',
  'Octopuses have three hearts and blue blood.',
]

/**
 * BackendLoader — full-screen loading gate shown while the backend is cold-starting.
 *
 * Props:
 *   onReady — callback fired once the backend health check passes
 */
export default function BackendLoader({ onReady }) {
  const [poseIndex, setPoseIndex] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * DID_YOU_KNOW.length))
  const [progress, setProgress] = useState(0)
  const [connected, setConnected] = useState(false)
  const pollRef = useRef(null)
  const attemptRef = useRef(0)
  const onReadyRef = useRef(onReady)

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  // Transition when connected
  useEffect(() => {
    if (!connected) return
    const timer = setTimeout(() => {
      onReadyRef.current?.()
    }, 1100)
    return () => clearTimeout(timer)
  }, [connected])

  // Poll backend every 2.5 seconds until connected
  useEffect(() => {
    if (connected) return
    let cancelled = false

    const poll = async () => {
      if (cancelled) return
      try {
        const ok = await isBackendAvailable()
        if (cancelled) return

        attemptRef.current += 1

        if (ok) {
          setConnected(true)
          return
        }
      } catch {
        // Retry silently
      }

      if (!cancelled) {
        pollRef.current = setTimeout(poll, 2500)
      }
    }

    poll() // Check immediately

    return () => {
      cancelled = true
      if (pollRef.current) clearTimeout(pollRef.current)
    }
  }, [connected])

  // Cycle mascot poses every 2.5s
  useEffect(() => {
    if (connected) return
    const id = setInterval(() => {
      setPoseIndex((i) => (i + 1) % MASCOT_POSES.length)
    }, 2500)
    return () => clearInterval(id)
  }, [connected])

  // Cycle status messages every 3.5s
  useEffect(() => {
    if (connected) return
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % STATUS_MESSAGES.length)
    }, 3500)
    return () => clearInterval(id)
  }, [connected])

  // Rotate fun facts every 6s
  useEffect(() => {
    if (connected) return
    const id = setInterval(() => {
      setFactIndex((i) => (i + 1) % DID_YOU_KNOW.length)
    }, 6000)
    return () => clearInterval(id)
  }, [connected])

  // Simulate progress bar (asymptotic, never reaches 100 until connected)
  useEffect(() => {
    if (connected) {
      setProgress(100)
      return
    }
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p + 0.1
        if (p >= 70) return p + 0.3
        if (p >= 50) return p + 0.5
        return p + 1.2
      })
    }, 300)
    return () => clearInterval(id)
  }, [connected])

  const currentPose = connected ? 'celebrating' : MASCOT_POSES[poseIndex]
  const currentMessage = connected
    ? 'Connected! Let\'s learn! 🎉'
    : STATUS_MESSAGES[messageIndex]

  return (
    <motion.div
      className="backend-loader"
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Floating particles */}
      <div className="loader-particles" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="loader-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="loader-content">
        {/* Logo */}
        <motion.div
          className="loader-logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="loader-logo__icon">📘</span>
          <span className="loader-logo__text">Gyan Saathi</span>
        </motion.div>

        {/* Mascot */}
        <motion.div
          className="loader-mascot"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, type: 'spring', stiffness: 200 }}
        >
          <BookMascot pose={currentPose} size={180} />
        </motion.div>

        {/* Speech bubble / status message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessage}
            className="loader-speech"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="loader-speech__text">{currentMessage}</p>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <motion.div
          className="loader-progress-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="loader-progress-bar">
            <motion.div
              className="loader-progress-bar__fill"
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
            <div className="loader-progress-bar__shimmer" />
          </div>
          <p className="loader-progress-label">
            {connected ? 'Backend connected ✅' : `Connecting… ${Math.floor(Math.min(progress, 99))}%`}
          </p>
        </motion.div>

        {/* Did You Know facts */}
        <motion.div
          className="loader-facts"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={factIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="loader-fact"
            >
              <span className="loader-fact__label">💡 Did you know?</span>
              <p className="loader-fact__text">{DID_YOU_KNOW[factIndex]}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        {/* Skip button for immediate entry or demo mode */}
        {!connected && (
          <motion.div
            className="loader-skip-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0 }}
          >
            <button
              type="button"
              className="loader-skip-btn"
              onClick={() => onReadyRef.current?.()}
            >
              Continue in Demo Mode →
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.p
        className="loader-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2 }}
      >
        Free-tier servers sleep when idle — waking up takes a moment ☕
      </motion.p>
    </motion.div>
  )
}
