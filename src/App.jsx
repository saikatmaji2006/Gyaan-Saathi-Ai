import { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Landing from './pages/Landing'
import ExplanationWorkspace from './pages/ExplanationWorkspace'
import QuizWorkspace from './pages/QuizWorkspace'
import Settings from './pages/Settings'
import BackendLoader from './components/common/BackendLoader'

export default function App() {
  const [backendReady, setBackendReady] = useState(false)

  const handleBackendReady = useCallback(() => {
    setBackendReady(true)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {!backendReady && (
          <BackendLoader key="loader" onReady={handleBackendReady} />
        )}
      </AnimatePresence>

      {backendReady && (
        <motion.div
          className="min-h-screen bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/explain" element={<ExplanationWorkspace />} />
            <Route path="/quiz" element={<QuizWorkspace />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </motion.div>
      )}
    </>
  )
}
