'use client'

import React from 'react'

export default function PracticePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Practice Challenges</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for practice challenges */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="bg-secondary rounded-xl p-6 border border-gray-800 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">🧩</span>
              </div>
              <div>
                <h3 className="font-semibold">Challenge {i + 1}</h3>
                <p className="text-sm text-gray-400">Difficulty: {['Easy', 'Medium', 'Hard'][i % 3]}</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Practice your coding skills with this interactive challenge.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs bg-gray-800 px-2 py-1 rounded">JavaScript</span>
              <span className="text-xs text-gray-400">Coming soon</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-secondary/50 rounded-xl p-8 border border-gray-800">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">This page is under construction</h2>
          <p className="text-gray-400 mb-6">
            We're working hard to bring you challenging coding exercises. 
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