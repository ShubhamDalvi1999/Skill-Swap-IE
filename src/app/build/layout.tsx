'use client'

import React from 'react'
import WorkspaceLayout from '@/components/layout/WorkspaceLayout'
import MainLayout from '@/components/layout/MainLayout'
import type { ReactNode } from 'react'

export default function BuildLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <WorkspaceLayout 
      sidebar={
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-8">Project Templates</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-800 pb-4">
              <h3 className="text-lg font-medium mb-3">Web Development</h3>
              <ul className="space-y-2">
                <li>
                  <button type="button" className="w-full text-left p-3 rounded-lg bg-secondary-800 border-l-4 border-primary-500">
                    Weather App
                  </button>
                </li>
                <li>
                  <button type="button" className="w-full text-left p-3 rounded-lg hover:bg-secondary-800/50 text-gray-400">
                    Todo Application
                  </button>
                </li>
                <li>
                  <button type="button" className="w-full text-left p-3 rounded-lg hover:bg-secondary-800/50 text-gray-400">
                    Blog Platform
                  </button>
                </li>
              </ul>
            </div>
            <div className="border-b border-gray-800 pb-4">
              <h3 className="text-lg font-medium mb-3">Mobile Development</h3>
              <ul className="space-y-2">
                <li>
                  <button type="button" className="w-full text-left p-3 rounded-lg hover:bg-secondary-800/50 text-gray-400">
                    Fitness Tracker
                  </button>
                </li>
                <li>
                  <button type="button" className="w-full text-left p-3 rounded-lg hover:bg-secondary-800/50 text-gray-400">
                    Recipe App
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-4rem)]">
        <div className="p-6 border-r border-gray-800 overflow-y-auto">
          <div className="h-full overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Project Requirements</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium text-primary">Objective</h3>
                <p className="text-gray-400">
                  Build a simple weather application that fetches and displays weather data for a user-specified location.
                </p>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-primary">Requirements</h3>
                <ul className="list-disc pl-5 text-gray-400 space-y-2">
                  <li>Create a form that allows users to input a city name</li>
                  <li>Fetch weather data from an API when the form is submitted</li>
                  <li>Display the current temperature, conditions, and forecast</li>
                  <li>Include error handling for failed API requests</li>
                  <li>Make the UI responsive and user-friendly</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-primary">Resources</h3>
                <ul className="list-disc pl-5 text-gray-400 space-y-2">
                  <li>OpenWeather API documentation</li>
                  <li>Example code for API integration</li>
                  <li>UI design guidelines</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </WorkspaceLayout>
  )
} 