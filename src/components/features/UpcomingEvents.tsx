'use client'

import React from 'react'
import LoadingSkeleton from '../shared/LoadingSkeleton'

// Default placeholder events if none are provided
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

interface Event {
  id: string | number;
  title: string;
  date: string;
  time: string;
  type: string;
  location?: string;
  emoji?: string;
}

interface UpcomingEventsProps {
  events?: Event[];
}

export default function UpcomingEvents({ events = PLACEHOLDER_EVENTS }: UpcomingEventsProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Add emojis to events if they don't have them
  const eventsWithEmojis = events.map(event => {
    if (event.emoji) return event;
    
    // Add default emoji based on type if not provided
    let emoji = '📅'; // Default
    if (event.type === 'conference') emoji = '🎤';
    if (event.type === 'workshop') emoji = '💻';
    if (event.type === 'meetup') emoji = '👥';
    if (event.type === 'challenge') emoji = '🎮';
    if (event.type === 'review') emoji = '👁️';
    
    return { ...event, emoji };
  });

  if (!mounted) {
    return (
      <div className="bg-secondary/80 backdrop-blur-sm rounded-xl p-4 w-64">
        {/* Title Loading */}
        <LoadingSkeleton className="h-5 w-32 mb-4" />

        {/* Events Loading */}
        <div className="space-y-3">
          {['skeleton1', 'skeleton2', 'skeleton3'].map((skeletonId) => (
            <div key={skeletonId} className="flex items-start gap-3">
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
        {eventsWithEmojis.map((event) => (
          <div key={event.id} className="flex items-start gap-6 p-4 hover:bg-background/50 rounded-lg transition-colors cursor-pointer">
            <span className="text-3xl">{event.emoji}</span>
            <div>
              <p className="text-lg font-medium mb-1">{event.title}</p>
              <p className="text-base text-gray-400">{event.date} at {event.time}</p>
              {event.location && (
                <p className="text-sm text-gray-500">{event.location}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 