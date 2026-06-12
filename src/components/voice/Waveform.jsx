import { useEffect, useRef } from 'react'

export default function Waveform({ isActive, type = 'input' }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const barCount = 40
    const totalWidth = w / barCount
    const barWidth = totalWidth * 0.6
    const gap = totalWidth * 0.4

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < barCount; i++) {
        const x = i * totalWidth + gap / 2
        let barHeight

        if (isActive) {
          const t = Date.now() / 1000
          barHeight = (Math.sin(t * 3 + i * 0.5) * 0.4 + 0.5) * h * 0.7 * (0.5 + Math.random() * 0.5)
        } else {
          barHeight = 2
        }

        const y = (h - barHeight) / 2
        const color = type === 'input' ? 'rgba(79, 70, 229, 0.6)' : 'rgba(5, 150, 105, 0.6)'

        ctx.fillStyle = color
        // Use simple rect with manual rounded corners
        const radius = Math.min(2, barWidth / 2, barHeight / 2)
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + barWidth - radius, y)
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius)
        ctx.lineTo(x + barWidth, y + barHeight - radius)
        ctx.quadraticCurveTo(x + barWidth, y + barHeight, x + barWidth - radius, y + barHeight)
        ctx.lineTo(x + radius, y + barHeight)
        ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.closePath()
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [isActive, type])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={60}
      className="w-full max-w-md h-[60px]"
    />
  )
}
