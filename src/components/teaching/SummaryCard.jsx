export default function SummaryCard({ data }) {
  return (
    <div className="teaching-card card-summary" style={{ background: '#eef2ff' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📋</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Summary</span>
      </div>
      <ul className="space-y-2">
        {data.points && data.points.map((point, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[15px] text-[var(--text-primary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] mt-2 shrink-0" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}
