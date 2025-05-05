'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import Icon from '@/components/ui/Icon'
import { ICONS } from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

const navLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: 'Home' },
  { label: 'Learn', href: '/learn', icon: 'BookOpen' },
  { label: 'Practice', href: '/practice', icon: 'Code' },
  { label: 'Build', href: '/build', icon: 'Layers' },
  { label: 'Community', href: '/community', icon: 'Users' },
  { label: 'Progress', href: '/progress', icon: 'BarChart2' },
]

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: User | null } | null) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <nav className="bg-secondary-950 border-b border-secondary-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary-500 font-bold text-2xl">SkillSwap</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 text-base font-medium transition-colors duration-200",
                    isActive(link.href)
                      ? "text-primary-500 border-b-2 border-primary-500"
                      : "text-secondary-300 hover:text-white hover:border-b-2 hover:border-secondary-700"
                  )}
                >
                  <Icon name={link.icon} className="mr-2 h-5 w-5" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!loading && (
              user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-white hover:text-primary-500 focus:outline-none transition-colors duration-200"
                  >
                    <div className="w-9 h-9 rounded-full bg-secondary-700 flex items-center justify-center">
                      {user.email?.[0].toUpperCase() || 'U'}
                    </div>
                    <span className="text-base">{user.email?.split('@')[0]}</span>
                    <Icon name="ChevronDown" className={cn("h-5 w-5 transition-transform duration-200", isDropdownOpen ? "transform rotate-180" : "")} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-secondary-900 rounded-md shadow-lg py-1 z-10 border border-secondary-800">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-base text-secondary-200 hover:bg-secondary-800 hover:text-white"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-base text-secondary-200 hover:bg-secondary-800 hover:text-white"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          await supabase.auth.signOut()
                          setIsDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-base text-error-500 hover:bg-secondary-800"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Button variant="ghost" size="lg" asChild>
                    <Link href="/auth/signin" className="text-base">Sign in</Link>
                  </Button>
                  <Button size="lg" asChild>
                    <Link href="/auth/signup" className="text-base">Sign up</Link>
                  </Button>
                </div>
              )
            )}
          </div>
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-300 hover:text-white hover:bg-secondary-800 focus:outline-none"
            >
              {isMenuOpen ? (
                <Icon name="X" className="h-6 w-6" />
              ) : (
                <Icon name="Menu" className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary-900 border-b border-secondary-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-lg font-medium flex items-center",
                  isActive(link.href)
                    ? "bg-secondary-800 text-primary-500"
                    : "text-secondary-300 hover:bg-secondary-800 hover:text-white"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon name={link.icon} className="mr-3 h-6 w-6" />
                {link.label}
              </Link>
            ))}
            {!loading && user && (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-lg font-medium text-secondary-300 hover:bg-secondary-800 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-3 py-2 rounded-md text-lg font-medium text-secondary-300 hover:bg-secondary-800 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-lg font-medium text-error-500 hover:bg-secondary-800"
                >
                  Sign out
                </button>
              </>
            )}
            {!loading && !user && (
              <div className="pt-4 pb-3 border-t border-secondary-800">
                <div className="flex items-center px-5">
                  <Link
                    href="/auth/signin"
                    className="block w-full px-3 py-2 rounded-md text-lg font-medium text-center text-secondary-200 hover:bg-secondary-800 hover:text-white border border-secondary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                </div>
                <div className="mt-3 px-5">
                  <Link
                    href="/auth/signup"
                    className="block w-full px-3 py-2 rounded-md text-lg font-medium text-center bg-primary-600 text-white hover:bg-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 