import { motion } from 'framer-motion'
import { DEMO_SESSIONS } from '../data/demoData'

export default function SessionHistory() {
  const groupByDate = (sessions) => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    const groups = {}
    sessions.forEach((s) => {
      const d = new Date(s.created_at).toDateString()
      const label = d === today ? 'Today' : d === yesterday ? 'Yesterday' : d
      if (!groups[label]) groups[label] = []
      groups[label].push(s)
    })
    return groups
  }

  const groups = groupByDate(DEMO_SESSIONS)

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Session History</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">Your past teaching sessions</p>

        {Object.entries(groups).map(([date, sessions]) => (
          <div key={date} className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">{date}</h2>
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl p-4 hover:border-[var(--accent)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{session.topic}</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent)] font-medium">
                      Score: {session.quiz_score}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                    <span>{session.subject}</span>
                    <span>·</span>
                    <span>Class {session.class_level}</span>
                    <span>·</span>
                    <span>{Math.round(session.duration_seconds / 60)} min</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] cursor-pointer bg-transparent transition-colors">
                      View Notes
                    </button>
                    <button className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] cursor-pointer bg-transparent transition-colors">
                      Retake Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
