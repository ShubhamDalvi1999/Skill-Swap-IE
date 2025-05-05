'use client'

import Icon from '@/components/ui/Icon'
import { ICONS } from '@/lib/icons'
import type { Event } from '@/types'

const eventTypeIcons = {
  webinar: 'Video',
  workshop: 'Calendar',
  assignment: 'BookOpen',
}

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const iconName = eventTypeIcons[event.type]

  return (
    <div className="bg-secondary rounded-lg p-4 hover:bg-gray-800 transition-colors">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-gray-700 rounded-lg">
          <Icon name={iconName} className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{event.title}</h3>
          <p className="text-sm text-gray-400 mb-2">{event.description}</p>
          <div className="flex items-center text-sm text-gray-400">
            <Icon name="Calendar" className="w-4 h-4 mr-2" />
            <span>{event.date}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button type="button" className="text-sm text-primary hover:text-primary/80 font-medium">
          Learn more →
        </button>
      </div>
    </div>
  )
} 