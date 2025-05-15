'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/Footer'

export default function TeachPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-grow bg-gradient-to-b from-secondary-900 to-secondary-950">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Share Your Knowledge<br />
              <span className="text-primary">Teach on SkillSwap</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join our community of educators and help others master new skills. Create engaging courses, reach students worldwide, and earn by sharing your expertise.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6">
                Become an Instructor
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Learn How It Works
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-secondary-800/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-secondary-800 rounded-xl">
                <div className="text-5xl font-bold text-primary mb-2">25K+</div>
                <div className="text-gray-300">Instructors</div>
              </div>
              <div className="text-center p-6 bg-secondary-800 rounded-xl">
                <div className="text-5xl font-bold text-primary mb-2">1M+</div>
                <div className="text-gray-300">Students</div>
              </div>
              <div className="text-center p-6 bg-secondary-800 rounded-xl">
                <div className="text-5xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-300">Courses</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-secondary-800 p-8 rounded-xl">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="text-xl font-bold text-white mb-3">Create Your Course</h3>
                <p className="text-gray-300">
                  Plan your curriculum and record high-quality videos. Our platform supports various content formats to make your course engaging.
                </p>
              </div>
              <div className="bg-secondary-800 p-8 rounded-xl">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="text-xl font-bold text-white mb-3">Publish and Promote</h3>
                <p className="text-gray-300">
                  Launch your course and leverage our marketing tools. We'll help you reach students interested in your topic.
                </p>
              </div>
              <div className="bg-secondary-800 p-8 rounded-xl">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="text-xl font-bold text-white mb-3">Earn and Grow</h3>
                <p className="text-gray-300">
                  Get paid for every enrollment and build your reputation. Top instructors earn substantial income through our revenue-sharing model.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/20 to-secondary-800/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Share Your Expertise?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of instructors who are changing lives through education.
            </p>
            <Button size="lg" className="text-lg px-10 py-6">
              Start Teaching Today
            </Button>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
} 