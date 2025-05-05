'use client'

import { useState } from 'react'
import SocialFeed from '@/components/features/SocialFeed'
import EventsList from '@/components/features/EventsList'
import TopContributors from '@/components/features/TopContributors'
import type { User } from '@/types'

// Mock data
const posts = [
  {
    id: '1',
    author: {
      name: 'John Doe',
      avatar: 'https://picsum.photos/seed/user1/40/40',
      role: 'Student',
    },
    content: 'Just completed my first React project! Check it out: https://github.com/johndoe/react-project',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
  },
  {
    id: '2',
    author: {
      name: 'Jane Smith',
      avatar: 'https://picsum.photos/seed/user2/40/40',
      role: 'Instructor',
    },
    content: 'New tutorial on advanced TypeScript features coming tomorrow! Stay tuned 🚀',
    timestamp: '4 hours ago',
    likes: 56,
    comments: 12,
  },
]

const events = [
  {
    id: '1',
    title: 'Full Stack Development',
    description: 'Create modern web applications with React and Node.js',
    date: '2024-03-15T14:00:00Z',
    attendees: 45,
    maxAttendees: 50,
  },
  {
    id: '2',
    title: 'Code Review Session',
    description: 'Get feedback on your projects from experienced developers',
    date: '2024-03-18T18:00:00Z',
    attendees: 12,
    maxAttendees: 20,
  },
]

const topContributors = [
  { id: 1, name: 'Contributor 1', points: 100, avatar: 'https://picsum.photos/seed/contributor1/32/32' },
  { id: 2, name: 'Contributor 2', points: 80, avatar: 'https://picsum.photos/seed/contributor2/32/32' },
  { id: 3, name: 'Contributor 3', points: 60, avatar: 'https://picsum.photos/seed/contributor3/32/32' }
];

const suggestedUsers: User[] = [
  {
    id: '3',
    name: 'Robert Fox',
    email: 'robert@example.com',
    role: 'instructor',
    avatar: 'https://picsum.photos/200?random=3',
  },
  {
    id: '4',
    name: 'Leslie Alexander',
    email: 'leslie@example.com',
    role: 'student',
    avatar: 'https://picsum.photos/200?random=4',
  },
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'events'>('feed')

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Community</h1>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'feed'
                ? 'bg-primary text-secondary'
                : 'hover:bg-gray-800'
            }`}
          >
            Feed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'events'
                ? 'bg-primary text-secondary'
                : 'hover:bg-gray-800'
            }`}
          >
            Events
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'feed' ? (
            <SocialFeed posts={posts} />
          ) : (
            <EventsList events={events} />
          )}
        </div>
        <div className="space-y-6">
          <div className="bg-secondary rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Community Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400">Active Members</div>
                <div className="text-2xl font-bold">2,543</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Posts Today</div>
                <div className="text-2xl font-bold">156</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Upcoming Events</div>
                <div className="text-2xl font-bold">8</div>
              </div>
            </div>
          </div>
          
          <TopContributors contributors={topContributors} />
          
          <div className="bg-secondary rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Suggested Connections</h2>
            <div className="space-y-4">
              {suggestedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-400">{user.role}</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-secondary rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
            <div className="space-y-2">
              {['#JavaScript', '#React', '#WebDev', '#CodingTips'].map((topic) => (
                <div
                  key={topic}
                  className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 