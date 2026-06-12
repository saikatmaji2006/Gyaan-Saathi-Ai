import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BookMascot from '../common/BookMascot'
import MicButton from './MicButton'
import useAppStore from '../../store/useAppStore'
import { isBackendAvailable, askVoiceCopilot } from '../../services/api'

export default function FloatingCopilot({ lessonContext = '', onPauseReading, onResumeReading }) {
  const { settings } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [askInput, setAskInput] = useState('')
  const [copilotState, setCopilotState] = useState('idle') // idle | thinking | answering
  const [copilotText, setCopilotText] = useState('Ask me anything about this lesson!')
  
  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setCopilotText('Ask me anything about this lesson!')
    }
  }

  const handleAskSubmit = async (e) => {
    e.preventDefault()
    if (!askInput.trim()) return

    const question = askInput.trim()
    setAskInput('')
    
    if (onPauseReading) onPauseReading()
    
    setCopilotState('thinking')
    setCopilotText('Thinking...')

    const backendUp = await isBackendAvailable()
    if (!backendUp) {
      const fallback = 'Backend is offline. Running in demo mode.'
      setCopilotText(fallback)
      speakAnswer(fallback)
      return
    }

    try {
      const result = await askVoiceCopilot(question, lessonContext)
      const ans = result.answer || 'I could not understand.'
      setCopilotText(ans)
      speakAnswer(ans)
    } catch (err) {
      const fallback = 'Error connecting to backend.'
      setCopilotText(fallback)
      speakAnswer(fallback)
    }
  }

  const speakAnswer = (text) => {
    setCopilotState('answering')
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = settings.language === 'english' ? 'en-IN' : 'hi-IN'
      utterance.onend = () => {
        setCopilotState('idle')
        if (onResumeReading) onResumeReading()
      }
      window.speechSynthesis.speak(utterance)
    } else {
      setCopilotState('idle')
      if (onResumeReading) setTimeout(() => onResumeReading(), 3000)
    }
  }

  let mascotPose = 'idle'
  if (copilotState === 'thinking') mascotPose = 'thinking'
  else if (copilotState === 'answering') mascotPose = 'speaking'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-80 bg-white rounded-2xl shadow-lg border border-[var(--border-light)] overflow-hidden"
          >
            <div className="bg-[var(--navbar-bg)] px-4 py-3 text-white font-bold flex justify-between items-center">
              <span>Gyan Saathi</span>
              <button onClick={handleToggle} className="text-white hover:text-gray-200 cursor-pointer bg-transparent border-none text-xl leading-none">
                ×
              </button>
            </div>
            
            <div className="p-5 flex flex-col items-center">
              <BookMascot pose={mascotPose} size={100} className="mb-4" />
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl p-3 w-full text-sm text-[var(--text-primary)] mb-4 text-center">
                {copilotText}
              </div>

              <form onSubmit={handleAskSubmit} className="ask-input-bar w-full">
                <input 
                  type="text" 
                  placeholder="Ask Gyan Saathi..." 
                  value={askInput}
                  onChange={e => setAskInput(e.target.value)}
                />
                <button type="submit" aria-label="Ask">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-[var(--border-light)] flex items-center justify-center cursor-pointer"
        >
          <BookMascot pose="idle" size={48} />
        </motion.button>
      )}
    </div>
  )
}
