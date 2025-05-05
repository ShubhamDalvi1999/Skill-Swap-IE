'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, User } from 'lucide-react'

// Temporary user data
const USER_DATA = {
  username: 'shubhamdwo526',
  name: 'Shubham Dalvi',
  joinDate: 'Dec 11, 2023',
  following: 12,
  followers: 28,
  bio: 'Full-stack developer passionate about building beautiful and functional web applications. Currently learning React and Next.js.',
  location: 'Mumbai, India',
  website: 'https://shubhamdalvi.dev',
  github: 'shubhamdwo526',
  twitter: 'shubhamdwo526',
  stats: {
    exercises: 25,
    totalXp: 1250,
    courseBadges: 3,
    dailyStreak: 7,
    hoursLearned: 48,
    projectsCompleted: 4
  },
  skills: ['JavaScript', 'React', 'Node.js', 'HTML/CSS', 'TypeScript', 'Next.js'],
  achievements: [
    { id: 1, title: 'First Project', icon: '🚀', date: 'Jan 15, 2024' },
    { id: 2, title: '7-Day Streak', icon: '🔥', date: 'Feb 2, 2024' },
    { id: 3, title: 'JavaScript Master', icon: '🏆', date: 'Feb 10, 2024' }
  ],
  recentActivity: [
    { id: 1, type: 'course', title: 'Completed React Fundamentals', date: '2 days ago' },
    { id: 2, type: 'project', title: 'Started Weather App Project', date: '4 days ago' },
    { id: 3, type: 'challenge', title: 'Solved Array Manipulation Challenge', date: '1 week ago' }
  ]
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      {/* Banner Image */}
      <div className="relative h-64 w-full rounded-xl overflow-hidden mb-20">
        <Image
          src="/images/courses/react-advanced.jpg"
          alt="Profile banner"
          fill
          className="object-cover"
        />
        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg">
            <Image
              src="/images/avatars/dr-ai-1.png"
              alt="Profile picture"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">{USER_DATA.name}</h1>
            <p className="text-gray-400 mb-2">@{USER_DATA.username}</p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              {USER_DATA.location && (
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span>{USER_DATA.location}</span>
                </div>
              )}
              {USER_DATA.website && (
                <div className="flex items-center gap-1">
                  <span>🔗</span>
                  <a href={USER_DATA.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Website
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary text-secondary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              Follow
            </button>
            <button className="px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Social Stats */}
        <div className="flex gap-6 text-sm mb-8">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{USER_DATA.following}</span>
            <span className="text-gray-400">following</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{USER_DATA.followers}</span>
            <span className="text-gray-400">followers</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">🕒</span>
            <span className="text-gray-400">Joined {USER_DATA.joinDate}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <div className="bg-secondary rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🎙️</span>
                <h2 className="text-lg font-semibold">Bio</h2>
              </div>
              <p className="text-gray-300 mb-4">
                {USER_DATA.bio || "You don't have anything in your bio. Go to account and edit profile to add something cool about yourself."}
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                {USER_DATA.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-secondary rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {USER_DATA.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">
                        {activity.type === 'course' ? '📚' : activity.type === 'project' ? '🚀' : '🧩'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-gray-400">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-secondary rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {USER_DATA.stats.projectsCompleted > 0 ? (
                  [...Array(USER_DATA.stats.projectsCompleted)].map((_, i) => (
                    <div key={i} className="border border-gray-800 rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-lg">💻</span>
                        </div>
                        <div>
                          <h3 className="font-medium">Project {i + 1}</h3>
                          <p className="text-xs text-gray-400">Completed</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">A sample project description would go here.</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded">React</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-400 py-8">
                    No projects completed yet. Start building in the Projects section!
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            {/* Stats Section */}
            <div className="bg-secondary rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Learning Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold mb-1">{USER_DATA.stats.exercises}</div>
                  <div className="text-xs text-gray-400">Exercises</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <span className="text-primary mx-auto mb-2 block text-xl">⏱️</span>
                  <div className="text-2xl font-bold mb-1">{USER_DATA.stats.hoursLearned}</div>
                  <div className="text-xs text-gray-400">Hours</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <span className="text-primary mx-auto mb-2 block text-xl">🏆</span>
                  <div className="text-2xl font-bold mb-1">{USER_DATA.stats.courseBadges}</div>
                  <div className="text-xs text-gray-400">Badges</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <span className="text-primary mx-auto mb-2 block text-xl">⭐</span>
                  <div className="text-2xl font-bold mb-1">{USER_DATA.stats.totalXp}</div>
                  <div className="text-xs text-gray-400">XP</div>
                </div>
              </div>
            </div>

            {/* Learning Streak */}
            <div className="bg-secondary rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Learning Streak</h3>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${i < USER_DATA.stats.dailyStreak ? 'bg-primary/20 text-primary' : 'bg-gray-800 text-gray-500'}`}>
                      {i < USER_DATA.stats.dailyStreak ? '✓' : ''}
                    </div>
                    <div className="text-xs mt-1 text-gray-400">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm font-medium">{USER_DATA.stats.dailyStreak} day streak! 🔥</span>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-secondary rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Achievements</h3>
              <div className="space-y-4">
                {USER_DATA.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{achievement.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-xs text-gray-400">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pet Café Section */}
            <div className="bg-secondary rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Pet Café</h3>
              <div className="w-32 h-32 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-5xl">🥚</span>
              </div>
              <p className="text-gray-400 mb-3">
                Complete exercises to hatch and raise your coding companion!
              </p>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '35%' }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">35% to hatching</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 