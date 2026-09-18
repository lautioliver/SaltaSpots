import { useState } from 'react'
import { venues } from '../data'
import type { VenueId } from '../data'

const STORAGE_KEY = 'saltaspots-favorites'

function readFavorites(): VenueId[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(stored)) return []
    return venues.filter((venue) => stored.includes(venue.id)).map((venue) => venue.id)
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<VenueId[]>(readFavorites)

  function toggleFavorite(id: VenueId) {
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id]
    setFavorites(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Favorites remain available in memory when storage is disabled.
    }
  }

  return { favorites, toggleFavorite }
}
