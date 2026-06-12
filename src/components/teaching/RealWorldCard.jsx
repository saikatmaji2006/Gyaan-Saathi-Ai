export default function RealWorldCard({ data }) {
  return (
    <div className="teaching-card card-real_world">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🌍</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Real World</span>
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{data.title}</h3>
      <p className="text-[15px] leading-relaxed text-[var(--text-primary)] mb-3">{data.scenario}</p>
      
      {data.equation && (
        <div className="bg-[#fdf2f8] rounded-lg px-4 py-2.5 border border-[#fbcfe8] mb-3">
          <span className="text-xs text-[var(--text-secondary)] block mb-1">Equation</span>
          <code className="text-base font-mono font-medium text-[#be185d]">{data.equation}</code>
        </div>
      )}
      
      {data.solution && (
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-[var(--text-secondary)]">→</span>
          <span className="text-[var(--text-primary)] font-medium">{data.solution}</span>
        </div>
      )}
    </div>
  )
}
