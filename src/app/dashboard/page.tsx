'use client'

import { useEffect, useState } from 'react'
import CourseCard from '@/components/features/CourseCard'
import CourseList from '@/components/features/CourseList'
import InviteFriend from '@/components/features/InviteFriend'
import ProfileSummary from '@/components/features/ProfileSummary'
import UpcomingEvents from '@/components/features/UpcomingEvents'
import { Course, UserCourse } from '@/types/course'

// Temporary placeholder data that matches our database schema
const PLACEHOLDER_COURSES: Course[] = [
  {
    id: 'course-gen-ai',
    title: 'Gen AI',
    description: 'Learn the fundamentals of Generative AI and how to build applications with it.',
    instructor: 'user-demo-1',
    category: 'AI',
    level: 'intermediate',
    rating: 4.8,
    students_count: 1250,
    duration: 28,
    published_date: '2023-01-15',
    thumbnail: '/images/courses/gen-ai.jpg',
    price: 49.99
  },
  {
    id: 'course-react-mastery',
    title: 'React Mastery',
    description: 'Master React and build modern web applications with best practices.',
    instructor: 'user-demo-1',
    category: 'Web Development',
    level: 'advanced',
    rating: 4.9,
    students_count: 2340,
    duration: 42,
    published_date: '2023-02-20',
    thumbnail: '/images/courses/react.jpg',
    price: 59.99
  }
]

const PLACEHOLDER_USER_COURSES: UserCourse[] = [
  {
    ...PLACEHOLDER_COURSES[0],
    progress: 38,
    lastAccessed: new Date(),
    status: 'in-progress',
    enrolled_date: '2023-03-10'
  }
]

const EXPLORE_SECTIONS = [
  {
    title: 'Challenge Packs',
    description: 'Practice what you learned with bite-sized code challenges.',
    icon: '🎮',
    link: '/challenges'
  },
  {
    title: 'Project Tutorials',
    description: 'Explore fun, step-by-step projects from beginner to advanced.',
    icon: '🚀',
    link: '/tutorials'
  },
  {
    title: '#30NitesOfCode',
    description: 'Commit to 30 days of learning and building-while raising a virtual pet!',
    icon: '🥚',
    link: '/30-days'
  },
  {
    title: 'Builds',
    description: 'Create and share code snippets and projects directly in the browser.',
    icon: '💻',
    link: '/builds'
  }
]

export default function DashboardPage() {
  // Using static data instead of fetching
  const userCourses = PLACEHOLDER_USER_COURSES

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1">
        {/* Welcome Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 md:mb-8">
            <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
              <span className="text-2xl">💻</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back @shubhamdwo526!</h1>
              <p className="text-gray-400">Happy coding!</p>
            </div>
          </div>
        </div>

        {/* Jump back in - Current Course */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Jump back in</h2>
          <div className="grid grid-cols-1 gap-6">
            {userCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                showProgress={true}
              />
            ))}
          </div>
        </section>

        {/* Popular Courses Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Popular Courses</h2>
          <CourseList />
        </section>

        {/* Explore More Section */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Explore more</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EXPLORE_SECTIONS.map((section) => (
              <a
                key={section.title}
                href={section.link}
                className="bg-secondary p-6 rounded-xl border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{section.icon}</span>
                  <div>
                    <h3 className="font-semibold mb-1">{section.title}</h3>
                    <p className="text-sm text-gray-400">{section.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Invite Section - Moved below Explore More */}
        <section className="mb-8 md:mb-12">
          <InviteFriend />
        </section>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 space-y-6">
        <ProfileSummary
          username="shubhamdwo526"
          level={1}
          totalXp={50}
          badges={0}
          dayStreak={1}
          rank="Bronze"
        />
        <UpcomingEvents />
      </div>
    </div>
  )
} 