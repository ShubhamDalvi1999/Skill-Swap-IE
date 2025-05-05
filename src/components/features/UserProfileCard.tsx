'use client'

import Icon from '@/components/ui/Icon'
import { ICONS } from '@/lib/icons'
import type { User } from '@/types'

interface UserProfileCardProps {
  user: User
  stats: {
    coursesCompleted: number
    hoursLearned: number
    certificates: number
  }
}

export default function UserProfileCard({ user, stats }: UserProfileCardProps) {
  return (
    <div className="bg-secondary rounded-xl p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <img
            src={user.avatar || 'https://picsum.photos/200'}
            alt={user.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-400">{user.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <Icon name={ICONS.learn} className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold mb-1">{stats.coursesCompleted}</div>
          <div className="text-sm text-gray-400">Courses</div>
        </div>
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <Icon name={ICONS.duration} className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold mb-1">{stats.hoursLearned}</div>
          <div className="text-sm text-gray-400">Hours</div>
        </div>
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <Icon name={ICONS.build} className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold mb-1">{stats.certificates}</div>
          <div className="text-sm text-gray-400">Certificates</div>
        </div>
      </div>

      <button type="button" className="w-full mt-6 bg-primary text-secondary font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
        View Profile
      </button>
    </div>
  )
} 