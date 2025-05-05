'use client'

import React from 'react'

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Progress</h1>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-secondary rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-2">Courses Completed</h3>
          <div className="text-3xl font-bold">2 / 5</div>
          <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '40%' }} />
          </div>
        </div>
        
        <div className="bg-secondary rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-2">Challenges Solved</h3>
          <div className="text-3xl font-bold">12 / 30</div>
          <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '40%' }} />
          </div>
        </div>
        
        <div className="bg-secondary rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-2">XP Earned</h3>
          <div className="text-3xl font-bold">580</div>
          <div className="mt-2 text-sm text-gray-400">Next level: 1000 XP</div>
        </div>
      </div>

      {/* Learning Streak */}
      <div className="bg-secondary rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold mb-4">Learning Streak</h3>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${i < 3 ? 'bg-primary/20 text-primary' : 'bg-gray-800 text-gray-500'}`}>
                {i < 3 ? '✓' : ''}
              </div>
              <div className="text-xs mt-1 text-gray-400">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-secondary rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-800">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">
                  {['📚', '🧩', '🚀', '🏆', '📝'][i % 5]}
                </span>
              </div>
              <div>
                <h4 className="font-medium">
                  {[
                    'Completed Lesson: Introduction to React',
                    'Solved Challenge: Two Sum',
                    'Started Project: Weather App',
                    'Earned Badge: JavaScript Basics',
                    'Posted in Community Forum'
                  ][i % 5]}
                </h4>
                <p className="text-sm text-gray-400">
                  {`${i + 1} ${i === 0 ? 'hour' : 'days'} ago`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-secondary/50 rounded-xl p-8 border border-gray-800">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">More features coming soon</h2>
          <p className="text-gray-400 mb-6">
            We're working on detailed analytics, achievement badges, and personalized learning recommendations.
            Check back soon for updates!
          </p>
          <div className="inline-flex items-center justify-center gap-2 bg-primary text-secondary px-6 py-3 rounded-lg">
            <span>Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  )
} 