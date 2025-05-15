'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { AuthContextType } from '@/types/auth'
import Icon from '@/components/ui/Icon'
import { IconKey, ICONS } from '@/lib/icons'

interface NavItem {
  icon: IconKey
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: 'home', label: 'Dashboard', href: '/dashboard' },
  { icon: 'learn', label: 'Learn', href: '/learn' },
  { icon: 'practice', label: 'Practice', href: '/practice' },
  { icon: 'build', label: 'Build', href: '/build' },
  { icon: 'community', label: 'Community', href: '/community' },
  { icon: 'teach', label: 'Teach', href: '/teach' },
  { icon: 'settings', label: 'Settings', href: '/settings' },
]

const Sidebar = () => {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const auth = useAuth() as AuthContextType
  const user = auth?.user

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed bottom-6 right-6 z-30 bg-primary text-white p-4 rounded-full shadow-lg"
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? (
          <Icon name={ICONS.close} size={24} />
        ) : (
          <Icon name={ICONS.menu} size={24} />
        )}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-72 h-[calc(100vh-4rem)] fixed top-16 left-0 bg-secondary border-r border-gray-800 z-10">
        <div className="h-full flex flex-col p-6">
          {/* User info */}
          {user && (
            <div className="mb-8 pb-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                  {user.profile?.avatar_url ? (
                    <img 
                      src={user.profile.avatar_url} 
                      alt={user.profile?.full_name || user.email} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{user.profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{user.profile?.full_name || user.email}</p>
                  <p className="text-sm text-gray-400">
                    {user.profile?.role === 'instructor' ? 'Instructor' : 'Student'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                }`}
              >
                <Icon name={ICONS[item.icon]} size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Help section */}
          <div className="mt-auto pt-6 border-t border-gray-800">
            <Link
              href="/help"
              className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800/60 hover:text-white rounded-lg transition-colors"
            >
              <span>Help & Support</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar (overlay) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-20">
          <div className="h-full w-64 bg-secondary p-6 animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <Icon name={ICONS.close} size={24} />
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                  }`}
                >
                  <Icon name={ICONS[item.icon]} size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar 