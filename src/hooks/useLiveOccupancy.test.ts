import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { occupancyPercent, occupancyStatus, saltaHour, venues } from '../data'
import { nextOccupancy, POLL_INTERVAL, useLiveOccupancy } from './useLiveOccupancy'
import { useFavorites } from './useFavorites'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.useRealTimers()
  localStorage.clear()
})

describe('live occupancy', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-18T18:00:00Z'))
  })

  it('polls every five seconds, pauses, resumes, and cleans up its timer', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    const { result, unmount } = renderHook(useLiveOccupancy)
    const initial = result.current.occupancy.sorbo
    act(() => { vi.advanceTimersByTime(POLL_INTERVAL - 1) })
    expect(result.current.occupancy.sorbo).toBe(initial)
    act(() => { vi.advanceTimersByTime(1) })
    expect(result.current.occupancy.sorbo).toBe(initial + 1)
    expect(result.current.updatedAt.toISOString()).toBe('2026-09-18T18:00:05.000Z')
    act(() => { result.current.toggleRunning() })
    const paused = result.current.occupancy
    act(() => { vi.advanceTimersByTime(POLL_INTERVAL * 3) })
    expect(result.current.occupancy).toEqual(paused)
    expect(vi.getTimerCount()).toBe(0)
    act(() => { result.current.toggleRunning() })
    act(() => { vi.advanceTimersByTime(POLL_INTERVAL) })
    expect(result.current.occupancy.sorbo).toBe(initial + 2)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('never exceeds venue capacity or produces negative occupancy', () => {
    let full = { sorbo: 14, bixi: 12, studio: 20 }
    let empty = { sorbo: 0, bixi: 0, studio: 0 }
    for (let index = 0; index < 100; index++) {
      full = nextOccupancy(full, () => 0.99)
      empty = nextOccupancy(empty, () => 0)
    }
    for (const venue of venues) {
      expect(full[venue.id]).toBe(venue.tables)
      expect(empty[venue.id]).toBe(0)
    }
  })

  it('keeps the previous snapshot immutable', () => {
    const current = Object.freeze({ sorbo: 5, bixi: 8, studio: 4 })
    expect(nextOccupancy(current, () => 0)).toEqual({ sorbo: 4, bixi: 7, studio: 3 })
    expect(current).toEqual({ sorbo: 5, bixi: 8, studio: 4 })
  })

  it.each([
    [0, 'green'], [49, 'green'], [50, 'amber'], [80, 'amber'], [81, 'red'], [100, 'red'],
  ])('classifies %i%% occupancy as %s', (percent, tone) => {
    expect(occupancyStatus(percent).tone).toBe(tone)
  })

  it('derives percentages consistently from occupied tables', () => {
    expect(occupancyPercent(5, 14)).toBe(36)
    expect(occupancyPercent(0, 14)).toBe(0)
    expect(occupancyPercent(14, 14)).toBe(100)
  })

  it('uses the Salta hour rather than the browser timezone', () => {
    expect(saltaHour(new Date('2026-09-18T18:00:00Z'))).toBe(15)
    expect(saltaHour(new Date('2026-09-19T03:00:00Z'))).toBe(0)
  })
})

describe('saved venues', () => {
  it('persists favorites across visits and allows removal', () => {
    const first = renderHook(useFavorites)
    act(() => { first.result.current.toggleFavorite('sorbo') })
    expect(first.result.current.favorites).toEqual(['sorbo'])
    first.unmount()
    const second = renderHook(useFavorites)
    expect(second.result.current.favorites).toEqual(['sorbo'])
    act(() => { second.result.current.toggleFavorite('sorbo') })
    expect(second.result.current.favorites).toEqual([])
  })

  it('ignores invalid or unknown saved IDs', () => {
    localStorage.setItem('saltaspots-favorites', '["unknown", "bixi", "bixi", 123]')
    const { result } = renderHook(useFavorites)
    expect(result.current.favorites).toEqual(['bixi'])
  })

  it('recovers from malformed local storage', () => {
    localStorage.setItem('saltaspots-favorites', '{invalid')
    const { result } = renderHook(useFavorites)
    expect(result.current.favorites).toEqual([])
  })

  it('works in memory when the browser denies local storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Denied') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Denied') })
    const { result } = renderHook(useFavorites)
    act(() => { result.current.toggleFavorite('studio') })
    expect(result.current.favorites).toEqual(['studio'])
  })
})
