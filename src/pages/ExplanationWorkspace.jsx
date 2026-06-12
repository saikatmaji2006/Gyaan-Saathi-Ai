import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CardRenderer from '../components/teaching/CardRenderer'
import BookMascot from '../components/common/BookMascot'
import SpeechBubble from '../components/common/SpeechBubble'
import MicButton from '../components/voice/MicButton'
import useAppStore from '../store/useAppStore'
import { isBackendAvailable, generateQuiz, askVoiceCopilot } from '../services/api'
import { DEMO_LESSON_LINEAR, DEMO_QUIZ } from '../data/demoData'

export default function ExplanationWorkspace() {
  const navigate = useNavigate()
  const { currentLesson, setCurrentLesson, setCurrentQuiz, settings, voiceState, setVoiceState } = useAppStore()
  const [activeSection, setActiveSection] = useState(-1)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Mascot & Copilot state
  const [copilotState, setCopilotState] = useState('idle') // idle | thinking | answering
  const [copilotText, setCopilotText] = useState('')
  const [askInput, setAskInput] = useState('')

  const activeSectionRef = useRef(-1)
  const isMutedRef = useRef(false)
  const pausedByRef = useRef(null)

  const lesson = currentLesson || DEMO_LESSON_LINEAR

  useEffect(() => {
    if (!currentLesson) {
      setCurrentLesson(DEMO_LESSON_LINEAR)
    }
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  useEffect(() => {
    activeSectionRef.current = activeSection
  }, [activeSection])

  // ─── Speech & Sequential Advance ───────────────────────────

  const speakSection = useCallback((index) => {
    const section = lesson.sections[index]
    if (!section?.speak_text) {
      setTimeout(() => autoAdvance(index), 1500)
      return
    }

    if (isMutedRef.current) {
      setTimeout(() => autoAdvance(index), 3000)
      return
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(section.speak_text)
      utterance.lang = settings.language === 'english' ? 'en-IN' : 'hi-IN'
      utterance.rate = settings.voiceSpeed === 'slow' ? 0.75 : settings.voiceSpeed === 'fast' ? 1.25 : 0.9

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        if (!pausedByRef.current) {
          autoAdvance(index)
        }
      }
      window.speechSynthesis.speak(utterance)
    }
  }, [lesson, settings])

  const autoAdvance = useCallback((currentIndex) => {
    if (currentIndex < lesson.sections.length - 1) {
      const nextIndex = currentIndex + 1
      setActiveSection(nextIndex)
      setTimeout(() => speakSection(nextIndex), 800)
    }
  }, [lesson, speakSection])

  const handleStartLesson = () => {
    setActiveSection(0)
    speakSection(0)
  }

  const handleSectionClick = (index) => {
    if (index <= activeSection || activeSection < 0) return
    window.speechSynthesis?.cancel()
    setActiveSection(index)
    speakSection(index)
  }

  const handleGenerateQuiz = async () => {
    window.speechSynthesis?.cancel()
    setIsGeneratingQuiz(true)
    const backendUp = await isBackendAvailable()
    if (backendUp) {
      try {
        const quiz = await generateQuiz({
          topic: lesson.title || 'General Knowledge',
          class_level: settings.classLevel,
          difficulty: settings.difficulty,
          question_count: settings.questionCount,
          language: settings.language,
        })
        setCurrentQuiz(quiz)
        setIsGeneratingQuiz(false)
        navigate('/quiz')
        return
      } catch (err) {
        console.warn('Quiz generation failed:', err.message)
      }
    }
    setCurrentQuiz(DEMO_QUIZ)
    setIsGeneratingQuiz(false)
    navigate('/quiz')
  }

  const toggleMute = () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    isMutedRef.current = nextMuted

    if (nextMuted) {
      window.speechSynthesis?.cancel()
      setIsSpeaking(false)
    } else {
      window.speechSynthesis?.cancel()
      setActiveSection(0)
      speakSection(0)
    }
  }

  // ─── Ask Copilot Logic ─────────────────────────────────────
  
  const handleMicClick = () => {
    if (voiceState === 'listening') return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = settings.language === 'english' ? 'en-US' : 'en-IN'

    recognition.onstart = () => {
      setVoiceState('listening')
      setAskInput('')
      
      // Pause lesson reading
      pausedByRef.current = 'copilot'
      setIsPaused(true)
      window.speechSynthesis?.cancel()
      setIsSpeaking(false)
    }

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setAskInput(text)
      setVoiceState('idle')
      // Automatically submit the voice query
      handleCopilotQuery(text)
    }

    recognition.onend = () => setVoiceState('idle')
    recognition.onerror = () => setVoiceState('idle')
    recognition.start()
  }

  const handleAskSubmit = async (e) => {
    e.preventDefault()
    if (!askInput.trim()) return
    const question = askInput.trim()
    setAskInput('')
    
    // Pause lesson reading
    pausedByRef.current = 'copilot'
    setIsPaused(true)
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
    
    await handleCopilotQuery(question)
  }

  const handleCopilotQuery = async (question) => {
    setCopilotState('thinking')
    setCopilotText('')

    const backendUp = await isBackendAvailable()
    if (!backendUp) {
      const fallback = 'Sorry, backend is not available right now. Please try again later.'
      setCopilotText(fallback)
      speakCopilotAnswer(fallback)
      return
    }

    try {
      const copilotContext = `Topic: ${lesson.title}\n${lesson.summary || ''}`
      const result = await askVoiceCopilot(question, copilotContext)
      const ans = result.answer || 'Main samajh nahi paaya.'
      setCopilotText(ans)
      speakCopilotAnswer(ans)
    } catch (err) {
      console.error('Copilot error:', err)
      const fallback = 'Kuch gadbad ho gayi. Ek baar phir try karein.'
      setCopilotText(fallback)
      speakCopilotAnswer(fallback)
    }
  }

  const speakCopilotAnswer = (text) => {
    setCopilotState('answering')
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = settings.language === 'english' ? 'en-IN' : 'hi-IN'
      utterance.rate = settings.voiceSpeed === 'slow' ? 0.75 : settings.voiceSpeed === 'fast' ? 1.25 : 0.9
      utterance.onend = () => {
        setCopilotState('idle')
        resumeLesson()
      }
      window.speechSynthesis.speak(utterance)
    } else {
      setCopilotState('idle')
      setTimeout(() => resumeLesson(), 3000)
    }
  }

  const resumeLesson = () => {
    pausedByRef.current = null
    setIsPaused(false)
    setCopilotText('')
    const current = activeSectionRef.current
    if (current >= 0 && current < lesson.sections.length) {
      speakSection(current)
    }
  }

  // ─── UI Variables ───────────────────────────────────────────

  const sectionLabels = {
    concept: '💡 Concept', definition: '📘 Definition', example: '📝 Example',
    formula: '🔢 Formula', practice: '✏️ Practice', summary: '📋 Summary',
    real_world: '🌍 Real World', hint: '💬 Hint', visual: '📊 Diagram'
  }

  // Determine what Mascot says
  let mascotSpeech = ''
  let mascotPose = 'idle'
  
  if (copilotState === 'thinking') {
    mascotPose = 'thinking'
    mascotSpeech = 'Thinking...'
  } else if (copilotState === 'answering') {
    mascotPose = 'speaking'
    mascotSpeech = copilotText
  } else if (isSpeaking && activeSection >= 0 && activeSection < lesson.sections.length) {
    mascotPose = 'teaching'
    mascotSpeech = lesson.sections[activeSection].speak_text || ''
  } else if (activeSection < 0) {
    mascotPose = 'idle'
    mascotSpeech = 'Ready to learn? Click Start Lesson!'
  } else {
    mascotPose = 'idle'
  }

  return (
    <div className="page-container flex relative overflow-hidden h-[calc(100vh-60px)]">
      
      {/* Left Sidebar (Blue Theme) */}
      <aside className="w-64 sidebar hidden lg:flex flex-col">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">
          Session Outline
        </h2>
        <div className="space-y-1.5 flex-1">
          {lesson.sections.map((section, i) => {
            const isActive = i === activeSection
            const isRevealed = activeSection >= 0 && i <= activeSection
            return (
              <button
                key={i}
                onClick={() => handleSectionClick(i)}
                className={`w-full text-left text-sm px-3 py-2.5 rounded-lg transition-all flex items-center gap-2.5 cursor-pointer border-none ${
                  isActive
                    ? 'bg-white shadow-sm text-[var(--accent)] font-bold border border-[var(--border-light)]'
                    : isRevealed
                    ? 'text-[var(--text-primary)] hover:bg-white hover:shadow-sm'
                    : 'text-[var(--text-tertiary)] opacity-60'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  isActive ? 'bg-[var(--accent)]' : isRevealed ? 'bg-[var(--text-secondary)]' : 'bg-[var(--border)]'
                }`} />
                {sectionLabels[section.type] || section.type}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Center: Teaching Board */}
      <main className="flex-1 overflow-y-auto px-8 py-8 bg-white">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{lesson.title}</h1>
              <button
                onClick={toggleMute}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-light)] transition-colors border-none cursor-pointer"
                title={isMuted ? "Unmute and restart" : "Mute voice"}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              {isPaused && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--warning-light)] text-[var(--warning)] font-medium">
                  ⏸ Paused
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-medium">{lesson.subtitle}</p>
          </motion.div>

          {/* Cards */}
          {activeSection < 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)]">
              <p className="text-[var(--text-secondary)] font-medium mb-6">Are you ready to explore {lesson.title}?</p>
              <button
                onClick={handleStartLesson}
                className="px-8 py-3.5 rounded-xl bg-[var(--accent)] text-white font-bold text-sm cursor-pointer hover:bg-[var(--accent-hover)] transition-colors border-none shadow-md"
              >
                ▶ Start Lesson
              </button>
            </motion.div>
          ) : (
            <CardRenderer sections={lesson.sections} activeIndex={activeSection} />
          )}

          {/* End of lesson */}
          {activeSection >= lesson.sections.length - 1 && activeSection >= 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="mt-10 p-8 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl text-center"
            >
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Lesson Complete! 🎉</h3>
              <p className="text-[var(--text-secondary)] mb-6 font-medium">Ready to test your understanding?</p>
              <button
                onClick={handleGenerateQuiz}
                disabled={isGeneratingQuiz}
                className="px-8 py-3.5 rounded-xl bg-[var(--accent)] text-white font-bold cursor-pointer hover:bg-[var(--accent-hover)] transition-all border-none shadow-md disabled:opacity-50"
              >
                {isGeneratingQuiz ? '⏳ Generating Quiz...' : '📝 Take Quiz'}
              </button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Right Sidebar: Mascot & Ask */}
      <aside className="w-80 sidebar-right hidden xl:flex flex-col relative justify-between">
        
        {/* Mascot Area */}
        <div className="flex-1 flex flex-col items-center pt-8">
          <div className="relative w-full flex flex-col items-center">
            <BookMascot pose={mascotPose} size={160} />
            
            <SpeechBubble 
              text={mascotSpeech} 
              visible={!!mascotSpeech} 
              position="top"
              className="mt-2 text-center"
              maxWidth={260}
            />
          </div>
        </div>

        {/* Bottom Area: Ask Gyan Saathi */}
        <div className="mt-6 w-full">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block px-2">
            Ask Gyan Saathi
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <MicButton isRecording={voiceState === 'listening'} onClick={handleMicClick} size={44} />
            </div>
            <form onSubmit={handleAskSubmit} className="ask-input-bar flex-1">
              <input 
                type="text" 
                placeholder={voiceState === 'listening' ? 'Listening...' : 'Type your question...'} 
                value={askInput}
                onChange={e => setAskInput(e.target.value)}
                disabled={voiceState === 'listening'}
              />
              <button type="submit" aria-label="Ask" disabled={voiceState === 'listening'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>

      </aside>
    </div>
  )
}
