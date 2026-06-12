import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './pages/Landing'
import ExplanationWorkspace from './pages/ExplanationWorkspace'
import QuizWorkspace from './pages/QuizWorkspace'

import Settings from './pages/Settings'

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explain" element={<ExplanationWorkspace />} />
        <Route path="/quiz" element={<QuizWorkspace />} />

        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  )
}
