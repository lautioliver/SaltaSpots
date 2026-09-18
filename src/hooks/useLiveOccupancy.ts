import { useEffect, useState } from 'react'
import { venues } from '../data'
import type { VenueId } from '../data'

export const POLL_INTERVAL = 5000
export type Occupancy = Record<VenueId, number>

export function nextOccupancy(current: Occupancy, random: () => number = Math.random): Occupancy {
  const next = { ...current }
  for (const venue of venues) {
    const movement = Math.floor(random() * 3) - 1
    next[venue.id] = Math.max(0, Math.min(venue.tables, current[venue.id] + movement))
  }
  return next
}

export function useLiveOccupancy() {
  const [running, setRunning] = useState(true)
  const [snapshot, setSnapshot] = useState(() => ({
    occupancy: Object.fromEntries(venues.map((venue) => [venue.id, venue.initialOccupied])) as Occupancy,
    updatedAt: new Date(),
    revision: 0,
  }))

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setSnapshot((previous) => ({
        occupancy: nextOccupancy(previous.occupancy),
        updatedAt: new Date(),
        revision: previous.revision + 1,
      }))
    }, POLL_INTERVAL)
    return () => window.clearInterval(timer)
  }, [running])

  return { ...snapshot, running, toggleRunning: () => setRunning((value) => !value) }
}
