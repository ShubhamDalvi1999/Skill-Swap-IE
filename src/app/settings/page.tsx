'use client'

import React, { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'appearance'>('profile')

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-800'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'account' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-800'
              }`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-800'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'appearance' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-800'
              }`}
            >
              Appearance
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 bg-secondary rounded-xl p-6 border border-gray-800">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your full name"
                      defaultValue="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your username"
                      defaultValue="johndoe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Bio
                    </label>
                    <textarea
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Tell us about yourself"
                      rows={4}
                      defaultValue="Full stack developer passionate about learning new technologies."
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button className="bg-primary text-secondary px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your email"
                      defaultValue="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Password
                    </label>
                    <button className="text-primary hover:text-primary/80">
                      Change Password
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button className="bg-primary text-secondary px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                
                <div className="space-y-4">
                  {['Email Notifications', 'Push Notifications', 'Course Updates', 'Community Activity'].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <span>{item}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button className="bg-primary text-secondary px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Dark', 'Light', 'System'].map((theme) => (
                        <div
                          key={theme}
                          className={`p-4 border rounded-lg cursor-pointer ${
                            theme === 'Dark' ? 'border-primary bg-primary/10' : 'border-gray-700 hover:border-gray-500'
                          }`}
                        >
                          {theme}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button className="bg-primary text-secondary px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 