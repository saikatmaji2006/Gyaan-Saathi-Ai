export default function HintCard({ data }) {
  return (
    <div className="teaching-card card-hint" style={{ background: '#fff7ed' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">💬</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Hint</span>
      </div>
      <p className="text-[15px] leading-relaxed text-[var(--text-primary)]">{data.content || data.hint}</p>
    </div>
  )
}
