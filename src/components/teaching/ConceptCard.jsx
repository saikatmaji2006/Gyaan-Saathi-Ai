export default function ConceptCard({ data }) {
  return (
    <div className="teaching-card card-concept">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">💡</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Concept</span>
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">{data.title}</h3>
      <p className="text-[15px] leading-relaxed text-[var(--text-primary)]">{data.content}</p>
    </div>
  )
}
