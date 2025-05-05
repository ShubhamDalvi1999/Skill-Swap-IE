'use client'

import React from 'react'
import LoadingSkeleton from '../shared/LoadingSkeleton'

const PLACEHOLDER_EVENTS = [
  {
    id: 1,
    title: 'JavaScript Challenge',
    date: 'Today',
    time: '3:00 PM',
    type: 'challenge',
    emoji: '🎮'
  },
  {
    id: 2,
    title: 'React Workshop',
    date: 'Tomorrow',
    time: '2:00 PM',
    type: 'workshop',
    emoji: '💻'
  },
  {
    id: 3,
    title: 'Code Review Session',
    date: 'Feb 3',
    time: '4:00 PM',
    type: 'review',
    emoji: '👥'
  }
]

export default function UpcomingEvents() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-secondary/80 backdrop-blur-sm rounded-xl p-4 w-64">
        {/* Title Loading */}
        <LoadingSkeleton className="h-5 w-32 mb-4" />

        {/* Events Loading */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <LoadingSkeleton className="w-8 h-8" />
              <div className="space-y-2 flex-1">
                <LoadingSkeleton className="h-4 w-32" />
                <LoadingSkeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-secondary/80 backdrop-blur-sm rounded-xl p-8 w-[420px]">
      <h3 className="text-2xl font-semibold mb-8">Upcoming Events</h3>
      <div className="space-y-6">
        {PLACEHOLDER_EVENTS.map((event) => (
          <div key={event.id} className="flex items-start gap-6 p-4 hover:bg-background/50 rounded-lg transition-colors cursor-pointer">
            <span className="text-3xl">{event.emoji}</span>
            <div>
              <p className="text-lg font-medium mb-1">{event.title}</p>
              <p className="text-base text-gray-400">{event.date} at {event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 