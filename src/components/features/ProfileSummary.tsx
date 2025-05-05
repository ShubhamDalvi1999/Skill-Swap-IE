'use client'

import React from 'react'
import Link from 'next/link'
import LoadingSkeleton from '../shared/LoadingSkeleton'

interface ProfileSummaryProps {
  username: string
  level: number
  totalXp: number
  badges: number
  dayStreak: number
  rank: string
  avatar?: string
}

export default function ProfileSummary({
  username = 'shubhamdwo526',
  level = 1,
  totalXp = 50,
  badges = 0,
  dayStreak = 1,
  rank = 'Bronze',
  avatar = '/images/avatars/dr-ai-1.png'
}: ProfileSummaryProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-secondary/80 backdrop-blur-sm rounded-xl p-4 w-64">
        {/* User Info Loading */}
        <div className="flex items-center gap-3 mb-4">
          <LoadingSkeleton className="w-10 h-10" />
          <div className="space-y-2 flex-1">
            <LoadingSkeleton className="h-4 w-24" />
            <LoadingSkeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Stats Grid Loading */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {['xp', 'rank', 'badges', 'streak'].map((item, i) => (
            <div key={`skeleton-${item}`} className="space-y-2">
              <LoadingSkeleton className="h-4 w-12" />
              <LoadingSkeleton className="h-3 w-16" />
            </div>
          ))}
        </div>

        {/* Button Loading */}
        <LoadingSkeleton className="h-9 w-full" />
      </div>
    )
  }

  return (
    <div className="bg-secondary/80 backdrop-blur-sm rounded-xl p-8 w-[420px]">
      {/* User Info */}
      <div className="flex items-center gap-8 mb-12">
        <div className="relative w-28 h-28 rounded-full overflow-hidden flex-shrink-0 border-3 border-primary/20">
          <img
            src={avatar}
            alt={username}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-3xl font-semibold truncate">{username}</h3>
          <p className="text-xl text-gray-400">Level {level}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-8 mb-10 font-mono">
        {/* XP */}
        <div className="flex items-center gap-4">
          <span className="text-4xl text-yellow-400">⭐</span>
          <div>
            <p className="text-2xl">{totalXp}</p>
            <p className="text-lg text-gray-400">Total XP</p>
          </div>
        </div>

        {/* Rank */}
        <div className="flex items-center gap-4">
          <span className="text-4xl text-amber-600">🏆</span>
          <div>
            <p className="text-2xl">{rank}</p>
            <p className="text-lg text-gray-400">Rank</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-4">
          <span className="text-4xl text-blue-400">🎯</span>
          <div>
            <p className="text-2xl">{badges}</p>
            <p className="text-lg text-gray-400">Badges</p>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-4">
          <span className="text-4xl text-orange-400">🔥</span>
          <div>
            <p className="text-2xl">{dayStreak}</p>
            <p className="text-lg text-gray-400">Day streak</p>
          </div>
        </div>
      </div>

      {/* View Profile Button */}
      <Link 
        href="/profile" 
        className="block w-full py-4 text-center text-xl bg-background rounded-lg hover:bg-background/80 transition-colors font-semibold"
      >
        View profile
      </Link>
    </div>
  )
} 