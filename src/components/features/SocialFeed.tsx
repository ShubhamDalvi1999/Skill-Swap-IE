'use client'

import Image from 'next/image'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

interface Author {
  name: string
  avatar: string
  role: string
}

interface Post {
  id: string
  author: Author
  content: string
  timestamp: string
  likes: number
  comments: number
}

interface SocialFeedProps {
  posts: Post[]
}

export default function SocialFeed({ posts }: SocialFeedProps) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-secondary rounded-xl p-6 border border-gray-800"
        >
          <div className="flex items-start space-x-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{post.author.name}</h3>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-400">{post.timestamp}</span>
              </div>
              <p className="text-sm text-gray-400">{post.author.role}</p>
              <p className="mt-3">{post.content}</p>
              
              <div className="mt-4 flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 