'use client'

import { useState, useEffect, useCallback } from 'react'
import { Prescription, ReviewStats } from '../types'
import { reviewService } from '../services/api'

export function useReviews() {
  const [reviews, setReviews] = useState<Prescription[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    pending: 12,
    reviewed_today: 18,
    needs_clarification: 3,
    total_handovers: 64,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'urgent' | 'outpatient' | 'pediatric'>('all')

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await reviewService.getPendingReviews()
      if (data && data.length > 0) {
        setReviews(data)
      }
      const statsData = await reviewService.getStats()
      setStats(statsData)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'all') return true
    if (filter === 'urgent') return r.urgency === 'urgent' || r.urgency === 'stat'
    if (filter === 'pediatric') return r.urgency === 'pediatric' || (r.patient_age !== undefined && r.patient_age < 18)
    if (filter === 'outpatient') return r.urgency === 'routine' || !r.urgency
    return true
  })

  return {
    reviews,
    filteredReviews,
    stats,
    loading,
    error,
    filter,
    setFilter,
    refetch: fetchReviews,
  }
}
