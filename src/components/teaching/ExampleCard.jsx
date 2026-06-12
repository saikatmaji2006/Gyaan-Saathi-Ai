export default function ExampleCard({ data }) {
  return (
    <div className="teaching-card card-example">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📝</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Example</span>
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{data.title}</h3>
      
      {/* Problem */}
      <div className="bg-[#f5f3ff] rounded-lg px-4 py-3 mb-4 border border-[#ddd6fe]">
        <code className="text-base font-mono font-medium text-[#6d28d9]">{data.problem}</code>
      </div>

      {/* Steps */}
      {data.steps && (
        <div className="space-y-3 mb-4">
          {data.steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-[var(--accent-light)] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-[var(--accent)]">{step.step}</span>
              </div>
              <div>
                <code className="text-sm font-mono text-[var(--text-primary)]">{step.text}</code>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{step.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Answer */}
      {data.answer && (
        <div className="flex items-center gap-2 bg-[var(--success-light)] rounded-lg px-4 py-2.5 border border-[#a7f3d0]">
          <span className="text-green-600 font-medium">✓</span>
          <code className="font-mono font-semibold text-[var(--success)]">{data.answer}</code>
        </div>
      )}
    </div>
  )
}
