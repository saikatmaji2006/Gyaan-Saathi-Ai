export default function PracticeCard({ data }) {
  return (
    <div className="teaching-card card-practice" style={{ background: '#ecfdf5' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">✏️</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Practice</span>
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Try these yourself!</h3>
      <div className="space-y-3">
        {data.questions && data.questions.map((q, i) => (
          <div key={i} className="bg-white/80 rounded-lg px-4 py-3 border border-[#a7f3d0]">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#10b981] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-[var(--text-primary)]">{q.question}</p>
                <details className="mt-2">
                  <summary className="text-xs text-[var(--success)] cursor-pointer font-medium">Show Answer</summary>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 font-mono">{q.answer}</p>
                </details>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
