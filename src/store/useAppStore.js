import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set, get) => ({
      // Voice state
      voiceState: 'idle', // idle | listening | processing | speaking
      transcript: '',
      
      // Current session
      currentSession: null,
      currentLesson: null,
      currentQuiz: null,
      currentQuestionIndex: 0,
      quizAnswers: {},
      
      // Sessions history
      sessions: [],
      
      // Settings
      settings: {
        language: 'hinglish',
        classLevel: 8,
        subject: 'Auto',
        difficulty: 'medium',
        questionCount: 10,
        voiceSpeed: 'normal',
        voiceGender: 'female',
        smartBoardMode: false,
      },

      // Actions
      setVoiceState: (state) => set({ voiceState: state }),
      setTranscript: (text) => set({ transcript: text }),
      
      setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
      setCurrentQuiz: (quiz) => set({ currentQuiz: quiz, currentQuestionIndex: 0, quizAnswers: {} }),
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      
      answerQuestion: (questionId, answer, isCorrect) => {
        const answers = { ...get().quizAnswers }
        if (!answers[questionId]) {
          answers[questionId] = { attempts: [], isCorrect: false, hint: null }
        }
        answers[questionId].attempts.push(answer)
        answers[questionId].isCorrect = isCorrect
        set({ quizAnswers: answers })
      },

      setHintForQuestion: (questionId, hint) => {
        const answers = { ...get().quizAnswers }
        if (answers[questionId]) {
          answers[questionId].hint = hint
        }
        set({ quizAnswers: answers })
      },

      addSession: (session) => set((s) => ({ sessions: [session, ...s.sessions] })),
      
      updateSettings: (newSettings) => set((s) => ({ 
        settings: { ...s.settings, ...newSettings } 
      })),

      reset: () => set({
        voiceState: 'idle',
        transcript: '',
        currentLesson: null,
        currentQuiz: null,
        currentQuestionIndex: 0,
        quizAnswers: {},
      }),
    }),
    {
      name: 'gyaansaathi-storage',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
)

export default useAppStore
