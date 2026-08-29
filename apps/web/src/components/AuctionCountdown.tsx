import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'

function getRemaining(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now()
  return Math.max(diff, 0)
}

function formatRemaining(ms: number) {
  if (ms <= 0) return 'Ended'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export function AuctionCountdown({ endsAt, compact = false }: { endsAt: string; compact?: boolean }) {
  const [remaining, setRemaining] = useState(() => getRemaining(endsAt))

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining(endsAt)), 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  const ended = remaining <= 0

  return (
    <span className={`countdown ${compact ? 'countdown-compact' : ''} ${ended ? 'countdown-ended' : ''}`}>
      <Timer size={compact ? 11 : 14} strokeWidth={2} />
      {ended ? 'Auction ended' : formatRemaining(remaining)}
    </span>
  )
}
