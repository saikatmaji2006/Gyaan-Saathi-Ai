export default function FormulaCard({ data }) {
  return (
    <div className="teaching-card card-formula" style={{ background: '#fffbeb' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔢</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Formula</span>
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">{data.title || 'Key Formula'}</h3>
      <div className="bg-white/80 rounded-lg px-5 py-4 border border-[#fde68a] text-center">
        <code className="text-xl font-mono font-bold text-[#92400e]">{data.formula}</code>
      </div>
      {data.variables && (
        <div className="mt-3 space-y-1">
          {data.variables.map((v, i) => (
            <div key={i} className="text-sm text-[var(--text-secondary)]">
              <code className="font-mono font-medium text-[#92400e]">{v.symbol}</code> = {v.meaning}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
