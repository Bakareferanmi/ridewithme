import { useCallback, useEffect, useState } from 'react'

const RECENT_KEY = 'ridewithme:recent-searches'
const MAX_RECENT = 6

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>(() => readRecent())

  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent))
  }, [recent])

  const addRecent = useCallback((term: string) => {
    const trimmed = term.trim()
    if (!trimmed) return
    setRecent((prev) => [trimmed, ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT))
  }, [])

  const clearRecent = useCallback(() => setRecent([]), [])

  return { recent, addRecent, clearRecent }
}
