import { useEffect, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({ startOnLoad: false, theme: 'default' })

export default function VisualCard({ data }) {
  const [svgContent, setSvgContent] = useState('')

  useEffect(() => {
    if (data.mermaid_code) {
      const renderDiagram = async () => {
        try {
          // Replace newlines with spaces or keep them? Mermaid handles newlines fine.
          const id = `mermaid-${Date.now()}-${Math.floor(Math.random() * 1000)}`
          const { svg } = await mermaid.render(id, data.mermaid_code)
          setSvgContent(svg)
        } catch (err) {
          console.error("Mermaid parsing error:", err)
          setSvgContent('<div class="text-[var(--danger)] text-sm p-4">Failed to render diagram</div>')
        }
      }
      renderDiagram()
    }
  }, [data.mermaid_code])

  return (
    <div className="teaching-card card-visual border-l-4 border-[#8b5cf6]" style={{ background: '#f5f3ff' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📊</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8b5cf6]">Visual Diagram</span>
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">{data.title || "Diagram"}</h3>
      
      {data.explanation && (
        <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed bg-white/60 p-3 rounded-lg border border-[#ede9fe]">
          {data.explanation}
        </p>
      )}

      {data.mermaid_code && (
        <div 
          className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-sm border border-[#ede9fe] overflow-x-auto min-h-[150px]"
          dangerouslySetInnerHTML={{ __html: svgContent }} 
        />
      )}
    </div>
  )
}
