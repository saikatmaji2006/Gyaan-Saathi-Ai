export default function DefinitionCard({ data }) {
  return (
    <div className="teaching-card card-definition" style={{ background: '#f0f9ff' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📘</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Definition</span>
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{data.term}</h3>
      <p className="text-[15px] leading-relaxed text-[var(--text-primary)] mb-3">{data.definition}</p>
      {data.formula && (
        <div className="bg-white/70 rounded-lg px-4 py-3 border border-[#bae6fd]">
          <span className="text-xs font-medium text-[var(--text-secondary)] block mb-1">Formula</span>
          <code className="text-lg font-mono font-medium text-[#0369a1]">{data.formula}</code>
        </div>
      )}
    </div>
  )
}
