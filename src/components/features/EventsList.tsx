'use client'

import { Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Event {
  id: string
  title: string
  description: string
  date: string
  attendees: number
  maxAttendees: number
}

interface EventsListProps {
  events: Event[]
}

export default function EventsList({ events }: EventsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-secondary rounded-xl p-6 border border-gray-800"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-400 mb-4">{event.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendees}/{event.maxAttendees} attending
                </div>
              </div>
            </div>
            <Button
              variant={event.attendees < event.maxAttendees ? 'default' : 'secondary'}
              disabled={event.attendees >= event.maxAttendees}
            >
              {event.attendees >= event.maxAttendees ? 'Full' : 'Join Event'}
            </Button>
          </div>
          {event.attendees >= event.maxAttendees && (
            <div className="mt-4 text-sm text-yellow-500">
              This event is at full capacity.
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 