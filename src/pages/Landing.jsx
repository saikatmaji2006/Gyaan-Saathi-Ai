import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import BookMascot from '../components/common/BookMascot'
import SpeechBubble from '../components/common/SpeechBubble'
import MicButton from '../components/voice/MicButton'
import Waveform from '../components/voice/Waveform'
import useAppStore from '../store/useAppStore'
import { isBackendAvailable, generateLesson, generateQuiz } from '../services/api'
import { DEMO_LESSON_LINEAR, DEMO_LESSON_PHOTOSYNTHESIS, DEMO_QUIZ } from '../data/demoData'

const STATUS_MAP = {
  idle: 'Gyan Saathi is ready! Tap mic to start.',
  listening: 'Gyan Saathi is listening! Ask me anything!',
  processing: 'Thinking... Give me a moment.',
  speaking: 'Speaking...',
}

export default function Landing() {
  const navigate = useNavigate()
  const { voiceState, setVoiceState, setTranscript, setCurrentLesson, setCurrentQuiz, settings } = useAppStore()
  const [localTranscript, setLocalTranscript] = useState('')
  const [recognizer, setRecognizer] = useState(null)
  const [backendUp, setBackendUp] = useState(false)
  const transcriptRef = useRef('')
  const silenceTimerRef = useRef(null)

  // Check if backend is running
  useEffect(() => {
    isBackendAvailable().then(setBackendUp)
  }, [])

  const handleMicClick = () => {
    if (voiceState === 'listening') {
      if (recognizer) {
        recognizer.stop()
        setRecognizer(null)
      }
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser. Please use Chrome.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = settings.language === 'english' ? 'en-US' : 'en-IN'

    recognition.onstart = () => {
      setVoiceState('listening')
      setLocalTranscript('')
      transcriptRef.current = ''
    }

    let finalTranscript = ''
    recognition.onresult = (event) => {
      let interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' '
        } else {
          interimTranscript += event.results[i][0].transcript
        }
      }
      const currentText = (finalTranscript + interimTranscript).trim()
      setLocalTranscript(currentText)
      transcriptRef.current = currentText
      
      // Reset 2s silence timer
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop()
      }, 2000)
    }

    recognition.onend = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      const finalText = transcriptRef.current
      if (finalText.trim()) {
        setVoiceState('processing')
        setTranscript(finalText)
        handleIntent(finalText)
      } else {
        setVoiceState('idle')
      }
      setRecognizer(null)
    }

    recognition.onerror = (e) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      console.error('Speech error:', e)
      setVoiceState('idle')
      setRecognizer(null)
    }

    recognition.start()
    setRecognizer(recognition)
  }

  const handleIntent = async (text) => {
    const lower = text.toLowerCase()

    // Determine action
    const isQuiz = lower.includes('quiz') || lower.includes('test') || lower.includes('question')
    
    // Extract topic
    let cleanText = text
      .replace(/generate a quiz on |give me a quiz on |generate quiz on /i, '')
      .replace(/generate a quiz|give me a quiz|generate quiz/i, '')
      .replace(/explain |tell me about |what is /i, '')
      .trim()
      
    let topic = cleanText || 'General Knowledge'
    let subject = settings.subject || 'Auto'
    let classLevel = settings.classLevel || 8
    
    if (lower.includes('photosynthesis')) {
      topic = 'Photosynthesis'
      subject = 'Science'
    } else if (lower.includes('fraction')) {
      topic = 'Fractions'
      subject = 'Mathematics'
    } else if (lower.includes('digestive') || lower.includes('digestion')) {
      topic = 'Human Digestive System'
      subject = 'Science'
    } else if (lower.includes('force') || lower.includes('pressure')) {
      topic = 'Force and Pressure'
      subject = 'Science'
    } else if (lower.includes('algebra')) {
      topic = 'Algebraic Expressions'
      subject = 'Mathematics'
    } else if (lower.includes('linear')) {
      topic = 'Linear Equations'
      subject = 'Mathematics'
    }

    // Try backend first, fallback to demo data
    if (backendUp) {
      try {
        if (isQuiz) {
          const quiz = await generateQuiz({ 
            topic, 
            class_level: classLevel, 
            difficulty: settings.difficulty, 
            question_count: settings.questionCount, 
            language: settings.language 
          })
          setCurrentQuiz(quiz)
          setVoiceState('idle')
          navigate('/quiz')
          return
        } else {
          const lesson = await generateLesson({ 
            topic, 
            class_level: classLevel, 
            subject, 
            difficulty: settings.difficulty, 
            language: settings.language 
          })
          setCurrentLesson(lesson)
          setVoiceState('idle')
          navigate('/explain')
          return
        }
      } catch (err) {
        console.warn('Backend call failed, using demo data:', err.message)
      }
    }

    // Fallback to demo data
    if (isQuiz) {
      setCurrentQuiz(DEMO_QUIZ)
      setVoiceState('idle')
      navigate('/quiz')
    } else if (lower.includes('photosynthesis')) {
      setCurrentLesson(DEMO_LESSON_PHOTOSYNTHESIS)
      setVoiceState('idle')
      navigate('/explain')
    } else {
      setCurrentLesson(DEMO_LESSON_LINEAR)
      setVoiceState('idle')
      navigate('/explain')
    }
  }

  // Map state to mascot pose
  const mascotPose = {
    idle: 'idle',
    listening: 'listening',
    processing: 'thinking',
    speaking: 'speaking',
  }[voiceState] || 'idle'

  return (
    <div className="page-container flex flex-col">
      {/* Backend status banner */}
      {!backendUp && (
        <div className="bg-[var(--warning-light)] border-b border-[#fed7aa] px-4 py-2 text-center shadow-sm relative z-10">
          <p className="text-xs text-[var(--warning)] font-medium">
            ⚡ Running in demo mode — Start the backend for AI-generated content
          </p>
        </div>
      )}

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 py-12 gap-12 max-w-6xl mx-auto w-full">
        
        {/* Left Side: Mic & Interaction */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-xl"
        >
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Say a command, e.g., "Explain a topic" or "Generate a quiz!"
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mb-12">
            Speak to Gyan Saathi naturally.
          </p>

          <div className="w-full flex items-center justify-center lg:justify-start gap-4 mb-8">
            {/* Waveform (left of mic) */}
            <div className="w-32 hidden md:block opacity-70">
              <Waveform
                isActive={voiceState === 'listening' || voiceState === 'speaking'}
                type="input"
              />
            </div>

            {/* Mic Button */}
            <div className="shrink-0 z-10">
              <MicButton
                isRecording={voiceState === 'listening'}
                onClick={handleMicClick}
                size={100}
              />
            </div>

            {/* Waveform (right of mic) */}
            <div className="w-32 hidden md:block opacity-70">
              <Waveform
                isActive={voiceState === 'listening' || voiceState === 'speaking'}
                type="input"
              />
            </div>
          </div>

          {/* Live transcript or Status */}
          <div className="h-16 flex items-center justify-center w-full max-w-md lg:justify-start mb-6">
            {(voiceState === 'listening' || voiceState === 'processing') && localTranscript ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md border border-[var(--border-light)] px-6 py-4 w-full"
              >
                <p className="text-sm text-[var(--text-primary)] font-medium">
                  {localTranscript}
                </p>
              </motion.div>
            ) : (
              <div className="text-[var(--text-secondary)] font-medium text-lg">
                {voiceState === 'processing' && '🤔 '}
                {voiceState === 'idle' && 'Microphone is off'}
              </div>
            )}
          </div>


        </motion.div>

        {/* Right Side: Mascot */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex flex-col items-center justify-center max-w-sm w-full"
        >
          <div className="bg-white rounded-3xl p-8 border border-[var(--border-light)] shadow-sm w-full flex flex-col items-center relative">
            <BookMascot pose={mascotPose} size={200} className="mb-4" />
            
            <SpeechBubble 
              text={STATUS_MAP[voiceState]} 
              visible={true}
              position="top"
              className="mt-2 text-center"
              maxWidth={280}
            />
          </div>
        </motion.div>

      </section>

      {/* Footer */}
      <footer className="py-6 px-6 text-center mt-auto">
        <p className="text-xs font-semibold text-[var(--text-tertiary)]">
          Gyan Saathi AI · Built By: Saikat Maji
        </p>
      </footer>
    </div>
  )
}
