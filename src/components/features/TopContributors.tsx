'use client'

import React from 'react'

interface TopContributorsProps {
  contributors?: Array<{
    id: string | number;
    name: string;
    points: number;
    avatar: string;
  }>;
}

export default function TopContributors({ 
  contributors = [
    { id: 1, name: 'Contributor 1', points: 100, avatar: 'https://picsum.photos/seed/contributor1/32/32' },
    { id: 2, name: 'Contributor 2', points: 80, avatar: 'https://picsum.photos/seed/contributor2/32/32' },
    { id: 3, name: 'Contributor 3', points: 60, avatar: 'https://picsum.photos/seed/contributor3/32/32' }
  ] 
}: TopContributorsProps) {
  return (
    <div className="bg-secondary rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Top Contributors</h2>
      <div className="space-y-4">
        {contributors.map((contributor) => (
          <div key={contributor.id} className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={contributor.avatar}
                alt={`${contributor.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{contributor.name}</div>
              <div className="text-sm text-gray-400">{contributor.points} points</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 