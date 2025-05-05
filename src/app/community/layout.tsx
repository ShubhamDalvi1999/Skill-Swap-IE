import React from 'react'
import CommunityLayout from '@/components/layout/CommunityLayout'
import ProfileSummary from '@/components/features/ProfileSummary'
import UpcomingEvents from '@/components/features/UpcomingEvents'

// Mock data - In a real app, this would come from an API
const mockUser = {
  id: '1',
  name: 'John Doe',
  username: '@johndoe',
  avatar: 'https://picsum.photos/200',
  bio: 'Full-stack developer passionate about creating intuitive user experiences.',
  joinDate: 'January 2023',
  stats: {
    posts: 24,
    followers: 156,
    following: 89,
  },
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS', 'HTML'],
}

const upcomingEvents = [
  {
    id: '1',
    title: 'React Advanced Conference',
    date: 'May 15, 2023',
    time: '10:00 AM',
    location: 'Online',
    type: 'conference',
  },
  {
    id: '2',
    title: 'Web Development Workshop',
    date: 'May 22, 2023',
    time: '2:00 PM',
    location: 'San Francisco, CA',
    type: 'workshop',
  },
  {
    id: '3',
    title: 'JavaScript Meetup',
    date: 'June 3, 2023',
    time: '6:30 PM',
    location: 'New York, NY',
    type: 'meetup',
  },
]

export default function CommunityPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CommunityLayout
      sidebar={
        <div className="space-y-6">
          <ProfileSummary user={mockUser} />
          <UpcomingEvents events={upcomingEvents} />
        </div>
      }
    >
      {children}
    </CommunityLayout>
  )
} 