import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MicButton from '../components/voice/MicButton'
import BookMascot from '../components/common/BookMascot'
import SpeechBubble from '../components/common/SpeechBubble'
import useAppStore from '../store/useAppStore'
import { isBackendAvailable, generateQuiz } from '../services/api'
import { DEMO_QUIZ } from '../data/demoData'

export default function QuizWorkspace() {
  const navigate = useNavigate()
  const {
    currentQuiz, setCurrentQuiz, currentQuestionIndex, setCurrentQuestionIndex,
    quizAnswers, answerQuestion, setHintForQuestion, voiceState, setVoiceState,
    settings
  } = useAppStore()

  const [selectedOption, setSelectedOption] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [timer, setTimer] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)

  const [isGenerating, setIsGenerating] = useState(false)
  const [setupTopic, setSetupTopic] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const isMutedRef = useRef(false)

  const quiz = currentQuiz

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => {
      clearInterval(interval)
      window.speechSynthesis?.cancel()
    }
  }, [])

  const currentQuestion = quiz?.questions?.[currentQuestionIndex]
  const questionAnswer = currentQuestion ? (quizAnswers[currentQuestion.id] || { attempts: [], isCorrect: false, hint: null }) : null
  const attempts = questionAnswer ? questionAnswer.attempts.length : 0
  const isAnswered = questionAnswer ? (questionAnswer.isCorrect || attempts >= 3) : false

  const speakText = useCallback((text) => {
    if (isMutedRef.current) return
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = settings.language === 'english' ? 'en-IN' : 'hi-IN'
      u.rate = settings.voiceSpeed === 'slow' ? 0.75 : settings.voiceSpeed === 'fast' ? 1.25 : 0.9
      window.speechSynthesis.speak(u)
    }
  }, [settings])

  useEffect(() => {
    if (currentQuestion) {
      setSelectedOption(null)
      setFeedback(null)
      setShowExplanation(false)
      speakText(currentQuestion.speak_text)
    }
  }, [currentQuestionIndex, currentQuestion, speakText])

  const handleAnswer = (option) => {
    if (isAnswered) return
    setSelectedOption(option)

    const isCorrect = option === currentQuestion.correct
    answerQuestion(currentQuestion.id, option, isCorrect)

    if (isCorrect) {
      setFeedback({ type: 'correct', message: 'Fantastic work! You got it right! 🎉' })
      speakText('Bilkul sahi! Bahut acche!')
      setTimeout(() => goToNext(), 2500)
    } else {
      const newAttempts = attempts + 1
      if (newAttempts >= 3) {
        setFeedback({ type: 'reveal', message: `The correct answer is ${currentQuestion.correct}: ${currentQuestion.options[currentQuestion.correct]}` })
        setShowExplanation(true)
        speakText(`Sahi jawab hai Option ${currentQuestion.correct}. ${currentQuestion.explanation}`)
        setTimeout(() => goToNext(), 4000)
      } else if (newAttempts >= 2) {
        const hint = getHint(currentQuestion)
        setHintForQuestion(currentQuestion.id, hint)
        setFeedback({ type: 'hint', message: `Not quite. Hint: ${hint}` })
        speakText(`Yeh sahi nahi hai. Hint: ${hint}`)
        setSelectedOption(null)
      } else {
        setFeedback({ type: 'wrong', message: 'Not quite. Try again!' })
        speakText('Yeh sahi nahi hai. Ek baar aur try karo!')
        setSelectedOption(null)
      }
    }
  }

  const getHint = (q) => {
    const explanation = q.explanation || ''
    if (explanation.length > 30) return explanation.slice(0, 50) + '...'
    return 'Think about the steps we covered in the lesson.'
  }

  const goToNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setQuizComplete(true)
      window.speechSynthesis?.cancel()
    }
  }

  const getScore = () => {
    return Object.values(quizAnswers).filter((a) => a.isCorrect).length
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const getOptionClass = (key) => {
    if (!selectedOption && !isAnswered) return 'quiz-option'
    if (isAnswered && key === currentQuestion.correct) return 'quiz-option correct'
    if (key === selectedOption && selectedOption !== currentQuestion.correct) return 'quiz-option wrong'
    return 'quiz-option'
  }

  const handleMicClick = () => {
    if (isAnswered) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.lang = 'en-IN'

    recognition.onstart = () => setVoiceState('listening')
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase()
      setVoiceState('idle')
      const optionMap = { a: 'A', b: 'B', c: 'C', d: 'D' }
      let matched = null
      for (const [key, val] of Object.entries(optionMap)) {
        if (text.includes(`option ${key}`) || text.includes(key) || text.includes(val)) {
          matched = val
          break
        }
      }
      if (matched) handleAnswer(matched)
    }
    recognition.onend = () => setVoiceState('idle')
    recognition.onerror = () => setVoiceState('idle')
    recognition.start()
  }

  const handleGenerateCustomQuiz = async () => {
    const topicToUse = setupTopic.trim() || 'General Knowledge'
    setIsGenerating(true)
    const backendUp = await isBackendAvailable()
    
    if (backendUp) {
      try {
        const newQuiz = await generateQuiz({ 
          topic: topicToUse, 
          class_level: 8, 
          difficulty: 'medium', 
          question_count: 5, 
          language: 'hinglish' 
        })
        setCurrentQuiz(newQuiz)
        setIsGenerating(false)
        return
      } catch (err) {
        console.warn('Quiz generation failed:', err.message)
      }
    }
    setCurrentQuiz(DEMO_QUIZ)
    setIsGenerating(false)
  }

  const toggleMute = () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    isMutedRef.current = nextMuted

    if (nextMuted) {
      window.speechSynthesis?.cancel()
    } else {
      window.speechSynthesis?.cancel()
      setCurrentQuestionIndex(0)
      useAppStore.setState({ quizAnswers: {} })
      if (currentQuestionIndex === 0 && currentQuestion) {
        speakText(currentQuestion.speak_text)
      }
    }
  }

  if (!quiz) {
    return (
      <div className="page-container flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[var(--border-light)] shadow-sm rounded-3xl p-8 max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-6">
            <BookMascot pose="happy" size={100} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Start a New Quiz</h2>
          <p className="text-[var(--text-secondary)] mb-6 text-sm font-medium">
            Enter a topic below, or just click generate for a general knowledge test.
          </p>
          <input
            type="text"
            placeholder="e.g. Solar System, Fractions..."
            value={setupTopic}
            onChange={(e) => setSetupTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomQuiz()}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl px-4 py-3.5 mb-4 text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
          <button
            onClick={handleGenerateCustomQuiz}
            disabled={isGenerating}
            className="w-full bg-[var(--accent)] text-white font-bold py-3.5 rounded-xl cursor-pointer hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 border-none shadow-md"
          >
            {isGenerating ? '⏳ Generating Quiz...' : '✨ Generate Quiz'}
          </button>
        </motion.div>
      </div>
    )
  }

  if (quizComplete) {
    const score = getScore()
    const total = quiz.questions.length
    const pct = Math.round((score / total) * 100)

    return (
      <div className="page-container flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <BookMascot pose="celebrating" size={160} className="mb-6" />
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Quiz Complete!</h1>
          <p className="text-[var(--text-secondary)] font-medium mb-6">
            {quiz.topic} · {formatTime(timer)}
          </p>
          <div className="bg-white rounded-3xl p-8 border border-[var(--border-light)] shadow-sm mb-6">
            <div className="text-5xl font-extrabold text-[var(--accent)] mb-2">{score}/{total}</div>
            <p className="text-sm font-bold text-[var(--text-secondary)]">{pct}% Correct</p>
            <div className="w-full h-3 bg-[var(--bg-tertiary)] rounded-full mt-5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-full rounded-full ${pct >= 70 ? 'bg-[var(--success)]' : pct >= 40 ? 'bg-[var(--warning)]' : 'bg-[var(--error)]'}`}
              />
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { useAppStore.getState().reset(); navigate('/') }}
              className="px-6 py-3 rounded-xl border-2 border-[var(--border-light)] text-sm font-bold text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors bg-white"
            >
              ← Home
            </button>
            <button
              onClick={() => { 
                setCurrentQuestionIndex(0)
                useAppStore.setState({ quizAnswers: {} })
                setQuizComplete(false)
                setTimer(0)
              }}
              className="px-6 py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-bold cursor-pointer hover:bg-[var(--accent-hover)] transition-colors border-none shadow-md"
            >
              Retake Quiz
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Determine Mascot Feedback & Pose
  let mascotSpeech = ''
  let mascotPose = 'idle'
  if (feedback) {
    mascotSpeech = feedback.message
    if (feedback.type === 'correct') mascotPose = 'happy'
    else if (feedback.type === 'hint') mascotPose = 'thinking'
    else mascotPose = 'encouraging'
  } else {
    mascotSpeech = "You're doing great! Keep going."
    mascotPose = 'encouraging'
  }

  return (
    <div className="page-container flex overflow-hidden relative">
      {/* Left Sidebar (Blue Theme) */}
      <aside className="w-64 sidebar hidden md:flex flex-col">
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-4">Questions</h2>
          <div className="grid grid-cols-4 gap-2.5">
            {quiz.questions.map((q, i) => {
              const qa = quizAnswers[q.id]
              const isCurrent = i === currentQuestionIndex
              let bgColor = 'bg-white border border-[var(--border-light)]'
              let textColor = 'text-[var(--text-secondary)]'

              if (qa?.isCorrect) {
                bgColor = 'bg-[var(--success)] border-[var(--success)]'
                textColor = 'text-white'
              } else if (qa && qa.attempts.length >= 3) {
                bgColor = 'bg-[var(--error)] border-[var(--error)]'
                textColor = 'text-white'
              } else if (isCurrent) {
                bgColor = 'bg-[var(--accent)] border-[var(--accent)]'
                textColor = 'text-white'
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold ${bgColor} ${textColor} cursor-pointer transition-all shadow-sm`}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Difficulty</h3>
          <span className="text-xs px-3 py-1.5 rounded-lg bg-white border border-[var(--border-light)] text-[var(--accent)] font-bold capitalize shadow-sm inline-block">
            {quiz.difficulty}
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-[var(--border-light)]">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">Time</div>
          <div className="text-xl font-mono font-bold text-[var(--text-primary)]">{formatTime(timer)}</div>
        </div>
      </aside>

      {/* Center: Question Area */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[var(--border-light)]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[var(--text-primary)] bg-[var(--bg-secondary)] px-4 py-2 rounded-xl">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <button
              onClick={toggleMute}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-light)] transition-colors border-none cursor-pointer"
              title={isMuted ? "Unmute and restart" : "Mute voice"}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* Question content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-3xl p-8 shadow-sm"
            >
              <h2 className="text-sm font-bold uppercase text-[var(--text-secondary)] mb-2">Question {currentQuestionIndex + 1}:</h2>
              <p className="text-3xl font-extrabold text-[var(--text-primary)] mb-10 leading-tight">
                {currentQuestion.question}
              </p>

              {/* 2x2 Grid for options */}
              <div className="quiz-grid mb-8">
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                  <motion.button
                    key={key}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(key)}
                    disabled={isAnswered}
                    className={getOptionClass(key)}
                  >
                    <span className="text-xl font-extrabold text-center block w-full">{value}</span>
                  </motion.button>
                ))}
              </div>

              {/* Voice controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <MicButton isRecording={voiceState === 'listening'} onClick={handleMicClick} size={64} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Progress Bar */}
          <div className="w-full max-w-2xl mt-8">
            <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase">
              <span>Progress bar</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar__fill progress-bar__fill--accent" 
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar: Mascot & Score */}
      <aside className="w-72 sidebar-right hidden xl:flex flex-col">
        
        {/* Mascot Area with Speech Bubble */}
        <div className="flex flex-col items-center pt-6 mb-8">
          <BookMascot pose={mascotPose} size={150} />
          <SpeechBubble 
            text={mascotSpeech} 
            visible={true}
            position="top"
            className="mt-4 text-center"
          />
        </div>

        {/* Explanation / Hint (if any) */}
        {showExplanation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-5 border border-[var(--border-light)] shadow-sm mb-6">
            <h4 className="text-xs font-bold uppercase text-[var(--accent)] mb-2">Explanation</h4>
            <p className="text-sm text-[var(--text-primary)] font-medium">{currentQuestion.explanation}</p>
          </motion.div>
        )}

        {/* Score & Progress text */}
        <div className="mt-auto bg-white rounded-2xl p-5 border border-[var(--border-light)] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Current Score:</h3>
          <div className="text-4xl font-extrabold text-[var(--text-primary)] mb-4">{getScore()}</div>
          
          <div className="flex justify-between text-sm font-bold text-[var(--text-secondary)] mb-2">
            <span>Student score:</span>
            <span className="text-[var(--text-primary)]">{getScore()} / {quiz.questions.length}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-[var(--text-secondary)]">
            <span>Progress:</span>
            <span className="text-[var(--text-primary)]">{Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}%</span>
          </div>
        </div>
      </aside>
    </div>
  )
}
