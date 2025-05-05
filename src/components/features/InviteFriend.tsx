'use client'

import React from 'react'

const InviteFriend = () => {
  return (
    <div className="bg-secondary rounded-xl p-8 border border-gray-800">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🤝</span>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Invite friends to learn together</h3>
            <p className="text-gray-400">Get 1 month of Pro for every friend who joins</p>
          </div>
        </div>
        <button type="button" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          Share Invite Link
        </button>
      </div>
    </div>
  )
}

export default InviteFriend 