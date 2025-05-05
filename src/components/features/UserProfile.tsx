'use client'

import Image from 'next/image'
import { Medal, Book, Clock, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserStats {
  completedCourses: number
  hoursLearned: number
  skillsLearned: number
  achievements: number
}

interface UserProfileProps {
  name: string
  email: string
  avatar: string
  role: string
  stats: UserStats
}

export default function UserProfile({
  name,
  email,
  avatar,
  role,
  stats,
}: UserProfileProps) {
  return (
    <div className="bg-secondary rounded-xl overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20" />

      {/* Profile Info */}
      <div className="p-6">
        <div className="flex flex-col items-center -mt-16">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-secondary">
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          <h2 className="mt-4 text-xl font-semibold">{name}</h2>
          <p className="text-sm text-gray-400">{email}</p>
          <div className="mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            {role}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Medal className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stats.completedCourses}</div>
                <div className="text-sm text-gray-400">Courses Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stats.hoursLearned}</div>
                <div className="text-sm text-gray-400">Hours Learned</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Book className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stats.skillsLearned}</div>
                <div className="text-sm text-gray-400">Skills Learned</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Trophy className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stats.achievements}</div>
                <div className="text-sm text-gray-400">Achievements</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Button className="w-full" variant="default">
            Edit Profile
          </Button>
          <Button className="w-full" variant="outline">
            View Certificates
          </Button>
        </div>
      </div>
    </div>
  )
} 